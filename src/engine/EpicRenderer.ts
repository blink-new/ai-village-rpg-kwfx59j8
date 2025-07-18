import { GameEngine } from './GameEngine';
import { LegendaryWorldGenerator, LegendaryStructure } from './LegendaryWorldGenerator';
import { Entity } from '../types/world';
import { Player } from '../types/game';

export interface ParticleSystem {
  particles: Particle[];
  emitters: ParticleEmitter[];
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
  type: 'fire' | 'ice' | 'magic' | 'blood' | 'smoke' | 'sparkle' | 'lightning' | 'leaf' | 'snow';
  gravity: boolean;
  fade: boolean;
}

export interface ParticleEmitter {
  id: string;
  x: number;
  y: number;
  type: string;
  rate: number;
  lastEmit: number;
  duration: number;
  active: boolean;
}

export interface LightSource {
  id: string;
  x: number;
  y: number;
  radius: number;
  intensity: number;
  color: string;
  flickering: boolean;
  type: 'torch' | 'magic' | 'fire' | 'crystal' | 'sunlight' | 'moonlight';
}

export interface WeatherEffect {
  type: 'rain' | 'snow' | 'storm' | 'fog' | 'aurora';
  intensity: number;
  particles: Particle[];
  overlay: {
    color: string;
    alpha: number;
  };
}

export interface RenderConfig {
  tileSize: number;
  viewportWidth: number;
  viewportHeight: number;
  renderDistance: number;
  enableParticles: boolean;
  enableLighting: boolean;
  enableWeatherEffects: boolean;
  enableShadows: boolean;
  pixelArt: boolean;
  antiAliasing: boolean;
  bloomEffect: boolean;
  screenShake: boolean;
}

export class EpicRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private gameEngine: GameEngine;
  private worldGenerator: LegendaryWorldGenerator;
  private config: RenderConfig;
  
  // Rendering systems
  private particleSystem: ParticleSystem;
  private lightSources: Map<string, LightSource> = new Map();
  private weatherEffect: WeatherEffect | null = null;
  
  // Camera and viewport
  private camera = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    zoom: 1,
    shake: { x: 0, y: 0, intensity: 0, duration: 0 }
  };
  
  // Rendering layers
  private layers = {
    background: document.createElement('canvas'),
    terrain: document.createElement('canvas'),
    structures: document.createElement('canvas'),
    entities: document.createElement('canvas'),
    particles: document.createElement('canvas'),
    lighting: document.createElement('canvas'),
    ui: document.createElement('canvas')
  };
  
  // Animation and effects
  private animations: Map<string, Animation> = new Map();
  private screenEffects: ScreenEffect[] = [];
  
  // Performance tracking
  private frameCount = 0;
  private lastFpsUpdate = 0;
  private fps = 0;
  
  constructor(canvas: HTMLCanvasElement, gameEngine: GameEngine, config: RenderConfig) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.gameEngine = gameEngine;
    this.worldGenerator = new LegendaryWorldGenerator(gameEngine.getWorldState().seed);
    this.config = config;
    
    // Initialize particle system
    this.particleSystem = {
      particles: [],
      emitters: []
    };
    
    // Setup rendering layers
    this.setupLayers();
    
    // Initialize lighting
    this.initializeLighting();
    
    // Setup canvas properties
    this.setupCanvas();
  }
  
  private setupLayers(): void {
    Object.values(this.layers).forEach(layer => {
      layer.width = this.config.viewportWidth;
      layer.height = this.config.viewportHeight;
      const ctx = layer.getContext('2d')!;
      if (this.config.pixelArt) {
        ctx.imageSmoothingEnabled = false;
      }
    });
  }
  
  private setupCanvas(): void {
    if (this.config.pixelArt) {
      this.ctx.imageSmoothingEnabled = false;
    }
    
    // Set up high DPI support
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
  }
  
  private initializeLighting(): void {
    // Add ambient lighting
    this.addLightSource({
      id: 'ambient',
      x: 0,
      y: 0,
      radius: 1000,
      intensity: 0.3,
      color: '#ffffff',
      flickering: false,
      type: 'sunlight'
    });
  }
  
  // Main render function
  render(): void {
    this.updateCamera();
    this.updateParticles();
    this.updateAnimations();
    this.updateScreenEffects();
    
    // Clear main canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render layers in order
    this.renderBackground();
    this.renderTerrain();
    this.renderStructures();
    this.renderEntities();
    
    if (this.config.enableParticles) {
      this.renderParticles();
    }
    
    if (this.config.enableLighting) {
      this.renderLighting();
    }
    
    if (this.config.enableWeatherEffects && this.weatherEffect) {
      this.renderWeatherEffects();
    }
    
    this.renderUI();
    this.renderScreenEffects();
    
    // Composite all layers
    this.compositeLayers();
    
    this.updateFPS();
  }
  
  private updateCamera(): void {
    const player = this.gameEngine.getPlayer();
    
    // Smooth camera following
    this.camera.targetX = player.position.x - this.config.viewportWidth / 2;
    this.camera.targetY = player.position.y - this.config.viewportHeight / 2;
    
    const smoothing = 0.1;
    this.camera.x += (this.camera.targetX - this.camera.x) * smoothing;
    this.camera.y += (this.camera.targetY - this.camera.y) * smoothing;
    
    // Update screen shake
    if (this.camera.shake.duration > 0) {
      this.camera.shake.x = (Math.random() - 0.5) * this.camera.shake.intensity;
      this.camera.shake.y = (Math.random() - 0.5) * this.camera.shake.intensity;
      this.camera.shake.duration -= 16; // Assuming 60 FPS
      
      if (this.camera.shake.duration <= 0) {
        this.camera.shake.x = 0;
        this.camera.shake.y = 0;
      }
    }
  }
  
  private renderBackground(): void {
    const ctx = this.layers.background.getContext('2d')!;
    ctx.clearRect(0, 0, this.config.viewportWidth, this.config.viewportHeight);
    
    // Render sky gradient based on time of day
    const timeInfo = this.gameEngine.getTimeInfo();
    const skyGradient = this.getSkyGradient(timeInfo.dayPhase || 'day');
    
    const gradient = ctx.createLinearGradient(0, 0, 0, this.config.viewportHeight);
    gradient.addColorStop(0, skyGradient.top);
    gradient.addColorStop(1, skyGradient.bottom);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.config.viewportWidth, this.config.viewportHeight);
    
    // Render distant mountains/horizon
    this.renderHorizon(ctx);
  }
  
  private getSkyGradient(dayPhase: string): { top: string; bottom: string } {
    const gradients = {
      dawn: { top: '#ff6b6b', bottom: '#ffd93d' },
      day: { top: '#74b9ff', bottom: '#0984e3' },
      dusk: { top: '#fd79a8', bottom: '#fdcb6e' },
      night: { top: '#2d3436', bottom: '#636e72' }
    };
    
    return gradients[dayPhase as keyof typeof gradients] || gradients.day;
  }
  
  private renderHorizon(ctx: CanvasRenderingContext2D): void {
    const horizonY = this.config.viewportHeight * 0.7;
    
    // Render distant mountains
    ctx.fillStyle = 'rgba(100, 100, 120, 0.3)';
    ctx.beginPath();
    
    for (let x = 0; x < this.config.viewportWidth; x += 20) {
      const height = Math.sin(x * 0.01 + this.camera.x * 0.001) * 50 + 100;
      if (x === 0) {
        ctx.moveTo(x, horizonY - height);
      } else {
        ctx.lineTo(x, horizonY - height);
      }
    }
    
    ctx.lineTo(this.config.viewportWidth, this.config.viewportHeight);
    ctx.lineTo(0, this.config.viewportHeight);
    ctx.closePath();
    ctx.fill();
  }
  
  private renderTerrain(): void {
    const ctx = this.layers.terrain.getContext('2d')!;
    ctx.clearRect(0, 0, this.config.viewportWidth, this.config.viewportHeight);
    
    const startX = Math.floor(this.camera.x / this.config.tileSize) - 1;
    const startY = Math.floor(this.camera.y / this.config.tileSize) - 1;
    const endX = startX + Math.ceil(this.config.viewportWidth / this.config.tileSize) + 2;
    const endY = startY + Math.ceil(this.config.viewportHeight / this.config.tileSize) + 2;
    
    for (let x = startX; x < endX; x++) {
      for (let y = startY; y < endY; y++) {
        const tile = this.worldGenerator.getWorldTile(x, y);
        this.renderTile(ctx, tile, x, y);
      }
    }
  }
  
  private renderTile(ctx: CanvasRenderingContext2D, tile: any, x: number, y: number): void {
    const screenX = x * this.config.tileSize - this.camera.x + this.camera.shake.x;
    const screenY = y * this.config.tileSize - this.camera.y + this.camera.shake.y;
    
    // Get biome color
    const color = this.getBiomeColor(tile.biome, tile.height);
    
    ctx.fillStyle = color;
    ctx.fillRect(screenX, screenY, this.config.tileSize, this.config.tileSize);
    
    // Add height-based shading
    const heightShade = Math.floor((tile.height - 0.5) * 50);
    if (heightShade !== 0) {
      ctx.fillStyle = heightShade > 0 ? 
        `rgba(255, 255, 255, ${Math.abs(heightShade) / 255})` :
        `rgba(0, 0, 0, ${Math.abs(heightShade) / 255})`;
      ctx.fillRect(screenX, screenY, this.config.tileSize, this.config.tileSize);
    }
    
    // Render resources
    if (tile.resource) {
      this.renderResource(ctx, tile.resource, screenX, screenY);
    }
  }
  
  private getBiomeColor(biome: string, height: number): string {
    const colors = {
      ocean: '#0984e3',
      grassland: '#00b894',
      forest: '#00a085',
      desert: '#fdcb6e',
      tundra: '#b2bec3',
      jungle: '#00b894',
      swamp: '#636e72',
      plains: '#55a3ff',
      mountains: '#636e72'
    };
    
    let baseColor = colors[biome as keyof typeof colors] || '#00b894';
    
    // Adjust color based on height
    if (height < 0.2) {
      baseColor = '#0984e3'; // Water
    } else if (height > 0.8) {
      baseColor = '#ddd'; // Snow caps
    }
    
    return baseColor;
  }
  
  private renderResource(ctx: CanvasRenderingContext2D, resource: string, x: number, y: number): void {
    const resourceColors = {
      iron_ore: '#8e8e93',
      gold_ore: '#f39c12',
      diamond: '#74b9ff',
      mithril_ore: '#a29bfe',
      crystal_shard: '#fd79a8',
      rare_wood: '#8b4513',
      stone: '#636e72'
    };
    
    const baseResource = resource.replace(/^(common_|uncommon_|rare_|epic_|legendary_|mythical_)/, '');
    const color = resourceColors[baseResource as keyof typeof resourceColors] || '#f39c12';
    
    // Draw resource indicator
    ctx.fillStyle = color;
    ctx.fillRect(x + 4, y + 4, this.config.tileSize - 8, this.config.tileSize - 8);
    
    // Add rarity glow
    if (resource.includes('legendary') || resource.includes('mythical')) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.fillRect(x + 6, y + 6, this.config.tileSize - 12, this.config.tileSize - 12);
      ctx.shadowBlur = 0;
    }
  }
  
  private renderStructures(): void {
    const ctx = this.layers.structures.getContext('2d')!;
    ctx.clearRect(0, 0, this.config.viewportWidth, this.config.viewportHeight);
    
    const player = this.gameEngine.getPlayer();
    const structures = this.worldGenerator.getStructuresInRegion(
      player.position.x,
      player.position.y,
      this.config.renderDistance * this.config.tileSize
    );
    
    for (const structure of structures) {
      this.renderStructure(ctx, structure);
    }
  }
  
  private renderStructure(ctx: CanvasRenderingContext2D, structure: LegendaryStructure): void {
    const screenX = structure.x - this.camera.x + this.camera.shake.x;
    const screenY = structure.y - this.camera.y + this.camera.shake.y;
    
    // Skip if off-screen
    if (screenX + structure.width < 0 || screenX > this.config.viewportWidth ||
        screenY + structure.height < 0 || screenY > this.config.viewportHeight) {
      return;
    }
    
    const color = this.getStructureColor(structure.type, structure.rarity);
    
    // Render structure base
    ctx.fillStyle = color;
    ctx.fillRect(screenX, screenY, structure.width, structure.height);
    
    // Add rarity effects
    this.renderStructureEffects(ctx, structure, screenX, screenY);
    
    // Render structure details
    this.renderStructureDetails(ctx, structure, screenX, screenY);
  }
  
  private getStructureColor(type: string, rarity: string): string {
    const baseColors = {
      village: '#8b4513',
      pyramid: '#f39c12',
      dragon_lair: '#e74c3c',
      lost_temple: '#9b59b6',
      ice_fortress: '#74b9ff',
      witch_hut: '#2d3436',
      dwarven_mine: '#636e72'
    };
    
    let color = baseColors[type as keyof typeof baseColors] || '#8b4513';
    
    // Modify color based on rarity
    switch (rarity) {
      case 'legendary':
        color = '#f39c12'; // Gold tint
        break;
      case 'mythical':
        color = '#a29bfe'; // Purple tint
        break;
      case 'epic':
        color = '#fd79a8'; // Pink tint
        break;
    }
    
    return color;
  }
  
  private renderStructureEffects(ctx: CanvasRenderingContext2D, structure: LegendaryStructure, x: number, y: number): void {
    if (structure.rarity === 'legendary' || structure.rarity === 'mythical') {
      // Add magical aura
      const time = Date.now() * 0.005;
      const glowIntensity = (Math.sin(time) + 1) * 0.5;
      
      ctx.shadowColor = structure.rarity === 'mythical' ? '#a29bfe' : '#f39c12';
      ctx.shadowBlur = 20 * glowIntensity;
      ctx.strokeStyle = ctx.shadowColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 2, y - 2, structure.width + 4, structure.height + 4);
      ctx.shadowBlur = 0;
      
      // Add floating particles
      if (Math.random() < 0.1) {
        this.addParticle({
          id: `structure_${structure.id}_${Date.now()}`,
          x: x + Math.random() * structure.width,
          y: y + Math.random() * structure.height,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 2,
          life: 2000,
          maxLife: 2000,
          size: 2 + Math.random() * 3,
          color: structure.rarity === 'mythical' ? '#a29bfe' : '#f39c12',
          alpha: 0.8,
          type: 'magic',
          gravity: false,
          fade: true
        });
      }
    }
  }
  
  private renderStructureDetails(ctx: CanvasRenderingContext2D, structure: LegendaryStructure, x: number, y: number): void {
    // Add structure-specific details
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    
    switch (structure.type) {
      case 'pyramid':
        // Draw pyramid shape
        ctx.beginPath();
        ctx.moveTo(x + structure.width / 2, y);
        ctx.lineTo(x + structure.width, y + structure.height);
        ctx.lineTo(x, y + structure.height);
        ctx.closePath();
        ctx.fill();
        break;
        
      case 'dragon_lair':
        // Draw cave entrance
        ctx.beginPath();
        ctx.arc(x + structure.width / 2, y + structure.height / 2, structure.width / 3, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'village':
        // Draw multiple buildings
        const buildingCount = 3;
        const buildingWidth = structure.width / buildingCount;
        for (let i = 0; i < buildingCount; i++) {
          ctx.fillRect(x + i * buildingWidth + 1, y + 2, buildingWidth - 2, structure.height - 4);
        }
        break;
    }
  }
  
  private renderEntities(): void {
    const ctx = this.layers.entities.getContext('2d')!;
    ctx.clearRect(0, 0, this.config.viewportWidth, this.config.viewportHeight);
    
    const entities = this.gameEngine.getEntities();
    const player = this.gameEngine.getPlayer();
    
    // Render player
    this.renderPlayer(ctx, player);
    
    // Render other entities
    for (const entity of entities) {
      this.renderEntity(ctx, entity);
    }
  }
  
  private renderPlayer(ctx: CanvasRenderingContext2D, player: Player): void {
    const screenX = player.position.x - this.camera.x + this.camera.shake.x;
    const screenY = player.position.y - this.camera.y + this.camera.shake.y;
    
    // Player body
    ctx.fillStyle = this.getClassColor(player.class);
    ctx.fillRect(screenX - 16, screenY - 24, 32, 48);
    
    // Player head
    ctx.fillStyle = '#ffdbac';
    ctx.fillRect(screenX - 8, screenY - 32, 16, 16);
    
    // Health bar
    this.renderHealthBar(ctx, screenX, screenY - 40, player.stats.health, player.stats.maxHealth);
    
    // Level indicator
    ctx.fillStyle = '#f39c12';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Lv.${player.level}`, screenX, screenY - 45);
  }
  
  private getClassColor(playerClass: string): string {
    const colors = {
      warrior: '#e74c3c',
      mage: '#9b59b6',
      rogue: '#2d3436',
      archer: '#00b894',
      paladin: '#f39c12',
      necromancer: '#636e72',
      ranger: '#00a085',
      monk: '#fd79a8'
    };
    
    return colors[playerClass as keyof typeof colors] || '#e74c3c';
  }
  
  private renderEntity(ctx: CanvasRenderingContext2D, entity: Entity): void {
    const screenX = entity.x - this.camera.x + this.camera.shake.x;
    const screenY = entity.y - this.camera.y + this.camera.shake.y;
    
    // Skip if off-screen
    if (screenX + entity.width < 0 || screenX > this.config.viewportWidth ||
        screenY + entity.height < 0 || screenY > this.config.viewportHeight) {
      return;
    }
    
    const color = this.getEntityColor(entity.type, entity.data);
    
    ctx.fillStyle = color;
    ctx.fillRect(screenX, screenY, entity.width, entity.height);
    
    // Render health bar for entities with health
    if (entity.health !== undefined && entity.maxHealth !== undefined) {
      this.renderHealthBar(ctx, screenX + entity.width / 2, screenY - 8, entity.health, entity.maxHealth);
    }
    
    // Add entity-specific effects
    this.renderEntityEffects(ctx, entity, screenX, screenY);
  }
  
  private getEntityColor(type: string, data: any): string {
    switch (type) {
      case 'npc':
        return '#74b9ff';
      case 'enemy':
        const enemyColors = {
          goblin: '#00b894',
          orc: '#e74c3c',
          wolf: '#636e72',
          dragon: '#e74c3c',
          troll: '#8b4513'
        };
        return enemyColors[data.enemyType as keyof typeof enemyColors] || '#e74c3c';
      default:
        return '#ddd';
    }
  }
  
  private renderEntityEffects(ctx: CanvasRenderingContext2D, entity: Entity, x: number, y: number): void {
    // Add glowing effect for special entities
    if (entity.type === 'enemy' && entity.data.enemyType === 'dragon') {
      const time = Date.now() * 0.01;
      const glowIntensity = (Math.sin(time) + 1) * 0.5;
      
      ctx.shadowColor = '#e74c3c';
      ctx.shadowBlur = 15 * glowIntensity;
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(x, y, entity.width, entity.height);
      ctx.shadowBlur = 0;
    }
  }
  
  private renderHealthBar(ctx: CanvasRenderingContext2D, x: number, y: number, health: number, maxHealth: number): void {
    const barWidth = 32;
    const barHeight = 4;
    const healthPercent = health / maxHealth;
    
    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(x - barWidth / 2, y, barWidth, barHeight);
    
    // Health
    ctx.fillStyle = healthPercent > 0.5 ? '#00b894' : healthPercent > 0.25 ? '#f39c12' : '#e74c3c';
    ctx.fillRect(x - barWidth / 2, y, barWidth * healthPercent, barHeight);
  }
  
  private renderParticles(): void {
    const ctx = this.layers.particles.getContext('2d')!;
    ctx.clearRect(0, 0, this.config.viewportWidth, this.config.viewportHeight);
    
    for (const particle of this.particleSystem.particles) {
      this.renderParticle(ctx, particle);
    }
  }
  
  private renderParticle(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const screenX = particle.x - this.camera.x + this.camera.shake.x;
    const screenY = particle.y - this.camera.y + this.camera.shake.y;
    
    ctx.save();
    ctx.globalAlpha = particle.alpha;
    
    switch (particle.type) {
      case 'fire':
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, particle.size, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'magic':
        ctx.fillStyle = particle.color;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = particle.size * 2;
        ctx.beginPath();
        ctx.arc(screenX, screenY, particle.size, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'sparkle':
        ctx.fillStyle = particle.color;
        ctx.fillRect(screenX - particle.size / 2, screenY - particle.size / 2, particle.size, particle.size);
        break;
        
      default:
        ctx.fillStyle = particle.color;
        ctx.fillRect(screenX - particle.size / 2, screenY - particle.size / 2, particle.size, particle.size);
    }
    
    ctx.restore();
  }
  
  private renderLighting(): void {
    const ctx = this.layers.lighting.getContext('2d')!;
    ctx.clearRect(0, 0, this.config.viewportWidth, this.config.viewportHeight);
    
    // Create darkness overlay
    const timeInfo = this.gameEngine.getTimeInfo();
    const darkness = this.getDarknessLevel(timeInfo.dayPhase || 'day');
    
    ctx.fillStyle = `rgba(0, 0, 20, ${darkness})`;
    ctx.fillRect(0, 0, this.config.viewportWidth, this.config.viewportHeight);
    
    // Render light sources
    ctx.globalCompositeOperation = 'destination-out';
    
    for (const light of this.lightSources.values()) {
      this.renderLightSource(ctx, light);
    }
    
    ctx.globalCompositeOperation = 'source-over';
  }
  
  private getDarknessLevel(dayPhase: string): number {
    const levels = {
      dawn: 0.3,
      day: 0.0,
      dusk: 0.4,
      night: 0.7
    };
    
    return levels[dayPhase as keyof typeof levels] || 0.0;
  }
  
  private renderLightSource(ctx: CanvasRenderingContext2D, light: LightSource): void {
    const screenX = light.x - this.camera.x + this.camera.shake.x;
    const screenY = light.y - this.camera.y + this.camera.shake.y;
    
    let intensity = light.intensity;
    
    // Add flickering effect
    if (light.flickering) {
      intensity *= 0.8 + Math.random() * 0.4;
    }
    
    const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, light.radius);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${intensity})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(screenX, screenY, light.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  private renderWeatherEffects(): void {
    if (!this.weatherEffect) return;
    
    const ctx = this.ctx;
    
    // Render weather particles
    for (const particle of this.weatherEffect.particles) {
      this.renderParticle(ctx, particle);
    }
    
    // Render weather overlay
    ctx.fillStyle = this.weatherEffect.overlay.color;
    ctx.globalAlpha = this.weatherEffect.overlay.alpha;
    ctx.fillRect(0, 0, this.config.viewportWidth, this.config.viewportHeight);
    ctx.globalAlpha = 1;
  }
  
  private renderUI(): void {
    const ctx = this.layers.ui.getContext('2d')!;
    ctx.clearRect(0, 0, this.config.viewportWidth, this.config.viewportHeight);
    
    // Render minimap
    this.renderMinimap(ctx);
    
    // Render FPS counter
    if (this.config.enableParticles) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.fillText(`FPS: ${this.fps}`, 10, 25);
      ctx.fillText(`Particles: ${this.particleSystem.particles.length}`, 10, 45);
    }
  }
  
  private renderMinimap(ctx: CanvasRenderingContext2D): void {
    const minimapSize = 150;
    const minimapX = this.config.viewportWidth - minimapSize - 10;
    const minimapY = 10;
    
    // Minimap background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(minimapX, minimapY, minimapSize, minimapSize);
    
    // Minimap border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(minimapX, minimapY, minimapSize, minimapSize);
    
    // Render world preview
    const player = this.gameEngine.getPlayer();
    const worldPreview = this.worldGenerator.generateWorldPreview(
      player.position.x,
      player.position.y,
      1000
    );
    
    // Render biomes
    for (const tile of worldPreview.tiles) {
      const mapX = minimapX + ((tile.x - player.position.x + 500) / 1000) * minimapSize;
      const mapY = minimapY + ((tile.y - player.position.y + 500) / 1000) * minimapSize;
      
      if (mapX >= minimapX && mapX < minimapX + minimapSize &&
          mapY >= minimapY && mapY < minimapY + minimapSize) {
        ctx.fillStyle = this.getBiomeColor(tile.biome, tile.height);
        ctx.fillRect(mapX, mapY, 2, 2);
      }
    }
    
    // Render structures
    for (const structure of worldPreview.structures) {
      const mapX = minimapX + ((structure.x - player.position.x + 500) / 1000) * minimapSize;
      const mapY = minimapY + ((structure.y - player.position.y + 500) / 1000) * minimapSize;
      
      if (mapX >= minimapX && mapX < minimapX + minimapSize &&
          mapY >= minimapY && mapY < minimapY + minimapSize) {
        ctx.fillStyle = structure.rarity === 'legendary' || structure.rarity === 'mythical' ? '#f39c12' : '#ffffff';
        ctx.fillRect(mapX - 1, mapY - 1, 3, 3);
      }
    }
    
    // Player position
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(minimapX + minimapSize / 2, minimapY + minimapSize / 2, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  
  private renderScreenEffects(): void {
    for (const effect of this.screenEffects) {
      this.renderScreenEffect(effect);
    }
  }
  
  private renderScreenEffect(effect: ScreenEffect): void {
    switch (effect.type) {
      case 'flash':
        this.ctx.fillStyle = effect.color;
        this.ctx.globalAlpha = effect.intensity;
        this.ctx.fillRect(0, 0, this.config.viewportWidth, this.config.viewportHeight);
        this.ctx.globalAlpha = 1;
        break;
        
      case 'vignette':
        const gradient = this.ctx.createRadialGradient(
          this.config.viewportWidth / 2,
          this.config.viewportHeight / 2,
          0,
          this.config.viewportWidth / 2,
          this.config.viewportHeight / 2,
          Math.max(this.config.viewportWidth, this.config.viewportHeight) / 2
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, `rgba(0, 0, 0, ${effect.intensity})`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.config.viewportWidth, this.config.viewportHeight);
        break;
    }
  }
  
  private compositeLayers(): void {
    // Composite all layers onto main canvas
    this.ctx.drawImage(this.layers.background, 0, 0);
    this.ctx.drawImage(this.layers.terrain, 0, 0);
    this.ctx.drawImage(this.layers.structures, 0, 0);
    this.ctx.drawImage(this.layers.entities, 0, 0);
    
    if (this.config.enableParticles) {
      this.ctx.drawImage(this.layers.particles, 0, 0);
    }
    
    if (this.config.enableLighting) {
      this.ctx.globalCompositeOperation = 'multiply';
      this.ctx.drawImage(this.layers.lighting, 0, 0);
      this.ctx.globalCompositeOperation = 'source-over';
    }
    
    this.ctx.drawImage(this.layers.ui, 0, 0);
  }
  
  // Particle system methods
  addParticle(particle: Particle): void {
    this.particleSystem.particles.push(particle);
  }
  
  private updateParticles(): void {
    const deltaTime = 16; // Assuming 60 FPS
    
    for (let i = this.particleSystem.particles.length - 1; i >= 0; i--) {
      const particle = this.particleSystem.particles[i];
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Apply gravity
      if (particle.gravity) {
        particle.vy += 0.5;
      }
      
      // Update life
      particle.life -= deltaTime;
      
      // Update alpha for fading
      if (particle.fade) {
        particle.alpha = particle.life / particle.maxLife;
      }
      
      // Remove dead particles
      if (particle.life <= 0) {
        this.particleSystem.particles.splice(i, 1);
      }
    }
  }
  
  // Animation system
  private updateAnimations(): void {
    const currentTime = Date.now();
    
    for (const [id, animation] of this.animations.entries()) {
      const progress = (currentTime - animation.startTime) / animation.duration;
      
      if (progress >= 1) {
        // Animation complete
        animation.onComplete?.();
        this.animations.delete(id);
      } else {
        // Update animation
        animation.onUpdate?.(progress);
      }
    }
  }
  
  private updateScreenEffects(): void {
    const deltaTime = 16;
    
    for (let i = this.screenEffects.length - 1; i >= 0; i--) {
      const effect = this.screenEffects[i];
      effect.duration -= deltaTime;
      
      if (effect.duration <= 0) {
        this.screenEffects.splice(i, 1);
      }
    }
  }
  
  private updateFPS(): void {
    this.frameCount++;
    const currentTime = Date.now();
    
    if (currentTime - this.lastFpsUpdate >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsUpdate = currentTime;
    }
  }
  
  // Public API methods
  shakeCamera(intensity: number, duration: number): void {
    this.camera.shake.intensity = intensity;
    this.camera.shake.duration = duration;
  }
  
  addLightSource(light: LightSource): void {
    this.lightSources.set(light.id, light);
  }
  
  removeLightSource(id: string): void {
    this.lightSources.delete(id);
  }
  
  setWeatherEffect(effect: WeatherEffect | null): void {
    this.weatherEffect = effect;
  }
  
  addScreenEffect(effect: ScreenEffect): void {
    this.screenEffects.push(effect);
  }
  
  addAnimation(id: string, animation: Animation): void {
    animation.startTime = Date.now();
    this.animations.set(id, animation);
  }
  
  // Utility methods
  worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    return {
      x: worldX - this.camera.x + this.camera.shake.x,
      y: worldY - this.camera.y + this.camera.shake.y
    };
  }
  
  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: screenX + this.camera.x - this.camera.shake.x,
      y: screenY + this.camera.y - this.camera.shake.y
    };
  }
}

// Supporting interfaces
interface Animation {
  startTime: number;
  duration: number;
  onUpdate?: (progress: number) => void;
  onComplete?: () => void;
}

interface ScreenEffect {
  type: 'flash' | 'vignette' | 'blur';
  intensity: number;
  duration: number;
  color: string;
}