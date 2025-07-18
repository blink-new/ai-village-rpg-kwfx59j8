import { LegendaryWorldGenerator } from './LegendaryWorldGenerator';
import { PhysicsEngine, PhysicsBody } from './PhysicsEngine';
import { CombatEngine, CombatStats } from './CombatEngine';
import { WeatherSystem } from './WeatherSystem';
import { CraftingSystem } from './CraftingSystem';
import { WorldState, Entity, TerrainChunk } from '../types/world';
import { Player } from '../types/game';

export interface GameConfig {
  worldSeed?: number;
  renderDistance: number;
  tickRate: number;
  autoSave: boolean;
  autoSaveInterval: number;
}

export interface GameEvents {
  onPlayerMove: (x: number, y: number) => void;
  onEntitySpawn: (entity: Entity) => void;
  onEntityDestroy: (entityId: string) => void;
  onWeatherChange: (weather: any) => void;
  onTimeChange: (time: any) => void;
  onCombatEvent: (event: any) => void;
  onItemPickup: (itemId: string, quantity: number) => void;
  onLevelUp: (newLevel: number) => void;
}

export class GameEngine {
  private worldGenerator: LegendaryWorldGenerator;
  private physicsEngine: PhysicsEngine;
  private combatEngine: CombatEngine;
  private weatherSystem: WeatherSystem;
  private craftingSystem: CraftingSystem;
  
  private worldState: WorldState;
  private player: Player;
  private entities: Map<string, Entity> = new Map();
  private config: GameConfig;
  private events: Partial<GameEvents> = {};
  
  private lastUpdateTime: number = 0;
  private accumulator: number = 0;
  private readonly fixedTimeStep: number = 1000 / 60; // 60 FPS
  
  private isRunning: boolean = false;
  private animationFrameId: number | null = null;
  
  constructor(config: GameConfig, player: Player) {
    this.config = {
      renderDistance: 2, // Reduced from 5 to 2
      tickRate: 60,
      autoSave: true,
      autoSaveInterval: 30000, // 30 seconds
      ...config
    };
    
    this.player = player;
    
    // Initialize core systems
    this.worldGenerator = new LegendaryWorldGenerator(config.worldSeed);
    this.physicsEngine = new PhysicsEngine(this.worldGenerator);
    this.combatEngine = new CombatEngine(this.physicsEngine);
    this.weatherSystem = new WeatherSystem();
    this.craftingSystem = new CraftingSystem();
    
    // Initialize world state
    this.worldState = {
      seed: config.worldSeed || Math.random() * 1000000,
      playerX: 0,
      playerY: 0,
      loadedChunks: new Map(),
      weather: this.weatherSystem.getWeatherInfo(),
      timeOfDay: this.weatherSystem.getTimeInfo(),
      discoveredAreas: new Set()
    };
    
    this.initializePlayer();
    // DON'T load initial chunks in constructor - do it when game starts
  }
  
  private initializePlayer(): void {
    // Add player to physics engine
    const playerBody: PhysicsBody = {
      id: 'player',
      x: this.worldState.playerX,
      y: this.worldState.playerY,
      width: 32,
      height: 48,
      velocity: { x: 0, y: 0 },
      acceleration: { x: 0, y: 0 },
      mass: 70,
      friction: 0.8,
      restitution: 0.1,
      isStatic: false,
      isGrounded: false,
      canJump: true
    };
    
    this.physicsEngine.addBody(playerBody);
    
    // Add player to combat engine
    const playerStats: CombatStats = {
      health: this.player.stats.health,
      maxHealth: this.player.stats.maxHealth,
      mana: this.player.stats.mana,
      maxMana: this.player.stats.maxMana,
      stamina: this.player.stats.stamina,
      maxStamina: this.player.stats.maxStamina,
      attack: this.player.stats.attack,
      defense: this.player.stats.defense,
      speed: this.player.stats.speed,
      criticalChance: 0.1,
      criticalDamage: 1.5,
      magicPower: this.player.stats.magic,
      magicResistance: 0.1
    };
    
    this.combatEngine.addCombatEntity('player', playerStats);
  }
  
  private loadInitialChunks(): void {
    const chunkSize = 32;
    const playerChunkX = Math.floor(this.worldState.playerX / chunkSize);
    const playerChunkY = Math.floor(this.worldState.playerY / chunkSize);
    
    // SUPER FAST: Load only the player's current chunk immediately
    this.loadChunk(playerChunkX, playerChunkY);
    
    // Load adjacent chunks with minimal delay
    const adjacentChunks = [
      { x: playerChunkX - 1, y: playerChunkY },
      { x: playerChunkX + 1, y: playerChunkY },
      { x: playerChunkX, y: playerChunkY - 1 },
      { x: playerChunkX, y: playerChunkY + 1 }
    ];
    
    adjacentChunks.forEach((chunk, index) => {
      setTimeout(() => {
        this.loadChunk(chunk.x, chunk.y);
      }, (index + 1) * 50); // 50ms delay between adjacent chunks
    });
    
    // Load remaining chunks in background
    setTimeout(() => {
      for (let x = playerChunkX - this.config.renderDistance; x <= playerChunkX + this.config.renderDistance; x++) {
        for (let y = playerChunkY - this.config.renderDistance; y <= playerChunkY + this.config.renderDistance; y++) {
          const distance = Math.max(Math.abs(x - playerChunkX), Math.abs(y - playerChunkY));
          if (distance > 1) { // Skip already loaded chunks
            setTimeout(() => {
              this.loadChunk(x, y);
            }, distance * 100); // Stagger by distance
          }
        }
      }
    }, 500); // Start background loading after 500ms
  }
  
  private loadChunk(chunkX: number, chunkY: number): void {
    const key = `${chunkX}_${chunkY}`;
    if (this.worldState.loadedChunks.has(key)) return;
    
    // FAST: Generate basic chunk immediately
    const chunk = this.worldGenerator.generateChunk(chunkX, chunkY);
    this.worldState.loadedChunks.set(key, chunk);
    
    // LAZY: Load detailed content only when player gets close
    this.scheduleChunkDetailLoading(chunkX, chunkY);
  }

  private scheduleChunkDetailLoading(chunkX: number, chunkY: number): void {
    // Load structures and resources in the background
    setTimeout(() => {
      const playerChunkX = Math.floor(this.worldState.playerX / 32);
      const playerChunkY = Math.floor(this.worldState.playerY / 32);
      const distance = Math.max(Math.abs(chunkX - playerChunkX), Math.abs(chunkY - playerChunkY));
      
      // Only load details if player is still nearby
      if (distance <= this.config.renderDistance + 1) {
        this.loadChunkDetails(chunkX, chunkY);
      }
    }, 100); // Small delay to spread the load
  }

  private loadChunkDetails(chunkX: number, chunkY: number): void {
    // Generate structures and resources on-demand
    this.worldGenerator.generateChunkStructures(chunkX, chunkY);
    this.worldGenerator.generateChunkResources(chunkX, chunkY);
    
    // Spawn entities in chunk
    const chunk = this.worldState.loadedChunks.get(`${chunkX}_${chunkY}`);
    if (chunk) {
      this.spawnChunkEntities(chunk);
    }
  }
  
  private spawnChunkEntities(chunk: TerrainChunk): void {
    // Spawn NPCs based on structures
    chunk.structures.forEach(structure => {
      if (structure.type === 'village') {
        this.spawnNPC('villager', structure.x, structure.y);
      } else if (structure.type === 'temple_ruins') {
        this.spawnNPC('guardian', structure.x, structure.y);
      }
    });
    
    // Spawn enemies based on biome and time
    const timeInfo = this.weatherSystem.getTimeInfo();
    const spawnRate = timeInfo.isNight ? 0.3 : 0.1;
    
    if (Math.random() < spawnRate) {
      const x = chunk.x * 32 + Math.random() * 32;
      const y = chunk.y * 32 + Math.random() * 32;
      
      // Choose enemy type based on biome
      const centerTile = chunk.tiles[16][16];
      let enemyType = 'goblin';
      
      switch (centerTile.biome) {
        case 'forest':
          enemyType = Math.random() > 0.5 ? 'wolf' : 'orc';
          break;
        case 'desert':
          enemyType = 'sand_worm';
          break;
        case 'jungle':
          enemyType = 'jungle_cat';
          break;
        case 'tundra':
          enemyType = 'ice_troll';
          break;
      }
      
      this.spawnEnemy(enemyType, x, y);
    }
  }
  
  private spawnNPC(type: string, x: number, y: number): void {
    const npcId = `npc_${Date.now()}_${Math.random()}`;
    const npc: Entity = {
      id: npcId,
      type: 'npc',
      x,
      y,
      width: 32,
      height: 48,
      health: 100,
      maxHealth: 100,
      data: {
        npcType: type,
        dialogue: [],
        quests: [],
        inventory: [],
        personality: this.generatePersonality(),
        relationship: 0
      }
    };
    
    this.entities.set(npcId, npc);
    
    // Add to physics engine
    const body: PhysicsBody = {
      id: npcId,
      x,
      y,
      width: 32,
      height: 48,
      velocity: { x: 0, y: 0 },
      acceleration: { x: 0, y: 0 },
      mass: 60,
      friction: 0.9,
      restitution: 0.1,
      isStatic: false,
      isGrounded: false,
      canJump: true
    };
    
    this.physicsEngine.addBody(body);
    this.events.onEntitySpawn?.(npc);
  }
  
  private spawnEnemy(type: string, x: number, y: number): void {
    const enemyId = `enemy_${Date.now()}_${Math.random()}`;
    const enemy: Entity = {
      id: enemyId,
      type: 'enemy',
      x,
      y,
      width: 32,
      height: 32,
      health: this.getEnemyHealth(type),
      maxHealth: this.getEnemyHealth(type),
      data: {
        enemyType: type,
        aggroRange: 100,
        attackRange: 40,
        damage: this.getEnemyDamage(type),
        speed: this.getEnemySpeed(type),
        lastAttack: 0,
        target: null,
        ai: 'patrol'
      }
    };
    
    this.entities.set(enemyId, enemy);
    
    // Add to physics and combat engines
    const body: PhysicsBody = {
      id: enemyId,
      x,
      y,
      width: 32,
      height: 32,
      velocity: { x: 0, y: 0 },
      acceleration: { x: 0, y: 0 },
      mass: 50,
      friction: 0.7,
      restitution: 0.2,
      isStatic: false,
      isGrounded: false,
      canJump: true
    };
    
    this.physicsEngine.addBody(body);
    
    const stats: CombatStats = {
      health: enemy.health!,
      maxHealth: enemy.maxHealth!,
      mana: 0,
      maxMana: 0,
      stamina: 100,
      maxStamina: 100,
      attack: enemy.data.damage,
      defense: 5,
      speed: enemy.data.speed,
      criticalChance: 0.05,
      criticalDamage: 1.2,
      magicPower: 0,
      magicResistance: 0.1
    };
    
    this.combatEngine.addCombatEntity(enemyId, stats);
    this.events.onEntitySpawn?.(enemy);
  }
  
  private generatePersonality(): any {
    const traits = ['friendly', 'grumpy', 'wise', 'mysterious', 'cheerful', 'serious'];
    const interests = ['magic', 'combat', 'crafting', 'exploration', 'trade', 'history'];
    
    return {
      primaryTrait: traits[Math.floor(Math.random() * traits.length)],
      interests: interests.slice(0, 2 + Math.floor(Math.random() * 2)),
      mood: 0.5 + (Math.random() - 0.5) * 0.4, // 0.3 to 0.7
      knowledge: Math.random()
    };
  }
  
  private getEnemyHealth(type: string): number {
    const healthMap: Record<string, number> = {
      goblin: 30,
      orc: 60,
      wolf: 40,
      sand_worm: 80,
      jungle_cat: 35,
      ice_troll: 120
    };
    return healthMap[type] || 30;
  }
  
  private getEnemyDamage(type: string): number {
    const damageMap: Record<string, number> = {
      goblin: 15,
      orc: 25,
      wolf: 20,
      sand_worm: 30,
      jungle_cat: 18,
      ice_troll: 35
    };
    return damageMap[type] || 15;
  }
  
  private getEnemySpeed(type: string): number {
    const speedMap: Record<string, number> = {
      goblin: 80,
      orc: 60,
      wolf: 120,
      sand_worm: 40,
      jungle_cat: 140,
      ice_troll: 50
    };
    return speedMap[type] || 80;
  }
  
  // Main game loop
  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastUpdateTime = performance.now();
    
    // Load initial chunks only when game starts
    this.loadInitialChunks();
    
    this.gameLoop();
  }
  
  stop(): void {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  private gameLoop = (): void => {
    if (!this.isRunning) return;
    
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastUpdateTime;
    this.lastUpdateTime = currentTime;
    
    // Fixed timestep with accumulator
    this.accumulator += deltaTime;
    
    while (this.accumulator >= this.fixedTimeStep) {
      this.update(this.fixedTimeStep);
      this.accumulator -= this.fixedTimeStep;
    }
    
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };
  
  private update(deltaTime: number): void {
    // Update core systems
    this.physicsEngine.update();
    this.combatEngine.update(deltaTime);
    this.weatherSystem.update(deltaTime);
    this.craftingSystem.update();
    
    // Update world state
    this.updateWorldState();
    
    // Update entities
    this.updateEntities(deltaTime);
    
    // Update player
    this.updatePlayer();
    
    // Manage chunks
    this.manageChunks();
    
    // Clean up old data
    this.cleanup();
  }
  
  private updateWorldState(): void {
    const playerBody = this.physicsEngine.getBody('player');
    if (playerBody) {
      this.worldState.playerX = playerBody.x;
      this.worldState.playerY = playerBody.y;
    }
    
    this.worldState.weather = this.weatherSystem.getWeatherInfo();
    this.worldState.timeOfDay = this.weatherSystem.getTimeInfo();
  }
  
  private updateEntities(deltaTime: number): void {
    for (const entity of this.entities.values()) {
      if (entity.type === 'enemy') {
        this.updateEnemyAI(entity, deltaTime);
      } else if (entity.type === 'npc') {
        this.updateNPCAI(entity, deltaTime);
      }
      
      // Update entity position from physics
      const body = this.physicsEngine.getBody(entity.id);
      if (body) {
        entity.x = body.x;
        entity.y = body.y;
      }
      
      // Check if entity is dead
      if (entity.health !== undefined && entity.health <= 0) {
        this.destroyEntity(entity.id);
      }
    }
  }
  
  private updateEnemyAI(enemy: Entity, deltaTime: number): void {
    const playerBody = this.physicsEngine.getBody('player');
    if (!playerBody) return;
    
    const dx = playerBody.x - enemy.x;
    const dy = playerBody.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Check aggro range
    if (distance <= enemy.data.aggroRange) {
      enemy.data.target = 'player';
      enemy.data.ai = 'chase';
      
      // Move towards player
      if (distance > enemy.data.attackRange) {
        const moveSpeed = enemy.data.speed;
        const normalizedDx = dx / distance;
        const normalizedDy = dy / distance;
        
        this.physicsEngine.applyForce(enemy.id, {
          x: normalizedDx * moveSpeed,
          y: normalizedDy * moveSpeed
        });
      } else {
        // Attack player
        const now = Date.now();
        if (now - enemy.data.lastAttack > 1000) { // 1 second cooldown
          this.combatEngine.performAttack(enemy.id, 'player', 'claws');
          enemy.data.lastAttack = now;
        }
      }
    } else {
      enemy.data.target = null;
      enemy.data.ai = 'patrol';
      
      // Simple patrol behavior
      if (Math.random() < 0.01) { // 1% chance per frame to change direction
        const randomAngle = Math.random() * Math.PI * 2;
        this.physicsEngine.applyForce(enemy.id, {
          x: Math.cos(randomAngle) * 20,
          y: Math.sin(randomAngle) * 20
        });
      }
    }
  }
  
  private updateNPCAI(npc: Entity, deltaTime: number): void {
    // Simple NPC behavior - mostly stationary with occasional movement
    if (Math.random() < 0.005) { // 0.5% chance per frame
      const randomAngle = Math.random() * Math.PI * 2;
      this.physicsEngine.applyForce(npc.id, {
        x: Math.cos(randomAngle) * 10,
        y: Math.sin(randomAngle) * 10
      });
    }
  }
  
  private updatePlayer(): void {
    const playerBody = this.physicsEngine.getBody('player');
    if (!playerBody) return;
    
    // Update player stats from combat engine
    const combatStats = this.combatEngine.getModifiedStats('player');
    if (combatStats) {
      this.player.stats.health = combatStats.health;
      this.player.stats.mana = combatStats.mana;
      this.player.stats.stamina = combatStats.stamina;
    }
    
    // Check for level up
    if (this.player.experience >= this.getRequiredExperience(this.player.level + 1)) {
      this.player.level++;
      this.player.stats.maxHealth += 10;
      this.player.stats.maxMana += 5;
      this.player.stats.maxStamina += 5;
      this.events.onLevelUp?.(this.player.level);
    }
    
    // Discover new areas
    const chunkSize = 32;
    const chunkX = Math.floor(playerBody.x / chunkSize);
    const chunkY = Math.floor(playerBody.y / chunkSize);
    const areaKey = `${chunkX}_${chunkY}`;
    
    if (!this.worldState.discoveredAreas.has(areaKey)) {
      this.worldState.discoveredAreas.add(areaKey);
      this.player.experience += 5; // Exploration XP
    }
  }
  
  private getRequiredExperience(level: number): number {
    return level * level * 100;
  }
  
  private manageChunks(): void {
    const chunkSize = 32;
    const playerChunkX = Math.floor(this.worldState.playerX / chunkSize);
    const playerChunkY = Math.floor(this.worldState.playerY / chunkSize);
    
    // Load new chunks
    for (let x = playerChunkX - this.config.renderDistance; x <= playerChunkX + this.config.renderDistance; x++) {
      for (let y = playerChunkY - this.config.renderDistance; y <= playerChunkY + this.config.renderDistance; y++) {
        this.loadChunk(x, y);
      }
    }
    
    // Unload distant chunks
    const chunksToUnload: string[] = [];
    for (const [key, chunk] of this.worldState.loadedChunks.entries()) {
      const distance = Math.max(
        Math.abs(chunk.x - playerChunkX),
        Math.abs(chunk.y - playerChunkY)
      );
      
      if (distance > this.config.renderDistance + 2) {
        chunksToUnload.push(key);
      }
    }
    
    chunksToUnload.forEach(key => {
      this.worldState.loadedChunks.delete(key);
    });
  }
  
  private cleanup(): void {
    // Clear old combat logs
    this.combatEngine.clearOldCombatLog();
    
    // Clear world generator cache periodically
    if (Math.random() < 0.001) { // 0.1% chance per frame
      this.worldGenerator.clearCache();
    }
  }
  
  private destroyEntity(entityId: string): void {
    const entity = this.entities.get(entityId);
    if (!entity) return;
    
    // Remove from all systems
    this.entities.delete(entityId);
    this.physicsEngine.removeBody(entityId);
    this.combatEngine.removeCombatEntity(entityId);
    
    // Drop loot if enemy
    if (entity.type === 'enemy') {
      this.dropLoot(entity);
    }
    
    this.events.onEntityDestroy?.(entityId);
  }
  
  private dropLoot(entity: Entity): void {
    const lootTable: Record<string, string[]> = {
      goblin: ['gold_coin', 'leather', 'iron_ore'],
      orc: ['iron_ingot', 'meat', 'bone'],
      wolf: ['fur', 'meat', 'fang'],
      sand_worm: ['sand_crystal', 'chitin', 'water'],
      jungle_cat: ['exotic_fur', 'claw', 'jungle_herb'],
      ice_troll: ['ice_crystal', 'troll_hide', 'frozen_meat']
    };
    
    const possibleLoot = lootTable[entity.data.enemyType] || ['gold_coin'];
    const lootCount = 1 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < lootCount; i++) {
      if (Math.random() < 0.6) { // 60% drop chance per item
        const lootItem = possibleLoot[Math.floor(Math.random() * possibleLoot.length)];
        this.craftingSystem.addItem(lootItem, 1);
        this.events.onItemPickup?.(lootItem, 1);
      }
    }
  }
  
  // Public API methods
  movePlayer(direction: 'up' | 'down' | 'left' | 'right', intensity: number = 1): void {
    const force = 200 * intensity;
    const weatherEffects = this.weatherSystem.getWeatherEffects();
    const adjustedForce = force * weatherEffects.movement;
    
    switch (direction) {
      case 'up':
        this.physicsEngine.applyForce('player', { x: 0, y: -adjustedForce });
        break;
      case 'down':
        this.physicsEngine.applyForce('player', { x: 0, y: adjustedForce });
        break;
      case 'left':
        this.physicsEngine.applyForce('player', { x: -adjustedForce, y: 0 });
        break;
      case 'right':
        this.physicsEngine.applyForce('player', { x: adjustedForce, y: 0 });
        break;
    }
    
    this.events.onPlayerMove?.(this.worldState.playerX, this.worldState.playerY);
  }
  
  playerJump(): void {
    this.physicsEngine.jump('player', 600);
  }
  
  playerAttack(targetId?: string): void {
    if (targetId) {
      const result = this.combatEngine.performAttack('player', targetId, this.player.equipment.weapon || 'fists');
      if (result) {
        this.events.onCombatEvent?.({ type: 'attack', result });
      }
    }
  }
  
  playerCastSpell(spellId: string, targetId?: string, targetX?: number, targetY?: number): void {
    const success = this.combatEngine.castSpell('player', spellId, targetId, targetX, targetY);
    if (success) {
      this.events.onCombatEvent?.({ type: 'spell', spellId, targetId });
    }
  }
  
  interactWithEntity(entityId: string): Entity | null {
    return this.entities.get(entityId) || null;
  }
  
  // Getters
  getWorldState(): WorldState {
    return { ...this.worldState };
  }
  
  getPlayer(): Player {
    return { ...this.player };
  }
  
  getEntities(): Entity[] {
    return Array.from(this.entities.values());
  }
  
  getWeatherEffects() {
    return this.weatherSystem.getWeatherEffects();
  }
  
  getTimeInfo() {
    return this.weatherSystem.getTimeInfo();
  }
  
  getCraftingSystem(): CraftingSystem {
    return this.craftingSystem;
  }
  
  // Event system
  on<K extends keyof GameEvents>(event: K, callback: GameEvents[K]): void {
    this.events[event] = callback;
  }
  
  off<K extends keyof GameEvents>(event: K): void {
    delete this.events[event];
  }
}