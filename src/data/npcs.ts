import { NPC } from '../types/game'

export const villageNPCs: NPC[] = [
  {
    id: 'blacksmith-1',
    name: 'Thorin Ironforge',
    title: 'Master Blacksmith',
    role: 'Village Blacksmith & Weaponsmith',
    sprite: '🔨',
    x: 150,
    y: 190,
    level: 25,
    faction: 'village',
    personality: 'Gruff but honorable, takes immense pride in his craft, protective of the village and its people',
    context: [
      'Has been the village blacksmith for over 30 years, learning from his father before him',
      'Master of weapon crafting, armor repair, and metallurgy',
      'Deeply worried about recent monster attacks affecting trade routes and supply lines',
      'Has a daughter named Lyanna who dreams of becoming an adventurer against his wishes',
      'Offers weapon upgrades, repairs, and custom forging to worthy heroes',
      'Knows ancient smithing techniques passed down through generations',
      'Has connections with dwarven smiths in the mountain kingdoms',
      'Lost his left eye in a battle with orcs twenty years ago',
      'Keeps a secret stash of rare metals for special occasions'
    ],
    dialogue: [
      {
        id: 'greeting',
        text: 'Ah, another adventurer seeking my services? My forge burns hot and my hammer strikes true. What brings you to my workshop?',
        responses: [
          { id: 'shop', text: 'I need weapons and armor.', nextNodeId: 'shop_intro' },
          { id: 'quest', text: 'Do you have any work for me?', nextNodeId: 'quest_intro' },
          { id: 'lore', text: 'Tell me about your craft.', nextNodeId: 'craft_lore' },
          { id: 'goodbye', text: 'Just looking around.', nextNodeId: 'farewell' }
        ]
      }
    ],
    quests: ['missing-hammer', 'rare-ore', 'dragon-scale-armor'],
    shop: {
      items: [
        {
          id: 'steel-sword',
          name: 'Masterwork Steel Sword',
          type: 'weapon',
          subtype: 'sword',
          rarity: 'uncommon',
          icon: '⚔️',
          description: 'A finely crafted steel sword with perfect balance.',
          lore: 'Forged with techniques passed down through generations.',
          value: 150,
          weight: 3.0,
          quantity: 1,
          stats: { damage: 22, critChance: 8, durability: 100, maxDurability: 100 }
        }
      ],
      gold: 500,
      refreshTime: 86400000, // 24 hours
      lastRefresh: Date.now()
    },
    isInteracting: false,
    isHostile: false,
    health: 180,
    maxHealth: 180,
    stats: { strength: 20, agility: 8, intelligence: 12, defense: 15 },
    loot: [],
    patrolRoute: [
      { x: 150, y: 190 },
      { x: 160, y: 200 },
      { x: 140, y: 180 }
    ],
    currentPatrolIndex: 0
  },
  {
    id: 'merchant-1',
    name: 'Mira Goldleaf',
    title: 'Traveling Merchant',
    role: 'Exotic Goods Trader & Information Broker',
    sprite: '💰',
    x: 400,
    y: 170,
    level: 15,
    faction: 'merchants',
    personality: 'Cheerful and business-minded, loves to gossip and share news, always looking for profitable opportunities',
    context: [
      'Travels between villages and cities selling exotic goods from distant lands',
      'Has extensive knowledge about other towns, cities, and their current situations',
      'Maintains detailed records of market prices and trade opportunities',
      'Recently arrived from the capital city of Aethermoor with disturbing news',
      'Sells potions, supplies, rare materials, and magical trinkets',
      'Has connections with merchant guilds across the continent',
      'Knows secret trade routes and hidden caches of valuable goods',
      'Survived a bandit attack on the northern road just last week',
      'Carries a magical ledger that never runs out of pages'
    ],
    dialogue: [
      {
        id: 'greeting',
        text: 'Welcome, welcome! Step right up and see the finest goods from across the realm! I have treasures from the far corners of the world!',
        responses: [
          { id: 'shop', text: 'Show me your wares.', nextNodeId: 'shop_intro' },
          { id: 'news', text: 'What news from your travels?', nextNodeId: 'travel_news' },
          { id: 'quest', text: 'Do you need any help?', nextNodeId: 'quest_intro' },
          { id: 'goodbye', text: 'Maybe later.', nextNodeId: 'farewell' }
        ]
      }
    ],
    quests: ['dangerous-delivery', 'lost-caravan', 'rare-spices'],
    shop: {
      items: [
        {
          id: 'health-potion-greater',
          name: 'Greater Health Potion',
          type: 'consumable',
          subtype: 'potion',
          rarity: 'uncommon',
          icon: '🧪',
          description: 'A potent healing elixir that restores significant health.',
          lore: 'Brewed by master alchemists in the capital.',
          value: 75,
          weight: 0.5,
          quantity: 10,
          effects: [{ type: 'heal', value: 100 }]
        }
      ],
      gold: 1000,
      refreshTime: 43200000, // 12 hours
      lastRefresh: Date.now()
    },
    isInteracting: false,
    isHostile: false,
    health: 120,
    maxHealth: 120,
    stats: { strength: 8, agility: 14, intelligence: 18, defense: 10 },
    loot: [
      {
        id: 'gold-coins',
        name: 'Gold Coins',
        type: 'misc',
        subtype: 'currency',
        rarity: 'common',
        icon: '🪙',
        description: 'Shiny gold coins from various kingdoms.',
        lore: 'The universal currency of trade.',
        value: 1,
        weight: 0.01,
        quantity: 50
      }
    ]
  },
  {
    id: 'guard-1',
    name: 'Captain Marcus Steelwind',
    title: 'Captain of the Guard',
    role: 'Village Defense Commander & Law Enforcer',
    sprite: '🛡️',
    x: 310,
    y: 100,
    level: 30,
    faction: 'guards',
    personality: 'Serious and duty-bound, deeply concerned about village safety, respects strength and honor above all',
    context: [
      'Leads the village guard with unwavering dedication to protecting civilians',
      'Has extensive knowledge of recent monster sightings, bandit activities, and regional threats',
      'Maintains detailed maps of dangerous areas and safe travel routes',
      'Actively recruiting capable adventurers to help with escalating problems',
      'Has served as guard captain for 15 years, earning respect through countless battles',
      'Veteran of the Goblin Wars and the Siege of Ironhold',
      'Trains new recruits in combat techniques and tactical warfare',
      'Haunted by the loss of half his unit in a dragon attack five years ago',
      'Keeps a war journal documenting every threat to the village'
    ],
    dialogue: [
      {
        id: 'greeting',
        text: 'Halt! State your business in our village. These are dangerous times, and I must know the intentions of all who enter our gates.',
        responses: [
          { id: 'peaceful', text: 'I come in peace, seeking adventure.', nextNodeId: 'adventurer_welcome' },
          { id: 'quest', text: 'I want to help protect the village.', nextNodeId: 'quest_intro' },
          { id: 'threat', text: 'What threats face the village?', nextNodeId: 'threat_briefing' },
          { id: 'goodbye', text: 'I\'ll be on my way.', nextNodeId: 'farewell' }
        ]
      }
    ],
    quests: ['strange-creatures', 'bandit-patrol', 'missing-guards', 'ancient-evil'],
    isInteracting: false,
    isHostile: false,
    health: 250,
    maxHealth: 250,
    stats: { strength: 22, agility: 12, intelligence: 16, defense: 20 },
    loot: [
      {
        id: 'guard-badge',
        name: 'Captain\'s Badge',
        type: 'misc',
        subtype: 'insignia',
        rarity: 'rare',
        icon: '🏅',
        description: 'A badge of office worn by the guard captain.',
        lore: 'Symbol of authority and responsibility.',
        value: 100,
        weight: 0.2,
        quantity: 1
      }
    ],
    patrolRoute: [
      { x: 310, y: 100 },
      { x: 320, y: 90 },
      { x: 300, y: 110 },
      { x: 310, y: 100 }
    ],
    currentPatrolIndex: 0
  },
  {
    id: 'elder-1',
    name: 'Henrik the Wise',
    title: 'Village Elder',
    role: 'Keeper of Ancient Knowledge & Village Historian',
    sprite: '👴',
    x: 510,
    y: 250,
    level: 50,
    faction: 'village',
    personality: 'Wise and patient, keeper of village history and ancient secrets, speaks in riddles and metaphors',
    context: [
      'Eldest resident of the village with vast knowledge spanning decades',
      'Remembers the old days before the Great Calamity changed the world',
      'Keeper of ancient legends, prophecies, and forgotten lore',
      'Can provide cryptic guidance and wisdom to worthy adventurers',
      'Guardian of village traditions, customs, and sacred rituals',
      'Possesses a library of rare books and ancient scrolls',
      'Once adventured with legendary heroes in his youth',
      'Knows the location of hidden treasures and secret passages',
      'Can sense the presence of ancient magic and dark forces'
    ],
    dialogue: [
      {
        id: 'greeting',
        text: 'Ah, young one... I sense great potential within you. The threads of fate have brought you to my door. What wisdom do you seek?',
        responses: [
          { id: 'wisdom', text: 'I seek your wisdom, Elder.', nextNodeId: 'wisdom_sharing' },
          { id: 'history', text: 'Tell me of the village\'s history.', nextNodeId: 'village_history' },
          { id: 'quest', text: 'Do you have a task for me?', nextNodeId: 'quest_intro' },
          { id: 'goodbye', text: 'Perhaps another time.', nextNodeId: 'farewell' }
        ]
      }
    ],
    quests: ['ancient-treasure', 'lost-prophecy', 'forgotten-ritual', 'elder-memories'],
    isInteracting: false,
    isHostile: false,
    health: 100,
    maxHealth: 100,
    stats: { strength: 6, agility: 4, intelligence: 25, defense: 8 },
    loot: [
      {
        id: 'ancient-tome',
        name: 'Tome of Ancient Wisdom',
        type: 'misc',
        subtype: 'book',
        rarity: 'legendary',
        icon: '📚',
        description: 'A leather-bound tome containing centuries of accumulated knowledge.',
        lore: 'Written by the village elders throughout the ages.',
        value: 500,
        weight: 2.0,
        quantity: 1
      }
    ]
  },
  {
    id: 'baker-1',
    name: 'Rosie Sweetbread',
    title: 'Village Baker',
    role: 'Baker & Community Heart',
    sprite: '🥖',
    x: 250,
    y: 290,
    level: 12,
    faction: 'village',
    personality: 'Warm and motherly, loves to feed people and share gossip, always has the latest village news',
    context: [
      'Runs the village bakery and knows every resident personally',
      'Primary source of village gossip, daily news, and social information',
      'Provides food, comfort, and a listening ear to all travelers',
      'Deeply worried about her son Thomas who left to become an adventurer',
      'Makes the finest bread, pastries, and comfort food in the entire region',
      'Organizes village festivals and community gatherings',
      'Has a network of contacts throughout the village',
      'Remembers everyone\'s favorite treats and dietary needs',
      'Often the first to know about births, deaths, and marriages'
    ],
    dialogue: [
      {
        id: 'greeting',
        text: 'Oh my! Another brave soul passing through our little village! You look hungry, dear. Can I interest you in some fresh bread and local news?',
        responses: [
          { id: 'food', text: 'I could use some food.', nextNodeId: 'food_offer' },
          { id: 'news', text: 'What\'s the latest news?', nextNodeId: 'village_gossip' },
          { id: 'quest', text: 'Do you need any help?', nextNodeId: 'quest_intro' },
          { id: 'goodbye', text: 'Thank you, but I must go.', nextNodeId: 'farewell' }
        ]
      }
    ],
    quests: ['missing-son', 'festival-preparations', 'recipe-ingredients', 'bread-delivery'],
    shop: {
      items: [
        {
          id: 'fresh-bread',
          name: 'Fresh Baked Bread',
          type: 'consumable',
          subtype: 'food',
          rarity: 'common',
          icon: '🍞',
          description: 'Warm, crusty bread that restores health and stamina.',
          lore: 'Baked with love and the finest ingredients.',
          value: 5,
          weight: 0.5,
          quantity: 20,
          effects: [{ type: 'heal', value: 25 }, { type: 'buff', value: 10, stat: 'stamina' }]
        }
      ],
      gold: 200,
      refreshTime: 21600000, // 6 hours
      lastRefresh: Date.now()
    },
    isInteracting: false,
    isHostile: false,
    health: 80,
    maxHealth: 80,
    stats: { strength: 6, agility: 8, intelligence: 14, defense: 5 },
    loot: [
      {
        id: 'recipe-book',
        name: 'Family Recipe Book',
        type: 'misc',
        subtype: 'book',
        rarity: 'uncommon',
        icon: '📖',
        description: 'A collection of treasured family recipes.',
        lore: 'Passed down through generations of bakers.',
        value: 50,
        weight: 1.0,
        quantity: 1
      }
    ]
  },
  {
    id: 'priest-1',
    name: 'Father Benedict',
    title: 'Village Priest',
    role: 'Spiritual Guide & Healer',
    sprite: '⛪',
    x: 600,
    y: 150,
    level: 20,
    faction: 'temple',
    personality: 'Compassionate and wise, devoted to helping others, speaks with quiet authority',
    context: [
      'Serves as the village\'s spiritual leader and primary healer',
      'Maintains the ancient temple and performs sacred rituals',
      'Provides healing services, blessings, and spiritual guidance',
      'Keeper of holy relics and sacred artifacts',
      'Has the power to consecrate weapons and armor',
      'Knows ancient prayers and protective wards',
      'Concerned about growing darkness in the surrounding lands',
      'Can sense the presence of undead and demonic forces',
      'Trains acolytes in the healing arts and divine magic'
    ],
    dialogue: [
      {
        id: 'greeting',
        text: 'Peace be with you, child. The light of the divine shines upon all who seek righteousness. How may I serve you this day?',
        responses: [
          { id: 'healing', text: 'I need healing.', nextNodeId: 'healing_service' },
          { id: 'blessing', text: 'Can you bless my equipment?', nextNodeId: 'blessing_service' },
          { id: 'quest', text: 'Is there evil I can help combat?', nextNodeId: 'quest_intro' },
          { id: 'goodbye', text: 'Blessings upon you, Father.', nextNodeId: 'farewell' }
        ]
      }
    ],
    quests: ['cleanse-corruption', 'recover-relic', 'banish-undead', 'pilgrimage'],
    shop: {
      items: [
        {
          id: 'holy-water',
          name: 'Blessed Holy Water',
          type: 'consumable',
          subtype: 'blessed',
          rarity: 'uncommon',
          icon: '💧',
          description: 'Water blessed with divine power, effective against undead.',
          lore: 'Drawn from the Sacred Spring at dawn.',
          value: 40,
          weight: 0.3,
          quantity: 15,
          effects: [{ type: 'damage_over_time', value: 75, stat: 'vs_undead' }]
        }
      ],
      gold: 300,
      refreshTime: 86400000, // 24 hours
      lastRefresh: Date.now()
    },
    isInteracting: false,
    isHostile: false,
    health: 150,
    maxHealth: 150,
    stats: { strength: 10, agility: 8, intelligence: 20, defense: 12 },
    loot: [
      {
        id: 'holy-symbol',
        name: 'Sacred Symbol of Light',
        type: 'armor',
        subtype: 'amulet',
        rarity: 'rare',
        icon: '✨',
        description: 'A golden symbol that radiates divine energy.',
        lore: 'Blessed by the High Priestess herself.',
        value: 200,
        weight: 0.2,
        quantity: 1,
        effects: [{ type: 'stat_boost', value: 25, stat: 'mana' }]
      }
    ]
  },
  {
    id: 'alchemist-1',
    name: 'Zara Moonwhisper',
    title: 'Master Alchemist',
    role: 'Potion Brewer & Magical Researcher',
    sprite: '🧪',
    x: 450,
    y: 350,
    level: 22,
    faction: 'mages',
    personality: 'Eccentric and brilliant, obsessed with magical research, speaks rapidly about her discoveries',
    context: [
      'Master of alchemical arts and potion brewing',
      'Conducts magical research and experiments',
      'Maintains an extensive laboratory filled with rare ingredients',
      'Can craft custom potions and magical elixirs',
      'Knows the properties of every herb, mineral, and magical component',
      'Studies the effects of magical corruption on living beings',
      'Has connections with other mages and scholars',
      'Occasionally creates dangerous or unpredictable concoctions',
      'Seeks rare ingredients for her most ambitious projects'
    ],
    dialogue: [
      {
        id: 'greeting',
        text: 'Ah! A visitor to my laboratory! Perfect timing - I just finished brewing a fascinating new concoction! Are you here for potions or perhaps to assist with my research?',
        responses: [
          { id: 'potions', text: 'I need potions.', nextNodeId: 'potion_shop' },
          { id: 'research', text: 'Tell me about your research.', nextNodeId: 'research_discussion' },
          { id: 'quest', text: 'Do you need help gathering ingredients?', nextNodeId: 'quest_intro' },
          { id: 'goodbye', text: 'I\'ll return later.', nextNodeId: 'farewell' }
        ]
      }
    ],
    quests: ['rare-ingredients', 'magical-corruption', 'potion-testing', 'ancient-formula'],
    shop: {
      items: [
        {
          id: 'mana-potion-greater',
          name: 'Greater Mana Potion',
          type: 'consumable',
          subtype: 'potion',
          rarity: 'uncommon',
          icon: '🔵',
          description: 'A potent elixir that restores significant magical energy.',
          lore: 'Distilled from rare moonflowers and starlight essence.',
          value: 90,
          weight: 0.5,
          quantity: 8,
          effects: [{ type: 'mana_restore', value: 120 }]
        }
      ],
      gold: 400,
      refreshTime: 43200000, // 12 hours
      lastRefresh: Date.now()
    },
    isInteracting: false,
    isHostile: false,
    health: 110,
    maxHealth: 110,
    stats: { strength: 6, agility: 10, intelligence: 24, defense: 8 },
    loot: [
      {
        id: 'alchemist-kit',
        name: 'Master Alchemist\'s Kit',
        type: 'misc',
        subtype: 'tool',
        rarity: 'rare',
        icon: '⚗️',
        description: 'A complete set of alchemical tools and apparatus.',
        lore: 'Essential equipment for advanced potion brewing.',
        value: 300,
        weight: 5.0,
        quantity: 1
      }
    ]
  },
  {
    id: 'innkeeper-1',
    name: 'Gareth Hearthkeeper',
    title: 'Innkeeper',
    role: 'Inn Owner & Information Hub',
    sprite: '🍺',
    x: 350,
    y: 250,
    level: 18,
    faction: 'village',
    personality: 'Jovial and welcoming, loves to tell stories, knows everyone who passes through',
    context: [
      'Owns and operates the village inn, providing lodging and meals',
      'Serves as an informal information hub for travelers and locals',
      'Knows stories and rumors from across the realm',
      'Provides a safe haven for weary adventurers',
      'Has connections with traveling merchants and wanderers',
      'Maintains detailed records of guests and their stories',
      'Can arrange transportation and guide services',
      'Knows the best routes to other settlements',
      'Often mediates disputes and provides neutral ground for meetings'
    ],
    dialogue: [
      {
        id: 'greeting',
        text: 'Welcome to the Prancing Pony, friend! Pull up a chair by the fire and rest your weary bones. What can I get for you - a room, a meal, or perhaps some local tales?',
        responses: [
          { id: 'room', text: 'I need a room for the night.', nextNodeId: 'lodging_service' },
          { id: 'food', text: 'I\'d like some food and drink.', nextNodeId: 'meal_service' },
          { id: 'stories', text: 'Tell me some stories.', nextNodeId: 'story_time' },
          { id: 'goodbye', text: 'Just passing through.', nextNodeId: 'farewell' }
        ]
      }
    ],
    quests: ['missing-guest', 'supply-run', 'inn-renovation', 'tavern-brawl'],
    shop: {
      items: [
        {
          id: 'hearty-stew',
          name: 'Hearty Beef Stew',
          type: 'consumable',
          subtype: 'food',
          rarity: 'common',
          icon: '🍲',
          description: 'A warming stew that restores health and provides lasting nourishment.',
          lore: 'Made with the finest ingredients and grandmother\'s secret recipe.',
          value: 15,
          weight: 1.0,
          quantity: 12,
          effects: [{ type: 'heal', value: 40 }, { type: 'buff', value: 20, stat: 'health_regen', duration: 300 }]
        }
      ],
      gold: 250,
      refreshTime: 21600000, // 6 hours
      lastRefresh: Date.now()
    },
    isInteracting: false,
    isHostile: false,
    health: 140,
    maxHealth: 140,
    stats: { strength: 12, agility: 10, intelligence: 16, defense: 10 },
    loot: [
      {
        id: 'inn-ledger',
        name: 'Guest Registry',
        type: 'misc',
        subtype: 'book',
        rarity: 'uncommon',
        icon: '📋',
        description: 'A detailed record of all inn guests and their stories.',
        lore: 'Contains valuable information about travelers and events.',
        value: 75,
        weight: 1.5,
        quantity: 1
      }
    ]
  }
]