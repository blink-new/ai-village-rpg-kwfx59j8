import { InventoryItem } from '../types/game'

export const gameItems: InventoryItem[] = [
  // Legendary Weapons
  {
    id: 'lightbringer_legendary_weapon',
    name: 'Lightbringer, Sword of Dawn',
    type: 'weapon',
    subtype: 'sword',
    rarity: 'legendary',
    icon: '⚡',
    description: 'A legendary blade that radiates pure light, capable of banishing even the darkest shadows.',
    lore: 'Forged in the First Age by the combined efforts of the greatest smiths and mages, Lightbringer was wielded by the hero who first defeated the Ancient Shadow Lord. The blade contains a fragment of the sun itself, making it the ultimate weapon against darkness.',
    value: 5000,
    weight: 4.0,
    quantity: 1,
    stats: {
      damage: 80,
      magicDamage: 40,
      critChance: 25,
      durability: 200,
      maxDurability: 200
    },
    effects: [
      { type: 'buff', value: 100, stat: 'damage_vs_undead' },
      { type: 'buff', value: 50, stat: 'damage_vs_shadow' },
      { type: 'stat_boost', value: 5, stat: 'faith' }
    ],
    requirements: { level: 25, strength: 20, faith: 15 }
  },
  {
    id: 'shadowbane_weapon',
    name: 'Shadowbane, The Void Cleaver',
    type: 'weapon',
    subtype: 'greatsword',
    rarity: 'legendary',
    icon: '🗡️',
    description: 'A massive two-handed sword that can cut through the fabric of reality itself.',
    lore: 'Created from the crystallized essence of a collapsed star, Shadowbane exists partially in the void between worlds. It can strike enemies that exist in shadow or ethereal form, making it invaluable against supernatural foes.',
    value: 4500,
    weight: 8.0,
    quantity: 1,
    stats: {
      damage: 100,
      critChance: 15,
      durability: 180,
      maxDurability: 180
    },
    effects: [
      { type: 'buff', value: 75, stat: 'damage_vs_ethereal' },
      { type: 'buff', value: 50, stat: 'void_strike' },
      { type: 'stat_boost', value: 3, stat: 'strength' }
    ],
    requirements: { level: 20, strength: 25, intelligence: 12 }
  },
  
  // Dragon Scale Armor Set
  {
    id: 'dragon_scale_armor_set',
    name: 'Complete Dragon Scale Armor',
    type: 'armor',
    subtype: 'heavy',
    rarity: 'legendary',
    icon: '🐲',
    description: 'A complete set of armor crafted from the scales of Pyraxis the Eternal.',
    lore: 'Each scale was personally blessed by the ancient dragon, granting the wearer not just protection but a connection to draconic power. The armor adapts to its wearer, becoming lighter for rogues or more protective for warriors.',
    value: 8000,
    weight: 15.0,
    quantity: 1,
    stats: {
      defense: 50,
      magicDefense: 30,
      durability: 300,
      maxDurability: 300
    },
    effects: [
      { type: 'buff', value: 90, stat: 'fire_resistance' },
      { type: 'buff', value: 50, stat: 'physical_resistance' },
      { type: 'stat_boost', value: 5, stat: 'vitality' },
      { type: 'buff', value: 1, stat: 'dragon_breath' }
    ],
    requirements: { level: 20, strength: 18, endurance: 15 }
  },
  
  // Unique Quest Items
  {
    id: 'eternal_hammer',
    name: 'Hammer of Eternal Flames',
    type: 'weapon',
    subtype: 'hammer',
    rarity: 'artifact',
    icon: '🔨',
    description: 'The legendary smithing hammer passed down through seven generations of master smiths.',
    lore: 'Forged by the dwarven smith-king Durin Ironbeard in the First Age, this hammer can forge weapons capable of slaying dragons and armor that can turn aside the spells of archmages. The flames within never die, burning with the passion of creation itself.',
    value: 10000,
    weight: 6.0,
    quantity: 1,
    stats: {
      damage: 60,
      critChance: 20,
      durability: 500,
      maxDurability: 500
    },
    effects: [
      { type: 'buff', value: 100, stat: 'crafting_quality' },
      { type: 'buff', value: 50, stat: 'fire_damage' },
      { type: 'stat_boost', value: 10, stat: 'crafting' }
    ],
    requirements: { level: 15, strength: 20 }
  },
  
  {
    id: 'codex_eternal_cycles',
    name: 'The Codex of Eternal Cycles',
    type: 'misc',
    subtype: 'book',
    rarity: 'artifact',
    icon: '📜',
    description: 'The complete prophecy that foretells the fate of the realm.',
    lore: 'Written by the Oracle of the First Dawn, this prophecy reveals the cyclical nature of light and darkness, and speaks of a Chosen One who will determine the fate of all existence. The text shifts and changes, revealing different meanings to different readers.',
    value: 15000,
    weight: 3.0,
    quantity: 1,
    effects: [
      { type: 'stat_boost', value: 10, stat: 'intelligence' },
      { type: 'buff', value: 50, stat: 'prophecy_insight' },
      { type: 'buff', value: 25, stat: 'fate_resistance' }
    ]
  },
  
  // Consumables
  {
    id: 'magic_awakening_potion',
    name: 'Potion of Magical Awakening',
    type: 'consumable',
    subtype: 'potion',
    rarity: 'legendary',
    icon: '🧪',
    description: 'A revolutionary potion that temporarily grants magical abilities to non-magical individuals.',
    lore: 'The result of Zara Moonwhisper\'s groundbreaking research, this potion contains ingredients from across the realm and beyond. It represents a potential revolution in the understanding of magic itself.',
    value: 1000,
    weight: 0.5,
    quantity: 1,
    effects: [
      { type: 'buff', value: 100, stat: 'mana', duration: 3600 },
      { type: 'buff', value: 15, stat: 'intelligence', duration: 3600 },
      { type: 'buff', value: 1, stat: 'spell_casting', duration: 3600 }
    ]
  },
  
  {
    id: 'greater_health_potion',
    name: 'Greater Potion of Healing',
    type: 'consumable',
    subtype: 'potion',
    rarity: 'uncommon',
    icon: '❤️',
    description: 'A powerful healing elixir that can mend even grievous wounds.',
    lore: 'Brewed using techniques perfected over centuries, this potion combines rare herbs with alchemical processes to create a healing effect far superior to common remedies.',
    value: 100,
    weight: 0.5,
    quantity: 1,
    effects: [
      { type: 'heal', value: 150 },
      { type: 'buff', value: 20, stat: 'health_regen', duration: 300 }
    ]
  },
  
  {
    id: 'elixir_of_dragon_strength',
    name: 'Elixir of Dragon Strength',
    type: 'consumable',
    subtype: 'elixir',
    rarity: 'rare',
    icon: '💪',
    description: 'An elixir that grants the physical might of a dragon for a limited time.',
    lore: 'Created using dragon blood and ancient alchemical secrets, this elixir temporarily transforms the drinker\'s physical capabilities to superhuman levels.',
    value: 500,
    weight: 0.3,
    quantity: 1,
    effects: [
      { type: 'stat_boost', value: 10, stat: 'strength', duration: 1800 },
      { type: 'stat_boost', value: 5, stat: 'vitality', duration: 1800 },
      { type: 'buff', value: 25, stat: 'physical_damage', duration: 1800 }
    ]
  },
  
  // Crafting Materials
  {
    id: 'pristine_dragon_scale',
    name: 'Pristine Dragon Scale',
    type: 'material',
    subtype: 'scale',
    rarity: 'legendary',
    icon: '🐉',
    description: 'A perfect scale from an ancient dragon, still warm to the touch.',
    lore: 'Dragon scales are among the most valuable crafting materials in existence. Each scale contains a fragment of the dragon\'s power and can be used to create items of incredible potency.',
    value: 1000,
    weight: 0.5,
    quantity: 1
  },
  
  {
    id: 'starfall_crystal',
    name: 'Starfall Crystal',
    type: 'material',
    subtype: 'crystal',
    rarity: 'rare',
    icon: '💎',
    description: 'A crystal formed from solidified starlight, pulsing with cosmic energy.',
    lore: 'These crystals only form when meteors containing stellar essence impact the earth. They are essential components in the most powerful magical items and spells.',
    value: 750,
    weight: 0.2,
    quantity: 1
  },
  
  {
    id: 'moon_tear',
    name: 'Tear of the Moon Goddess',
    type: 'material',
    subtype: 'essence',
    rarity: 'legendary',
    icon: '🌙',
    description: 'A crystallized tear shed by the Moon Goddess during a lunar eclipse.',
    lore: 'Legend says that the Moon Goddess weeps for the suffering of mortals, and her tears, when crystallized during an eclipse, contain the power to heal any wound or curse.',
    value: 2000,
    weight: 0.1,
    quantity: 1
  },
  
  {
    id: 'time_essence',
    name: 'Essence of Time',
    type: 'material',
    subtype: 'essence',
    rarity: 'artifact',
    icon: '⏳',
    description: 'A swirling vortex of temporal energy contained within a crystal matrix.',
    lore: 'Time itself made manifest, this essence can only be found in places where the fabric of reality has been torn. It is said to contain the power to alter the flow of time itself.',
    value: 5000,
    weight: 0.1,
    quantity: 1
  },
  
  // Accessories and Rings
  {
    id: 'ring_of_eternal_wisdom',
    name: 'Ring of Eternal Wisdom',
    type: 'armor',
    subtype: 'ring',
    rarity: 'legendary',
    icon: '💍',
    description: 'A ring that contains the accumulated knowledge of ancient scholars.',
    lore: 'Crafted by the Archmage Valdris before his disappearance, this ring contains fragments of consciousness from the greatest minds in history. The wearer gains access to their collective wisdom.',
    value: 3000,
    weight: 0.1,
    quantity: 1,
    effects: [
      { type: 'stat_boost', value: 8, stat: 'intelligence' },
      { type: 'stat_boost', value: 50, stat: 'mana' },
      { type: 'buff', value: 25, stat: 'experience_gain' }
    ],
    requirements: { level: 15, intelligence: 18 }
  },
  
  {
    id: 'amulet_of_shadow_ward',
    name: 'Amulet of Shadow Ward',
    type: 'armor',
    subtype: 'amulet',
    rarity: 'rare',
    icon: '🛡️',
    description: 'An amulet that provides protection against shadow magic and dark curses.',
    lore: 'Created by the priests of the Temple of Light specifically to combat the Shadow Cult, this amulet has saved countless lives from dark magic.',
    value: 800,
    weight: 0.2,
    quantity: 1,
    effects: [
      { type: 'buff', value: 50, stat: 'shadow_resistance' },
      { type: 'buff', value: 30, stat: 'curse_resistance' },
      { type: 'stat_boost', value: 3, stat: 'faith' }
    ],
    requirements: { level: 10, faith: 12 }
  },
  
  // Tools and Utilities
  {
    id: 'alchemists_masterwork_kit',
    name: 'Alchemist\'s Masterwork Kit',
    type: 'misc',
    subtype: 'tool',
    rarity: 'rare',
    icon: '⚗️',
    description: 'A complete set of the finest alchemical equipment, capable of creating the most complex potions.',
    lore: 'This kit represents the pinnacle of alchemical craftsmanship, containing tools and apparatus that can handle even the most volatile and dangerous ingredients.',
    value: 1500,
    weight: 8.0,
    quantity: 1,
    effects: [
      { type: 'buff', value: 50, stat: 'alchemy_success' },
      { type: 'buff', value: 25, stat: 'potion_potency' },
      { type: 'stat_boost', value: 5, stat: 'alchemy' }
    ]
  },
  
  {
    id: 'thieves_master_tools',
    name: 'Master Thief\'s Toolkit',
    type: 'misc',
    subtype: 'tool',
    rarity: 'rare',
    icon: '🔧',
    description: 'The finest lockpicks and tools available, capable of opening any lock.',
    lore: 'Crafted by the legendary thief known only as "The Phantom," these tools have never failed to open a lock or disarm a trap.',
    value: 1000,
    weight: 1.0,
    quantity: 1,
    effects: [
      { type: 'buff', value: 75, stat: 'lockpicking_success' },
      { type: 'buff', value: 50, stat: 'trap_detection' },
      { type: 'stat_boost', value: 3, stat: 'agility' }
    ]
  },
  
  // Food and Provisions
  {
    id: 'feast_of_heroes',
    name: 'Feast of Heroes',
    type: 'consumable',
    subtype: 'food',
    rarity: 'rare',
    icon: '🍖',
    description: 'A magnificent feast that provides long-lasting benefits to all who partake.',
    lore: 'Prepared using recipes from the royal kitchens and ingredients blessed by nature spirits, this feast can sustain a hero through the most challenging adventures.',
    value: 200,
    weight: 2.0,
    quantity: 1,
    effects: [
      { type: 'heal', value: 100 },
      { type: 'buff', value: 5, stat: 'all_stats', duration: 7200 },
      { type: 'buff', value: 50, stat: 'stamina_regen', duration: 7200 }
    ]
  },
  
  // Spell Scrolls
  {
    id: 'scroll_of_meteor',
    name: 'Scroll of Meteor Strike',
    type: 'consumable',
    subtype: 'scroll',
    rarity: 'rare',
    icon: '📜',
    description: 'A scroll containing the incantation for summoning a meteor from the heavens.',
    lore: 'Written by the Archmage Pyrion during the War of the Burning Skies, this scroll contains one of the most destructive spells ever created.',
    value: 500,
    weight: 0.1,
    quantity: 1,
    effects: [
      { type: 'damage_over_time', value: 200 }
    ]
  },
  
  {
    id: 'scroll_of_time_stop',
    name: 'Scroll of Temporal Stasis',
    type: 'consumable',
    subtype: 'scroll',
    rarity: 'legendary',
    icon: '📜',
    description: 'A scroll that can briefly halt the flow of time itself.',
    lore: 'One of only three such scrolls ever created, this represents the pinnacle of temporal magic. Use with extreme caution, as the consequences of temporal manipulation are unpredictable.',
    value: 2500,
    weight: 0.1,
    quantity: 1,
    effects: [
      { type: 'buff', value: 1, stat: 'time_stop', duration: 10 }
    ]
  },
  
  // Currency and Valuables
  {
    id: 'ancient_gold_coin',
    name: 'Ancient Gold Coin',
    type: 'misc',
    subtype: 'currency',
    rarity: 'uncommon',
    icon: '🪙',
    description: 'A gold coin from a long-dead empire, worth far more than its weight in gold.',
    lore: 'These coins bear the mark of the Eternal Empire, which ruled the known world over a thousand years ago. Collectors and historians pay premium prices for authentic specimens.',
    value: 100,
    weight: 0.01,
    quantity: 1
  },
  
  {
    id: 'gem_of_power',
    name: 'Gem of Concentrated Power',
    type: 'material',
    subtype: 'gem',
    rarity: 'legendary',
    icon: '💎',
    description: 'A gem that pulses with raw magical energy, containing enough power to fuel great spells.',
    lore: 'These gems form naturally in places where powerful magic has been used repeatedly over centuries. They are essential components in the creation of legendary magical items.',
    value: 3000,
    weight: 0.3,
    quantity: 1
  },
  
  // Unique Story Items
  {
    id: 'shadow_lord_crown',
    name: 'Crown of the Shadow Lord',
    type: 'armor',
    subtype: 'helmet',
    rarity: 'artifact',
    icon: '👑',
    description: 'The crown worn by the Ancient Shadow Lord, radiating dark power.',
    lore: 'This crown was forged in the depths of the Void Realm and contains a fragment of the Shadow Lord\'s essence. While incredibly powerful, it slowly corrupts the wearer\'s soul.',
    value: 10000,
    weight: 2.0,
    quantity: 1,
    stats: {
      defense: 25,
      magicDefense: 40,
      durability: 1000,
      maxDurability: 1000
    },
    effects: [
      { type: 'stat_boost', value: 10, stat: 'intelligence' },
      { type: 'buff', value: 100, stat: 'shadow_magic' },
      { type: 'debuff', value: -1, stat: 'alignment', duration: -1 }
    ],
    requirements: { level: 20, intelligence: 20 }
  },
  
  {
    id: 'merchants_favor_token',
    name: 'Token of Merchant\'s Favor',
    type: 'misc',
    subtype: 'token',
    rarity: 'rare',
    icon: '🏅',
    description: 'A token that grants significant discounts with all merchants.',
    lore: 'Awarded to those who have proven themselves trustworthy and valuable to the merchant community, this token opens doors and purses throughout the realm.',
    value: 500,
    weight: 0.1,
    quantity: 1,
    effects: [
      { type: 'buff', value: 25, stat: 'merchant_discount' },
      { type: 'buff', value: 50, stat: 'trade_reputation' }
    ]
  }
]