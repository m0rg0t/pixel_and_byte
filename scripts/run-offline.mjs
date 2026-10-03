import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, basename } from 'node:path';
const args = process.argv.slice(2);
if (!args.length) throw new Error('A local Node entry point is required');
mkdirSync('output', { recursive: true });
const label = args[0] === '--test' ? 'guards' : [basename(args[0]), args[1] ?? 'run'].join('-').replace(/[^a-z0-9.-]/gi, '_');
const log = resolve('output', label + '-blocked-hosts.txt');
writeFileSync(log, '');
const guard = resolve('scripts/offline-network-guard.cjs');
const result = spawnSync(process.execPath, args, {
  stdio: 'inherit',
  timeout: 120_000,
  env: { ...process.env, SITE_VERIFY_OFFLINE: 'true', OFFLINE_NETWORK_LOG: log,
    NODE_OPTIONS: [process.env.NODE_OPTIONS, '--require=' + JSON.stringify(guard)].filter(Boolean).join(' ') },
});
if (result.error) console.error(result.error.message);
const blocked = readFileSync(log, 'utf8').trim();
if (blocked) console.error('Unexpected network attempts were blocked during verification:', blocked);
process.exitCode = blocked ? 1 : (result.status ?? 1);
