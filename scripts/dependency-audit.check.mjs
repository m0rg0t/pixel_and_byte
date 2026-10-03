import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateAudit, advisory, callsiteHash } from './dependency-audit.mjs';
const evidence = { astro: '7.3.5', cache: '4.2.0', callsite: callsiteHash, parents: ['node_modules/astro'] };
const now = new Date('2026-10-03T00:00:00Z');
function fixture() {
  return { auditReportVersion: 2, metadata: { vulnerabilities: { info: 0, low: 0, moderate: 0, high: 2, critical: 0, total: 2 } }, vulnerabilities: {
    astro: { severity: 'high', nodes: ['node_modules/astro'], via: ['http-cache-semantics'], effects: [] },
    'http-cache-semantics': { severity: 'high', nodes: ['node_modules/http-cache-semantics'], via: [{ name: 'http-cache-semantics', url: `https://github.com/advisories/${advisory}`, range: '<=4.2.0', severity: 'high' }], effects: ['astro'] },
  } };
}
test('only the reviewed build-only advisory is held', () => assert.deepEqual(evaluateAudit(fixture(), evidence, now), { held: [advisory], blocked: [] }));
test('new advisory, dependency path or package version fails closed', () => {
  const newer = fixture(); newer.vulnerabilities['http-cache-semantics'].via.push({ url: 'https://github.com/advisories/new' });
  assert.ok(evaluateAudit(newer, evidence, now).blocked.length);
  const moved = fixture(); moved.vulnerabilities.astro.nodes.push('node_modules/nested/astro');
  assert.ok(evaluateAudit(moved, evidence, now).blocked.length);
  for (const changed of [{ cache: '4.2.1' }, { astro: '7.3.6' }, { callsite: 'changed' }, { parents: ['node_modules/other'] }])
    assert.ok(evaluateAudit(fixture(), { ...evidence, ...changed }, now).blocked.length);
});
test('expired exception fails closed', () => assert.ok(evaluateAudit(fixture(), evidence, new Date('2026-11-03T00:00:00Z')).blocked.length));
test('failed or incomplete audit is never treated as clean', () => {
  for (const report of [{}, { error: { message: 'offline' } }, { ...fixture(), vulnerabilities: {} }]) assert.throws(() => evaluateAudit(report, evidence, now));
});
test('a complete genuinely clean report needs no exception', () => assert.deepEqual(evaluateAudit({ auditReportVersion: 2, vulnerabilities: {}, metadata: { vulnerabilities: { info: 0, low: 0, moderate: 0, high: 0, critical: 0, total: 0 } } }, evidence, now), { held: [], blocked: [] }));
