import {mkdir,readFile,unlink,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {S3Client,PutObjectCommand,GetObjectCommand,DeleteObjectCommand} from '@aws-sdk/client-s3';
let client;
export function storage() {
  const env=process.env;
  if(env.MEDIA_STORAGE==='s3' && env.S3_BUCKET) {
    client??=new S3Client({region:env.S3_REGION||'auto',endpoint:env.S3_ENDPOINT||undefined,forcePathStyle:Boolean(env.S3_ENDPOINT)});
    const params=key=>({Bucket:env.S3_BUCKET,Key:key});
    return {
      put:(key,Body)=>client.send(new PutObjectCommand({...params(key),Body,ContentType:'image/webp'})),
      get:async key=>Buffer.from(await (await client.send(new GetObjectCommand(params(key)))).Body.transformToByteArray()),
      remove:key=>client.send(new DeleteObjectCommand(params(key)))
    };
  }
  if(env.MEDIA_STORAGE && env.MEDIA_STORAGE!=='local' || env.NODE_ENV==='production' && !path.isAbsolute(env.MEDIA_DIR||'')) throw Error('Storage configuration required');
  const root=path.resolve(env.MEDIA_DIR||'var/media');
  function file(key){if(!/^[a-f0-9-]{36}-(480|1600)\.webp$/.test(key)) throw Error('Invalid media key');return path.join(root,key);}
  return {
    put:async(key,data)=>{await mkdir(root,{recursive:true});await writeFile(file(key),data,{flag:'wx'});},
    get:key=>readFile(file(key)),remove:async key=>{try{await unlink(file(key));}catch(e){if(e.code!=='ENOENT') throw e;}}
  };
}
