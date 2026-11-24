import {randomUUID} from 'node:crypto';
import multer from 'multer';
import sharp from 'sharp';
import {transaction} from '../db/connection.mjs';
import {currentUser,fail,query,run} from './security.mjs';
import {id} from './catalog.mjs';
import {storage} from './storage.mjs';
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:8*1024*1024,files:1,fields:0,parts:2}}).single('image');
const sizes=[480,1600];
const key=(prefix,size)=>prefix+'-'+size+'.webp';
async function purge(prefix) {
  for(const size of sizes) await storage().remove(key(prefix,size));
  await query('DELETE FROM media_cleanup WHERE storage_key=$1',[prefix]);
}
export function mediaRoutes(api) {
  api.get('/manage/media',run(async(req,res)=>res.json((await query('SELECT id,width,height,bytes,created_at FROM media ORDER BY created_at DESC,id LIMIT 21 OFFSET $1',[Math.min(100000,Math.max(0,Math.floor(Number(req.query.page)||0)))*20])).rows)));
  api.post('/manage/media',(req,res,next)=>upload(req,res,err=>next(err?fail(400,'Upload one image of up to 8 MB.'):undefined)),run(async(req,res)=>{
    const input=req.file?.buffer;if(!input) throw fail(400,'Choose an image.');
    const image=sharp(input,{limitInputPixels:24000000,failOn:'warning'});
    let metadata;
    try{metadata=await image.metadata();}catch{throw fail(400,'Unreadable or oversized image.');}
    if(!['jpeg','png','webp'].includes(metadata.format)||metadata.pages>1||!metadata.width||!metadata.height||metadata.width*metadata.height>24000000) throw fail(400,'Use a JPEG, PNG or single-frame WebP image under 24 megapixels.');
    const prefix=randomUUID();
    let result;
    try {
      for(const size of sizes) {
        const out=await image.clone().rotate().resize({width:size,height:size,fit:'inside',withoutEnlargement:true}).webp({quality:82}).toBuffer({resolveWithObject:true});
        result=out.info;await storage().put(key(prefix,size),out.data);
      }
      const record=await transaction(async c=>{
        const {rows}=await c.query("INSERT INTO media(storage_key,mime,width,height,bytes) VALUES($1,'image/webp',$2,$3,$4) RETURNING id,width,height,bytes",[prefix,result.width,result.height,result.size]);
        await c.query("INSERT INTO audit_log(actor_id,action,object_id) VALUES($1,'media_uploaded',$2)",[req.user.id,rows[0].id]);return rows[0];
      });res.status(201).json(record);
    }catch(e){console.error(JSON.stringify({event:'upload_failed'}));await query('INSERT INTO media_cleanup(storage_key) VALUES($1) ON CONFLICT DO NOTHING',[prefix]);await purge(prefix);throw e;}
  }));
  api.delete('/manage/media/:id',run(async(req,res)=>{
    const prefix=await transaction(async c=>{
      const {rows}=await c.query('DELETE FROM media WHERE id=$1 RETURNING storage_key',[id(req.params.id)]);
      if(!rows.length) throw fail(404,'Unknown image.');
      await c.query('INSERT INTO media_cleanup(storage_key) VALUES($1)',[rows[0].storage_key]);
      await c.query("INSERT INTO audit_log(actor_id,action,object_id) VALUES($1,'media_deleted',$2)",[req.user.id,req.params.id]);
      return rows[0].storage_key;
    });
    await purge(prefix);res.sendStatus(204);
  }));
  api.get('/media/:id',run(async(req,res)=>{
    const {rows}=await query(`SELECT storage_key,EXISTS(SELECT 1 FROM listings l WHERE l.status='published' AND
      (l.floor_plan_id=m.id OR EXISTS(SELECT 1 FROM listing_images g WHERE g.media_id=m.id AND g.listing_id=l.id)))
      OR EXISTS(SELECT 1 FROM website_settings WHERE media_id=m.id) AS public FROM media m WHERE m.id=$1`,[id(req.params.id)]);
    if(!rows.length||!rows[0].public&&(await currentUser(req))?.role!=='admin') throw fail(404,'Image unavailable.');
    res.type('image/webp').send(await storage().get(key(rows[0].storage_key,req.query.w==='480'?480:1600)));
  }));
}
