export type Biome = 
  | 'grassland' 
  | 'forest' 
  | 'desert' 
  | 'tundra' 
  | 'jungle' 
  | 'swamp' 
  | 'plains'
  | 'mountains'
  | 'ocean';

export interface WorldTile {
  x: number;
  y: number;
  height: number; // 0-1, where 0 is water level
  biome: Biome;
  temperature: number; // 0-1
  humidity: number; // 0-1
  solid: boolean;
  resource: string | null;
  discovered: boolean;
}

export interface Structure {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  data: Record<string, any>;
}

export interface TerrainChunk {
  x: number;
  y: number;
  tiles: WorldTile[][];
  structures: Structure[];
  entities: Entity[];
  generated: boolean;
}

export interface Entity {
  id: string;
  type: 'npc' | 'enemy' | 'item' | 'player';
  x: number;
  y: number;
  width: number;
  height: number;
  health?: number;
  maxHealth?: number;
  data: Record<string, any>;
}

export interface Weather {
  type: 'clear' | 'rain' | 'storm' | 'snow' | 'fog';
  intensity: number; // 0-1
  duration: number; // in game ticks
  effects: {
    visibility: number; // 0-1
    movement: number; // speed multiplier
    combat: number; // damage multiplier
  };
}

export interface TimeOfDay {
  hour: number; // 0-23
  minute: number; // 0-59
  dayPhase: 'dawn' | 'day' | 'dusk' | 'night';
  lightLevel: number; // 0-1
}

export interface WorldState {
  seed: number;
  playerX: number;
  playerY: number;
  loadedChunks: Map<string, TerrainChunk>;
  weather: Weather;
  timeOfDay: TimeOfDay;
  discoveredAreas: Set<string>;
}