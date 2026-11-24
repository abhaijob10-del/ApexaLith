import express from 'express';
import {authRoutes} from './auth.mjs';
import {requireRole} from './security.mjs';
export function installPlatform(app) {
  app.disable('x-powered-by');
  app.use((req,res,next)=>{
    res.set({'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','X-Frame-Options':'DENY'});
    if(/^\/(api|account|admin)(\/|$)/.test(req.path)) res.set({'Cache-Control':'no-store','X-Robots-Tag':'noindex'});
    if(req.path.startsWith('/api/') && !['GET','HEAD','OPTIONS'].includes(req.method)) {
      const origin=req.get('origin');
      if(req.get('sec-fetch-site')==='cross-site' || (origin && origin!==(process.env.APP_ORIGIN||'http://'+req.get('host')))) return res.status(403).json({error:'Request origin rejected.'});
      if(!req.is('application/json') && !req.is('multipart/form-data')) return res.status(415).json({error:'Unsupported request format.'});
    }
    next();
  });
  const api=express.Router();
  api.use(express.json({limit:'64kb'}));
  authRoutes(api);
  app.use('/api/v1',api);
  app.use('/api/v1',(req,res)=>res.status(404).json({error:'Unknown endpoint.'}));
  app.use('/api',(req,res,next)=>req.path==='/health' && req.method==='GET'?next():requireRole('admin')(req,res,next));
}
export function apiErrors(err,req,res,next) {
  const status=Number(err.status)||500;
  console.error(JSON.stringify({event:status===401?'authentication_denied':status>=500?'application_error':'request_denied',status}));
  res.status(status).json({error:status>=500?'Service temporarily unavailable.':err.type==='entity.parse.failed'?'Invalid JSON.':err.message});
}
