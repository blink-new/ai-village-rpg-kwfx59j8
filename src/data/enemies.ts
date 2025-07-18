import { Enemy } from '../types/game'

export const enemies: Enemy[] = [
  {
    id: 'shadow_cultist',
    name: 'Shadow Cultist',
    type: 'humanoid',
    sprite: '🥷',
    level: 6,
    health: 85,
    maxHealth: 85,
    mana: 60,
    maxMana: 60,
    stats: {
      strength: 12,
      agility: 16,
      intelligence: 14,
      defense: 8,
      magicDefense: 12
    },
    abilities: [
      {
        id: 'shadow_strike',
        name: 'Shadow Strike',
        type: 'attack',
        damage: 25,
        manaCost: 15,
        cooldown: 3,
        range: 2,
        effects: [{ type: 'debuff', value: -3, stat: 'agility', duration: 10 }],
        description: 'A swift strike from the shadows that reduces enemy agility.'
      },
      {
        id: 'dark_bolt',
        name: 'Dark Bolt',
        type: 'spell',
        damage: 30,
        manaCost: 20,
        cooldown: 4,
        range: 5,
        effects: [{ type: 'damage_over_time', value: 5, duration: 15 }],
        description: 'A bolt of dark energy that causes lingering shadow damage.'
      }
    ],
    loot: [
      { itemId: 'shadow_essence', chance: 0.7, minQuantity: 1, maxQuantity: 3 },
      { itemId: 'cultist_dagger', chance: 0.3, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'dark_crystal', chance: 0.15, minQuantity: 1, maxQuantity: 1 }
    ],
    experience: 120,
    gold: 25,
    behavior: 'aggressive',
    resistances: { physical: 5, magical: 15, fire: 0, ice: 5, poison: 10 },
    weaknesses: ['holy', 'light'],
    description: 'Hooded figures who have given their souls to the Shadow Lord in exchange for dark power.',
    lore: 'Once ordinary people, these cultists have been corrupted by prolonged exposure to shadow magic. Their humanity slowly fades as they become vessels for dark energy.'
  },
  {
    id: 'iron_wolf_bandit',
    name: 'Iron Wolf Bandit',
    type: 'humanoid',
    sprite: '🗡️',
    level: 8,
    health: 110,
    maxHealth: 110,
    mana: 30,
    maxMana: 30,
    stats: {
      strength: 18,
      agility: 14,
      intelligence: 8,
      defense: 12,
      magicDefense: 6
    },
    abilities: [
      {
        id: 'savage_slash',
        name: 'Savage Slash',
        type: 'attack',
        damage: 35,
        manaCost: 0,
        cooldown: 2,
        range: 1,
        effects: [{ type: 'damage_over_time', value: 8, duration: 10 }],
        description: 'A brutal sword attack that causes bleeding.'
      },
      {
        id: 'intimidating_howl',
        name: 'Intimidating Howl',
        type: 'debuff',
        damage: 0,
        manaCost: 15,
        cooldown: 8,
        range: 3,
        effects: [{ type: 'debuff', value: -5, stat: 'strength', duration: 20 }],
        description: 'A fearsome howl that weakens nearby enemies.'
      }
    ],
    loot: [
      { itemId: 'bandit_sword', chance: 0.4, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'leather_armor_scraps', chance: 0.6, minQuantity: 2, maxQuantity: 4 },
      { itemId: 'gold_coins', chance: 0.8, minQuantity: 15, maxQuantity: 35 }
    ],
    experience: 180,
    gold: 40,
    behavior: 'pack',
    resistances: { physical: 8, magical: 2, fire: 0, ice: 0, poison: 5 },
    weaknesses: ['magic', 'fear'],
    description: 'Ruthless bandits who have adopted the wolf as their symbol, hunting in coordinated packs.',
    lore: 'The Iron Wolves were once honorable soldiers who turned to banditry after being abandoned by their commanders. They fight with military precision and pack tactics.'
  },
  {
    id: 'shadow_guardian',
    name: 'Corrupted Shadow Guardian',
    type: 'undead',
    sprite: '👻',
    level: 12,
    health: 200,
    maxHealth: 200,
    mana: 120,
    maxMana: 120,
    stats: {
      strength: 16,
      agility: 12,
      intelligence: 20,
      defense: 15,
      magicDefense: 25
    },
    abilities: [
      {
        id: 'spectral_drain',
        name: 'Spectral Drain',
        type: 'spell',
        damage: 40,
        manaCost: 25,
        cooldown: 5,
        range: 3,
        effects: [{ type: 'heal', value: 20 }],
        description: 'Drains life force from enemies to heal itself.'
      },
      {
        id: 'shadow_bind',
        name: 'Shadow Bind',
        type: 'debuff',
        damage: 15,
        manaCost: 30,
        cooldown: 6,
        range: 4,
        effects: [{ type: 'debuff', value: -10, stat: 'agility', duration: 15 }],
        description: 'Binds enemies with shadowy tendrils, reducing their mobility.'
      },
      {
        id: 'darkness_aura',
        name: 'Aura of Darkness',
        type: 'buff',
        damage: 0,
        manaCost: 40,
        cooldown: 12,
        range: 0,
        effects: [{ type: 'buff', value: 15, stat: 'damage', duration: 30 }],
        description: 'Surrounds itself with darkness, increasing damage output.'
      }
    ],
    loot: [
      { itemId: 'guardian_essence', chance: 0.9, minQuantity: 1, maxQuantity: 2 },
      { itemId: 'spectral_crystal', chance: 0.5, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'ancient_rune', chance: 0.25, minQuantity: 1, maxQuantity: 1 }
    ],
    experience: 350,
    gold: 80,
    behavior: 'territorial',
    resistances: { physical: 20, magical: 30, fire: -10, ice: 15, poison: 40 },
    weaknesses: ['holy', 'fire', 'light'],
    description: 'Ancient guardians corrupted by shadow magic, now serving the darkness they once fought against.',
    lore: 'These were once noble spirits bound to protect sacred places. The shadow corruption has twisted their purpose, turning protectors into destroyers.'
  },
  {
    id: 'shadow_lord',
    name: 'Ancient Shadow Lord',
    type: 'undead',
    sprite: '👑',
    level: 18,
    health: 800,
    maxHealth: 800,
    mana: 400,
    maxMana: 400,
    stats: {
      strength: 25,
      agility: 15,
      intelligence: 30,
      defense: 20,
      magicDefense: 35
    },
    abilities: [
      {
        id: 'shadow_storm',
        name: 'Shadow Storm',
        type: 'spell',
        damage: 80,
        manaCost: 60,
        cooldown: 8,
        range: 6,
        effects: [{ type: 'debuff', value: -8, stat: 'all_stats', duration: 20 }],
        description: 'Unleashes a devastating storm of shadow energy that weakens all who face it.'
      },
      {
        id: 'soul_rend',
        name: 'Soul Rend',
        type: 'spell',
        damage: 120,
        manaCost: 80,
        cooldown: 10,
        range: 4,
        effects: [{ type: 'damage_over_time', value: 25, duration: 30 }],
        description: 'Tears at the very soul of the target, causing immense pain and lingering agony.'
      },
      {
        id: 'summon_shadows',
        name: 'Summon Shadow Minions',
        type: 'conjuration',
        damage: 0,
        manaCost: 100,
        cooldown: 15,
        range: 0,
        effects: [{ type: 'buff', value: 3, stat: 'minion_count' }],
        description: 'Summons shadow minions to fight alongside the Shadow Lord.'
      },
      {
        id: 'dark_regeneration',
        name: 'Dark Regeneration',
        type: 'heal',
        damage: 0,
        manaCost: 50,
        cooldown: 12,
        range: 0,
        effects: [{ type: 'heal', value: 100 }],
        description: 'Channels dark energy to rapidly heal wounds.'
      }
    ],
    loot: [
      { itemId: 'shadow_lord_crown', chance: 1.0, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'essence_of_darkness', chance: 1.0, minQuantity: 3, maxQuantity: 5 },
      { itemId: 'ancient_shadow_tome', chance: 0.8, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'legendary_shadow_weapon', chance: 0.6, minQuantity: 1, maxQuantity: 1 }
    ],
    experience: 2000,
    gold: 500,
    behavior: 'aggressive',
    resistances: { physical: 30, magical: 40, fire: -20, ice: 20, poison: 50 },
    weaknesses: ['holy', 'light', 'divine'],
    description: 'An ancient sorcerer-king transformed into an undying abomination by his lust for power.',
    lore: 'Once the ruler of a mighty kingdom, his obsession with immortality led him to make dark pacts with entities from the Void Realm. Now he exists as a being of pure malevolence, seeking to drag all life into eternal darkness.'
  },
  {
    id: 'flame_elemental',
    name: 'Greater Flame Elemental',
    type: 'elemental',
    sprite: '🔥',
    level: 15,
    health: 300,
    maxHealth: 300,
    mana: 200,
    maxMana: 200,
    stats: {
      strength: 20,
      agility: 18,
      intelligence: 22,
      defense: 12,
      magicDefense: 20
    },
    abilities: [
      {
        id: 'flame_burst',
        name: 'Flame Burst',
        type: 'spell',
        damage: 60,
        manaCost: 30,
        cooldown: 4,
        range: 3,
        effects: [{ type: 'damage_over_time', value: 15, duration: 12 }],
        description: 'Explodes in a burst of flames, burning all nearby enemies.'
      },
      {
        id: 'molten_armor',
        name: 'Molten Armor',
        type: 'buff',
        damage: 0,
        manaCost: 40,
        cooldown: 20,
        range: 0,
        effects: [{ type: 'buff', value: 10, stat: 'defense', duration: 60 }],
        description: 'Surrounds itself with molten rock, increasing defense and burning attackers.'
      },
      {
        id: 'inferno',
        name: 'Inferno',
        type: 'spell',
        damage: 100,
        manaCost: 80,
        cooldown: 12,
        range: 5,
        effects: [{ type: 'damage_over_time', value: 30, duration: 20 }],
        description: 'Creates a massive inferno that engulfs a large area.'
      }
    ],
    loot: [
      { itemId: 'flame_elemental_heart', chance: 1.0, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'molten_core', chance: 0.7, minQuantity: 1, maxQuantity: 2 },
      { itemId: 'fire_crystal', chance: 0.5, minQuantity: 2, maxQuantity: 4 }
    ],
    experience: 800,
    gold: 150,
    behavior: 'territorial',
    resistances: { physical: 10, magical: 15, fire: 100, ice: -50, poison: 80 },
    weaknesses: ['ice', 'water'],
    description: 'A powerful elemental being composed of pure flame and molten rock.',
    lore: 'Flame elementals are born in the heart of volcanoes and embody the raw power of fire itself. They are neither good nor evil, but will defend their territory with devastating force.'
  },
  {
    id: 'pyraxis_eternal',
    name: 'Pyraxis the Eternal',
    type: 'dragon',
    sprite: '🐉',
    level: 25,
    health: 1500,
    maxHealth: 1500,
    mana: 600,
    maxMana: 600,
    stats: {
      strength: 35,
      agility: 20,
      intelligence: 28,
      defense: 30,
      magicDefense: 25
    },
    abilities: [
      {
        id: 'dragon_breath',
        name: 'Infernal Dragon Breath',
        type: 'spell',
        damage: 150,
        manaCost: 80,
        cooldown: 6,
        range: 8,
        effects: [{ type: 'damage_over_time', value: 40, duration: 25 }],
        description: 'Breathes a cone of devastating dragonfire that melts armor and burns flesh.'
      },
      {
        id: 'wing_buffet',
        name: 'Mighty Wing Buffet',
        type: 'attack',
        damage: 80,
        manaCost: 40,
        cooldown: 5,
        range: 4,
        effects: [{ type: 'debuff', value: -15, stat: 'agility', duration: 15 }],
        description: 'Powerful wing beats that knock enemies back and reduce their mobility.'
      },
      {
        id: 'ancient_wisdom',
        name: 'Ancient Wisdom',
        type: 'buff',
        damage: 0,
        manaCost: 60,
        cooldown: 15,
        range: 0,
        effects: [{ type: 'buff', value: 20, stat: 'all_stats', duration: 45 }],
        description: 'Draws upon centuries of knowledge to enhance all abilities.'
      },
      {
        id: 'meteor_strike',
        name: 'Meteor Strike',
        type: 'spell',
        damage: 200,
        manaCost: 120,
        cooldown: 20,
        range: 10,
        effects: [{ type: 'debuff', value: -20, stat: 'defense', duration: 30 }],
        description: 'Calls down a meteor from the heavens to devastate enemies.'
      }
    ],
    loot: [
      { itemId: 'pristine_dragon_scale', chance: 1.0, minQuantity: 8, maxQuantity: 12 },
      { itemId: 'dragon_heart', chance: 1.0, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'ancient_dragon_treasure', chance: 0.9, minQuantity: 1, maxQuantity: 3 },
      { itemId: 'pyraxis_fang', chance: 0.7, minQuantity: 1, maxQuantity: 2 }
    ],
    experience: 5000,
    gold: 2000,
    behavior: 'territorial',
    resistances: { physical: 40, magical: 35, fire: 90, ice: -30, poison: 60 },
    weaknesses: ['ice', 'dragon_slaying_weapons'],
    description: 'An ancient red dragon of immense power and wisdom, one of the last Great Dragons.',
    lore: 'Pyraxis has lived for over three millennia, witnessing the rise and fall of countless civilizations. Unlike younger dragons driven by greed, Pyraxis values honor and wisdom above treasure. Those who prove themselves worthy may earn the dragon\'s respect rather than its wrath.'
  },
  {
    id: 'corrupted_spirit',
    name: 'Corrupted Forest Spirit',
    type: 'undead',
    sprite: '🌲',
    level: 9,
    health: 120,
    maxHealth: 120,
    mana: 80,
    maxMana: 80,
    stats: {
      strength: 14,
      agility: 16,
      intelligence: 18,
      defense: 10,
      magicDefense: 15
    },
    abilities: [
      {
        id: 'thorn_lash',
        name: 'Corrupted Thorn Lash',
        type: 'attack',
        damage: 35,
        manaCost: 20,
        cooldown: 3,
        range: 3,
        effects: [{ type: 'damage_over_time', value: 10, duration: 15 }],
        description: 'Lashes out with corrupted thorns that inject poison.'
      },
      {
        id: 'nature_corruption',
        name: 'Spread Corruption',
        type: 'debuff',
        damage: 20,
        manaCost: 25,
        cooldown: 6,
        range: 4,
        effects: [{ type: 'debuff', value: -5, stat: 'vitality', duration: 30 }],
        description: 'Spreads magical corruption that weakens life force.'
      }
    ],
    loot: [
      { itemId: 'corrupted_bark', chance: 0.8, minQuantity: 1, maxQuantity: 3 },
      { itemId: 'tainted_sap', chance: 0.6, minQuantity: 1, maxQuantity: 2 },
      { itemId: 'spirit_essence', chance: 0.3, minQuantity: 1, maxQuantity: 1 }
    ],
    experience: 200,
    gold: 30,
    behavior: 'territorial',
    resistances: { physical: 15, magical: 20, fire: -10, ice: 5, poison: 50 },
    weaknesses: ['holy', 'purification'],
    description: 'Once-peaceful forest spirits twisted by dark magic into malevolent beings.',
    lore: 'These spirits were the guardians of the Sacred Grove, but the spreading corruption has turned them against the very nature they once protected.'
  },
  {
    id: 'corruption_wraith',
    name: 'Wraith of Corruption',
    type: 'undead',
    sprite: '💀',
    level: 13,
    health: 250,
    maxHealth: 250,
    mana: 150,
    maxMana: 150,
    stats: {
      strength: 18,
      agility: 20,
      intelligence: 24,
      defense: 12,
      magicDefense: 22
    },
    abilities: [
      {
        id: 'corruption_wave',
        name: 'Wave of Corruption',
        type: 'spell',
        damage: 50,
        manaCost: 40,
        cooldown: 5,
        range: 5,
        effects: [{ type: 'debuff', value: -8, stat: 'all_stats', duration: 20 }],
        description: 'Sends out a wave of corrupting energy that weakens all it touches.'
      },
      {
        id: 'life_drain',
        name: 'Life Drain',
        type: 'spell',
        damage: 60,
        manaCost: 35,
        cooldown: 4,
        range: 3,
        effects: [{ type: 'heal', value: 30 }],
        description: 'Drains life force from enemies to sustain itself.'
      },
      {
        id: 'corruption_aura',
        name: 'Aura of Corruption',
        type: 'buff',
        damage: 0,
        manaCost: 50,
        cooldown: 15,
        range: 0,
        effects: [{ type: 'damage_over_time', value: 15, duration: 60 }],
        description: 'Emanates an aura that slowly corrupts all nearby life.'
      }
    ],
    loot: [
      { itemId: 'wraith_essence', chance: 1.0, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'corruption_crystal', chance: 0.7, minQuantity: 1, maxQuantity: 2 },
      { itemId: 'necrotic_dust', chance: 0.5, minQuantity: 2, maxQuantity: 4 }
    ],
    experience: 450,
    gold: 100,
    behavior: 'aggressive',
    resistances: { physical: 25, magical: 30, fire: 0, ice: 10, poison: 60 },
    weaknesses: ['holy', 'light', 'purification'],
    description: 'A powerful wraith born from concentrated corruption, seeking to spread its taint to all living things.',
    lore: 'This wraith was created when the corruption reached critical mass at the desecrated shrine. It embodies all the malevolence and hatred that has accumulated over years of dark rituals.'
  },
  {
    id: 'shadow_high_priest',
    name: 'Shadow Cult High Priest',
    type: 'humanoid',
    sprite: '🧙‍♂️',
    level: 20,
    health: 400,
    maxHealth: 400,
    mana: 300,
    maxMana: 300,
    stats: {
      strength: 15,
      agility: 12,
      intelligence: 28,
      defense: 18,
      magicDefense: 30
    },
    abilities: [
      {
        id: 'shadow_ritual',
        name: 'Ritual of Shadows',
        type: 'spell',
        damage: 80,
        manaCost: 60,
        cooldown: 8,
        range: 6,
        effects: [{ type: 'buff', value: 20, stat: 'damage', duration: 45 }],
        description: 'Performs a dark ritual that enhances shadow magic and damages enemies.'
      },
      {
        id: 'summon_shadows',
        name: 'Summon Shadow Servants',
        type: 'conjuration',
        damage: 0,
        manaCost: 80,
        cooldown: 12,
        range: 0,
        effects: [{ type: 'buff', value: 2, stat: 'minion_count' }],
        description: 'Summons shadow creatures to serve in battle.'
      },
      {
        id: 'dark_healing',
        name: 'Dark Restoration',
        type: 'heal',
        damage: 0,
        manaCost: 50,
        cooldown: 6,
        range: 0,
        effects: [{ type: 'heal', value: 80 }],
        description: 'Channels dark energy to heal wounds at the cost of others\' life force.'
      }
    ],
    loot: [
      { itemId: 'high_priest_staff', chance: 0.8, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'shadow_cult_tome', chance: 0.9, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'dark_ritual_components', chance: 0.7, minQuantity: 3, maxQuantity: 6 }
    ],
    experience: 1200,
    gold: 300,
    behavior: 'aggressive',
    resistances: { physical: 15, magical: 35, fire: 5, ice: 10, poison: 25 },
    weaknesses: ['holy', 'light', 'divine'],
    description: 'A high-ranking member of the Shadow Cult, wielding immense dark magical power.',
    lore: 'These priests have dedicated their lives to serving the Shadow Master, gaining incredible power in exchange for their humanity. They are the architects of the cult\'s grand design.'
  },
  {
    id: 'shadow_master',
    name: 'The Shadow Master',
    type: 'humanoid',
    sprite: '👤',
    level: 30,
    health: 1200,
    maxHealth: 1200,
    mana: 800,
    maxMana: 800,
    stats: {
      strength: 25,
      agility: 22,
      intelligence: 35,
      defense: 25,
      magicDefense: 40
    },
    abilities: [
      {
        id: 'eternal_eclipse',
        name: 'Eternal Eclipse',
        type: 'spell',
        damage: 200,
        manaCost: 150,
        cooldown: 15,
        range: 10,
        effects: [{ type: 'debuff', value: -15, stat: 'all_stats', duration: 60 }],
        description: 'Begins the ritual of eternal darkness, weakening all who oppose the shadows.'
      },
      {
        id: 'shadow_mastery',
        name: 'Mastery of Shadows',
        type: 'buff',
        damage: 0,
        manaCost: 100,
        cooldown: 20,
        range: 0,
        effects: [{ type: 'buff', value: 50, stat: 'all_stats', duration: 90 }],
        description: 'Channels the power of all shadows, greatly enhancing abilities.'
      },
      {
        id: 'void_strike',
        name: 'Void Strike',
        type: 'spell',
        damage: 150,
        manaCost: 80,
        cooldown: 6,
        range: 5,
        effects: [{ type: 'damage_over_time', value: 35, duration: 30 }],
        description: 'Strikes with the power of the void itself, causing reality-tearing damage.'
      }
    ],
    loot: [
      { itemId: 'shadow_master_regalia', chance: 1.0, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'void_crystal', chance: 1.0, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'eclipse_artifact', chance: 0.9, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'master_shadow_tome', chance: 0.8, minQuantity: 1, maxQuantity: 1 }
    ],
    experience: 8000,
    gold: 5000,
    behavior: 'aggressive',
    resistances: { physical: 35, magical: 45, fire: 10, ice: 15, poison: 40 },
    weaknesses: ['holy', 'light', 'divine', 'unity'],
    description: 'The supreme leader of the Shadow Cult, a being of immense dark power who seeks to plunge the world into eternal darkness.',
    lore: 'Once a powerful mage who sought to understand the nature of darkness, the Shadow Master was consumed by the very forces he studied. Now he exists as something beyond mortal comprehension, driven by an insatiable hunger to extinguish all light from the world.'
  }
]