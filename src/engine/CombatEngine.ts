import { PhysicsEngine, PhysicsBody } from './PhysicsEngine';
import { Entity } from '../types/world';

export interface CombatStats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  stamina: number;
  maxStamina: number;
  attack: number;
  defense: number;
  speed: number;
  criticalChance: number;
  criticalDamage: number;
  magicPower: number;
  magicResistance: number;
}

export interface Weapon {
  id: string;
  name: string;
  type: 'sword' | 'bow' | 'staff' | 'dagger' | 'axe' | 'spear';
  damage: number;
  speed: number;
  range: number;
  criticalChance: number;
  specialEffects: string[];
  durability: number;
  maxDurability: number;
}

export interface Spell {
  id: string;
  name: string;
  type: 'offensive' | 'defensive' | 'utility' | 'healing';
  manaCost: number;
  damage?: number;
  healing?: number;
  duration?: number;
  cooldown: number;
  range: number;
  areaOfEffect: number;
  effects: string[];
}

export interface CombatAction {
  type: 'attack' | 'block' | 'dodge' | 'cast' | 'item';
  entityId: string;
  targetId?: string;
  targetX?: number;
  targetY?: number;
  weaponId?: string;
  spellId?: string;
  itemId?: string;
  timestamp: number;
}

export interface DamageResult {
  damage: number;
  isCritical: boolean;
  isBlocked: boolean;
  isDodged: boolean;
  effects: string[];
}

export interface StatusEffect {
  id: string;
  type: string;
  duration: number;
  intensity: number;
  tickDamage?: number;
  statModifiers: Partial<CombatStats>;
}

export class CombatEngine {
  private physicsEngine: PhysicsEngine;
  private combatEntities: Map<string, CombatStats> = new Map();
  private weapons: Map<string, Weapon> = new Map();
  private spells: Map<string, Spell> = new Map();
  private statusEffects: Map<string, StatusEffect[]> = new Map();
  private cooldowns: Map<string, Map<string, number>> = new Map();
  private combatLog: CombatAction[] = [];

  constructor(physicsEngine: PhysicsEngine) {
    this.physicsEngine = physicsEngine;
    this.initializeWeapons();
    this.initializeSpells();
  }

  private initializeWeapons(): void {
    const weapons: Weapon[] = [
      {
        id: 'iron_sword',
        name: 'Iron Sword',
        type: 'sword',
        damage: 25,
        speed: 1.0,
        range: 64,
        criticalChance: 0.1,
        specialEffects: [],
        durability: 100,
        maxDurability: 100
      },
      {
        id: 'elven_bow',
        name: 'Elven Bow',
        type: 'bow',
        damage: 30,
        speed: 0.8,
        range: 200,
        criticalChance: 0.15,
        specialEffects: ['piercing'],
        durability: 80,
        maxDurability: 80
      },
      {
        id: 'fire_staff',
        name: 'Staff of Fire',
        type: 'staff',
        damage: 20,
        speed: 0.6,
        range: 150,
        criticalChance: 0.05,
        specialEffects: ['fire_damage'],
        durability: 60,
        maxDurability: 60
      },
      {
        id: 'shadow_dagger',
        name: 'Shadow Dagger',
        type: 'dagger',
        damage: 18,
        speed: 1.5,
        range: 32,
        criticalChance: 0.25,
        specialEffects: ['poison', 'stealth'],
        durability: 70,
        maxDurability: 70
      }
    ];

    weapons.forEach(weapon => this.weapons.set(weapon.id, weapon));
  }

  private initializeSpells(): void {
    const spells: Spell[] = [
      {
        id: 'fireball',
        name: 'Fireball',
        type: 'offensive',
        manaCost: 20,
        damage: 40,
        cooldown: 2000,
        range: 200,
        areaOfEffect: 32,
        effects: ['fire_damage', 'burn']
      },
      {
        id: 'heal',
        name: 'Heal',
        type: 'healing',
        manaCost: 15,
        healing: 50,
        cooldown: 1000,
        range: 64,
        areaOfEffect: 0,
        effects: ['restore_health']
      },
      {
        id: 'lightning_bolt',
        name: 'Lightning Bolt',
        type: 'offensive',
        manaCost: 25,
        damage: 35,
        cooldown: 1500,
        range: 300,
        areaOfEffect: 0,
        effects: ['shock', 'stun']
      },
      {
        id: 'shield',
        name: 'Magic Shield',
        type: 'defensive',
        manaCost: 30,
        duration: 10000,
        cooldown: 5000,
        range: 0,
        areaOfEffect: 0,
        effects: ['damage_reduction']
      }
    ];

    spells.forEach(spell => this.spells.set(spell.id, spell));
  }

  addCombatEntity(entityId: string, stats: CombatStats): void {
    this.combatEntities.set(entityId, { ...stats });
    this.statusEffects.set(entityId, []);
    this.cooldowns.set(entityId, new Map());
  }

  removeCombatEntity(entityId: string): void {
    this.combatEntities.delete(entityId);
    this.statusEffects.delete(entityId);
    this.cooldowns.delete(entityId);
  }

  // Calculate damage with all modifiers
  private calculateDamage(
    attacker: CombatStats,
    defender: CombatStats,
    weapon: Weapon,
    isCritical: boolean
  ): number {
    let baseDamage = weapon.damage + attacker.attack;
    
    // Apply critical hit
    if (isCritical) {
      baseDamage *= attacker.criticalDamage;
    }
    
    // Apply defense
    const defense = defender.defense;
    const damageReduction = defense / (defense + 100);
    baseDamage *= (1 - damageReduction);
    
    // Random variance (±10%)
    const variance = 0.9 + Math.random() * 0.2;
    baseDamage *= variance;
    
    return Math.max(1, Math.floor(baseDamage));
  }

  // Check if attack hits target
  private checkHit(attacker: CombatStats, defender: CombatStats): {
    hits: boolean;
    isCritical: boolean;
    isBlocked: boolean;
    isDodged: boolean;
  } {
    // Base hit chance is 85%
    let hitChance = 0.85;
    
    // Speed affects hit chance
    hitChance += (attacker.speed - defender.speed) * 0.01;
    
    const hits = Math.random() < hitChance;
    if (!hits) {
      return { hits: false, isCritical: false, isBlocked: false, isDodged: true };
    }
    
    // Check for critical hit
    const isCritical = Math.random() < attacker.criticalChance;
    
    // Check for block (requires stamina)
    const isBlocked = defender.stamina > 10 && Math.random() < 0.2;
    
    return { hits: true, isCritical, isBlocked, isDodged: false };
  }

  // Perform melee attack
  performAttack(attackerId: string, targetId: string, weaponId: string): DamageResult | null {
    const attacker = this.combatEntities.get(attackerId);
    const defender = this.combatEntities.get(targetId);
    const weapon = this.weapons.get(weaponId);
    
    if (!attacker || !defender || !weapon) return null;
    
    // Check cooldown
    const entityCooldowns = this.cooldowns.get(attackerId);
    if (entityCooldowns?.has(weaponId)) {
      const cooldownEnd = entityCooldowns.get(weaponId)!;
      if (Date.now() < cooldownEnd) return null;
    }
    
    // Check stamina
    if (attacker.stamina < 10) return null;
    
    // Check range
    const attackerBody = this.physicsEngine.getBody(attackerId);
    const defenderBody = this.physicsEngine.getBody(targetId);
    if (attackerBody && defenderBody) {
      const distance = Math.sqrt(
        Math.pow(attackerBody.x - defenderBody.x, 2) +
        Math.pow(attackerBody.y - defenderBody.y, 2)
      );
      if (distance > weapon.range) return null;
    }
    
    // Perform hit calculation
    const hitResult = this.checkHit(attacker, defender);
    
    let damage = 0;
    const effects: string[] = [];
    
    if (hitResult.hits && !hitResult.isBlocked && !hitResult.isDodged) {
      damage = this.calculateDamage(attacker, defender, weapon, hitResult.isCritical);
      
      // Apply damage
      defender.health = Math.max(0, defender.health - damage);
      
      // Apply weapon effects
      weapon.specialEffects.forEach(effect => {
        this.applyStatusEffect(targetId, effect, 3000, 1);
        effects.push(effect);
      });
    }
    
    // Consume stamina
    attacker.stamina = Math.max(0, attacker.stamina - 10);
    
    // Set cooldown
    const cooldownDuration = 1000 / weapon.speed;
    entityCooldowns?.set(weaponId, Date.now() + cooldownDuration);
    
    // Reduce weapon durability
    weapon.durability = Math.max(0, weapon.durability - 1);
    
    // Log combat action
    this.combatLog.push({
      type: 'attack',
      entityId: attackerId,
      targetId,
      weaponId,
      timestamp: Date.now()
    });
    
    return {
      damage,
      isCritical: hitResult.isCritical,
      isBlocked: hitResult.isBlocked,
      isDodged: hitResult.isDodged,
      effects
    };
  }

  // Cast spell
  castSpell(casterId: string, spellId: string, targetId?: string, targetX?: number, targetY?: number): boolean {
    const caster = this.combatEntities.get(casterId);
    const spell = this.spells.get(spellId);
    
    if (!caster || !spell) return false;
    
    // Check cooldown
    const entityCooldowns = this.cooldowns.get(casterId);
    if (entityCooldowns?.has(spellId)) {
      const cooldownEnd = entityCooldowns.get(spellId)!;
      if (Date.now() < cooldownEnd) return false;
    }
    
    // Check mana
    if (caster.mana < spell.manaCost) return false;
    
    // Consume mana
    caster.mana = Math.max(0, caster.mana - spell.manaCost);
    
    // Apply spell effects
    if (spell.type === 'offensive' && targetId) {
      const target = this.combatEntities.get(targetId);
      if (target && spell.damage) {
        const damage = spell.damage + caster.magicPower;
        target.health = Math.max(0, target.health - damage);
        
        spell.effects.forEach(effect => {
          this.applyStatusEffect(targetId, effect, spell.duration || 3000, 1);
        });
      }
    } else if (spell.type === 'healing' && targetId) {
      const target = this.combatEntities.get(targetId);
      if (target && spell.healing) {
        const healing = spell.healing + caster.magicPower * 0.5;
        target.health = Math.min(target.maxHealth, target.health + healing);
      }
    } else if (spell.type === 'defensive') {
      spell.effects.forEach(effect => {
        this.applyStatusEffect(casterId, effect, spell.duration || 5000, 1);
      });
    }
    
    // Set cooldown
    entityCooldowns?.set(spellId, Date.now() + spell.cooldown);
    
    // Log combat action
    this.combatLog.push({
      type: 'cast',
      entityId: casterId,
      targetId,
      targetX,
      targetY,
      spellId,
      timestamp: Date.now()
    });
    
    return true;
  }

  // Apply status effect
  private applyStatusEffect(entityId: string, effectType: string, duration: number, intensity: number): void {
    const effects = this.statusEffects.get(entityId);
    if (!effects) return;
    
    const effect: StatusEffect = {
      id: `${effectType}_${Date.now()}`,
      type: effectType,
      duration,
      intensity,
      statModifiers: {}
    };
    
    // Define effect properties
    switch (effectType) {
      case 'burn':
        effect.tickDamage = 5 * intensity;
        break;
      case 'poison':
        effect.tickDamage = 3 * intensity;
        effect.statModifiers.speed = -0.2 * intensity;
        break;
      case 'stun':
        effect.statModifiers.speed = -1;
        break;
      case 'damage_reduction':
        effect.statModifiers.defense = 20 * intensity;
        break;
      case 'fire_damage':
        effect.tickDamage = 2 * intensity;
        break;
    }
    
    effects.push(effect);
  }

  // Update combat system
  update(deltaTime: number): void {
    // Update status effects
    for (const [entityId, effects] of this.statusEffects.entries()) {
      const entity = this.combatEntities.get(entityId);
      if (!entity) continue;
      
      for (let i = effects.length - 1; i >= 0; i--) {
        const effect = effects[i];
        effect.duration -= deltaTime;
        
        // Apply tick damage
        if (effect.tickDamage && Math.random() < 0.1) { // 10% chance per frame
          entity.health = Math.max(0, entity.health - effect.tickDamage);
        }
        
        // Remove expired effects
        if (effect.duration <= 0) {
          effects.splice(i, 1);
        }
      }
    }
    
    // Regenerate stamina and mana
    for (const entity of this.combatEntities.values()) {
      entity.stamina = Math.min(entity.maxStamina, entity.stamina + deltaTime * 0.02);
      entity.mana = Math.min(entity.maxMana, entity.mana + deltaTime * 0.01);
    }
  }

  // Get entity stats with status effect modifiers
  getModifiedStats(entityId: string): CombatStats | null {
    const baseStats = this.combatEntities.get(entityId);
    if (!baseStats) return null;
    
    const modifiedStats = { ...baseStats };
    const effects = this.statusEffects.get(entityId) || [];
    
    // Apply status effect modifiers
    for (const effect of effects) {
      for (const [stat, modifier] of Object.entries(effect.statModifiers)) {
        if (typeof modifier === 'number') {
          (modifiedStats as any)[stat] += modifier;
        }
      }
    }
    
    return modifiedStats;
  }

  // Check if entity is alive
  isAlive(entityId: string): boolean {
    const entity = this.combatEntities.get(entityId);
    return entity ? entity.health > 0 : false;
  }

  // Get combat log
  getCombatLog(): CombatAction[] {
    return [...this.combatLog];
  }

  // Clear old combat log entries
  clearOldCombatLog(): void {
    const cutoff = Date.now() - 30000; // Keep last 30 seconds
    this.combatLog = this.combatLog.filter(action => action.timestamp > cutoff);
  }
}