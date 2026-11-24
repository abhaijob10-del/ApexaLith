import { createHmac, randomInt, timingSafeEqual } from 'node:crypto';
import { transaction } from '../db/connection.mjs';
import { cookieOptions,currentUser,digest,fail,field,hashPassword,matchesPassword,newSession,phoneNumber,query,requireRole,run,throttle,tokenOf } from './security.mjs';

function otpProvider() {
  const env=process.env;
  if(env.OTP_PROVIDER==='development' && ['development','test'].includes(env.NODE_ENV) && !process.argv.includes('--serve-built') && /^\d{6}$/.test(env.DEV_OTP||'')) {
    return {code:()=>env.DEV_OTP,send:async()=>{}};
  }
  if(env.OTP_PROVIDER==='twilio' && /^AC[0-9a-f]{32}$/i.test(env.TWILIO_ACCOUNT_SID||'') && env.TWILIO_AUTH_TOKEN && env.TWILIO_FROM && env.TWILIO_TEMPLATE?.includes('{code}')) {
    return {code:()=>String(randomInt(100000,1000000)),send:async(phone,code)=>{
      const response=await fetch('https://api.twilio.com/2010-04-01/Accounts/'+env.TWILIO_ACCOUNT_SID+'/Messages.json',{
        method:'POST',signal:AbortSignal.timeout(8000),
        headers:{Authorization:'Basic '+Buffer.from(env.TWILIO_ACCOUNT_SID+':'+env.TWILIO_AUTH_TOKEN).toString('base64')},
        body:new URLSearchParams({To:phone,From:env.TWILIO_FROM,Body:env.TWILIO_TEMPLATE.replace('{code}',code)})
      });
      if(!response.ok) throw fail(503,'SMS delivery unavailable.');
    }};
  }
  throw fail(503,'Phone sign-in is currently unavailable.');
}
function otpDigest(phone,code) {
  if((process.env.OTP_SECRET||'').length<32) throw fail(503,'Phone sign-in is currently unavailable.');
  return createHmac('sha256',process.env.OTP_SECRET).update(process.env.OTP_PROVIDER+'|'+phone+'|'+code).digest('hex');
}
function setSession(res,token) {
  res.cookie('apx_session',token,{...cookieOptions(),maxAge:8*3600000});
  console.info(JSON.stringify({event:'login_success'}));
}
export function authRoutes(api) {
  api.get('/session',run(async(req,res)=>res.json({user:await currentUser(req)})));
  api.post('/logout',run(async(req,res)=>{
    if(tokenOf(req)) await query('DELETE FROM sessions WHERE digest=$1',[digest(tokenOf(req))]);
    res.clearCookie('apx_session',cookieOptions()).sendStatus(204);
  }));
  api.post('/otp/request',run(async(req,res)=>{
    const phone=phoneNumber(req.body.phone),provider=otpProvider();
    await throttle('send-ip:'+req.ip,15);
    await throttle('send-phone:'+phone,4);
    const code=provider.code(),hash=otpDigest(phone,code);
    await transaction(async client=>{
      const result=await client.query(`INSERT INTO otp_challenges AS c VALUES ($1,$2,now()+interval '5 minutes',now()+interval '60 seconds',0)
        ON CONFLICT(phone) DO UPDATE SET digest=excluded.digest,expires_at=excluded.expires_at,resend_after=excluded.resend_after,attempts=0
        WHERE c.resend_after<=now()`,[phone,hash]);
      if(!result.rowCount) throw fail(429,'Wait one minute before requesting another code.');
      await provider.send(phone,code);
    });
    res.sendStatus(202);
  }));
  api.post('/otp/verify',run(async(req,res)=>{
    const phone=phoneNumber(req.body.phone);
    await throttle('verify:'+req.ip,45);
    otpProvider();
    const code=field(req.body.code,6,true);
    const token=await transaction(async client=>{
      const {rows}=await client.query('SELECT digest FROM otp_challenges WHERE phone=$1 AND expires_at>now() AND attempts<5 FOR UPDATE',[phone]);
      if(!rows.length) return null;
      if(!timingSafeEqual(Buffer.from(rows[0].digest),Buffer.from(otpDigest(phone,code)))) {
        await client.query('UPDATE otp_challenges SET attempts=attempts+1 WHERE phone=$1',[phone]);return null;
      }
      await client.query('DELETE FROM otp_challenges WHERE phone=$1',[phone]);
      const user=await client.query("INSERT INTO users(role,phone) VALUES ('customer',$1) ON CONFLICT(phone) DO UPDATE SET phone=excluded.phone WHERE users.role='customer' RETURNING id",[phone]);
      return newSession(client,user.rows[0]);
    });
    if(!token) throw fail(401,'Invalid or expired verification code.');
    setSession(res,token);res.sendStatus(204);
  }));
  api.post('/admin/login',run(async(req,res)=>{
    const email=field(req.body.email,254,true).toLowerCase();
    await throttle('admin-ip:'+req.ip,20);await throttle('admin-account:'+email,8);
    const token=await transaction(async client=>{
      const {rows}=await client.query("SELECT id,password_hash FROM users WHERE email=$1 AND role='admin' FOR UPDATE",[email]);
      if(!await matchesPassword(req.body.password,rows[0]?.password_hash) || !rows.length) throw fail(401,'Invalid sign-in details.');
      await client.query("INSERT INTO audit_log(actor_id,action) VALUES($1,'admin_login')",[rows[0].id]);
      return newSession(client,rows[0]);
    });
    setSession(res,token);res.sendStatus(204);
  }));
  api.post('/admin/password',requireRole('admin'),run(async(req,res)=>{
    await throttle('password:'+req.user.id,8);
    await transaction(async client=>{
      const {rows}=await client.query('SELECT password_hash FROM users WHERE id=$1 FOR UPDATE',[req.user.id]);
      if(!await matchesPassword(req.body.current,rows[0].password_hash)) throw fail(401,'Invalid sign-in details.');
      await client.query('UPDATE users SET password_hash=$1 WHERE id=$2',[await hashPassword(req.body.password),req.user.id]);
      await client.query('DELETE FROM sessions WHERE user_id=$1',[req.user.id]);
      await client.query("INSERT INTO audit_log(actor_id,action) VALUES ($1,'password_changed')",[req.user.id]);
    });
    res.clearCookie('apx_session',cookieOptions()).sendStatus(204);
  }));
  api.patch('/profile',requireRole('customer'),run(async(req,res)=>{
    await query('UPDATE users SET name=$1 WHERE id=$2',[field(req.body.name,100,true),req.user.id]);res.sendStatus(204);
  }));
}
