# 🌱 SeedForge

**Advanced Pseudo-Random Number Generator Library for JavaScript**

A comprehensive, seedable PRNG library featuring multiple algorithms, statistical distributions, noise generators, and utilities designed for procedural generation, games, simulations, and reproducible randomness.

[![npm version](https://img.shields.io/npm/v/seedforge-prng.svg)](https://www.npmjs.com/package/seedforge-prng)
[![npm downloads](https://img.shields.io/npm/dm/seedforge-prng.svg)](https://www.npmjs.com/package/seedforge-prng)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Algorithms](#algorithms)
- [API Reference](#api-reference)
  - [Basic Generation](#basic-generation)
  - [Statistical Distributions](#statistical-distributions)
  - [Array Utilities](#array-utilities)
  - [Geometric Utilities](#geometric-utilities)
  - [Special Generators](#special-generators)
  - [State Management](#state-management)
  - [Noise Generators](#noise-generators)
- [Usage Examples](#usage-examples)
  - [Procedural Terrain Generation](#procedural-terrain-generation)
  - [RPG Loot System](#rpg-loot-system)
  - [NPC Name Generator](#npc-name-generator)
  - [Dice Rolling System](#dice-rolling-system)
  - [Card Deck Shuffling](#card-deck-shuffling)
  - [Procedural Colors](#procedural-colors)
  - [Spawn Point Distribution](#spawn-point-distribution)
  - [Save/Load Game State](#saveload-game-state)
  - [Parallel Random Streams](#parallel-random-streams)
  - [Monte Carlo Simulation](#monte-carlo-simulation)
- [Performance](#performance)
- [Browser Usage](#browser-usage)
- [TypeScript Support](#typescript-support)
- [Testing](#testing)
- [License](#license)
- [Credits](#credits)

---

## Features

- **🎲 6 PRNG Algorithms** - Mulberry32, Xoshiro128**, Xorshift128, PCG32, SFC32, LCG
- **📊 17 Statistical Distributions** - Normal, Exponential, Poisson, Binomial, Gamma, Beta, Pareto, Triangular, Log-Normal, Weibull, Cauchy, Geometric, Zipf, Chi-Squared, Student's t, Von Mises, Hypergeometric
- **🌊 6 Noise Generators** - Value, Simplex, Perlin, Worley (Cellular), Ridged, Billowed + fBm, turbulence, domain warping
- **📦 Array Utilities** - Shuffle, pick, sample, weighted selection
- **📐 Geometric Utilities** - Random points in/on circles, spheres, rectangles, boxes
- **💾 State Management** - Save, restore, reset, clone, and fork generators
- **🔄 100% Reproducible** - Same seed always produces identical sequences
- **📝 TypeScript Support** - Full type definitions included
- **🚀 Zero Dependencies** - Pure JavaScript, works everywhere
- **🌐 Universal** - Works in Node.js, browsers, and module bundlers

---

## Installation

### npm

```bash
npm install seedforge-prng
```

### Browser (CDN)

```html
<script src="https://unpkg.com/seedforge-prng/dist/seedforge.js"></script>
```

### Manual Download

Download `seedforge.js` from the `dist/` folder and include it in your project.

---

## Quick Start

### Node.js / CommonJS

```javascript
const { PRNG } = require('seedforge-prng');

const rng = new PRNG('my-seed');
console.log(rng.random());     // 0.7364291045814753
console.log(rng.int(1, 100));  // 42
```

### ES Modules

```javascript
import { PRNG } from 'seedforge-prng';

const rng = new PRNG('my-seed');
console.log(rng.random());
```

### Browser

```html
<script src="seedforge.js"></script>
<script>
    const rng = new PRNG.PRNG('my-seed');
    console.log(rng.random());
</script>
```

### Basic Example

```javascript
const { PRNG } = require('seedforge-prng');

// Create a seeded generator
const rng = new PRNG('my-game-seed');

// Generate various random values
rng.random();           // Float in [0, 1)     → 0.7364291045814753
rng.int(1, 100);        // Integer in [1, 100] → 42
rng.float(5.0, 10.0);   // Float in [5, 10)    → 7.284729103847
rng.bool(0.7);          // 70% chance of true  → true
rng.sign();             // -1 or 1             → -1

// Reproducibility: same seed = same sequence
const rng2 = new PRNG('my-game-seed');
rng2.random();          // 0.7364291045814753 (identical!)
```

---

## Algorithms

SeedForge includes 6 different PRNG algorithms. Each has different characteristics:

| Algorithm | Period | Speed | Quality | Best For |
|-----------|--------|-------|---------|----------|
| `mulberry32` | ~2³² | ★★★★★ | ★★★☆☆ | Simple games, quick prototypes |
| `xoshiro128` | 2¹²⁸-1 | ★★★★☆ | ★★★★★ | General purpose **(default)** |
| `xorshift128` | 2¹²⁸-1 | ★★★☆☆ | ★★★★☆ | When you need xorshift specifically |
| `pcg32` | 2⁶⁴ | ★★★★☆ | ★★★★★ | Simulations, statistics |
| `sfc32` | ~2¹²⁸ | ★★★★★ | ★★★★★ | Best all-around choice |
| `lcg` | 2³² | ★★★★★ | ★★☆☆☆ | Legacy compatibility |

> ⚠️ **Performance Note**: `xorshift128` may be slower than other algorithms in some JavaScript environments. For best performance, use `sfc32`, `mulberry32`, or `xoshiro128`.

### Choosing an Algorithm

```javascript
// Default (xoshiro128) - great for most uses
const rng = new PRNG('seed');

// Specify algorithm
const rng1 = new PRNG('seed', 'sfc32');      // Best all-around
const rng2 = new PRNG('seed', 'mulberry32'); // Fastest
const rng3 = new PRNG('seed', 'pcg32');      // Best for statistics
```

### Algorithm Details

**Mulberry32** - Extremely fast, small state (32-bit). Good for games where speed matters more than statistical perfection.

**Xoshiro128**** - Excellent statistical properties with 128-bit state. Supports `jump()` for creating parallel streams. The default choice.

**PCG32** - Permuted Congruential Generator. Exceptional statistical quality, passes all BigCrush tests. Best for Monte Carlo simulations.

**SFC32** - Simple Fast Counter. Extremely fast while maintaining excellent quality. Passes PractRand. Recommended for most uses.

**LCG** - Linear Congruential Generator. Classic algorithm, included for compatibility. Lower quality but predictable behavior.

---

## API Reference

### Creating a Generator

```javascript
const { PRNG } = require('seedforge-prng');

// With string seed (recommended)
const rng = new PRNG('my-seed');

// With number seed
const rng = new PRNG(12345);

// With specific algorithm
const rng = new PRNG('my-seed', 'pcg32');

// Change seed later
rng.setSeed('new-seed');
rng.setSeed('new-seed', 'sfc32'); // Also change algorithm
```

---

### Basic Generation

#### `random()` → `number`
Returns a random float in the range [0, 1).

```javascript
rng.random();  // 0.7364291045814753
rng.random();  // 0.2847293018374628
rng.random();  // 0.9173648201847362
```

#### `randomInt()` → `number`
Returns a random 32-bit unsigned integer.

```javascript
rng.randomInt();  // 3162948573
rng.randomInt();  // 1847362910
```

#### `int(min, max)` → `number`
Returns a random integer in the range [min, max] (inclusive).

```javascript
rng.int(1, 6);    // 4 (like rolling a die)
rng.int(0, 100);  // 73
rng.int(-10, 10); // -3
```

#### `float(min, max)` → `number`
Returns a random float in the range [min, max).

```javascript
rng.float(0, 1);      // 0.7364291045814753
rng.float(10, 20);    // 15.847293018374628
rng.float(-5.5, 5.5); // 2.183746281037465
```

#### `bool(probability?)` → `boolean`
Returns true with the given probability (default 0.5).

```javascript
rng.bool();      // true (50% chance)
rng.bool(0.8);   // true (80% chance)
rng.bool(0.1);   // false (10% chance of true)
```

#### `sign(probability?)` → `-1 | 1`
Returns -1 or 1, with the given probability of returning 1.

```javascript
rng.sign();      // -1 or 1 (50/50)
rng.sign(0.7);   // 1 (70% chance) or -1 (30% chance)
```

---

### Statistical Distributions

#### `normal(mean?, stdDev?)` → `number`
Normal (Gaussian) distribution using Box-Muller transform.

```javascript
// Standard normal (mean=0, stdDev=1)
rng.normal();           // -0.284 to 2.847 (typically)

// IQ-like distribution
rng.normal(100, 15);    // 94.28, 112.47, 87.19...

// Character stats
rng.normal(50, 10);     // 48.2, 53.7, 41.9...
```

**Use cases:** Character attributes, natural measurements, test scores, any "bell curve" data.

#### `exponential(lambda?)` → `number`
Exponential distribution for modeling time between events.

```javascript
// Average of 2 (lambda = 0.5, mean = 1/lambda)
rng.exponential(0.5);   // 1.847, 0.293, 3.182...

// Average of 10
rng.exponential(0.1);   // 8.47, 12.93, 3.82...
```

**Use cases:** Time between enemy spawns, item drops, random events.

#### `poisson(lambda)` → `number`
Poisson distribution for counting random events.

```javascript
// Average 4 events
rng.poisson(4);   // 3, 5, 4, 2, 6...

// Average 10 events
rng.poisson(10);  // 8, 11, 10, 12, 9...
```

**Use cases:** Number of enemies in an encounter, items in a chest, events per time period.

#### `binomial(n, p)` → `number`
Binomial distribution - number of successes in n trials.

```javascript
// 10 coin flips
rng.binomial(10, 0.5);   // 4, 6, 5, 7, 3...

// 20 attempts with 30% success rate
rng.binomial(20, 0.3);   // 6, 5, 8, 4, 7...
```

**Use cases:** Critical hit streaks, success counts, quality rolls.

#### `triangular(min?, max?, mode?)` → `number`
Triangular distribution with a peak at mode.

```javascript
// Peak at 0.5 (symmetric)
rng.triangular(0, 1, 0.5);    // 0.42, 0.58, 0.51...

// Peak near max (skewed right)
rng.triangular(0, 100, 80);   // 72, 85, 68, 91...

// Peak near min (skewed left)
rng.triangular(1, 10, 2);     // 2.4, 3.1, 1.8...
```

**Use cases:** Task completion times, price variations, biased random values.

#### `pareto(alpha?, xm?)` → `number`
Pareto distribution (power law / 80-20 rule).

```javascript
// Typical wealth distribution
rng.pareto(1.16, 1);    // 1.2, 2.8, 1.1, 15.4, 1.3...

// Steeper falloff
rng.pareto(2, 10);      // 11.2, 10.8, 14.7, 10.3...
```

**Use cases:** Loot value, city sizes, wealth distribution, popularity.

#### `gamma(shape, scale?)` → `number`
Gamma distribution for waiting times and life spans.

```javascript
rng.gamma(2, 2);   // 3.182, 1.847, 4.293...
rng.gamma(5, 1);   // 4.28, 5.91, 3.72...
```

**Use cases:** Wait times, rainfall amounts, insurance claims.

#### `beta(alpha, beta)` → `number`
Beta distribution for probabilities and proportions (always 0-1).

```javascript
// Uniform-ish
rng.beta(1, 1);      // 0.28, 0.74, 0.51...

// Skewed toward 0
rng.beta(1, 5);      // 0.12, 0.08, 0.23...

// Skewed toward 1
rng.beta(5, 1);      // 0.87, 0.92, 0.78...

// Bell-shaped
rng.beta(5, 5);      // 0.48, 0.52, 0.44...
```

**Use cases:** AI confidence levels, completion percentages, probability parameters.

#### `logNormal(mu?, sigma?)` → `number`
Log-normal distribution for multiplicative processes.

```javascript
rng.logNormal(0, 0.5);   // 0.87, 1.42, 0.68...
rng.logNormal(0, 1);     // 0.54, 2.18, 0.31...
```

**Use cases:** Stock prices, file sizes, organism sizes.

#### `weibull(scale?, shape?)` → `number`
Weibull distribution for reliability/survival analysis.

```javascript
rng.weibull(1, 1);     // Exponential
rng.weibull(1, 2);     // Rayleigh
rng.weibull(1, 3.6);   // Approximately normal
```

**Use cases:** Equipment lifetime, failure rates, wind speeds.

#### `cauchy(location?, scale?)` → `number`
Cauchy distribution with heavy tails (extreme outliers).

```javascript
rng.cauchy(0, 1);   // -2.38, 0.47, 15.82, -0.18...
```

**Use cases:** When you want occasional extreme values, resonance phenomena.

#### `geometric(p)` → `number` *(New in v1.1.0)*
Geometric distribution - number of trials until first success.

```javascript
// 30% success rate per trial
rng.geometric(0.3);   // 1, 4, 2, 1, 7, 3...

// 50% success rate
rng.geometric(0.5);   // 1, 2, 1, 1, 3, 1...

// 10% success rate (rare successes)
rng.geometric(0.1);   // 8, 12, 5, 15, 3...
```

**Use cases:** Number of attempts until success, retry counts, rare drop farming.

#### `zipf(n, s?)` → `number` *(New in v1.1.0)*
Zipf distribution - power-law ranking (1 is most common, n is rarest).

```javascript
// Top 10 ranking (s=1 default)
rng.zipf(10);        // 1, 1, 2, 1, 3, 1, 1, 2...

// Top 100 with steeper falloff
rng.zipf(100, 1.5);  // 1, 1, 1, 2, 1, 1, 3...

// Flatter distribution
rng.zipf(10, 0.5);   // 1, 3, 2, 5, 1, 4, 2...
```

**Use cases:** Word frequencies, city populations, website traffic, popularity rankings.

#### `chiSquared(k)` → `number` *(New in v1.1.0)*
Chi-squared distribution with k degrees of freedom.

```javascript
// 2 degrees of freedom
rng.chiSquared(2);    // 0.47, 2.18, 1.23, 3.84...

// 5 degrees of freedom
rng.chiSquared(5);    // 3.82, 5.47, 2.91, 6.28...

// 10 degrees of freedom
rng.chiSquared(10);   // 8.12, 11.34, 9.47, 7.89...
```

**Use cases:** Statistical testing, goodness-of-fit tests, variance analysis.

#### `studentT(df)` → `number` *(New in v1.1.0)*
Student's t-distribution for small sample statistics.

```javascript
// 3 degrees of freedom (heavy tails)
rng.studentT(3);      // -0.84, 1.47, -2.18, 0.23...

// 10 degrees of freedom (closer to normal)
rng.studentT(10);     // 0.47, -1.12, 0.89, -0.34...

// 30 degrees of freedom (nearly normal)
rng.studentT(30);     // 0.28, -0.67, 1.04, -0.18...
```

**Use cases:** Confidence intervals, hypothesis testing, small sample analysis.

#### `vonMises(mu, kappa)` → `number` *(New in v1.1.0)*
Von Mises distribution for circular/directional data. Returns angle in radians [0, 2π].

```javascript
// Concentrated around 0 (East)
rng.vonMises(0, 5);           // 0.12, -0.08, 0.23, 6.18...

// Concentrated around π/2 (North)
rng.vonMises(Math.PI/2, 3);   // 1.47, 1.62, 1.38, 1.71...

// Low concentration (nearly uniform)
rng.vonMises(0, 0.5);         // 2.84, 0.47, 5.12, 3.91...
```

**Use cases:** Wind direction, compass bearings, time of day (circular), animal migration angles.

#### `hypergeometric(N, K, n)` → `number` *(New in v1.1.0)*
Hypergeometric distribution - successes when sampling without replacement.

```javascript
// Drawing 5 cards, 13 hearts in 52-card deck
rng.hypergeometric(52, 13, 5);   // 1, 2, 0, 1, 2, 1...

// 10 defective items in 100, sample 20
rng.hypergeometric(100, 10, 20); // 2, 1, 3, 2, 2...

// Urn with 30 red balls of 50 total, draw 10
rng.hypergeometric(50, 30, 10);  // 6, 5, 7, 6, 5...
```

**Use cases:** Card games (probability of drawing specific cards), quality control sampling, lottery probabilities.

---

### Array Utilities

#### `shuffle(array)` → `array`
Shuffles an array **in place** using Fisher-Yates algorithm. Returns the same array.

```javascript
const deck = [1, 2, 3, 4, 5];
rng.shuffle(deck);
console.log(deck);  // [3, 1, 5, 2, 4] (mutated)
```

#### `shuffled(array)` → `array`
Returns a **new shuffled array**, leaving the original unchanged.

```javascript
const original = [1, 2, 3, 4, 5];
const shuffled = rng.shuffled(original);
console.log(original);  // [1, 2, 3, 4, 5] (unchanged)
console.log(shuffled);  // [3, 1, 5, 2, 4] (new array)
```

#### `pick(array)` → `element`
Returns a random element from the array.

```javascript
const items = ['sword', 'shield', 'potion', 'scroll'];
rng.pick(items);  // 'potion'
rng.pick(items);  // 'sword'
rng.pick(items);  // 'potion'
```

#### `sample(array, n)` → `array`
Returns n random elements without replacement (no duplicates).

```javascript
const pool = ['a', 'b', 'c', 'd', 'e', 'f'];
rng.sample(pool, 3);  // ['c', 'a', 'e']
rng.sample(pool, 3);  // ['b', 'f', 'd']
```

#### `weightedPick(items, weights)` → `element`
Picks a random element with weighted probabilities.

```javascript
const items = ['common', 'uncommon', 'rare', 'legendary'];
const weights = [70, 20, 8, 2];  // Must match items length

rng.weightedPick(items, weights);  // 'common' (70% chance)
rng.weightedPick(items, weights);  // 'common' (70% chance)
rng.weightedPick(items, weights);  // 'rare' (8% chance)
```

#### `weightedPickObject(weightedItems)` → `string`
Picks from an object where keys are items and values are weights.

```javascript
const lootTable = {
    gold: 50,
    potion: 30,
    weapon: 15,
    artifact: 5
};

rng.weightedPickObject(lootTable);  // 'gold'
rng.weightedPickObject(lootTable);  // 'potion'
rng.weightedPickObject(lootTable);  // 'gold'
```

#### `array(length, generator?)` → `array`
Generates an array of random values using the provided generator function.

```javascript
// Array of random floats
rng.array(5);
// [0.284, 0.917, 0.103, 0.558, 0.721]

// Array of random integers
rng.array(5, () => rng.int(1, 100));
// [42, 87, 13, 56, 91]

// Array of random booleans
rng.array(5, () => rng.bool(0.3));
// [false, true, false, false, false]

// Array of random points
rng.array(3, () => rng.pointInCircle(10));
// [{x: 3.2, y: -5.1}, {x: -2.8, y: 1.4}, {x: 7.1, y: 2.9}]
```

---

### Geometric Utilities

#### `pointInCircle(radius?)` → `{x, y}`
Returns a random point uniformly distributed inside a circle.

```javascript
rng.pointInCircle(10);
// { x: 3.284, y: -5.917 }

rng.pointInCircle(1);
// { x: 0.284, y: 0.417 }
```

#### `pointOnCircle(radius?)` → `{x, y}`
Returns a random point on the edge of a circle.

```javascript
rng.pointOnCircle(10);
// { x: 7.071, y: 7.071 }

rng.pointOnCircle(1);
// { x: -0.866, y: 0.5 }
```

#### `pointInSphere(radius?)` → `{x, y, z}`
Returns a random point uniformly distributed inside a sphere.

```javascript
rng.pointInSphere(5);
// { x: 1.2, y: -2.8, z: 3.1 }
```

#### `pointOnSphere(radius?)` → `{x, y, z}`
Returns a random point on the surface of a sphere.

```javascript
rng.pointOnSphere(1);
// { x: 0.577, y: 0.577, z: 0.577 }
```

#### `direction2D()` → `{x, y}`
Returns a random 2D unit vector (direction).

```javascript
rng.direction2D();
// { x: 0.6, y: -0.8 }  (length = 1)
```

#### `direction3D()` → `{x, y, z}`
Returns a random 3D unit vector (direction).

```javascript
rng.direction3D();
// { x: 0.33, y: 0.67, z: -0.67 }  (length = 1)
```

#### `pointInRect(x, y, width, height)` → `{x, y}`
Returns a random point inside a rectangle.

```javascript
rng.pointInRect(0, 0, 100, 50);
// { x: 42.8, y: 31.2 }

rng.pointInRect(10, 20, 80, 60);
// { x: 54.2, y: 67.8 }
```

#### `pointInBox(x, y, z, width, height, depth)` → `{x, y, z}`
Returns a random point inside a 3D box.

```javascript
rng.pointInBox(0, 0, 0, 10, 10, 10);
// { x: 4.2, y: 7.1, z: 2.8 }
```

---

### Special Generators

#### `uuid()` → `string`
Generates a random UUID v4.

```javascript
rng.uuid();  // 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
rng.uuid();  // '7c9e6679-7425-40de-944b-e07fc1f90ae7'
```

#### `color()` → `string`
Generates a random hex color.

```javascript
rng.color();  // '#7a3f9c'
rng.color();  // '#2ecc71'
rng.color();  // '#e74c3c'
```

#### `colorRGB()` → `{r, g, b}`
Generates a random RGB color object.

```javascript
rng.colorRGB();
// { r: 122, g: 63, b: 156 }
```

#### `colorHSL(saturation?, lightness?)` → `{h, s, l}`
Generates a random HSL color. Optionally fix saturation and/or lightness.

```javascript
// Fully random
rng.colorHSL();
// { h: 274, s: 42, l: 43 }

// Fixed saturation and lightness (random hue)
rng.colorHSL(80, 50);
// { h: 187, s: 80, l: 50 }

// Just fixed saturation
rng.colorHSL(100, null);
// { h: 42, s: 100, l: 67 }
```

#### `char(charset?)` → `string`
Returns a random character from the given charset.

```javascript
rng.char();                        // 'k' (alphanumeric)
rng.char('0123456789');            // '7'
rng.char('aeiou');                 // 'e'
rng.char('!@#$%');                 // '#'
```

#### `string(length, charset?)` → `string`
Generates a random string of the given length.

```javascript
rng.string(8);
// 'Kj8mPx2n'

rng.string(16, '0123456789abcdef');
// 'a7f3c921e8b4d056'

rng.string(6, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
// 'KFMQZW'

rng.string(10, '01');
// '0110110101'
```

---

### State Management

State management allows you to save, restore, clone, and fork generators.

#### `getState()` → `object`
Returns the complete internal state for saving.

```javascript
const state = rng.getState();
// Save to localStorage, file, database, etc.
localStorage.setItem('rngState', JSON.stringify(state));
```

#### `setState(state)` → `void`
Restores from a previously saved state.

```javascript
const savedState = JSON.parse(localStorage.getItem('rngState'));
rng.setState(savedState);
// Generator continues from exact saved position
```

#### `reset()` → `void`
Resets the generator to its initial seed.

```javascript
const rng = new PRNG('my-seed');
rng.random();  // 0.284
rng.random();  // 0.917
rng.random();  // 0.103

rng.reset();

rng.random();  // 0.284 (back to start!)
rng.random();  // 0.917
```

#### `clone()` → `PRNG`
Creates an independent copy at the current position.

```javascript
const rng = new PRNG('seed');
rng.random();  // 0.284
rng.random();  // 0.917

const clone = rng.clone();

rng.random();    // 0.103
clone.random();  // 0.103 (same!)

rng.random();    // 0.558
clone.random();  // 0.558 (still in sync)
```

#### `fork(label?)` → `PRNG`
Creates a new generator with a derived seed. Perfect for sub-systems.

```javascript
const worldRng = new PRNG('world-42');

// Create independent streams for different systems
const terrainRng = worldRng.fork('terrain');
const riverRng = worldRng.fork('rivers');
const forestRng = worldRng.fork('forests');
const cityRng = worldRng.fork('cities');

// Each fork is independent but reproducible
terrainRng.random();  // Always same for 'world-42' + 'terrain'
riverRng.random();    // Different sequence
forestRng.random();   // Different sequence

// Recreating gives identical results
const worldRng2 = new PRNG('world-42');
const terrainRng2 = worldRng2.fork('terrain');
terrainRng2.random(); // Identical to terrainRng!
```

---

### Noise Generators

SeedForge includes 6 noise generators for procedural content generation.

#### Value Noise

```javascript
const { Noise } = require('seedforge-prng');

const noise = new Noise.ValueNoise('seed');

// 1D noise (returns 0-1)
noise.noise1D(x);
noise.noise1D(1.5);        // 0.628

// 2D noise (returns 0-1)
noise.noise2D(x, y);
noise.noise2D(1.5, 2.3);   // 0.412

// 3D noise (returns 0-1)
noise.noise3D(x, y, z);
noise.noise3D(1.5, 2.3, 0.8);  // 0.553
```

#### Simplex Noise

```javascript
const simplex = new Noise.SimplexNoise('seed');

// 2D noise (returns -1 to 1)
simplex.noise2D(x, y);
simplex.noise2D(1.5, 2.3);     // 0.284

// 3D noise (returns -1 to 1)
simplex.noise3D(x, y, z);
simplex.noise3D(1.5, 2.3, 0.8); // -0.156
```

#### Perlin Noise *(New in v1.1.0)*

Classic Perlin gradient noise.

```javascript
const perlin = new Noise.PerlinNoise('seed');

// 2D noise (returns -1 to 1)
perlin.noise2D(x, y);
perlin.noise2D(1.5, 2.3);     // 0.312

// 3D noise (returns -1 to 1)
perlin.noise3D(x, y, z);
perlin.noise3D(1.5, 2.3, 0.8); // -0.089
```

#### Worley Noise (Cellular) *(New in v1.1.0)*

Cell/Voronoi distance-based noise for organic patterns.

```javascript
const worley = new Noise.WorleyNoise('seed');

// Basic usage (returns distance to nearest cell point)
worley.noise2D(x, y);

// With distance type: 'euclidean', 'manhattan', 'chebyshev'
// F1 (nearest point)
worley.noise2D(1.5, 2.3, 'euclidean', 0);  // Round cells

// F2 (second nearest)
worley.noise2D(1.5, 2.3, 'euclidean', 1);  // Puffy shapes

// F2-F1 (cell edges)
worley.noise2D(1.5, 2.3, 'euclidean', 2);  // Cracks/veins

// Manhattan distance - diamond cells
worley.noise2D(1.5, 2.3, 'manhattan', 0);

// Chebyshev distance - square cells
worley.noise2D(1.5, 2.3, 'chebyshev', 0);
```

**Use cases:** Stone textures, biological cells, cracked earth, stained glass, caustics.

#### Ridged Noise *(New in v1.1.0)*

Sharp ridges and peaks, great for mountains and veins.

```javascript
const ridged = new Noise.RidgedNoise('seed');

// 2D ridged noise
ridged.noise2D(x * 0.01, y * 0.01);

// With fBm for detailed mountain ridges
ridged.fbm(x * 0.01, y * 0.01, null, 6, 2.0, 0.5);
```

**Use cases:** Mountain ridges, lightning bolts, veins, cracks, alien terrain.

#### Billowed Noise *(New in v1.1.0)*

Soft, puffy noise for clouds and soft terrain.

```javascript
const billowed = new Noise.BillowedNoise('seed');

// 2D billowed noise
billowed.noise2D(x * 0.01, y * 0.01);

// With fBm for fluffy clouds
billowed.fbm(x * 0.01, y * 0.01, null, 4, 2.0, 0.5);
```

**Use cases:** Clouds, smoke, soft hills, cotton, foam.

#### Fractal Brownian Motion (fBm)

All noise types support fBm for natural-looking, multi-scale noise:

```javascript
// Parameters: x, y, z, octaves, lacunarity, persistence
noise.fbm(x, y, null, octaves, lacunarity, persistence);

// Defaults: 4 octaves, 2.0 lacunarity, 0.5 persistence
noise.fbm(1.5, 2.3);

// More detail (more octaves)
noise.fbm(1.5, 2.3, null, 8, 2.0, 0.5);

// Rougher terrain (higher persistence)
noise.fbm(1.5, 2.3, null, 6, 2.0, 0.65);

// 3D fBm
noise.fbm(1.5, 2.3, 0.8, 4, 2.0, 0.5);
```

**Parameters:**
- `octaves` - Number of noise layers (more = more detail)
- `lacunarity` - Frequency multiplier per octave (usually 2.0)
- `persistence` - Amplitude multiplier per octave (0.5 = each octave half as strong)

#### Turbulence *(New in v1.1.0)*

Chaotic, swirling noise using absolute values - great for fire, smoke, and plasma.

```javascript
const simplex = new Noise.SimplexNoise('fire');

// Turbulence (absolute value fBm)
simplex.turbulence(x, y, null, octaves, lacunarity, persistence);

// Fire effect
simplex.turbulence(x * 0.03, y * 0.03, null, 6, 2.2, 0.5);

// Plasma
simplex.turbulence(x * 0.02, y * 0.02, null, 4, 2.5, 0.45);
```

**Use cases:** Fire, smoke, plasma, marble veins, turbulent water.

#### Domain Warping *(New in v1.1.0)*

Distort coordinates using noise for organic, flowing patterns.

```javascript
const simplex = new Noise.SimplexNoise('warp');

// Single warp - organic distortion
simplex.warp(x, y, warpStrength, octaves);
simplex.warp(x * 0.02, y * 0.02, 1.5, 4);

// Double warp - extreme organic patterns
simplex.warp2(x, y, warpStrength, octaves);
simplex.warp2(x * 0.02, y * 0.02, 2.0, 4);
```

**Use cases:** Marble, alien terrain, organic materials, flowing patterns.

---

## Usage Examples

### Procedural Terrain Generation

```javascript
const { PRNG, Noise } = require('seedforge-prng');

function generateHeightmap(seed, width, height) {
    const noise = new Noise.SimplexNoise(seed);
    const heightmap = [];
    
    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            // Multi-octave noise for natural terrain
            let elevation = noise.fbm(
                x * 0.02,  // Scale factor
                y * 0.02,
                null,
                6,         // 6 octaves for detail
                2.0,       // Standard lacunarity
                0.5        // Standard persistence
            );
            
            // Normalize from [-1, 1] to [0, 1]
            elevation = (elevation + 1) / 2;
            
            row.push(elevation);
        }
        heightmap.push(row);
    }
    
    return heightmap;
}

// Same seed = same terrain every time
const terrain1 = generateHeightmap('world-42', 256, 256);
const terrain2 = generateHeightmap('world-42', 256, 256);
// terrain1 and terrain2 are identical!
```

### RPG Loot System

```javascript
const { PRNG } = require('seedforge-prng');

class LootTable {
    constructor(seed) {
        this.rng = new PRNG(seed);
        
        this.rarities = {
            common: 60,
            uncommon: 25,
            rare: 10,
            epic: 4,
            legendary: 1
        };
        
        this.items = {
            common: ['Rusty Sword', 'Wooden Shield', 'Cloth Armor', 'Minor Potion'],
            uncommon: ['Iron Sword', 'Steel Shield', 'Leather Armor', 'Potion'],
            rare: ['Silver Sword', 'Knight Shield', 'Chain Mail', 'Greater Potion'],
            epic: ['Enchanted Blade', 'Dragon Shield', 'Plate Armor', 'Elixir'],
            legendary: ['Excalibur', 'Aegis', 'Divine Armor', 'Phoenix Down']
        };
    }
    
    generateLoot(enemyLevel) {
        const loot = [];
        
        // Number of drops (Poisson distribution)
        const dropCount = this.rng.poisson(1 + enemyLevel * 0.3);
        
        for (let i = 0; i < dropCount; i++) {
            // Rarity (weighted, with level bonus)
            const adjustedRarities = { ...this.rarities };
            adjustedRarities.rare += enemyLevel;
            adjustedRarities.epic += enemyLevel * 0.5;
            adjustedRarities.legendary += enemyLevel * 0.2;
            
            const rarity = this.rng.weightedPickObject(adjustedRarities);
            const item = this.rng.pick(this.items[rarity]);
            
            // Gold value (Pareto distribution for occasional high values)
            const baseGold = { common: 10, uncommon: 50, rare: 200, epic: 1000, legendary: 5000 };
            const gold = Math.round(this.rng.pareto(1.5, baseGold[rarity]));
            
            loot.push({ item, rarity, value: gold });
        }
        
        return loot;
    }
}

// Reproducible loot for specific encounters
const chest1 = new LootTable('dungeon-floor-3-chest-1');
console.log(chest1.generateLoot(10));
// Always gives the same loot for this chest!
```

### NPC Name Generator

```javascript
const { PRNG } = require('seedforge-prng');

class NameGenerator {
    constructor(seed) {
        this.rng = new PRNG(seed);
        
        this.prefixes = ['Ael', 'Bran', 'Cael', 'Dor', 'Eld', 'Fen', 'Gal', 'Hal', 'Ith', 'Jor'];
        this.middles = ['', '', 'ar', 'en', 'il', 'or', 'un', 'al', 'em'];
        this.suffixes = ['dric', 'wen', 'mir', 'thor', 'ius', 'ara', 'eth', 'ion', 'wyn', 'rick'];
        
        this.titles = [
            'the Brave', 'the Wise', 'the Swift', 'the Strong', 'the Cunning',
            'Shadowbane', 'Ironforge', 'Lightbringer', 'Stormbringer', 'Flameheart'
        ];
        
        this.professions = [
            'Blacksmith', 'Merchant', 'Guard', 'Farmer', 'Innkeeper',
            'Scholar', 'Hunter', 'Healer', 'Bard', 'Soldier'
        ];
    }
    
    generateName() {
        return this.rng.pick(this.prefixes) + 
               this.rng.pick(this.middles) + 
               this.rng.pick(this.suffixes);
    }
    
    generateNPC(options = {}) {
        const npc = {
            name: this.generateName(),
            profession: this.rng.pick(this.professions),
            level: this.rng.int(1, 20),
            stats: {
                strength: Math.round(this.rng.normal(10, 3)),
                intelligence: Math.round(this.rng.normal(10, 3)),
                agility: Math.round(this.rng.normal(10, 3)),
                charisma: Math.round(this.rng.normal(10, 3))
            }
        };
        
        // 20% chance for a title
        if (this.rng.bool(0.2)) {
            npc.name += ' ' + this.rng.pick(this.titles);
        }
        
        return npc;
    }
    
    generateVillage(count) {
        return this.rng.array(count, () => this.generateNPC());
    }
}

// Generate consistent NPCs for a village
const village = new NameGenerator('starting-village');
console.log(village.generateVillage(5));
// Same village every time with seed 'starting-village'
```

### Dice Rolling System

```javascript
const { PRNG } = require('seedforge-prng');

class DiceRoller {
    constructor(seed) {
        this.rng = new PRNG(seed);
    }
    
    // Roll XdY (e.g., 3d6 = roll 3 six-sided dice)
    roll(count, sides) {
        const rolls = [];
        for (let i = 0; i < count; i++) {
            rolls.push(this.rng.int(1, sides));
        }
        return {
            rolls,
            total: rolls.reduce((a, b) => a + b, 0),
            min: Math.min(...rolls),
            max: Math.max(...rolls)
        };
    }
    
    // Roll with advantage (roll twice, take higher)
    rollWithAdvantage(count, sides) {
        const roll1 = this.roll(count, sides);
        const roll2 = this.roll(count, sides);
        return roll1.total >= roll2.total ? roll1 : roll2;
    }
    
    // Roll with disadvantage (roll twice, take lower)
    rollWithDisadvantage(count, sides) {
        const roll1 = this.roll(count, sides);
        const roll2 = this.roll(count, sides);
        return roll1.total <= roll2.total ? roll1 : roll2;
    }
    
    // Roll and drop lowest (e.g., 4d6 drop lowest for stats)
    rollDropLowest(count, sides, drop = 1) {
        const result = this.roll(count, sides);
        const sorted = [...result.rolls].sort((a, b) => b - a);
        const kept = sorted.slice(0, count - drop);
        return {
            rolls: result.rolls,
            kept,
            dropped: sorted.slice(count - drop),
            total: kept.reduce((a, b) => a + b, 0)
        };
    }
}

// Seeded dice roller for reproducible combat
const combat = new DiceRoller('combat-encounter-42');

console.log('Attack roll:', combat.roll(1, 20));
// { rolls: [17], total: 17, min: 17, max: 17 }

console.log('Damage roll:', combat.roll(2, 6));
// { rolls: [4, 6], total: 10, min: 4, max: 6 }

console.log('Stat roll (4d6 drop lowest):', combat.rollDropLowest(4, 6));
// { rolls: [3, 5, 6, 2], kept: [6, 5, 3], dropped: [2], total: 14 }
```

### Card Deck Shuffling

```javascript
const { PRNG } = require('seedforge-prng');

class Deck {
    constructor(seed) {
        this.rng = new PRNG(seed);
        this.reset();
    }
    
    reset() {
        this.cards = [];
        const suits = ['♠', '♥', '♦', '♣'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        for (const suit of suits) {
            for (const rank of ranks) {
                this.cards.push({ rank, suit, name: `${rank}${suit}` });
            }
        }
    }
    
    shuffle() {
        this.rng.shuffle(this.cards);
        return this;
    }
    
    draw(count = 1) {
        return this.cards.splice(0, count);
    }
    
    drawHand(size = 5) {
        return this.draw(size);
    }
    
    remaining() {
        return this.cards.length;
    }
}

// Reproducible poker game
const deck = new Deck('poker-game-123');
deck.shuffle();

const player1 = deck.drawHand(5);
const player2 = deck.drawHand(5);

console.log('Player 1:', player1.map(c => c.name).join(' '));
// Player 1: 7♠ K♦ 3♥ J♣ 9♠

console.log('Player 2:', player2.map(c => c.name).join(' '));
// Player 2: A♥ 5♦ 2♣ Q♠ 8♦

// Same hands every time with seed 'poker-game-123'
```

### Procedural Colors

```javascript
const { PRNG } = require('seedforge-prng');

class ColorPalette {
    constructor(seed) {
        this.rng = new PRNG(seed);
    }
    
    // Generate a cohesive color palette
    generatePalette(count = 5) {
        // Pick a random base hue
        const baseHue = this.rng.int(0, 360);
        
        const colors = [];
        for (let i = 0; i < count; i++) {
            // Vary hue within 60 degrees for cohesion
            const hue = (baseHue + this.rng.int(-30, 30) + 360) % 360;
            const saturation = this.rng.int(40, 80);
            const lightness = this.rng.int(30, 70);
            
            colors.push({
                hsl: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
                hex: this.hslToHex(hue, saturation, lightness)
            });
        }
        
        return colors;
    }
    
    // Generate complementary colors
    generateComplementary() {
        const hue1 = this.rng.int(0, 360);
        const hue2 = (hue1 + 180) % 360;
        const sat = this.rng.int(50, 80);
        const light = this.rng.int(40, 60);
        
        return [
            { hsl: `hsl(${hue1}, ${sat}%, ${light}%)` },
            { hsl: `hsl(${hue2}, ${sat}%, ${light}%)` }
        ];
    }
    
    hslToHex(h, s, l) {
        s /= 100;
        l /= 100;
        const a = s * Math.min(l, 1 - l);
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }
}

const palette = new ColorPalette('my-game-theme');
console.log(palette.generatePalette(5));
// Consistent color palette for 'my-game-theme'
```

### Spawn Point Distribution

```javascript
const { PRNG } = require('seedforge-prng');

class SpawnManager {
    constructor(seed) {
        this.rng = new PRNG(seed);
    }
    
    // Spawn enemies in a circle around a point
    spawnInCircle(center, radius, count) {
        const spawns = [];
        for (let i = 0; i < count; i++) {
            const point = this.rng.pointInCircle(radius);
            spawns.push({
                x: center.x + point.x,
                y: center.y + point.y
            });
        }
        return spawns;
    }
    
    // Spawn enemies on the edge of a circle (surrounding player)
    spawnOnCircleEdge(center, radius, count) {
        const spawns = [];
        for (let i = 0; i < count; i++) {
            const point = this.rng.pointOnCircle(radius);
            spawns.push({
                x: center.x + point.x,
                y: center.y + point.y
            });
        }
        return spawns;
    }
    
    // Spawn in a rectangle (room)
    spawnInRoom(x, y, width, height, count) {
        const spawns = [];
        for (let i = 0; i < count; i++) {
            const point = this.rng.pointInRect(x, y, width, height);
            spawns.push(point);
        }
        return spawns;
    }
    
    // Spawn with minimum distance between points
    spawnWithSpacing(area, count, minDistance) {
        const spawns = [];
        let attempts = 0;
        const maxAttempts = count * 100;
        
        while (spawns.length < count && attempts < maxAttempts) {
            const point = this.rng.pointInRect(
                area.x, area.y, area.width, area.height
            );
            
            // Check distance from all existing spawns
            const valid = spawns.every(s => {
                const dx = s.x - point.x;
                const dy = s.y - point.y;
                return Math.sqrt(dx * dx + dy * dy) >= minDistance;
            });
            
            if (valid) {
                spawns.push(point);
            }
            attempts++;
        }
        
        return spawns;
    }
}

const spawner = new SpawnManager('level-3-encounter-2');
const enemies = spawner.spawnInCircle({ x: 100, y: 100 }, 50, 8);
console.log(enemies);
// Same spawn positions every time!
```

### Save/Load Game State

```javascript
const { PRNG } = require('seedforge-prng');

class Game {
    constructor(seed) {
        this.seed = seed;
        this.rng = new PRNG(seed);
        this.score = 0;
        this.level = 1;
        this.events = [];
    }
    
    play() {
        // Simulate game events
        const event = this.rng.weightedPickObject({
            'found treasure': 30,
            'encountered enemy': 40,
            'discovered secret': 10,
            'nothing happened': 20
        });
        
        this.events.push(event);
        
        if (event === 'found treasure') {
            this.score += this.rng.int(10, 100);
        } else if (event === 'encountered enemy') {
            // Combat roll
            if (this.rng.int(1, 20) >= 10) {
                this.score += this.rng.int(5, 25);
            }
        } else if (event === 'discovered secret') {
            this.score += this.rng.int(50, 200);
            this.level++;
        }
        
        return event;
    }
    
    // Save complete game state
    save() {
        return JSON.stringify({
            seed: this.seed,
            rngState: this.rng.getState(),
            score: this.score,
            level: this.level,
            events: this.events
        });
    }
    
    // Load game state
    static load(saveData) {
        const data = JSON.parse(saveData);
        const game = new Game(data.seed);
        game.rng.setState(data.rngState);
        game.score = data.score;
        game.level = data.level;
        game.events = data.events;
        return game;
    }
}

// Play game
const game = new Game('player-save-1');
for (let i = 0; i < 10; i++) {
    game.play();
}
console.log('Score:', game.score);

// Save
const saveData = game.save();

// Continue playing
for (let i = 0; i < 5; i++) {
    game.play();
}
console.log('Score after more play:', game.score);

// Load and continue - exact same state!
const loadedGame = Game.load(saveData);
for (let i = 0; i < 5; i++) {
    loadedGame.play();
}
console.log('Score from loaded game:', loadedGame.score);
// Both scores are identical!
```

### Parallel Random Streams

```javascript
const { PRNG, Algorithms } = require('seedforge-prng');

// Method 1: Fork for sub-systems (recommended)
function createWorldGenerators(worldSeed) {
    const world = new PRNG(worldSeed);
    
    return {
        terrain: world.fork('terrain'),
        rivers: world.fork('rivers'),
        forests: world.fork('forests'),
        cities: world.fork('cities'),
        npcs: world.fork('npcs'),
        loot: world.fork('loot'),
        weather: world.fork('weather')
    };
}

const generators = createWorldGenerators('my-world');

// Each generator is independent
generators.terrain.random();  // Used for terrain
generators.rivers.random();   // Used for rivers
generators.cities.random();   // Used for cities

// Recreating gives identical results
const generators2 = createWorldGenerators('my-world');
// generators2.terrain produces same sequence as generators.terrain


// Method 2: Xoshiro jump() for massive parallelism
function createParallelStreams(seed, count) {
    const streams = [];
    
    for (let i = 0; i < count; i++) {
        const stream = new Algorithms.Xoshiro128SS(seed);
        // Each jump advances by 2^64 values - they'll never overlap
        for (let j = 0; j < i; j++) {
            stream.jump();
        }
        streams.push(stream);
    }
    
    return streams;
}

// Create 8 parallel streams for multi-threaded generation
const streams = createParallelStreams('base-seed', 8);
// Each stream can generate 2^64 values before overlapping with the next
```

### Monte Carlo Simulation

```javascript
const { PRNG } = require('seedforge-prng');

// Estimate Pi using Monte Carlo method
function estimatePi(seed, samples) {
    const rng = new PRNG(seed);
    let inside = 0;
    
    for (let i = 0; i < samples; i++) {
        const x = rng.random();
        const y = rng.random();
        
        if (x * x + y * y <= 1) {
            inside++;
        }
    }
    
    return 4 * inside / samples;
}

console.log('π estimate (10,000 samples):', estimatePi('pi-calc', 10000));
// π estimate (10,000 samples): 3.1412

console.log('π estimate (100,000 samples):', estimatePi('pi-calc', 100000));
// π estimate (100,000 samples): 3.14052

console.log('π estimate (1,000,000 samples):', estimatePi('pi-calc', 1000000));
// π estimate (1,000,000 samples): 3.141592

// Results are reproducible with the same seed!


// Simulate dice probabilities
function simulateDiceProbability(seed, diceCount, target, trials) {
    const rng = new PRNG(seed);
    let successes = 0;
    
    for (let i = 0; i < trials; i++) {
        let total = 0;
        for (let d = 0; d < diceCount; d++) {
            total += rng.int(1, 6);
        }
        if (total >= target) successes++;
    }
    
    return successes / trials;
}

console.log('P(2d6 >= 7):', simulateDiceProbability('dice', 2, 7, 100000));
// P(2d6 >= 7): 0.58342
// Expected: ~0.583 (58.3%)
```

---

## Performance

Benchmark generating 1,000,000 random numbers (approximate, varies by environment):

| Algorithm | Operations/sec | Notes |
|-----------|---------------|-------|
| `sfc32` | ~45,000,000 | Fastest, excellent quality |
| `mulberry32` | ~42,000,000 | Very fast, good quality |
| `xoshiro128` | ~38,000,000 | Fast, excellent quality |
| `lcg` | ~35,000,000 | Fast, lower quality |
| `pcg32` | ~25,000,000 | Good speed, best quality |
| `xorshift128` | ~15,000,000 | Slower in JS environments |

> ⚠️ **Note**: `xorshift128` is slower due to its 128-bit state manipulation in JavaScript. Use `sfc32` or `xoshiro128` for performance-critical code.

### Recommendations

- **Games/Procedural Generation**: Use `sfc32` or `mulberry32`
- **Simulations/Statistics**: Use `pcg32`
- **General Purpose**: Use `xoshiro128` (default)
- **Legacy Compatibility**: Use `lcg`

---

## Browser Usage

### Script Tag

```html
<!DOCTYPE html>
<html>
<head>
    <script src="seedforge.js"></script>
</head>
<body>
    <script>
        // Access via PRNG global
        const rng = new PRNG.PRNG('my-seed');
        console.log(rng.random());
        
        // Noise generators
        const noise = new PRNG.Noise.SimplexNoise('terrain');
        console.log(noise.noise2D(1.5, 2.3));
        
        // Factory function
        const rng2 = PRNG.create('another-seed', 'sfc32');
    </script>
</body>
</html>
```

### ES Module (with bundler)

```javascript
import { PRNG, Noise } from 'seedforge-prng';

const rng = new PRNG('seed');
const noise = new Noise.SimplexNoise('seed');
```

---

## TypeScript Support

SeedForge includes full TypeScript definitions in `types/seedforge.d.ts`.

```typescript
import { PRNG, Noise, Point2D, RGB } from 'seedforge-prng';

const rng: PRNG = new PRNG('seed', 'pcg32');

const value: number = rng.random();
const integer: number = rng.int(1, 100);
const point: Point2D = rng.pointInCircle(10);
const color: RGB = rng.colorRGB();

const noise = new Noise.SimplexNoise('seed');
const height: number = noise.fbm(1.5, 2.3, null, 4);
const turb: number = noise.turbulence(1.5, 2.3, null, 6);
```

---

## Testing

### Node.js

```bash
# Run test suite
npm test

# Run examples
npm run example
```

### Browser

Open `test/browser-test.html` in your browser for an interactive test suite with:

- **Unit Tests** - Algorithm validation, distribution tests
- **PRNG Demos** - Random numbers, shuffle, colors, UUIDs, algorithm comparison
- **Distribution Charts** - Visual histograms with mean indicators
- **Noise Gallery** - All 6 noise types with click-to-enlarge (1024×1024)
- **Procedural Textures** - Terrain, stone, clouds, fire, marble, and more

---

## License

MIT License - see [LICENSE](LICENSE) file.

---

## Credits

Algorithm implementations based on:

- **Mulberry32** by Tommy Ettinger
- **Xoshiro128**** by David Blackman and Sebastiano Vigna
- **PCG** by Melissa O'Neill (pcg-random.org)
- **SFC32** by Chris Doty-Humphrey (PractRand)
- **Simplex Noise** based on Stefan Gustavson's implementation
- **Perlin Noise** by Ken Perlin
- **Worley Noise** by Steven Worley

---

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

## Changelog

### 1.1.0

**New Statistical Distributions (6):**
- `geometric(p)` - Trials until first success
- `zipf(n, s)` - Power-law ranking distribution
- `chiSquared(k)` - Chi-squared distribution
- `studentT(df)` - Student's t-distribution
- `vonMises(mu, kappa)` - Circular/angular distribution
- `hypergeometric(N, K, n)` - Sampling without replacement

**New Noise Generators (4):**
- `PerlinNoise` - Classic Perlin gradient noise
- `WorleyNoise` - Cellular/Voronoi noise with distance types (euclidean, manhattan, chebyshev)
- `RidgedNoise` - Sharp ridges for mountains, veins
- `BillowedNoise` - Soft shapes for clouds, smoke

**New Noise Features:**
- `turbulence()` - Chaotic absolute-value fBm for fire, smoke, plasma
- `warp()` - Single domain warping for organic distortion
- `warp2()` - Double domain warping for extreme organic patterns

**Improvements:**
- Enhanced browser test suite with interactive PRNG demos
- Click-to-enlarge noise previews (1024×1024)
- PRNG visualization section with canvas visualizations
- Professional distribution histograms with mean indicators
- 39 comprehensive unit tests

### 1.0.0

- Initial release
- 6 PRNG algorithms
- 11 statistical distributions
- Value Noise and Simplex Noise with fBm
- Full state management (save/load/clone/fork)
- TypeScript definitions
- Comprehensive test suite
