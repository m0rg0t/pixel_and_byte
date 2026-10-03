import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
export const advisory = 'GHSA-ch52-4w7c-c8xp';
export const callsiteHash = 'f373fa76e3112446db327c79b34e2bbb1ef1dcad41affb60788adf30edc9588e';
const reviewBy = new Date('2026-11-03T00:00:00Z');
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
export function evaluateAudit(report, evidence, now = new Date()) {
  if (report?.error || report?.auditReportVersion !== 2 || !report.vulnerabilities || !report.metadata?.vulnerabilities)
    throw new Error('Missing or unsuccessful npm audit report');
  const entries = Object.entries(report.vulnerabilities);
  const totals = report.metadata.vulnerabilities;
  if (totals.total !== entries.length || ['info', 'low', 'moderate', 'high', 'critical'].some((key) => !Number.isInteger(totals[key]) || totals[key] < 0) || ['info', 'low', 'moderate', 'high', 'critical'].reduce((sum, key) => sum + totals[key], 0) !== totals.total) throw new Error('Inconsistent audit totals');
  if (!entries.length) return { held: [], blocked: [] };
  const matches = same(entries.map(([name]) => name).sort(), ['astro', 'http-cache-semantics']) && now < reviewBy && evidence.astro === '7.3.5' && evidence.cache === '4.2.0' && evidence.callsite === callsiteHash && same(evidence.parents, ['node_modules/astro']);
  const blocked = [];
  for (const [name, v] of entries) {
    const direct = name === 'http-cache-semantics' && same(v.nodes, ['node_modules/http-cache-semantics']) && v.via.length === 1 && v.via[0].name === name && v.via[0].url === `https://github.com/advisories/${advisory}` && v.via[0].range === '<=4.2.0' && v.via[0].severity === 'high' && same(v.effects, ['astro']);
    const inherited = name === 'astro' && same(v.nodes, ['node_modules/astro']) && same(v.via, ['http-cache-semantics']) && same(v.effects, []);
    if (!matches || v.severity !== 'high' || !(direct || inherited)) blocked.push(name);
  }
  // An inherited finding must retain the corresponding original advisory.
  if (!report.vulnerabilities['http-cache-semantics']) blocked.push('missing original advisory');
  return { held: blocked.length ? [] : [advisory], blocked };
}
export function installedEvidence() {
  const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
  return {
    astro: JSON.parse(readFileSync('node_modules/astro/package.json')).version,
    cache: JSON.parse(readFileSync('node_modules/http-cache-semantics/package.json')).version,
    callsite: createHash('sha256').update(readFileSync('node_modules/astro/dist/assets/build/remote.js')).digest('hex'),
    parents: Object.entries(lock.packages).filter(([, value]) => value.dependencies?.['http-cache-semantics']).map(([path]) => path).sort(),
  };
}
export function verifyStaticBundle(directory) {
  let scripts = 0, pages = 0;
  function visit(path) {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      const file = join(path, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (entry.isFile()) {
        if (/\.html$/.test(entry.name)) pages++;
        if (/\.(?:mjs|cjs|js)$/.test(entry.name)) {
          scripts++;
          if (/http-cache-semantics|satisfiesWithoutRevalidation|_requestMatches|@grpc\/grpc-js/.test(readFileSync(file, 'utf8'))) throw new Error(`Node dependency found in published static bundle: ${file}`);
        }
      }
    }
  }
  visit(directory);
  if (!scripts || !pages) throw new Error('Expected a built static site with HTML and JavaScript');
  return { scripts, pages };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes('--runtime')) console.log(verifyStaticBundle('dist'));
  else {
    const result = spawnSync('npm', ['audit', '--json', '--registry=https://registry.npmjs.org'], { encoding: 'utf8', timeout: 60000, maxBuffer: 10 * 1024 * 1024 });
    mkdirSync('output/audit', { recursive: true });
    writeFileSync('output/audit/npm-audit.json', result.stdout ?? '');
    if (result.error || result.status === null || result.status > 1) throw result.error ?? new Error('npm audit did not complete');
    const report = JSON.parse(result.stdout), evidence = installedEvidence();
    writeFileSync('output/audit/reachability.json', JSON.stringify(evidence, null, 2));
    const decision = evaluateAudit(report, evidence);
    console.log(report.metadata.vulnerabilities);
    if (decision.held.length) console.warn(`Known unpatched ${advisory}, two build-only package findings; not a clean audit. Review before ${reviewBy.toISOString()}. Static bundle check remains required.`);
    if (decision.blocked.length) throw new Error(`Unreviewed findings: ${decision.blocked.join(', ')}`);
  }
}
