import {transaction} from '../db/connection.mjs';
import {currentUser,fail,field,phoneNumber,query,requireRole,run,throttle} from './security.mjs';

export const id=value=>{
  if(typeof value!=='string'|| !/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(value)) throw fail(400,'Invalid reference.');
  return value;
};
function choice(value,values) {if(!values.includes(value)) throw fail(400,'Invalid selection.');return value;}
function amount(value,max,integer=false){
  if(value==null||value==='') return null;
  const n=Number(value);
  if(!Number.isFinite(n)||n<0||n>max||(integer&&!Number.isInteger(n))) throw fail(400,'Invalid numeric value.');
  return n;
}
const kinds=['apartment','design'],states=['draft','published','archived'],availability=['available','reserved','sold'];
const leadTypes=['contact','enquiry','visit','booking'],leadStates=['new','in_progress','closed'];
const details=`SELECT l.*,ARRAY(SELECT media_id FROM listing_images WHERE listing_id=l.id ORDER BY position) AS gallery FROM listings l`;
const audit=(c,actor,action,object=null)=>c.query('INSERT INTO audit_log(actor_id,action,object_id) VALUES($1,$2,$3)',[actor,action,object]);
function page(value){return Math.min(100000,Math.max(0,Math.floor(Number(value)||0)));}
function listingValues(b) {
  const slug=field(b.slug,150,true);
  if(!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) throw fail(400,'Use lowercase words separated by hyphens for the URL.');
  const kind=choice(b.kind,kinds);
  if(!Array.isArray(b.amenities)||b.amenities.length>80) throw fail(400,'Invalid amenities.');
  return [kind,slug,field(b.title,180,true),field(b.description,8000),field(b.location,220),amount(b.price_inr,999999999999),
    amount(b.bhk,100,true),amount(b.carpet_sqft,10000000),b.amenities.map(x=>field(x,100,true)),field(b.construction_status,100),
    field(b.rera,100),field(b.category,120),field(b.specifications,8000),kind==='apartment'?choice(b.availability,availability):null,
    b.featured===true,choice(b.status,states),b.floor_plan_id?id(b.floor_plan_id):null];
}
const cols='kind,slug,title,description,location,price_inr,bhk,carpet_sqft,amenities,construction_status,rera,category,specifications,availability,featured,status,floor_plan_id'.split(',');
const params=cols.map((_,i)=>'$'+(i+1));
async function listingList(req,res,admin=false) {
  const q=req.query,sort={newest:'l.created_at DESC',price:'l.price_inr ASC NULLS LAST',title:'l.title ASC'}[String(q.sort||'newest')];
  if(!sort||typeof sort!=='string') throw fail(400,'Invalid sort order.');
  const result=await query(details+` WHERE ($1::text IS NULL OR l.status=$1) AND ($2::text IS NULL OR kind=$2)
    AND (title ILIKE $3 OR location ILIKE $3 OR category ILIKE $3) AND ($4::text IS NULL OR availability=$4)
    AND ($5::int IS NULL OR bhk=$5) AND ($6::numeric IS NULL OR price_inr<=$6)
    AND ($7::boolean IS FALSE OR featured) ORDER BY `+sort+',l.id LIMIT 21 OFFSET $8',
    [admin?(q.status?choice(q.status,states):null):'published',q.kind?choice(q.kind,kinds):null,'%'+field(q.search,100)+'%',
    q.availability?choice(q.availability,availability):null,amount(q.bhk,100,true),amount(q.maxPrice,999999999999),q.featured==='true',page(q.page)*20]);
  res.json({items:result.rows.slice(0,20),more:result.rows.length>20});
}
const settingsKeys=['company','contact','banner','social','testimonial','hero'];
export function catalogRoutes(api) {
  api.get('/listings',run((req,res)=>listingList(req,res)));
  api.get('/listings/:slug',run(async(req,res)=>{
    const {rows}=await query(details+" WHERE slug=$1 AND status='published'",[req.params.slug]);
    if(!rows[0]) throw fail(404,'Listing unavailable.');res.json(rows[0]);
  }));
  api.get('/settings',run(async(req,res)=>res.json((await query('SELECT * FROM website_settings ORDER BY key')).rows)));
  api.get('/saved',requireRole('customer'),run(async(req,res)=>res.json((await query(details+" JOIN saved_properties s ON s.listing_id=l.id WHERE s.user_id=$1 AND l.status='published' ORDER BY l.title",[req.user.id])).rows)));
  api.put('/saved/:id',requireRole('customer'),run(async(req,res)=>{
    const result=await query("INSERT INTO saved_properties SELECT $1,id FROM listings WHERE id=$2 AND status='published' AND kind='apartment' ON CONFLICT DO NOTHING",[req.user.id,id(req.params.id)]);
    res.sendStatus(204);
  }));
  api.delete('/saved/:id',requireRole('customer'),run(async(req,res)=>{await query('DELETE FROM saved_properties WHERE user_id=$1 AND listing_id=$2',[req.user.id,id(req.params.id)]);res.sendStatus(204);}));
  api.post('/enquiries',run(async(req,res)=>{
    const b=req.body,kind=choice(b.kind,leadTypes),user=await currentUser(req);
    await throttle('lead:'+req.ip,15);
    if(['visit','booking'].includes(kind)&&user?.role!=='customer') throw fail(401,'Sign in to make this request.');
    const phone=phoneNumber(user?.phone||b.phone),name=field(b.name,120,true);
    const date=kind==='visit'?field(b.requested_date,10,true):null;
    if(date&&(!/^\d{4}-\d\d-\d\d$/.test(date)||date<new Date(Date.now()+19800000).toISOString().slice(0,10))) throw fail(400,'Choose a future visit date.');
    const listing=kind==='contact'?null:id(b.listing_id);
    await transaction(async c=>{
      if(listing){
        const {rows}=await c.query("SELECT availability,kind FROM listings WHERE id=$1 AND status='published' FOR SHARE",[listing]);
        if(!rows.length || (kind==='booking'&&(rows[0].kind!=='apartment'||rows[0].availability!=='available'))) throw fail(409,'This listing is unavailable for that request.');
      }
      await c.query('INSERT INTO enquiries(user_id,listing_id,kind,name,phone,message,requested_date) VALUES($1,$2,$3,$4,$5,$6,$7)',[user?.id,listing,kind,name,phone,field(b.message,3000,kind==='contact'),date]);
    });res.sendStatus(201);
  }));
  api.use('/manage',requireRole('admin'));
  api.get('/manage/overview',run(async(req,res)=>{
    const [counts,activity]=await Promise.all([query(`SELECT count(*) FILTER(WHERE kind='apartment' AND status<>'archived') apartments,
    count(*) FILTER(WHERE kind='apartment' AND status='published' AND availability='available') available,
    count(*) FILTER(WHERE kind='apartment' AND status='published' AND availability IN('reserved','sold')) reserved_sold,
    count(*) FILTER(WHERE kind='design' AND status<>'archived') designs,(SELECT count(*) FROM users WHERE role='customer') customers,
    (SELECT count(*) FROM enquiries WHERE status='new') new_enquiries,(SELECT count(*) FROM enquiries WHERE kind='visit') visits FROM listings`),
    query('SELECT action,created_at FROM audit_log ORDER BY id DESC LIMIT 10')]);res.json({counts:counts.rows[0],activity:activity.rows});
  }));
  api.get('/manage/listings',run((req,res)=>listingList(req,res,true)));
  api.get('/manage/listings/:id',run(async(req,res)=>{const {rows}=await query(details+' WHERE id=$1',[id(req.params.id)]);if(!rows.length) throw fail(404,'Unknown listing.');res.json(rows[0]);}));
  const save=run(async(req,res)=>{
    const b=req.body,values=listingValues(b),gallery=b.gallery||[];
    if(!Array.isArray(gallery)||gallery.length>30||new Set(gallery).size!==gallery.length) throw fail(400,'Invalid gallery.');
    gallery.forEach(id);
    const listing=await transaction(async c=>{
      const result=req.params.id?await c.query('UPDATE listings SET '+cols.map((col,i)=>col+'='+params[i]).join(',')+',updated_at=now() WHERE id=$18 RETURNING id',[...values,id(req.params.id)]):
        await c.query('INSERT INTO listings('+cols.join(',')+') VALUES('+params.join(',')+') RETURNING id',values);
      if(!result.rowCount) throw fail(404,'Unknown listing.');
      const key=result.rows[0].id;
      await c.query('DELETE FROM listing_images WHERE listing_id=$1',[key]);
      await c.query('INSERT INTO listing_images SELECT $1,image,ordinal-1 FROM unnest($2::uuid[]) WITH ORDINALITY AS g(image,ordinal)',[key,gallery]);
      await audit(c,req.user.id,'listing_'+b.status,key);return key;
    });res.json({id:listing});
  });
  api.post('/manage/listings',save);api.put('/manage/listings/:id',save);
  api.get('/manage/enquiries',run(async(req,res)=>{
    const {rows}=await query(`SELECT e.*,l.title FROM enquiries e LEFT JOIN listings l ON l.id=e.listing_id
      WHERE ($1::text IS NULL OR e.status=$1) AND ($2::text IS NULL OR e.kind=$2)
      AND (e.name ILIKE $3 OR e.phone ILIKE $3 OR l.title ILIKE $3) ORDER BY e.created_at DESC,e.id LIMIT 21 OFFSET $4`,[
      req.query.status?choice(req.query.status,leadStates):null,req.query.kind?choice(req.query.kind,leadTypes):null,'%'+field(req.query.search,100)+'%',page(req.query.page)*20]);
    res.json({items:rows.slice(0,20),more:rows.length>20});
  }));
  api.patch('/manage/enquiries/:id',run(async(req,res)=>{
    await transaction(async c=>{
      const result=await c.query('UPDATE enquiries SET status=$1,notes=$2 WHERE id=$3',[choice(req.body.status,leadStates),field(req.body.notes,3000),id(req.params.id)]);
      if(!result.rowCount) throw fail(404,'Unknown enquiry.');await audit(c,req.user.id,'enquiry_updated',req.params.id);
    });res.sendStatus(204);
  }));
  api.get('/manage/customers',run(async(req,res)=>res.json((await query("SELECT name,right(phone,4) AS phone_ending,created_at FROM users WHERE role='customer' ORDER BY created_at DESC,id LIMIT 21 OFFSET $1",[page(req.query.page)*20])).rows)));
  api.put('/manage/settings/:key',run(async(req,res)=>{
    const key=choice(req.params.key,settingsKeys),value=field(req.body.value,4000),media=req.body.media_id?id(req.body.media_id):null;
    if(key==='social' && value && !/^https:\/\/[^\s]+$/.test(value)) throw fail(400,'Use an HTTPS link.');
    await transaction(async c=>{await c.query('INSERT INTO website_settings VALUES($1,$2,$3) ON CONFLICT(key) DO UPDATE SET value=excluded.value,media_id=excluded.media_id',[key,JSON.stringify(value),media]);await audit(c,req.user.id,'settings_'+key);});res.sendStatus(204);
  }));
}
