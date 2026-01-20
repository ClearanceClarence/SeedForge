/**
 * SeedForge - ES Module Entry Point
 * Advanced seedable PRNG library for JavaScript
 * 
 * @version 1.0.0
 * @license MIT
 */

// Re-export from the CommonJS bundle
// This allows both `import { PRNG }` and `import PRNG_Library` syntax

import PRNG_Library from '../dist/seedforge.js';

export const PRNG = PRNG_Library.PRNG;
export const Algorithms = PRNG_Library.Algorithms;
export const Noise = PRNG_Library.Noise;
export const Utils = PRNG_Library.Utils;

export default PRNG_Library;
