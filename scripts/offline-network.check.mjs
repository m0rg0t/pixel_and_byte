import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
const guard = resolve('scripts/offline-network-guard.cjs');
function run(source, mode = 'true') {
  return spawnSync(process.execPath, ['-e', source], { encoding: 'utf8',
    env: { ...process.env, SITE_VERIFY_OFFLINE: mode, OFFLINE_NETWORK_LOG: '', NODE_OPTIONS: '' } });
}
test('verification blocks forbidden fetch before its implementation is called', () => {
  const r = run("globalThis.fetch = async () => { throw new Error('PASSTHROUGH'); }; require(" + JSON.stringify(guard) + "); fetch('https://forbidden.invalid').catch(e => console.log(e.message));");
  assert.equal(r.status, 0);
  assert.match(r.stdout, /blocked outbound network to forbidden.invalid/);
  assert.doesNotMatch(r.stdout, /PASSTHROUGH/);
});
test('verification blocks direct non-loopback sockets before connecting', () => {
  const r = run("require(" + JSON.stringify(guard) + "); require('node:net').connect({host:'forbidden.invalid',port:443});");
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /blocked outbound network to forbidden.invalid/);
});
test('verification guard cannot silently activate in ordinary production', () => {
  const r = run("require(" + JSON.stringify(guard) + ");", 'false');
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /requires SITE_VERIFY_OFFLINE=true/);
});
