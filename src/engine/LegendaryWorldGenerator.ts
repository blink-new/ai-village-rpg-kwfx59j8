import { Biome, TerrainChunk, WorldTile, Structure } from '../types/world';

export interface LegendaryStructure extends Structure {
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythical';
  level: number;
  loot: string[];
  guardians: string[];
  secrets: string[];
  lore: string;
  discoveryReward: {
    experience: number;
    gold: number;
    items: string[];
    title?: string;
  };
}

export interface BiomeConfig {
  name: Biome;
  temperatureRange: [number, number];
  humidityRange: [number, number];
  heightPreference: [number, number];
  structures: {
    type: string;
    rarity: number;
    minLevel: number;
    maxLevel: number;
  }[];
  resources: {
    type: string;
    abundance: number;
    depth: [number, number];
  }[];
  enemies: {
    type: string;
    spawnRate: number;
    timePreference: 'day' | 'night' | 'any';
  }[];
  ambientEffects: string[];
}

export class LegendaryWorldGenerator {
  private seed: number;
  private noiseCache: Map<string, number> = new Map();
  private chunkCache: Map<string, TerrainChunk> = new Map();
  private structureCache: Map<string, LegendaryStructure[]> = new Map();
  
  private biomeConfigs: BiomeConfig[] = [
    {
      name: 'grassland',
      temperatureRange: [0.4, 0.7],
      humidityRange: [0.3, 0.7],
      heightPreference: [0.3, 0.7],
      structures: [
        { type: 'village', rarity: 0.05, minLevel: 1, maxLevel: 10 },
        { type: 'ancient_stone_circle', rarity: 0.02, minLevel: 5, maxLevel: 15 },
        { type: 'abandoned_farmhouse', rarity: 0.08, minLevel: 1, maxLevel: 5 }
      ],
      resources: [
        { type: 'iron_ore', abundance: 0.3, depth: [0.2, 0.6] },
        { type: 'wild_herbs', abundance: 0.6, depth: [0.5, 1.0] },
        { type: 'stone', abundance: 0.8, depth: [0.0, 0.4] }
      ],
      enemies: [
        { type: 'wolf', spawnRate: 0.1, timePreference: 'night' },
        { type: 'bandit', spawnRate: 0.05, timePreference: 'any' }
      ],
      ambientEffects: ['gentle_breeze', 'bird_songs', 'rustling_grass']
    },
    {
      name: 'forest',
      temperatureRange: [0.3, 0.6],
      humidityRange: [0.6, 0.9],
      heightPreference: [0.4, 0.8],
      structures: [
        { type: 'elven_ruins', rarity: 0.03, minLevel: 10, maxLevel: 25 },
        { type: 'druid_grove', rarity: 0.02, minLevel: 8, maxLevel: 20 },
        { type: 'ancient_tree', rarity: 0.15, minLevel: 1, maxLevel: 30 },
        { type: 'hidden_cave', rarity: 0.06, minLevel: 3, maxLevel: 15 }
      ],
      resources: [
        { type: 'rare_wood', abundance: 0.4, depth: [0.6, 1.0] },
        { type: 'magical_mushrooms', abundance: 0.2, depth: [0.3, 0.7] },
        { type: 'crystal_shard', abundance: 0.1, depth: [0.1, 0.5] }
      ],
      enemies: [
        { type: 'forest_troll', spawnRate: 0.03, timePreference: 'night' },
        { type: 'dire_wolf', spawnRate: 0.08, timePreference: 'any' },
        { type: 'forest_spirit', spawnRate: 0.02, timePreference: 'night' }
      ],
      ambientEffects: ['wind_through_trees', 'owl_hoots', 'mystical_whispers']
    },
    {
      name: 'desert',
      temperatureRange: [0.8, 1.0],
      humidityRange: [0.0, 0.3],
      heightPreference: [0.2, 0.6],
      structures: [
        { type: 'pyramid', rarity: 0.01, minLevel: 20, maxLevel: 50 },
        { type: 'oasis_temple', rarity: 0.02, minLevel: 15, maxLevel: 30 },
        { type: 'buried_city', rarity: 0.005, minLevel: 25, maxLevel: 60 },
        { type: 'sandstone_ruins', rarity: 0.04, minLevel: 5, maxLevel: 20 }
      ],
      resources: [
        { type: 'gold_ore', abundance: 0.2, depth: [0.1, 0.5] },
        { type: 'sand_crystal', abundance: 0.3, depth: [0.3, 0.8] },
        { type: 'ancient_artifact', abundance: 0.05, depth: [0.0, 0.3] }
      ],
      enemies: [
        { type: 'sand_worm', spawnRate: 0.04, timePreference: 'day' },
        { type: 'desert_scorpion', spawnRate: 0.12, timePreference: 'night' },
        { type: 'mummy_lord', spawnRate: 0.01, timePreference: 'night' }
      ],
      ambientEffects: ['howling_wind', 'shifting_sands', 'distant_mirages']
    },
    {
      name: 'tundra',
      temperatureRange: [0.0, 0.3],
      humidityRange: [0.2, 0.6],
      heightPreference: [0.3, 0.9],
      structures: [
        { type: 'ice_fortress', rarity: 0.02, minLevel: 18, maxLevel: 40 },
        { type: 'frozen_temple', rarity: 0.015, minLevel: 22, maxLevel: 45 },
        { type: 'mammoth_graveyard', rarity: 0.03, minLevel: 12, maxLevel: 25 }
      ],
      resources: [
        { type: 'ice_crystal', abundance: 0.4, depth: [0.4, 0.9] },
        { type: 'frozen_wood', abundance: 0.2, depth: [0.6, 1.0] },
        { type: 'permafrost_ore', abundance: 0.15, depth: [0.0, 0.4] }
      ],
      enemies: [
        { type: 'frost_giant', spawnRate: 0.02, timePreference: 'any' },
        { type: 'ice_wolf', spawnRate: 0.1, timePreference: 'night' },
        { type: 'yeti', spawnRate: 0.03, timePreference: 'any' }
      ],
      ambientEffects: ['howling_blizzard', 'cracking_ice', 'aurora_borealis']
    },
    {
      name: 'jungle',
      temperatureRange: [0.7, 1.0],
      humidityRange: [0.8, 1.0],
      heightPreference: [0.4, 0.8],
      structures: [
        { type: 'lost_temple', rarity: 0.02, minLevel: 15, maxLevel: 35 },
        { type: 'treehouse_city', rarity: 0.01, minLevel: 20, maxLevel: 40 },
        { type: 'sacrificial_altar', rarity: 0.03, minLevel: 10, maxLevel: 25 },
        { type: 'overgrown_ruins', rarity: 0.05, minLevel: 8, maxLevel: 20 }
      ],
      resources: [
        { type: 'exotic_fruit', abundance: 0.7, depth: [0.7, 1.0] },
        { type: 'rare_gems', abundance: 0.1, depth: [0.1, 0.4] },
        { type: 'medicinal_plants', abundance: 0.5, depth: [0.5, 1.0] }
      ],
      enemies: [
        { type: 'jaguar_spirit', spawnRate: 0.06, timePreference: 'night' },
        { type: 'poison_dart_frog', spawnRate: 0.15, timePreference: 'day' },
        { type: 'ancient_guardian', spawnRate: 0.01, timePreference: 'any' }
      ],
      ambientEffects: ['jungle_drums', 'exotic_bird_calls', 'rustling_vines']
    },
    {
      name: 'swamp',
      temperatureRange: [0.4, 0.7],
      humidityRange: [0.8, 1.0],
      heightPreference: [0.1, 0.4],
      structures: [
        { type: 'witch_hut', rarity: 0.04, minLevel: 8, maxLevel: 18 },
        { type: 'sunken_castle', rarity: 0.01, minLevel: 20, maxLevel: 35 },
        { type: 'bog_shrine', rarity: 0.03, minLevel: 5, maxLevel: 15 }
      ],
      resources: [
        { type: 'swamp_gas', abundance: 0.3, depth: [0.2, 0.6] },
        { type: 'bog_iron', abundance: 0.25, depth: [0.1, 0.5] },
        { type: 'rare_moss', abundance: 0.4, depth: [0.4, 0.8] }
      ],
      enemies: [
        { type: 'swamp_troll', spawnRate: 0.05, timePreference: 'night' },
        { type: 'will_o_wisp', spawnRate: 0.08, timePreference: 'night' },
        { type: 'bog_beast', spawnRate: 0.04, timePreference: 'any' }
      ],
      ambientEffects: ['bubbling_mud', 'croaking_frogs', 'eerie_mist']
    },
    {
      name: 'mountains',
      temperatureRange: [0.1, 0.5],
      humidityRange: [0.2, 0.6],
      heightPreference: [0.7, 1.0],
      structures: [
        { type: 'dragon_lair', rarity: 0.005, minLevel: 40, maxLevel: 80 },
        { type: 'dwarven_mine', rarity: 0.03, minLevel: 15, maxLevel: 30 },
        { type: 'sky_temple', rarity: 0.01, minLevel: 25, maxLevel: 50 },
        { type: 'crystal_cave', rarity: 0.04, minLevel: 10, maxLevel: 25 }
      ],
      resources: [
        { type: 'mithril_ore', abundance: 0.05, depth: [0.0, 0.3] },
        { type: 'precious_gems', abundance: 0.15, depth: [0.1, 0.6] },
        { type: 'mountain_herbs', abundance: 0.2, depth: [0.6, 1.0] }
      ],
      enemies: [
        { type: 'mountain_dragon', spawnRate: 0.002, timePreference: 'any' },
        { type: 'stone_golem', spawnRate: 0.03, timePreference: 'any' },
        { type: 'griffin', spawnRate: 0.02, timePreference: 'day' }
      ],
      ambientEffects: ['mountain_wind', 'eagle_cries', 'avalanche_rumbles']
    }
  ];

  constructor(seed: number = Math.random() * 1000000) {
    this.seed = seed;
  }

  // SUPER FAST noise - minimal computation
  private noise(x: number, y: number, scale: number = 1, octaves: number = 2): number {
    // Round coordinates more aggressively to increase cache hits
    const roundedX = Math.round(x * 10) / 10;
    const roundedY = Math.round(y * 10) / 10;
    const key = `${roundedX}_${roundedY}_${scale}`;
    
    if (this.noiseCache.has(key)) {
      return this.noiseCache.get(key)!;
    }

    // Simplified noise with fewer octaves (default 2 instead of 4)
    let value = 0;
    let amplitude = 1;
    let frequency = scale * 0.01;
    let maxValue = 0;

    for (let i = 0; i < Math.min(octaves, 2); i++) { // Max 2 octaves for speed
      const noiseValue = Math.sin(roundedX * frequency + this.seed) * 
                        Math.cos(roundedY * frequency + this.seed * 1.5);
      
      value += noiseValue * amplitude;
      maxValue += amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }

    const normalizedValue = (value / maxValue + 1) * 0.5; // Normalize to 0-1
    
    // Smaller cache with more aggressive cleanup
    if (this.noiseCache.size > 2000) {
      // Clear half the cache
      const entries = Array.from(this.noiseCache.entries());
      entries.slice(0, 1000).forEach(([key]) => {
        this.noiseCache.delete(key);
      });
    }
    
    this.noiseCache.set(key, normalizedValue);
    return normalizedValue;
  }

  // Advanced biome generation with realistic transitions
  private getBiome(x: number, y: number, height: number): Biome {
    const temperature = this.noise(x, y, 0.003, 6) + (1 - height) * 0.3;
    const humidity = this.noise(x + 1000, y + 1000, 0.004, 5);
    const continentalness = this.noise(x, y, 0.001, 8);
    const erosion = this.noise(x + 2000, y + 2000, 0.005, 4);

    // Ocean biome for very low heights
    if (height < 0.15) return 'ocean';
    
    // Mountain biome for very high heights
    if (height > 0.85) return 'mountains';

    // Find best matching biome
    let bestBiome: Biome = 'grassland';
    let bestScore = -1;

    for (const config of this.biomeConfigs) {
      if (config.name === 'ocean' || config.name === 'mountains') continue;

      const tempScore = 1 - Math.abs(temperature - (config.temperatureRange[0] + config.temperatureRange[1]) / 2);
      const humidScore = 1 - Math.abs(humidity - (config.humidityRange[0] + config.humidityRange[1]) / 2);
      const heightScore = height >= config.heightPreference[0] && height <= config.heightPreference[1] ? 1 : 0.5;
      
      const totalScore = (tempScore + humidScore + heightScore) / 3;
      
      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestBiome = config.name;
      }
    }

    return bestBiome;
  }

  // Generate epic terrain with realistic features
  private generateHeight(x: number, y: number): number {
    // Continental shelf
    const continentalNoise = this.noise(x, y, 0.0005, 8);
    
    // Mountain ranges
    const mountainNoise = this.noise(x, y, 0.002, 6);
    const mountainRidges = Math.pow(Math.abs(this.noise(x, y, 0.001, 4) - 0.5) * 2, 2);
    
    // Hills and valleys
    const hillNoise = this.noise(x, y, 0.01, 4);
    
    // Fine detail
    const detailNoise = this.noise(x, y, 0.05, 3) * 0.1;
    
    // Combine all layers
    let height = continentalNoise * 0.6 + 
                mountainNoise * 0.3 * (1 - mountainRidges) +
                mountainRidges * 0.8 +
                hillNoise * 0.2 +
                detailNoise;

    return Math.max(0, Math.min(1, height));
  }

  // Generate legendary structures with epic loot and lore
  private generateLegendaryStructures(chunk: TerrainChunk): LegendaryStructure[] {
    const structures: LegendaryStructure[] = [];
    const chunkSize = 32;

    // Get biome configuration
    const centerTile = chunk.tiles[16][16];
    const biomeConfig = this.biomeConfigs.find(b => b.name === centerTile.biome);
    if (!biomeConfig) return structures;

    // Generate structures based on biome configuration
    for (const structureConfig of biomeConfig.structures) {
      const structureNoise = this.noise(
        chunk.x * chunkSize + structureConfig.type.length,
        chunk.y * chunkSize + structureConfig.type.length,
        0.1
      );

      if (structureNoise > (1 - structureConfig.rarity)) {
        const x = chunk.x * chunkSize + Math.floor(Math.random() * (chunkSize - 4)) + 2;
        const y = chunk.y * chunkSize + Math.floor(Math.random() * (chunkSize - 4)) + 2;
        
        const level = structureConfig.minLevel + 
                     Math.floor(Math.random() * (structureConfig.maxLevel - structureConfig.minLevel + 1));
        
        const rarity = this.determineStructureRarity(structureNoise, level);
        
        const structure: LegendaryStructure = {
          id: `${structureConfig.type}_${x}_${y}`,
          type: structureConfig.type,
          x,
          y,
          width: this.getStructureSize(structureConfig.type).width,
          height: this.getStructureSize(structureConfig.type).height,
          rarity,
          level,
          loot: this.generateStructureLoot(structureConfig.type, rarity, level),
          guardians: this.generateStructureGuardians(structureConfig.type, level),
          secrets: this.generateStructureSecrets(structureConfig.type, rarity),
          lore: this.generateStructureLore(structureConfig.type, rarity),
          discoveryReward: this.generateDiscoveryReward(rarity, level),
          data: {
            biome: centerTile.biome,
            discovered: false,
            cleared: false,
            lastVisited: 0
          }
        };

        structures.push(structure);
      }
    }

    return structures;
  }

  private determineStructureRarity(noise: number, level: number): 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythical' {
    const rarityScore = noise + (level / 100);
    
    if (rarityScore > 0.999) return 'mythical';
    if (rarityScore > 0.995) return 'legendary';
    if (rarityScore > 0.985) return 'epic';
    if (rarityScore > 0.97) return 'rare';
    if (rarityScore > 0.95) return 'uncommon';
    return 'common';
  }

  private getStructureSize(type: string): { width: number; height: number } {
    const sizes: Record<string, { width: number; height: number }> = {
      village: { width: 8, height: 8 },
      pyramid: { width: 12, height: 12 },
      dragon_lair: { width: 16, height: 16 },
      lost_temple: { width: 10, height: 10 },
      ice_fortress: { width: 14, height: 14 },
      buried_city: { width: 20, height: 20 },
      treehouse_city: { width: 12, height: 8 },
      sunken_castle: { width: 16, height: 12 },
      sky_temple: { width: 8, height: 12 },
      ancient_tree: { width: 4, height: 6 },
      witch_hut: { width: 3, height: 3 },
      dwarven_mine: { width: 6, height: 8 }
    };
    
    return sizes[type] || { width: 4, height: 4 };
  }

  private generateStructureLoot(type: string, rarity: string, level: number): string[] {
    const baseLoot: Record<string, string[]> = {
      village: ['gold_coin', 'bread', 'leather', 'iron_sword'],
      pyramid: ['ancient_gold', 'mummy_wrappings', 'cursed_gem', 'pharaoh_scepter'],
      dragon_lair: ['dragon_scale', 'legendary_weapon', 'massive_treasure', 'dragon_egg'],
      lost_temple: ['jade_idol', 'ancient_scroll', 'blessed_weapon', 'temple_key'],
      ice_fortress: ['ice_crystal', 'frost_armor', 'frozen_weapon', 'winter_crown'],
      witch_hut: ['magic_potion', 'spell_scroll', 'enchanted_herb', 'witch_hat'],
      dwarven_mine: ['mithril_ore', 'dwarven_axe', 'precious_gems', 'mining_equipment']
    };

    const loot = [...(baseLoot[type] || ['gold_coin', 'generic_treasure'])];
    
    // Add rarity-based bonus loot
    const rarityMultiplier = {
      common: 1,
      uncommon: 1.5,
      rare: 2,
      epic: 3,
      legendary: 5,
      mythical: 10
    }[rarity];

    const bonusLoot = Math.floor(level * rarityMultiplier / 10);
    for (let i = 0; i < bonusLoot; i++) {
      loot.push('rare_artifact', 'legendary_material', 'epic_equipment');
    }

    return loot;
  }

  private generateStructureGuardians(type: string, level: number): string[] {
    const guardians: Record<string, string[]> = {
      pyramid: ['mummy_guardian', 'sand_elemental', 'pharaoh_spirit'],
      dragon_lair: ['ancient_dragon', 'dragon_cultist', 'fire_elemental'],
      lost_temple: ['stone_guardian', 'temple_priest', 'jungle_spirit'],
      ice_fortress: ['frost_giant', 'ice_elemental', 'frozen_warrior'],
      witch_hut: ['dark_familiar', 'cursed_spirit', 'bog_monster'],
      dwarven_mine: ['stone_golem', 'cave_troll', 'underground_beast']
    };

    const baseGuardians = guardians[type] || ['generic_guardian'];
    const guardianCount = Math.min(5, Math.floor(level / 10) + 1);
    
    return baseGuardians.slice(0, guardianCount);
  }

  private generateStructureSecrets(type: string, rarity: string): string[] {
    const secrets = [
      'hidden_chamber',
      'secret_passage',
      'ancient_mechanism',
      'buried_treasure',
      'mystical_portal'
    ];

    const secretCount = {
      common: 0,
      uncommon: 1,
      rare: 2,
      epic: 3,
      legendary: 4,
      mythical: 5
    }[rarity];

    return secrets.slice(0, secretCount);
  }

  private generateStructureLore(type: string, rarity: string): string {
    const loreTemplates: Record<string, string[]> = {
      pyramid: [
        "An ancient tomb of a forgotten pharaoh, sealed for millennia.",
        "The burial place of a god-king, protected by eternal guardians.",
        "A monument to divine power, hiding secrets of the afterlife."
      ],
      dragon_lair: [
        "The dwelling of an ancient wyrm, hoarding treasures beyond imagination.",
        "A cavern where legends are born and heroes are tested.",
        "The final resting place of the last dragon lord."
      ],
      lost_temple: [
        "A sacred site abandoned by a civilization lost to time.",
        "Where ancient priests once communed with forgotten gods.",
        "A temple that holds the key to unlocking divine mysteries."
      ]
    };

    const templates = loreTemplates[type] || ["An ancient structure of unknown origin."];
    const lore = templates[Math.floor(Math.random() * templates.length)];
    
    const rarityPrefix = {
      common: "",
      uncommon: "Whispers speak of ",
      rare: "Legends tell of ",
      epic: "Ancient prophecies foretell ",
      legendary: "The gods themselves blessed ",
      mythical: "Reality bends around "
    }[rarity];

    return rarityPrefix + lore;
  }

  private generateDiscoveryReward(rarity: string, level: number): {
    experience: number;
    gold: number;
    items: string[];
    title?: string;
  } {
    const baseReward = {
      experience: level * 50,
      gold: level * 25,
      items: ['discovery_token']
    };

    const rarityMultiplier = {
      common: 1,
      uncommon: 2,
      rare: 4,
      epic: 8,
      legendary: 16,
      mythical: 32
    }[rarity];

    const reward = {
      experience: baseReward.experience * rarityMultiplier,
      gold: baseReward.gold * rarityMultiplier,
      items: [...baseReward.items]
    };

    // Add special titles for rare discoveries
    if (rarity === 'legendary' || rarity === 'mythical') {
      const titles = [
        'Legendary Explorer',
        'Ancient Discoverer',
        'Mythical Seeker',
        'Divine Archaeologist'
      ];
      (reward as any).title = titles[Math.floor(Math.random() * titles.length)];
    }

    return reward;
  }

  // Generate advanced resources with realistic distribution
  private generateAdvancedResources(chunk: TerrainChunk): void {
    const chunkSize = 32;
    const biomeConfig = this.biomeConfigs.find(b => b.name === chunk.tiles[16][16].biome);
    if (!biomeConfig) return;

    for (let x = 0; x < chunkSize; x++) {
      for (let y = 0; y < chunkSize; y++) {
        const worldX = chunk.x * chunkSize + x;
        const worldY = chunk.y * chunkSize + y;
        const tile = chunk.tiles[x][y];

        // Generate resources based on biome configuration
        for (const resourceConfig of biomeConfig.resources) {
          const resourceNoise = this.noise(worldX, worldY, 0.03 + resourceConfig.type.length * 0.001);
          const depthFactor = 1 - tile.height;
          
          if (depthFactor >= resourceConfig.depth[0] && 
              depthFactor <= resourceConfig.depth[1] &&
              resourceNoise > (1 - resourceConfig.abundance)) {
            
            // Determine resource quality based on depth and rarity
            const quality = this.determineResourceQuality(resourceNoise, depthFactor);
            tile.resource = `${quality}_${resourceConfig.type}`;
          }
        }
      }
    }
  }

  private determineResourceQuality(noise: number, depth: number): string {
    const qualityScore = noise + depth;
    
    if (qualityScore > 1.8) return 'mythical';
    if (qualityScore > 1.6) return 'legendary';
    if (qualityScore > 1.4) return 'epic';
    if (qualityScore > 1.2) return 'rare';
    if (qualityScore > 1.0) return 'uncommon';
    return 'common';
  }

  // Main chunk generation with all epic features - OPTIMIZED FOR SPEED
  generateChunk(chunkX: number, chunkY: number): TerrainChunk {
    const key = `${chunkX}_${chunkY}`;
    if (this.chunkCache.has(key)) {
      return this.chunkCache.get(key)!;
    }

    const chunkSize = 32;
    const chunk: TerrainChunk = {
      x: chunkX,
      y: chunkY,
      tiles: [],
      structures: [],
      entities: [],
      generated: true
    };

    // OPTIMIZED: Generate only essential data immediately
    // Generate terrain with minimal computation
    for (let x = 0; x < chunkSize; x++) {
      chunk.tiles[x] = [];
      for (let y = 0; y < chunkSize; y++) {
        const worldX = chunkX * chunkSize + x;
        const worldY = chunkY * chunkSize + y;

        // Use cached noise for faster generation
        const height = this.generateHeightFast(worldX, worldY);
        const biome = this.getBiomeFast(worldX, worldY, height);

        chunk.tiles[x][y] = {
          x: worldX,
          y: worldY,
          height,
          biome,
          temperature: 0.5, // Default value, computed on-demand
          humidity: 0.5,    // Default value, computed on-demand
          solid: height < 0.2, // Water level
          resource: null,   // Generated on-demand when player gets close
          discovered: false
        };
      }
    }

    // LAZY LOADING: Generate structures and resources only when needed
    // Mark chunk as ready for lazy loading
    chunk.structures = []; // Will be populated when player gets close
    
    this.chunkCache.set(key, chunk);
    return chunk;
  }

  // ULTRA FAST height generation - single noise call
  private generateHeightFast(x: number, y: number): number {
    // Single noise call for maximum speed
    const height = this.noise(x, y, 0.005, 1); // Only 1 octave
    return Math.max(0, Math.min(1, height));
  }

  // ULTRA FAST biome generation - minimal logic
  private getBiomeFast(x: number, y: number, height: number): Biome {
    // Ocean biome for very low heights
    if (height < 0.2) return 'ocean';
    
    // Mountain biome for very high heights
    if (height > 0.8) return 'mountains';

    // Use simple hash-based selection for maximum speed
    const hash = ((x * 73856093) ^ (y * 19349663)) % 1000;
    
    if (hash < 200) return 'grassland';
    if (hash < 350) return 'forest';
    if (hash < 450) return 'desert';
    if (hash < 550) return 'plains';
    if (hash < 650) return 'tundra';
    if (hash < 750) return 'jungle';
    if (hash < 850) return 'swamp';
    return 'grassland'; // Default fallback
  }

  // Lazy load structures when player gets close
  generateChunkStructures(chunkX: number, chunkY: number): LegendaryStructure[] {
    const key = `structures_${chunkX}_${chunkY}`;
    if (this.structureCache.has(key)) {
      return this.structureCache.get(key)!;
    }

    const chunk = this.chunkCache.get(`${chunkX}_${chunkY}`);
    if (!chunk) return [];

    const structures = this.generateLegendaryStructures(chunk);
    this.structureCache.set(key, structures);
    
    // Update chunk with structures
    chunk.structures = structures;
    
    return structures;
  }

  // Lazy load resources when player gets close
  generateChunkResources(chunkX: number, chunkY: number): void {
    const chunk = this.chunkCache.get(`${chunkX}_${chunkY}`);
    if (!chunk) return;

    // Check if resources already generated
    if (chunk.tiles[0][0].resource !== null || chunk.tiles[0][0].temperature !== 0.5) {
      return; // Already generated
    }

    // Generate full tile data on-demand
    const chunkSize = 32;
    for (let x = 0; x < chunkSize; x++) {
      for (let y = 0; y < chunkSize; y++) {
        const worldX = chunkX * chunkSize + x;
        const worldY = chunkY * chunkSize + y;
        const tile = chunk.tiles[x][y];

        // Generate missing data
        tile.temperature = this.noise(worldX, worldY, 0.005, 4);
        tile.humidity = this.noise(worldX + 1000, worldY + 1000, 0.005, 4);
      }
    }

    // Generate resources
    this.generateAdvancedResources(chunk);
  }

  // Get world tile with caching
  getWorldTile(x: number, y: number): WorldTile {
    const chunkSize = 32;
    const chunkX = Math.floor(x / chunkSize);
    const chunkY = Math.floor(y / chunkSize);
    const localX = ((x % chunkSize) + chunkSize) % chunkSize;
    const localY = ((y % chunkSize) + chunkSize) % chunkSize;

    const chunk = this.generateChunk(chunkX, chunkY);
    return chunk.tiles[localX][localY];
  }

  // Get all structures in a region
  getStructuresInRegion(centerX: number, centerY: number, radius: number): LegendaryStructure[] {
    const structures: LegendaryStructure[] = [];
    const chunkSize = 32;
    const chunkRadius = Math.ceil(radius / chunkSize);
    
    const centerChunkX = Math.floor(centerX / chunkSize);
    const centerChunkY = Math.floor(centerY / chunkSize);

    for (let x = centerChunkX - chunkRadius; x <= centerChunkX + chunkRadius; x++) {
      for (let y = centerChunkY - chunkRadius; y <= centerChunkY + chunkRadius; y++) {
        const chunk = this.generateChunk(x, y);
        for (const structure of chunk.structures) {
          const distance = Math.sqrt(
            Math.pow(structure.x - centerX, 2) + 
            Math.pow(structure.y - centerY, 2)
          );
          
          if (distance <= radius) {
            structures.push(structure as LegendaryStructure);
          }
        }
      }
    }

    return structures;
  }

  // Clear cache to manage memory
  clearCache(): void {
    // Keep only recent chunks
    if (this.noiseCache.size > 10000) {
      this.noiseCache.clear();
    }
    
    if (this.chunkCache.size > 100) {
      const entries = Array.from(this.chunkCache.entries());
      entries.slice(0, -50).forEach(([key]) => {
        this.chunkCache.delete(key);
      });
    }
  }

  // Get biome information
  getBiomeConfig(biome: Biome): BiomeConfig | undefined {
    return this.biomeConfigs.find(config => config.name === biome);
  }

  // Generate world preview for map
  generateWorldPreview(centerX: number, centerY: number, size: number): {
    tiles: { x: number; y: number; biome: Biome; height: number }[];
    structures: LegendaryStructure[];
  } {
    const tiles = [];
    const structures = [];
    
    const step = Math.max(1, Math.floor(size / 100)); // Sample every few tiles for performance
    
    for (let x = centerX - size/2; x < centerX + size/2; x += step) {
      for (let y = centerY - size/2; y < centerY + size/2; y += step) {
        const tile = this.getWorldTile(Math.floor(x), Math.floor(y));
        tiles.push({
          x: Math.floor(x),
          y: Math.floor(y),
          biome: tile.biome,
          height: tile.height
        });
      }
    }
    
    const regionStructures = this.getStructuresInRegion(centerX, centerY, size/2);
    structures.push(...regionStructures);
    
    return { tiles, structures };
  }
}