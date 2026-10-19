/**
 * Phase 17 Step 7 — safe, non-destructive Supabase connectivity probe.
 * Does not print URL, keys, tokens, or row payloads.
 */
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

function loadEnv(filePath) {
  const env = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#')) continue;
    const i = line.indexOf('=');
    if (i < 0) continue;
    const k = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    env[k] = v;
  }
  return env;
}

function out(obj) {
  console.log(JSON.stringify(obj));
}

function tableStatus(err, data) {
  if (!err && Array.isArray(data)) return 'TABLE_REACHABLE';
  const msg = (err?.message || '').toLowerCase();
  const code = err?.code || '';
  if (
    code === 'PGRST205' ||
    msg.includes('could not find the table') ||
    msg.includes('does not exist') ||
    msg.includes('schema cache')
  ) {
    return 'TABLE_MISSING';
  }
  if (
    code === '42501' ||
    msg.includes('permission') ||
    msg.includes('row-level security') ||
    msg.includes('jwt')
  ) {
    return 'TABLE_EXISTS_ACCESS_DENIED';
  }
  if (!err) return 'TABLE_REACHABLE';
  return 'UNKNOWN_ERROR';
}

const envPath = process.env.PHASE17_ENV_PATH || 'D:/SubscriptionTracker/mobile/.env';
const env = loadEnv(envPath);
const url = env.EXPO_PUBLIC_SUPABASE_URL || '';
const key = env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

if (!url || !key) {
  out({ connection: 'FAIL', reason: 'missing_env' });
  process.exit(1);
}

const refMatch = url.match(/^https:\/\/([a-z0-9]+)\.supabase\.co\/?$/);
out({
  env_ok: true,
  url_shape_ok: Boolean(refMatch),
  project_ref_len: refMatch ? refMatch[1].length : 0,
  project_ref_prefix: refMatch ? refMatch[1].slice(0, 4) : null,
  key_family: key.startsWith('sb_publishable_')
    ? 'sb_publishable'
    : key.startsWith('sb_secret_')
      ? 'sb_secret'
      : key.startsWith('eyJ')
        ? 'jwt'
        : 'other',
});

const supabase = createClient(url, key, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

const base = url.replace(/\/$/, '');

let authHealthStatus = null;
let authHealthOk = false;
try {
  const authHealth = await fetch(`${base}/auth/v1/health`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  authHealthStatus = authHealth.status;
  authHealthOk = authHealth.ok;
  await authHealth.text();
} catch (e) {
  out({
    connection: 'FAIL',
    reason: 'auth_health_network_error',
    error_name: e?.name ?? 'Error',
  });
  process.exit(1);
}

out({
  auth_health_status: authHealthStatus,
  auth_health_ok: authHealthOk,
});

const { data: subData, error: subError } = await supabase
  .from('subscriptions')
  .select('id')
  .limit(1);

out({
  subscriptions_probe: {
    has_data: Array.isArray(subData),
    row_count: Array.isArray(subData) ? subData.length : null,
    error_code: subError?.code ?? null,
    error_message_safe: subError ? String(subError.message).slice(0, 160) : null,
    inferred: tableStatus(subError, subData),
  },
});

const { data: profData, error: profError } = await supabase
  .from('profiles')
  .select('id')
  .limit(1);

out({
  profiles_probe: {
    has_data: Array.isArray(profData),
    row_count: Array.isArray(profData) ? profData.length : null,
    error_code: profError?.code ?? null,
    error_message_safe: profError ? String(profError.message).slice(0, 160) : null,
    inferred: tableStatus(profError, profData),
  },
});

const { error: missingError } = await supabase
  .from('phase17_does_not_exist_xyz')
  .select('id')
  .limit(1);

out({
  missing_table_canary: {
    error_code: missingError?.code ?? null,
    error_message_safe: missingError
      ? String(missingError.message).slice(0, 160)
      : null,
    inferred: tableStatus(missingError, null),
  },
});

const subStatus = tableStatus(subError, subData);
const profStatus = tableStatus(profError, profData);

let connection = 'FAIL';
if (authHealthOk) {
  connection = 'PASS';
} else if (authHealthStatus != null) {
  connection = 'FAIL';
}

out({
  connection,
  migration_inference: {
    subscriptions: subStatus,
    profiles: profStatus,
    schema_applied_likely:
      (subStatus === 'TABLE_REACHABLE' ||
        subStatus === 'TABLE_EXISTS_ACCESS_DENIED') &&
      (profStatus === 'TABLE_REACHABLE' ||
        profStatus === 'TABLE_EXISTS_ACCESS_DENIED'),
    schema_missing_likely:
      subStatus === 'TABLE_MISSING' || profStatus === 'TABLE_MISSING',
  },
});
