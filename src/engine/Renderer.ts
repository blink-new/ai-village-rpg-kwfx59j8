import { WorldState, TerrainChunk, Entity } from '../types/world';
import { Player, ParticleEffect } from '../types/game';
import { GameEngine } from './GameEngine';

export interface RenderConfig {
  tileSize: number;
  viewportWidth: number;
  viewportHeight: number;
  renderDistance: number;
  enableParticles: boolean;
  enableLighting: boolean;
  enableWeatherEffects: boolean;
  pixelArt: boolean;
}

export interface Camera {
  x: number;
  y: number;
  zoom: number;
  shake: {
    intensity: number;
    duration: number;
    currentTime: number;
  };
}

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: RenderConfig;
  private camera: Camera;
  private gameEngine: GameEngine;
  
  private tileTextures: Map<string, HTMLImageElement> = new Map();
  private entitySprites: Map<string, HTMLImageElement> = new Map();
  private particleEffects: ParticleEffect[] = [];
  private lightSources: { x: number; y: number; radius: number; color: string; intensity: number }[] = [];
  
  private frameCount: number = 0;
  private lastFpsTime: number = 0;
  private fps: number = 0;
  
  constructor(canvas: HTMLCanvasElement, gameEngine: GameEngine, config: Partial<RenderConfig> = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.gameEngine = gameEngine;
    
    this.config = {
      tileSize: 32,
      viewportWidth: canvas.width,
      viewportHeight: canvas.height,
      renderDistance: 20,
      enableParticles: true,
      enableLighting: true,
      enableWeatherEffects: true,
      pixelArt: true,
      ...config
    };
    
    this.camera = {
      x: 0,
      y: 0,
      zoom: 1,
      shake: {
        intensity: 0,
        duration: 0,
        currentTime: 0
      }
    };
    
    this.setupCanvas();
    this.loadTextures();
  }
  
  private setupCanvas(): void {
    // Set up pixel art rendering
    if (this.config.pixelArt) {
      this.ctx.imageSmoothingEnabled = false;
      this.canvas.style.imageRendering = 'pixelated';
    }
    
    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    
    this.config.viewportWidth = rect.width;
    this.config.viewportHeight = rect.height;
  }
  
  private async loadTextures(): Promise<void> {
    // Load biome textures
    const biomes = ['grassland', 'forest', 'desert', 'tundra', 'jungle', 'swamp', 'plains', 'mountains', 'ocean'];
    
    for (const biome of biomes) {
      const img = new Image();
      img.src = this.generateBiomeTexture(biome);
      this.tileTextures.set(biome, img);
    }
    
    // Load entity sprites
    const entityTypes = ['player', 'villager', 'merchant', 'guard', 'goblin', 'orc', 'wolf', 'dragon'];
    
    for (const type of entityTypes) {
      const img = new Image();
      img.src = this.generateEntitySprite(type);
      this.entitySprites.set(type, img);
    }
  }
  
  private generateBiomeTexture(biome: string): string {
    // Generate procedural textures for different biomes
    const canvas = document.createElement('canvas');
    canvas.width = this.config.tileSize;
    canvas.height = this.config.tileSize;
    const ctx = canvas.getContext('2d')!;
    
    const colors: Record<string, string[]> = {
      grassland: ['#4a7c59', '#5d8a6b', '#6b9b7d'],
      forest: ['#2d5016', '#3a6b1f', '#4a7c2a'],
      desert: ['#c2b280', '#d4c294', '#e6d2a8'],
      tundra: ['#e6f2ff', '#f0f8ff', '#ffffff'],
      jungle: ['#1a4d1a', '#2d6b2d', '#4a8a4a'],
      swamp: ['#4a5d4a', '#5d7a5d', '#708a70'],
      plains: ['#7a9b4a', '#8aab5a', '#9bbc6b'],
      mountains: ['#8a8a8a', '#9b9b9b', '#acacac'],
      ocean: ['#1a4d7a', '#2d6b9b', '#4a8abc']
    };
    
    const biomeColors = colors[biome] || colors.grassland;
    
    // Create base color
    ctx.fillStyle = biomeColors[0];
    ctx.fillRect(0, 0, this.config.tileSize, this.config.tileSize);
    
    // Add texture variation
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = biomeColors[Math.floor(Math.random() * biomeColors.length)];
      ctx.fillRect(
        Math.random() * this.config.tileSize,
        Math.random() * this.config.tileSize,
        2 + Math.random() * 4,
        2 + Math.random() * 4
      );
    }
    
    return canvas.toDataURL();
  }
  
  private generateEntitySprite(type: string): string {
    // Generate simple colored rectangles for entities
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 48;
    const ctx = canvas.getContext('2d')!;
    
    const colors: Record<string, string> = {
      player: '#4a90e2',
      villager: '#8a6b47',
      merchant: '#d4af37',
      guard: '#4a4a4a',
      goblin: '#6b8a3a',
      orc: '#8a4a2d',
      wolf: '#5d4a3a',
      dragon: '#8a2d2d'
    };
    
    ctx.fillStyle = colors[type] || '#888888';
    ctx.fillRect(8, 16, 16, 32); // Body
    ctx.fillRect(12, 8, 8, 16); // Head
    
    return canvas.toDataURL();
  }
  
  public render(): void {
    this.updateFPS();
    this.updateCamera();
    this.clearCanvas();
    
    const worldState = this.gameEngine.getWorldState();
    const player = this.gameEngine.getPlayer();
    const entities = this.gameEngine.getEntities();
    const weatherEffects = this.gameEngine.getWeatherEffects();
    const timeInfo = this.gameEngine.getTimeInfo();
    
    // Apply lighting and weather effects
    this.applyGlobalEffects(weatherEffects, timeInfo);
    
    // Render world
    this.renderWorld(worldState);
    
    // Render entities
    this.renderEntities(entities, player);
    
    // Render particles
    if (this.config.enableParticles) {
      this.renderParticles();
      this.updateParticles();
    }
    
    // Render weather effects
    if (this.config.enableWeatherEffects) {
      this.renderWeatherEffects(weatherEffects);
    }
    
    // Render lighting
    if (this.config.enableLighting) {
      this.renderLighting(timeInfo);
    }
    
    // Render UI overlay
    this.renderUI(player, weatherEffects, timeInfo);
  }
  
  private updateFPS(): void {
    this.frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - this.lastFpsTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastFpsTime));
      this.frameCount = 0;
      this.lastFpsTime = currentTime;
    }
  }
  
  private updateCamera(): void {
    const player = this.gameEngine.getPlayer();
    
    // Follow player
    this.camera.x = player.position.x - this.config.viewportWidth / 2;
    this.camera.y = player.position.y - this.config.viewportHeight / 2;
    
    // Apply camera shake
    if (this.camera.shake.currentTime > 0) {
      const shakeX = (Math.random() - 0.5) * this.camera.shake.intensity;
      const shakeY = (Math.random() - 0.5) * this.camera.shake.intensity;
      
      this.camera.x += shakeX;
      this.camera.y += shakeY;
      
      this.camera.shake.currentTime -= 16; // Assuming 60 FPS
      
      if (this.camera.shake.currentTime <= 0) {
        this.camera.shake.intensity = 0;
      }
    }
  }
  
  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.config.viewportWidth, this.config.viewportHeight);
  }
  
  private applyGlobalEffects(weatherEffects: any, timeInfo: any): void {
    // Apply time-based lighting
    const lightLevel = timeInfo.lightLevel;
    const alpha = 1 - lightLevel;
    
    if (alpha > 0) {
      this.ctx.save();
      this.ctx.globalAlpha = alpha * 0.7;
      this.ctx.fillStyle = '#000033';
      this.ctx.fillRect(0, 0, this.config.viewportWidth, this.config.viewportHeight);
      this.ctx.restore();
    }
    
    // Apply weather visibility effects
    if (weatherEffects.visibility < 1) {
      this.ctx.save();
      this.ctx.globalAlpha = (1 - weatherEffects.visibility) * 0.5;
      this.ctx.fillStyle = '#cccccc';
      this.ctx.fillRect(0, 0, this.config.viewportWidth, this.config.viewportHeight);
      this.ctx.restore();
    }
  }
  
  private renderWorld(worldState: WorldState): void {
    const tileSize = this.config.tileSize;
    const startX = Math.floor(this.camera.x / tileSize) - 1;
    const endX = Math.ceil((this.camera.x + this.config.viewportWidth) / tileSize) + 1;
    const startY = Math.floor(this.camera.y / tileSize) - 1;
    const endY = Math.ceil((this.camera.y + this.config.viewportHeight) / tileSize) + 1;
    
    // Render terrain tiles
    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        const worldX = x * tileSize;
        const worldY = y * tileSize;
        const screenX = worldX - this.camera.x;
        const screenY = worldY - this.camera.y;
        
        // Get world tile data
        const chunkSize = 32;
        const chunkX = Math.floor(x / chunkSize);
        const chunkY = Math.floor(y / chunkSize);
        const localX = x - chunkX * chunkSize;
        const localY = y - chunkY * chunkSize;
        
        const chunkKey = `${chunkX}_${chunkY}`;
        const chunk = worldState.loadedChunks.get(chunkKey);
        
        if (chunk && chunk.tiles[localX] && chunk.tiles[localX][localY]) {
          const tile = chunk.tiles[localX][localY];
          this.renderTile(tile, screenX, screenY);
          
          // Render resources
          if (tile.resource) {
            this.renderResource(tile.resource, screenX, screenY);
          }
        } else {
          // Render placeholder for unloaded chunks
          this.ctx.fillStyle = '#333333';
          this.ctx.fillRect(screenX, screenY, tileSize, tileSize);
        }
      }
    }
    
    // Render structures
    for (const chunk of worldState.loadedChunks.values()) {
      for (const structure of chunk.structures) {
        const screenX = structure.x * tileSize - this.camera.x;
        const screenY = structure.y * tileSize - this.camera.y;
        
        if (this.isInViewport(screenX, screenY, structure.width * tileSize, structure.height * tileSize)) {
          this.renderStructure(structure, screenX, screenY);
        }
      }
    }
  }
  
  private renderTile(tile: any, x: number, y: number): void {
    const texture = this.tileTextures.get(tile.biome);
    
    if (texture && texture.complete) {
      // Adjust tile color based on height
      const heightModifier = tile.height * 0.3;
      this.ctx.save();
      this.ctx.globalAlpha = 0.7 + heightModifier;
      this.ctx.drawImage(texture, x, y, this.config.tileSize, this.config.tileSize);
      this.ctx.restore();
    } else {
      // Fallback color rendering
      const biomeColors: Record<string, string> = {
        grassland: '#4a7c59',
        forest: '#2d5016',
        desert: '#c2b280',
        tundra: '#e6f2ff',
        jungle: '#1a4d1a',
        swamp: '#4a5d4a',
        plains: '#7a9b4a',
        mountains: '#8a8a8a',
        ocean: '#1a4d7a'
      };
      
      this.ctx.fillStyle = biomeColors[tile.biome] || '#4a7c59';
      this.ctx.fillRect(x, y, this.config.tileSize, this.config.tileSize);
    }
    
    // Render water for low-height tiles
    if (tile.height < 0.3) {
      this.ctx.save();
      this.ctx.globalAlpha = 0.6;
      this.ctx.fillStyle = '#4a8abc';
      this.ctx.fillRect(x, y, this.config.tileSize, this.config.tileSize);
      this.ctx.restore();
    }
  }
  
  private renderResource(resource: string, x: number, y: number): void {
    const resourceColors: Record<string, string> = {
      wood: '#8B4513',
      stone: '#696969',
      iron: '#C0C0C0',
      gold: '#FFD700',
      diamond: '#B9F2FF',
      berries: '#DC143C',
      sand_crystal: '#F0E68C'
    };
    
    this.ctx.fillStyle = resourceColors[resource] || '#888888';
    this.ctx.fillRect(x + 8, y + 8, 16, 16);
  }
  
  private renderStructure(structure: any, x: number, y: number): void {
    const structureColors: Record<string, string> = {
      tree_large: '#228B22',
      tree_small: '#32CD32',
      village: '#8B4513',
      windmill: '#D2691E',
      oasis: '#00CED1',
      cactus: '#9ACD32',
      temple_ruins: '#A0522D',
      ice_cave: '#E0FFFF',
      rock_formation: '#708090'
    };
    
    this.ctx.fillStyle = structureColors[structure.type] || '#666666';
    this.ctx.fillRect(
      x,
      y,
      structure.width * this.config.tileSize,
      structure.height * this.config.tileSize
    );
    
    // Add structure details
    if (structure.type.includes('tree')) {
      // Tree trunk
      this.ctx.fillStyle = '#8B4513';
      this.ctx.fillRect(x + 12, y + 24, 8, 16);
    }
  }
  
  private renderEntities(entities: Entity[], player: Player): void {
    // Sort entities by Y position for proper depth
    const sortedEntities = [...entities].sort((a, b) => a.y - b.y);
    
    // Render player
    this.renderPlayer(player);
    
    // Render other entities
    for (const entity of sortedEntities) {
      const screenX = entity.x - this.camera.x;
      const screenY = entity.y - this.camera.y;
      
      if (this.isInViewport(screenX, screenY, entity.width, entity.height)) {
        this.renderEntity(entity, screenX, screenY);
      }
    }
  }
  
  private renderPlayer(player: Player): void {
    const screenX = player.position.x - this.camera.x;
    const screenY = player.position.y - this.camera.y;
    
    const sprite = this.entitySprites.get('player');
    
    if (sprite && sprite.complete) {
      this.ctx.drawImage(sprite, screenX - 16, screenY - 24, 32, 48);
    } else {
      // Fallback rendering
      this.ctx.fillStyle = '#4a90e2';
      this.ctx.fillRect(screenX - 8, screenY - 16, 16, 32);
      this.ctx.fillRect(screenX - 4, screenY - 24, 8, 16);
    }
    
    // Render health bar
    this.renderHealthBar(player.stats.health, player.stats.maxHealth, screenX - 16, screenY - 32);
    
    // Render level indicator
    this.ctx.fillStyle = '#FFD700';
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`Lv.${player.level}`, screenX, screenY - 35);
  }
  
  private renderEntity(entity: Entity, x: number, y: number): void {
    let spriteKey = 'villager';
    
    if (entity.type === 'enemy') {
      spriteKey = entity.data.enemyType || 'goblin';
    } else if (entity.type === 'npc') {
      spriteKey = entity.data.npcType || 'villager';
    }
    
    const sprite = this.entitySprites.get(spriteKey);
    
    if (sprite && sprite.complete) {
      this.ctx.drawImage(sprite, x - entity.width/2, y - entity.height, entity.width, entity.height);
    } else {
      // Fallback rendering
      const colors: Record<string, string> = {
        villager: '#8a6b47',
        merchant: '#d4af37',
        guard: '#4a4a4a',
        goblin: '#6b8a3a',
        orc: '#8a4a2d',
        wolf: '#5d4a3a'
      };
      
      this.ctx.fillStyle = colors[spriteKey] || '#888888';
      this.ctx.fillRect(x - entity.width/2, y - entity.height, entity.width, entity.height);
    }
    
    // Render health bar for entities with health
    if (entity.health !== undefined && entity.maxHealth !== undefined) {
      this.renderHealthBar(entity.health, entity.maxHealth, x - entity.width/2, y - entity.height - 8);
    }
    
    // Render interaction indicator for NPCs
    if (entity.type === 'npc') {
      const distance = Math.sqrt(
        Math.pow(entity.x - (this.camera.x + this.config.viewportWidth/2), 2) +
        Math.pow(entity.y - (this.camera.y + this.config.viewportHeight/2), 2)
      );
      
      if (distance < 64) {
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('!', x, y - entity.height - 16);
      }
    }
  }
  
  private renderHealthBar(health: number, maxHealth: number, x: number, y: number): void {
    const barWidth = 32;
    const barHeight = 4;
    const healthPercent = health / maxHealth;
    
    // Background
    this.ctx.fillStyle = '#333333';
    this.ctx.fillRect(x, y, barWidth, barHeight);
    
    // Health
    this.ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : healthPercent > 0.25 ? '#FFC107' : '#F44336';
    this.ctx.fillRect(x, y, barWidth * healthPercent, barHeight);
    
    // Border
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x, y, barWidth, barHeight);
  }
  
  private renderParticles(): void {
    for (const particle of this.particleEffects) {
      this.ctx.save();
      
      const screenX = particle.position.x - this.camera.x;
      const screenY = particle.position.y - this.camera.y;
      
      this.ctx.globalAlpha = particle.alpha;
      this.ctx.fillStyle = particle.color;
      
      if (particle.type === 'fire') {
        this.ctx.fillRect(screenX - particle.size/2, screenY - particle.size/2, particle.size, particle.size);
      } else if (particle.type === 'sparkle') {
        this.ctx.beginPath();
        this.ctx.arc(screenX, screenY, particle.size/2, 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      this.ctx.restore();
    }
  }
  
  private updateParticles(): void {
    for (let i = this.particleEffects.length - 1; i >= 0; i--) {
      const particle = this.particleEffects[i];
      
      // Update position
      particle.position.x += particle.velocity.x;
      particle.position.y += particle.velocity.y;
      
      // Apply gravity
      if (particle.gravity) {
        particle.velocity.y += 0.5;
      }
      
      // Update life
      particle.life -= 16; // Assuming 60 FPS
      particle.alpha = particle.life / particle.maxLife;
      
      // Remove dead particles
      if (particle.life <= 0) {
        this.particleEffects.splice(i, 1);
      }
    }
  }
  
  private renderWeatherEffects(weatherEffects: any): void {
    if (!weatherEffects.particles) return;
    
    const { type, density, speed } = weatherEffects.particles;
    
    // Generate weather particles
    if (Math.random() < density / 1000) {
      const particle: ParticleEffect = {
        id: `weather_${Date.now()}_${Math.random()}`,
        type: type as any,
        position: {
          x: this.camera.x + Math.random() * this.config.viewportWidth,
          y: this.camera.y - 10
        },
        velocity: {
          x: type === 'snow' ? (Math.random() - 0.5) * 20 : 0,
          y: speed / 60
        },
        life: 5000,
        maxLife: 5000,
        size: type === 'rain' ? 2 : 4,
        color: type === 'rain' ? '#87CEEB' : '#FFFFFF',
        alpha: 0.7,
        gravity: false
      };
      
      this.particleEffects.push(particle);
    }
  }
  
  private renderLighting(timeInfo: any): void {
    // Add light sources
    this.lightSources = [];
    
    // Player light source
    const player = this.gameEngine.getPlayer();
    this.lightSources.push({
      x: player.position.x,
      y: player.position.y,
      radius: 100,
      color: '#FFFF88',
      intensity: 0.8
    });
    
    // Render lighting overlay
    if (timeInfo.lightLevel < 0.8) {
      this.ctx.save();
      this.ctx.globalCompositeOperation = 'multiply';
      
      // Create gradient for each light source
      for (const light of this.lightSources) {
        const screenX = light.x - this.camera.x;
        const screenY = light.y - this.camera.y;
        
        const gradient = this.ctx.createRadialGradient(
          screenX, screenY, 0,
          screenX, screenY, light.radius
        );
        
        gradient.addColorStop(0, `rgba(255, 255, 255, ${light.intensity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(
          screenX - light.radius,
          screenY - light.radius,
          light.radius * 2,
          light.radius * 2
        );
      }
      
      this.ctx.restore();
    }
  }
  
  private renderUI(player: Player, weatherEffects: any, timeInfo: any): void {
    // Render minimap
    this.renderMinimap();
    
    // Render player stats
    this.renderPlayerStats(player);
    
    // Render time and weather info
    this.renderTimeWeatherInfo(timeInfo, weatherEffects);
    
    // Render FPS counter
    this.renderFPSCounter();
    
    // Render crosshair
    this.renderCrosshair();
  }
  
  private renderMinimap(): void {
    const minimapSize = 150;
    const minimapX = this.config.viewportWidth - minimapSize - 10;
    const minimapY = 10;
    
    // Background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(minimapX, minimapY, minimapSize, minimapSize);
    
    // Border
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(minimapX, minimapY, minimapSize, minimapSize);
    
    // Player position
    this.ctx.fillStyle = '#4a90e2';
    this.ctx.fillRect(
      minimapX + minimapSize/2 - 2,
      minimapY + minimapSize/2 - 2,
      4, 4
    );
  }
  
  private renderPlayerStats(player: Player): void {
    const x = 10;
    let y = 10;
    
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(x, y, 200, 120);
    
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = '14px Arial';
    this.ctx.textAlign = 'left';
    
    y += 20;
    this.ctx.fillText(`Level: ${player.level}`, x + 10, y);
    
    y += 20;
    this.ctx.fillText(`HP: ${player.stats.health}/${player.stats.maxHealth}`, x + 10, y);
    
    y += 20;
    this.ctx.fillText(`MP: ${player.stats.mana}/${player.stats.maxMana}`, x + 10, y);
    
    y += 20;
    this.ctx.fillText(`Stamina: ${Math.floor(player.stats.stamina)}/${player.stats.maxStamina}`, x + 10, y);
    
    y += 20;
    this.ctx.fillText(`XP: ${player.experience}`, x + 10, y);
  }
  
  private renderTimeWeatherInfo(timeInfo: any, weatherEffects: any): void {
    const x = this.config.viewportWidth / 2 - 100;
    const y = 10;
    
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(x, y, 200, 60);
    
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = '14px Arial';
    this.ctx.textAlign = 'center';
    
    this.ctx.fillText(timeInfo.timeString, x + 100, y + 20);
    this.ctx.fillText(`Weather: ${weatherEffects.weatherString || 'Clear'}`, x + 100, y + 40);
  }
  
  private renderFPSCounter(): void {
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`FPS: ${this.fps}`, this.config.viewportWidth - 10, 20);
  }
  
  private renderCrosshair(): void {
    const centerX = this.config.viewportWidth / 2;
    const centerY = this.config.viewportHeight / 2;
    
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 2;
    
    // Horizontal line
    this.ctx.beginPath();
    this.ctx.moveTo(centerX - 10, centerY);
    this.ctx.lineTo(centerX + 10, centerY);
    this.ctx.stroke();
    
    // Vertical line
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY - 10);
    this.ctx.lineTo(centerX, centerY + 10);
    this.ctx.stroke();
  }
  
  private isInViewport(x: number, y: number, width: number, height: number): boolean {
    return (
      x + width >= 0 &&
      y + height >= 0 &&
      x <= this.config.viewportWidth &&
      y <= this.config.viewportHeight
    );
  }
  
  // Public methods
  public addParticleEffect(effect: ParticleEffect): void {
    this.particleEffects.push(effect);
  }
  
  public shakeCamera(intensity: number, duration: number): void {
    this.camera.shake.intensity = intensity;
    this.camera.shake.duration = duration;
    this.camera.shake.currentTime = duration;
  }
  
  public setZoom(zoom: number): void {
    this.camera.zoom = Math.max(0.5, Math.min(3, zoom));
  }
  
  public getCamera(): Camera {
    return { ...this.camera };
  }
  
  public resize(width: number, height: number): void {
    this.config.viewportWidth = width;
    this.config.viewportHeight = height;
    this.setupCanvas();
  }
}