import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { initializeApp, deleteApp } from 'firebase/app';
import { getFirestore, doc, terminate } from 'firebase/firestore';
const require = createRequire(import.meta.url);
const firestoreRequire = createRequire(require.resolve('@firebase/firestore'));
const grpc = firestoreRequire('@grpc/grpc-js');
const protoLoader = firestoreRequire('@grpc/proto-loader');

test('patched Firestore transport supports its proto-loader API over loopback', { timeout: 10000 }, async () => {
  assert.equal(firestoreRequire('@grpc/grpc-js/package.json').version, '1.14.5');
  // Use the same fromJSON/loadPackageDefinition boundary as the SDK, with a
  // disposable in-process service and no Firebase project or credentials.
  const definition = protoLoader.fromJSON({ nested: { Fixture: { fields: { value: { type: 'string', id: 1 } } }, FixtureService: { methods: { Echo: { requestType: 'Fixture', responseType: 'Fixture' } } } } });
  const { FixtureService } = grpc.loadPackageDefinition(definition);
  const server = new grpc.Server();
  server.addService(FixtureService.service, { echo(call, done) { done(null, { value: call.request.value }); } });
  const port = await new Promise((resolve, reject) => server.bindAsync('127.0.0.1:0', grpc.ServerCredentials.createInsecure(), (error, port) => error ? reject(error) : resolve(port)));
  const client = new FixtureService(`127.0.0.1:${port}`, grpc.credentials.createInsecure());
  try {
    const response = await new Promise((resolve, reject) => client.echo({ value: 'synthetic' }, { deadline: Date.now() + 3000 }, (error, value) => error ? reject(error) : resolve(value)));
    assert.equal(response.value, 'synthetic');
  } finally {
    client.close();
    await new Promise((resolve) => server.tryShutdown(resolve));
  }
});

test('current Firebase SDK constructs and closes with synthetic configuration offline', async () => {
  const app = initializeApp({ projectId: 'demo-maintenance-fixture', apiKey: 'synthetic-test-value' }, 'maintenance-fixture');
  const database = getFirestore(app);
  try { assert.equal(doc(database, 'fixtures', 'one').path, 'fixtures/one'); }
  finally { await terminate(database); await deleteApp(app); }
});
