/**
 * SeedForge Usage Examples
 * Run with: node examples/examples.js
 */

const { PRNG, Noise } = require('../dist/seedforge.js');

console.log('SeedForge Examples\n');

// ============================================================
// Example 1: Basic Usage
// ============================================================
console.log('=== Basic Usage ===');

const rng = new PRNG('my-game-seed');

console.log('Random float [0,1):', rng.random());
console.log('Random int [1,100]:', rng.int(1, 100));
console.log('Random float [5,10):', rng.float(5, 10));
console.log('Random boolean (70% true):', rng.bool(0.7));
console.log('Random sign:', rng.sign());

// ============================================================
// Example 2: Reproducibility
// ============================================================
console.log('\n=== Reproducibility ===');

const rng1 = new PRNG('world-42');
const rng2 = new PRNG('world-42');

console.log('RNG 1:', [rng1.random(), rng1.random(), rng1.random()].map(v => v.toFixed(4)).join(', '));
console.log('RNG 2:', [rng2.random(), rng2.random(), rng2.random()].map(v => v.toFixed(4)).join(', '));
console.log('(Both sequences are identical!)');

// ============================================================
// Example 3: Procedural Terrain Heights
// ============================================================
console.log('\n=== Procedural Terrain ===');

function generateTerrainRow(seed, width) {
    const terrain = new PRNG(seed);
    const row = [];
    for (let x = 0; x < width; x++) {
        // Use normal distribution for natural-looking heights
        const height = Math.round(terrain.normal(64, 20));
        row.push(Math.max(0, Math.min(128, height)));
    }
    return row;
}

console.log('World "forest-realm":', generateTerrainRow('forest-realm', 10).join(', '));
console.log('World "desert-lands":', generateTerrainRow('desert-lands', 10).join(', '));
console.log('World "forest-realm":', generateTerrainRow('forest-realm', 10).join(', '), '(same!)');

// ============================================================
// Example 4: Loot Table with Weighted Selection
// ============================================================
console.log('\n=== Loot Table ===');

const lootRng = new PRNG('dungeon-chest-7');

const rarities = {
    common: 60,
    uncommon: 25,
    rare: 10,
    epic: 4,
    legendary: 1
};

console.log('Opening 10 chests:');
for (let i = 0; i < 10; i++) {
    const rarity = lootRng.weightedPickObject(rarities);
    const goldValue = Math.round(lootRng.pareto(1.5, 10));
    console.log(`  Chest ${i + 1}: ${rarity} item worth ${goldValue} gold`);
}

// ============================================================
// Example 5: NPC Generation
// ============================================================
console.log('\n=== NPC Generation ===');

function generateNPC(seed) {
    const npc = new PRNG(seed);
    
    const firstNames = ['Aldric', 'Brenna', 'Cedric', 'Diana', 'Edmund', 'Fiona'];
    const lastNames = ['Ironforge', 'Shadowmend', 'Brightwood', 'Stormwind', 'Darkhollow'];
    const classes = ['Warrior', 'Mage', 'Rogue', 'Cleric', 'Ranger'];
    
    return {
        name: npc.pick(firstNames) + ' ' + npc.pick(lastNames),
        class: npc.pick(classes),
        level: npc.int(1, 20),
        health: Math.round(npc.normal(100, 20)),
        strength: npc.int(8, 18),
        intelligence: npc.int(8, 18),
        agility: npc.int(8, 18)
    };
}

console.log('NPC from seed "tavern-keeper":');
console.log(generateNPC('tavern-keeper'));

console.log('\nNPC from seed "village-guard":');
console.log(generateNPC('village-guard'));

// ============================================================
// Example 6: Spawn Points in Circle
// ============================================================
console.log('\n=== Spawn Points ===');

const spawnRng = new PRNG('spawn-area-1');

console.log('Enemy spawn points (radius 50):');
for (let i = 0; i < 5; i++) {
    const point = spawnRng.pointInCircle(50);
    console.log(`  Enemy ${i + 1}: (${point.x.toFixed(1)}, ${point.y.toFixed(1)})`);
}

// ============================================================
// Example 7: Save/Load State
// ============================================================
console.log('\n=== Save/Load State ===');

const gameRng = new PRNG('player-session');

// Play for a while
console.log('Playing... rolled:', gameRng.int(1, 20), gameRng.int(1, 20), gameRng.int(1, 20));

// Save state
const savedState = gameRng.getState();
console.log('Game saved!');

// Continue playing
const nextRolls = [gameRng.int(1, 20), gameRng.int(1, 20), gameRng.int(1, 20)];
console.log('More rolls:', ...nextRolls);

// Restore state
gameRng.setState(savedState);
console.log('Game loaded!');

// Should get same rolls
const replayedRolls = [gameRng.int(1, 20), gameRng.int(1, 20), gameRng.int(1, 20)];
console.log('Replayed rolls:', ...replayedRolls, '(identical!)');

// ============================================================
// Example 8: Forking for Sub-systems
// ============================================================
console.log('\n=== Forking for Sub-systems ===');

const worldRng = new PRNG('my-world');

const terrainRng = worldRng.fork('terrain');
const riverRng = worldRng.fork('rivers');
const forestRng = worldRng.fork('forests');

console.log('Terrain seed produces:', terrainRng.random().toFixed(4));
console.log('River seed produces:', riverRng.random().toFixed(4));
console.log('Forest seed produces:', forestRng.random().toFixed(4));
console.log('(Each fork is independent but reproducible)');

// ============================================================
// Example 9: Noise for Heightmaps
// ============================================================
console.log('\n=== Noise Heightmap ===');

const noise = new Noise.SimplexNoise('terrain-seed');

console.log('5x5 heightmap sample:');
for (let y = 0; y < 5; y++) {
    const row = [];
    for (let x = 0; x < 5; x++) {
        // Use fBm for natural-looking terrain
        const height = noise.fbm(x * 0.1, y * 0.1, null, 4, 2.0, 0.5);
        // Normalize from [-1,1] to [0,9]
        const normalized = Math.floor((height + 1) / 2 * 10);
        row.push(normalized);
    }
    console.log('  ', row.join(' '));
}

// ============================================================
// Example 10: Dice Rolling System
// ============================================================
console.log('\n=== Dice Rolling ===');

const diceRng = new PRNG('combat-encounter-42');

function rollDice(rng, count, sides) {
    const rolls = [];
    for (let i = 0; i < count; i++) {
        rolls.push(rng.int(1, sides));
    }
    return {
        rolls,
        total: rolls.reduce((a, b) => a + b, 0)
    };
}

console.log('Rolling 3d6:', rollDice(diceRng, 3, 6));
console.log('Rolling 2d20:', rollDice(diceRng, 2, 20));
console.log('Rolling 4d10:', rollDice(diceRng, 4, 10));

console.log('\n=== Done! ===');
