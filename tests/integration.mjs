import assert from 'node:assert/strict';
import {test} from 'node:test';
import {randomBytes,randomInt} from 'node:crypto';
import express from 'express';
import {installPlatform,apiErrors} from '../backend/platform.mjs';
import {database} from '../db/connection.mjs';
import {hashPassword} from '../backend/security.mjs';

test('isolated PostgreSQL application workflows', async t=>{
  process.env.NODE_ENV='test'; process.env.OTP_PROVIDER='development';
  process.env.DEV_OTP=String(randomInt(100000,1000000));process.env.OTP_SECRET=randomBytes(32).toString('hex');
  const app=express();installPlatform(app);app.use(apiErrors);
  const server=await new Promise(resolve=>{const s=app.listen(0,'127.0.0.1',()=>resolve(s));});
  t.after(async()=>{await new Promise(ok=>server.close(ok));await database().end();});
  async function request(path,method='GET',body,cookie=''){
    return fetch('http://127.0.0.1:'+server.address().port+'/api/'+path,{method,headers:{'Content-Type':'application/json',Cookie:cookie},body:body&&JSON.stringify(body)});
  }
  const phone='+919000000001',code=process.env.DEV_OTP;
  assert.equal((await request('team')).status,401);
  assert.equal((await request('v1/otp/request','POST',{phone:'123'})).status,400);
  assert.equal((await request('v1/otp/request','POST',{phone})).status,202);
  assert.equal((await request('v1/otp/request','POST',{phone})).status,429);
  assert.equal((await request('v1/otp/verify','POST',{phone,code:'xxxxxx'})).status,401);
  const login=await request('v1/otp/verify','POST',{phone,code});assert.equal(login.status,204);
  const customer=login.headers.get('set-cookie').split(';')[0];
  assert.equal((await request('team','GET',null,customer)).status,403);
  assert.equal((await request('v1/otp/verify','POST',{phone,code})).status,401);
  assert.equal((await request('v1/otp/request','POST',{phone})).status,202);
  await database().query("UPDATE otp_challenges SET expires_at=now()-interval '1 second' WHERE phone=$1",[phone]);
  assert.equal((await request('v1/otp/verify','POST',{phone,code})).status,401);
  assert.equal((await request('v1/profile','PATCH',{name:'QA'},customer)).status,204);
  const email='qa@example.invalid',password=randomBytes(22).toString('hex');
  await database().query("INSERT INTO users(role,email,password_hash) VALUES('admin',$1,$2)",[email,await hashPassword(password)]);
  assert.equal((await request('v1/admin/login','POST',{email,password:'invalid'})).status,401);
  const adminLogin=await request('v1/admin/login','POST',{email,password});assert.equal(adminLogin.status,204);
  const admin=adminLogin.headers.get('set-cookie').split(';')[0];
  assert.equal((await (await request('v1/session','GET',null,admin)).json()).user.role,'admin');
  assert.equal((await request('v1/logout','POST',{},admin)).status,204);
  assert.equal((await (await request('v1/session','GET',null,admin)).json()).user,null);
  process.env.NODE_ENV='production';
  assert.equal((await request('v1/otp/request','POST',{phone})).status,503);
});
