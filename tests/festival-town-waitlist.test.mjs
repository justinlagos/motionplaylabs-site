import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { test, after } from 'node:test';
import assert from 'node:assert/strict';

// Exercise the real route with external storage/email replaced by in-memory responses.
const dir = await mkdtemp(join(tmpdir(), 'ft-signup-'));
const output = join(dir, 'route.cjs');
await build({ entryPoints: ['src/app/api/festival-town/waitlist/route.ts'], outfile: output, bundle: true, platform: 'node', format: 'cjs', alias: { '@': process.cwd() + '/src' } });
const { POST } = createRequire(import.meta.url)(output);
const originalFetch = globalThis.fetch;
const originalKey = process.env.RESEND_API_KEY;
delete process.env.RESEND_API_KEY;
let requests = [];
let storageStatus = 201;
let requestId = 0;
globalThis.fetch = async (url, init) => { requests.push({ url, data: JSON.parse(init.body) }); return new Response('', { status: storageStatus }); };
after(async () => { globalThis.fetch = originalFetch; if (originalKey) process.env.RESEND_API_KEY = originalKey; await rm(dir, { recursive: true, force: true }); });
const submit = body => { requests = []; return POST(new Request('https://example.test/api/festival-town/waitlist/', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': `test-${++requestId}` }, body: JSON.stringify(body) })); };
const parent = { email: 'parent@example.test', audience: 'parent', consent: true };

test('rejects absent consent before contacting storage', async () => { const res = await submit({ ...parent, consent: false }); assert.equal(res.status, 400); assert.equal(requests.length, 0); });
test('school signup requires school name', async () => { const res = await submit({ ...parent, audience: 'school' }); assert.equal(res.status, 400); assert.equal(requests.length, 0); });
test('parent signup stores consent but discards legacy child age and name fields', async () => { const res = await submit({ ...parent, child_age: '6 to 7', first_name: 'Unused' }); assert.equal(res.status, 200); assert.equal(requests.length, 1); assert.equal(requests[0].data.child_age, null); assert.equal(requests[0].data.first_name, null); assert.equal(requests[0].data.consent, true); assert.ok(requests[0].data.consent_text.includes('new worlds')); });
test('school signup preserves school-specific information', async () => { const res = await submit({ ...parent, audience: 'school', school_name: 'Example School', role: 'Teacher', child_age: '4' }); assert.equal(res.status, 200); assert.equal(requests[0].data.school_name, 'Example School'); assert.equal(requests[0].data.role, 'Teacher'); assert.equal(requests[0].data.child_age, null); });
test('duplicate signup is acknowledged without another welcome email', async () => { storageStatus = 409; const res = await submit(parent); assert.equal(res.status, 200); assert.equal((await res.json()).duplicate, true); assert.equal(requests.length, 1); });
test('storage failure remains an error, not a success message', async () => { storageStatus = 500; const res = await submit(parent); assert.equal(res.status, 502); assert.ok((await res.json()).error); });
