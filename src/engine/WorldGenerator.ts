import { Biome, TerrainChunk, WorldTile, Structure } from '../types/world';

export class WorldGenerator {
  private seed: number;
  private noiseCache: Map<string, number> = new Map();
  private chunkCache: Map<string, TerrainChunk> = new Map();
  
  constructor(seed: number = Math.random() * 1000000) {
    this.seed = seed;
  }

  // Perlin noise implementation for terrain generation
  private noise(x: number, y: number, scale: number = 1): number {
    const key = `${x}_${y}_${scale}`;
    if (this.noiseCache.has(key)) {
      return this.noiseCache.get(key)!;
    }

    // Simple noise function - in production would use proper Perlin noise
    const value = Math.sin(x * scale * 0.01 + this.seed) * 
                  Math.cos(y * scale * 0.01 + this.seed) * 0.5 + 0.5;
    
    this.noiseCache.set(key, value);
    return value;
  }

  // Generate biome based on temperature and humidity
  private getBiome(temperature: number, humidity: number): Biome {
    if (temperature > 0.8 && humidity < 0.3) return 'desert';
    if (temperature < 0.2) return 'tundra';
    if (humidity > 0.8 && temperature > 0.6) return 'jungle';
    if (temperature > 0.6 && humidity > 0.4) return 'forest';
    if (temperature < 0.4 && humidity > 0.6) return 'swamp';
    if (temperature > 0.7 && humidity < 0.6) return 'plains';
    return 'grassland';
  }

  // Generate terrain height using multiple octaves of noise
  private generateHeight(x: number, y: number): number {
    let height = 0;
    let amplitude = 1;
    let frequency = 0.01;

    // Multiple octaves for more realistic terrain
    for (let i = 0; i < 6; i++) {
      height += this.noise(x, y, frequency) * amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }

    return Math.max(0, Math.min(1, height));
  }

  // Generate structures based on biome and terrain
  private generateStructures(chunk: TerrainChunk): Structure[] {
    const structures: Structure[] = [];
    const chunkSize = 32;

    for (let x = 0; x < chunkSize; x += 8) {
      for (let y = 0; y < chunkSize; y += 8) {
        const worldX = chunk.x * chunkSize + x;
        const worldY = chunk.y * chunkSize + y;
        const structureNoise = this.noise(worldX, worldY, 0.1);

        if (structureNoise > 0.95) {
          const biome = chunk.tiles[x][y].biome;
          let structureType: string;

          switch (biome) {
            case 'forest':
              structureType = Math.random() > 0.5 ? 'tree_large' : 'tree_small';
              break;
            case 'desert':
              structureType = Math.random() > 0.8 ? 'oasis' : 'cactus';
              break;
            case 'plains':
              structureType = Math.random() > 0.7 ? 'village' : 'windmill';
              break;
            case 'jungle':
              structureType = 'temple_ruins';
              break;
            case 'tundra':
              structureType = 'ice_cave';
              break;
            default:
              structureType = 'rock_formation';
          }

          structures.push({
            id: `struct_${worldX}_${worldY}`,
            type: structureType,
            x: worldX,
            y: worldY,
            width: 2,
            height: 2,
            data: {}
          });
        }
      }
    }

    return structures;
  }

  // Generate ores and resources
  private generateResources(chunk: TerrainChunk): void {
    const chunkSize = 32;

    for (let x = 0; x < chunkSize; x++) {
      for (let y = 0; y < chunkSize; y++) {
        const worldX = chunk.x * chunkSize + x;
        const worldY = chunk.y * chunkSize + y;
        const tile = chunk.tiles[x][y];

        // Generate ores based on depth and noise
        const oreNoise = this.noise(worldX, worldY, 0.05);
        const depth = 1 - tile.height;

        if (depth > 0.3 && oreNoise > 0.9) {
          if (depth > 0.8 && oreNoise > 0.98) {
            tile.resource = 'diamond';
          } else if (depth > 0.6 && oreNoise > 0.95) {
            tile.resource = 'gold';
          } else if (depth > 0.4 && oreNoise > 0.92) {
            tile.resource = 'iron';
          } else {
            tile.resource = 'stone';
          }
        }

        // Generate surface resources based on biome
        if (tile.height > 0.5) {
          const resourceNoise = this.noise(worldX + 100, worldY + 100, 0.03);
          if (resourceNoise > 0.85) {
            switch (tile.biome) {
              case 'forest':
                tile.resource = Math.random() > 0.5 ? 'wood' : 'berries';
                break;
              case 'desert':
                tile.resource = 'sand_crystal';
                break;
              case 'jungle':
                tile.resource = 'exotic_fruit';
                break;
              case 'plains':
                tile.resource = 'wheat';
                break;
            }
          }
        }
      }
    }
  }

  // Main chunk generation function
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

    // Initialize tiles array
    for (let x = 0; x < chunkSize; x++) {
      chunk.tiles[x] = [];
      for (let y = 0; y < chunkSize; y++) {
        const worldX = chunkX * chunkSize + x;
        const worldY = chunkY * chunkSize + y;

        const height = this.generateHeight(worldX, worldY);
        const temperature = this.noise(worldX, worldY, 0.005) + height * 0.3;
        const humidity = this.noise(worldX + 1000, worldY + 1000, 0.005);
        const biome = this.getBiome(temperature, humidity);

        chunk.tiles[x][y] = {
          x: worldX,
          y: worldY,
          height,
          biome,
          temperature,
          humidity,
          solid: height < 0.3, // Water/air
          resource: null,
          discovered: false
        };
      }
    }

    // Generate resources
    this.generateResources(chunk);

    // Generate structures
    chunk.structures = this.generateStructures(chunk);

    this.chunkCache.set(key, chunk);
    return chunk;
  }

  // Get world tile at specific coordinates
  getWorldTile(x: number, y: number): WorldTile {
    const chunkSize = 32;
    const chunkX = Math.floor(x / chunkSize);
    const chunkY = Math.floor(y / chunkSize);
    const localX = x - chunkX * chunkSize;
    const localY = y - chunkY * chunkSize;

    const chunk = this.generateChunk(chunkX, chunkY);
    return chunk.tiles[localX][localY];
  }

  // Clear cache to manage memory
  clearCache(): void {
    this.noiseCache.clear();
    // Keep only nearby chunks
    const chunksToKeep = 9; // 3x3 grid around player
    if (this.chunkCache.size > chunksToKeep) {
      const entries = Array.from(this.chunkCache.entries());
      entries.slice(0, -chunksToKeep).forEach(([key]) => {
        this.chunkCache.delete(key);
      });
    }
  }
}