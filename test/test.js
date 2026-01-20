/**
 * SeedForge - Node.js Test Suite
 * Run with: node test/test.js
 */

const SeedForge = require('../dist/seedforge.js');
const { PRNG, Noise, Algorithms } = SeedForge;

// Test utilities
let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  ✅ ${message}`);
        passed++;
    } else {
        console.log(`  ❌ ${message}`);
        failed++;
    }
}

function section(title) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`  ${title}`);
    console.log('='.repeat(50));
}

// ============================================================
// TESTS
// ============================================================

section('Basic Generation');

const rng = new PRNG('test-seed', 'xoshiro128');

// Range tests
let inRange = true;
for (let i = 0; i < 1000; i++) {
    const v = rng.random();
    if (v < 0 || v >= 1) inRange = false;
}
assert(inRange, 'random() in [0, 1)');

rng.reset();
let intRange = true;
for (let i = 0; i < 1000; i++) {
    const v = rng.int(5, 15);
    if (v < 5 || v > 15 || !Number.isInteger(v)) intRange = false;
}
assert(intRange, 'int(5, 15) in [5, 15]');

section('Reproducibility');

const rng1 = new PRNG('same-seed', 'sfc32');
const rng2 = new PRNG('same-seed', 'sfc32');

const seq1 = Array.from({ length: 10 }, () => rng1.random());
const seq2 = Array.from({ length: 10 }, () => rng2.random());
assert(seq1.every((v, i) => v === seq2[i]), 'Same seed = same sequence');

rng1.reset();
const seq3 = Array.from({ length: 10 }, () => rng1.random());
assert(seq1.every((v, i) => v === seq3[i]), 'reset() works');

section('State Management');

const rngState = new PRNG('state-test', 'pcg32');
for (let i = 0; i < 50; i++) rngState.random();

const saved = rngState.getState();
const expected = Array.from({ length: 10 }, () => rngState.random());

rngState.setState(saved);
const restored = Array.from({ length: 10 }, () => rngState.random());
assert(expected.every((v, i) => v === restored[i]), 'setState() restores position');

const cloned = rngState.clone();
const origSeq = Array.from({ length: 10 }, () => rngState.random());
const cloneSeq = Array.from({ length: 10 }, () => cloned.random());
assert(cloneSeq.every((v, i) => v === origSeq[i]), 'clone() works');

section('Distributions');

const distRng = new PRNG('dist-test');

// Normal distribution
const normals = Array.from({ length: 10000 }, () => distRng.normal(100, 15));
const mean = normals.reduce((a, b) => a + b) / normals.length;
const stdDev = Math.sqrt(normals.reduce((a, b) => a + (b - mean) ** 2, 0) / normals.length);
assert(Math.abs(mean - 100) < 1, `normal() mean: ${mean.toFixed(2)} (expected ~100)`);
assert(Math.abs(stdDev - 15) < 1, `normal() stdDev: ${stdDev.toFixed(2)} (expected ~15)`);

// Exponential
const exps = Array.from({ length: 10000 }, () => distRng.exponential(0.5));
const expMean = exps.reduce((a, b) => a + b) / exps.length;
assert(Math.abs(expMean - 2) < 0.1, `exponential(0.5) mean: ${expMean.toFixed(2)} (expected ~2)`);

section('Array Utilities');

const arrRng = new PRNG('array-test');
const original = [1, 2, 3, 4, 5];
const shuffled = arrRng.shuffled(original);
assert(original.join(',') === '1,2,3,4,5', 'shuffled() preserves original');
assert(shuffled.sort((a,b) => a-b).join(',') === '1,2,3,4,5', 'shuffled() has same elements');

const items = ['a', 'b', 'c', 'd', 'e'];
const picked = arrRng.pick(items);
assert(items.includes(picked), `pick() returns valid item: ${picked}`);

const sampled = arrRng.sample(items, 3);
assert(sampled.length === 3 && new Set(sampled).size === 3, 'sample(3) returns 3 unique items');

section('Geometric Utilities');

const geoRng = new PRNG('geo-test');

let allInCircle = true;
for (let i = 0; i < 1000; i++) {
    const p = geoRng.pointInCircle(10);
    if (Math.sqrt(p.x ** 2 + p.y ** 2) > 10) allInCircle = false;
}
assert(allInCircle, 'pointInCircle() always within radius');

let allInSphere = true;
for (let i = 0; i < 1000; i++) {
    const p = geoRng.pointInSphere(1);
    if (Math.sqrt(p.x ** 2 + p.y ** 2 + p.z ** 2) > 1) allInSphere = false;
}
assert(allInSphere, 'pointInSphere() always within radius');

section('Special Generators');

const specRng = new PRNG('special-test');

const uuid = specRng.uuid();
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
assert(uuidRegex.test(uuid), `uuid() valid: ${uuid}`);

const color = specRng.color();
assert(/^#[0-9a-f]{6}$/.test(color), `color() valid: ${color}`);

const str = specRng.string(16);
assert(str.length === 16, `string(16) correct length: ${str}`);

section('Noise Generators');

const valueNoise = new Noise.ValueNoise('noise-test');
let noiseInRange = true;
for (let i = 0; i < 100; i++) {
    const v = valueNoise.noise2D(i * 0.1, i * 0.05);
    if (v < 0 || v > 1) noiseInRange = false;
}
assert(noiseInRange, 'ValueNoise in [0, 1]');

const simplex = new Noise.SimplexNoise('simplex-test');
let simplexInRange = true;
for (let i = 0; i < 100; i++) {
    const v = simplex.noise2D(i * 0.1, i * 0.05);
    if (v < -1 || v > 1) simplexInRange = false;
}
assert(simplexInRange, 'SimplexNoise in [-1, 1]');

section('All Algorithms');

const algorithms = ['mulberry32', 'xoshiro128', 'xorshift128', 'pcg32', 'sfc32', 'lcg'];

for (const algo of algorithms) {
    const r1 = new PRNG('algo-test', algo);
    const r2 = new PRNG('algo-test', algo);
    
    const s1 = Array.from({ length: 100 }, () => r1.random());
    const s2 = Array.from({ length: 100 }, () => r2.random());
    
    assert(s1.every((v, i) => v === s2[i]), `${algo} is reproducible`);
}

// ============================================================
// SUMMARY
// ============================================================

console.log(`\n${'='.repeat(50)}`);
console.log(`  SUMMARY: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

process.exit(failed > 0 ? 1 : 0);
