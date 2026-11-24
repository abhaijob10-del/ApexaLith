import {database} from '../db/connection.mjs';
import {purge} from '../backend/media.mjs';
try {
  const db=database();
  for(const table of ['otp_challenges','sessions','rate_limits']) {
    await db.query('DELETE FROM '+table+' WHERE expires_at<=now()');
  }
  const {rows}=await db.query("SELECT storage_key FROM media_cleanup q WHERE queued_at<now()-interval '1 hour' AND NOT EXISTS(SELECT 1 FROM media m WHERE m.storage_key=q.storage_key) ORDER BY queued_at LIMIT 200");
  for(const row of rows)await purge(row.storage_key);
  console.info(JSON.stringify({event:'maintenance_complete',media_processed:rows.length}));
} catch {console.error(JSON.stringify({event:'maintenance_failed'}));process.exitCode=1;}
finally {if(process.env.DATABASE_URL)await database().end();}
