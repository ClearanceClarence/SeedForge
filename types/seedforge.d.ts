// Type definitions for SeedForge
// Project: SeedForge
// Definitions by: SeedForge Contributors

export type AlgorithmName = 'mulberry32' | 'xoshiro128' | 'xorshift128' | 'pcg32' | 'sfc32' | 'lcg';

export interface Point2D {
    x: number;
    y: number;
}

export interface Point3D {
    x: number;
    y: number;
    z: number;
}

export interface RGB {
    r: number;
    g: number;
    b: number;
}

export interface HSL {
    h: number;
    s: number;
    l: number;
}

export interface PRNGState {
    algorithm: string;
    generatorState: any;
    normalCache: {
        spare: number | null;
        hasSpare: boolean;
    };
}

export class PRNG {
    constructor(seed?: string | number, algorithm?: AlgorithmName);

    // Basic generation
    random(): number;
    randomInt(): number;
    float(min?: number, max?: number): number;
    int(min: number, max: number): number;
    bool(probability?: number): boolean;
    sign(probability?: number): -1 | 1;

    // Statistical distributions
    normal(mean?: number, stdDev?: number): number;
    exponential(lambda?: number): number;
    poisson(lambda: number): number;
    binomial(n: number, p: number): number;
    pareto(alpha?: number, xm?: number): number;
    beta(alpha: number, beta: number): number;
    gamma(shape: number, scale?: number): number;
    triangular(min?: number, max?: number, mode?: number): number;
    logNormal(mu?: number, sigma?: number): number;
    weibull(scale?: number, shape?: number): number;
    cauchy(location?: number, scale?: number): number;

    // Array utilities
    shuffle<T>(array: T[]): T[];
    shuffled<T>(array: T[]): T[];
    pick<T>(array: T[]): T | undefined;
    sample<T>(array: T[], n: number): T[];
    weightedPick<T>(items: T[], weights: number[]): T;
    weightedPickObject<T extends string>(weightedItems: Record<T, number>): T;
    array<T>(length: number, generator?: () => T): T[];

    // Geometric utilities
    pointInCircle(radius?: number): Point2D;
    pointOnCircle(radius?: number): Point2D;
    pointInSphere(radius?: number): Point3D;
    pointOnSphere(radius?: number): Point3D;
    direction2D(): Point2D;
    direction3D(): Point3D;
    pointInRect(x: number, y: number, width: number, height: number): Point2D;
    pointInBox(x: number, y: number, z: number, width: number, height: number, depth: number): Point3D;

    // Special generators
    uuid(): string;
    color(): string;
    colorRGB(): RGB;
    colorHSL(saturation?: number | null, lightness?: number | null): HSL;
    char(charset?: string): string;
    string(length: number, charset?: string): string;

    // State management
    getState(): PRNGState;
    setState(state: PRNGState): void;
    reset(): void;
    clone(): PRNG;
    fork(label?: string): PRNG;
    setSeed(seed: string | number, algorithm?: AlgorithmName): void;
}

export namespace Algorithms {
    export class Mulberry32 {
        constructor(seed?: string | number);
        next(): number;
        nextInt(): number;
        getState(): any;
        setState(state: any): void;
        reset(): void;
        clone(): Mulberry32;
    }

    export class Xoshiro128SS {
        constructor(seed?: string | number);
        next(): number;
        nextInt(): number;
        jump(): void;
        getState(): any;
        setState(state: any): void;
        reset(): void;
        clone(): Xoshiro128SS;
    }

    export class Xorshift128Plus {
        constructor(seed?: string | number);
        next(): number;
        nextInt(): number;
        getState(): any;
        setState(state: any): void;
        reset(): void;
        clone(): Xorshift128Plus;
    }

    export class PCG32 {
        constructor(seed?: string | number, sequence?: number);
        next(): number;
        nextInt(): number;
        getState(): any;
        setState(state: any): void;
        reset(): void;
        clone(): PCG32;
    }

    export class SFC32 {
        constructor(seed?: string | number);
        next(): number;
        nextInt(): number;
        getState(): any;
        setState(state: any): void;
        reset(): void;
        clone(): SFC32;
    }

    export class LCG {
        constructor(seed?: string | number, a?: number, c?: number, m?: number);
        next(): number;
        nextInt(): number;
        getState(): any;
        setState(state: any): void;
        reset(): void;
        clone(): LCG;
    }
}

export namespace Noise {
    export class ValueNoise {
        constructor(seed?: string | number);
        noise1D(x: number): number;
        noise2D(x: number, y: number): number;
        noise3D(x: number, y: number, z: number): number;
        fbm(
            x: number,
            y?: number | null,
            z?: number | null,
            octaves?: number,
            lacunarity?: number,
            persistence?: number
        ): number;
    }

    export class SimplexNoise {
        constructor(seed?: string | number);
        noise2D(x: number, y: number): number;
        noise3D(x: number, y: number, z: number): number;
        fbm(
            x: number,
            y?: number | null,
            z?: number | null,
            octaves?: number,
            lacunarity?: number,
            persistence?: number
        ): number;
    }
}

export namespace Utils {
    export function stringToSeed(str: string): number;
    export function cyrb128(str: string): [number, number, number, number];
    export function splitmix64(seed: number): () => number;
}

export function create(seed?: string | number, algorithm?: AlgorithmName): PRNG;
export function seed(seed: string | number, algorithm?: AlgorithmName): typeof import('./seedforge');
export function random(): number;

declare const _default: {
    PRNG: typeof PRNG;
    Algorithms: typeof Algorithms;
    Noise: typeof Noise;
    Utils: typeof Utils;
    create: typeof create;
    seed: typeof seed;
    random: typeof random;
};

export default _default;
