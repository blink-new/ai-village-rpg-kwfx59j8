import { Location } from '../types/game'

export const gameLocations: Location[] = [
  {
    id: 'village-square',
    name: 'Village of Eldermere',
    type: 'village',
    description: 'A peaceful medieval village nestled in a valley, surrounded by ancient forests and rolling hills.',
    lore: 'Eldermere was founded over 500 years ago by refugees fleeing the Great War. Built around a natural spring said to have healing properties, the village has grown into a thriving community of craftsmen, farmers, and traders. The village is protected by ancient wards placed by the first settlers, but these protections are beginning to weaken.',
    level: 1,
    size: { width: 800, height: 600 },
    background: 'medieval_village',
    music: 'peaceful_village_theme',
    ambientSounds: ['birds_chirping', 'distant_hammering', 'market_chatter', 'wind_through_trees'],
    npcs: ['blacksmith-1', 'merchant-1', 'guard-1', 'elder-1', 'baker-1', 'priest-1', 'alchemist-1', 'innkeeper-1'],
    enemies: [],
    items: ['village_well_water', 'market_supplies', 'notice_board_quests'],
    exits: [
      {
        id: 'to_whispering_woods',
        name: 'Whispering Woods',
        targetLocation: 'whispering-woods',
        position: { x: 50, y: 300 }
      },
      {
        id: 'to_sacred_grove',
        name: 'Sacred Grove',
        targetLocation: 'sacred-grove',
        position: { x: 750, y: 200 }
      },
      {
        id: 'to_northern_road',
        name: 'Northern Trade Road',
        targetLocation: 'northern-road',
        position: { x: 400, y: 50 }
      }
    ],
    weather: ['clear', 'cloudy', 'rainy'],
    discoveryReward: {
      experience: 50,
      gold: 25,
      items: ['village_map']
    }
  },
  {
    id: 'whispering-woods',
    name: 'The Whispering Woods',
    type: 'forest',
    description: 'A dense forest where the trees seem to whisper secrets to those who listen carefully.',
    lore: 'These ancient woods are home to spirits and magical creatures. The trees here are said to be sentient, and travelers often report hearing voices carried on the wind. Many paths wind through the forest, but only those pure of heart can find the hidden groves where the most powerful magic dwells.',
    level: 3,
    size: { width: 1200, height: 800 },
    background: 'mystical_forest',
    music: 'mysterious_forest_theme',
    ambientSounds: ['rustling_leaves', 'owl_hoots', 'distant_howls', 'creaking_branches'],
    npcs: ['forest_hermit', 'dryad_guardian'],
    enemies: ['forest_wolf', 'shadow_sprite', 'corrupted_treant'],
    items: ['healing_herbs', 'moonflower', 'ancient_runes', 'forest_berries'],
    exits: [
      {
        id: 'to_village',
        name: 'Return to Village',
        targetLocation: 'village-square',
        position: { x: 1150, y: 400 }
      },
      {
        id: 'to_shadow_cave',
        name: 'Shadow Cave',
        targetLocation: 'shadow-cave',
        position: { x: 200, y: 100 },
        requirements: { quest: 'missing-hammer' }
      },
      {
        id: 'to_thornbridge',
        name: 'Thornbridge Crossing',
        targetLocation: 'thornbridge',
        position: { x: 600, y: 50 }
      }
    ],
    weather: ['clear', 'foggy', 'rainy'],
    timeRestrictions: ['night'],
    discoveryReward: {
      experience: 100,
      gold: 50,
      items: ['forest_map', 'nature_blessing']
    }
  },
  {
    id: 'shadow-cave',
    name: 'Cave of Shadows',
    type: 'cave',
    description: 'A dark cave system where the Shadow Cult has established a hidden base.',
    lore: 'This cave system extends deep into the mountain, with passages that seem to shift and change when no one is looking. The Shadow Cult chose this place for their rituals because the natural darkness here amplifies their magic. Ancient symbols carved into the walls suggest this place was used for dark purposes long before the current cult arrived.',
    level: 6,
    size: { width: 1000, height: 600 },
    background: 'dark_cave',
    music: 'ominous_cave_theme',
    ambientSounds: ['dripping_water', 'echoing_footsteps', 'distant_chanting', 'bat_wings'],
    npcs: [],
    enemies: ['shadow_cultist', 'cave_bat', 'shadow_wraith', 'cult_assassin'],
    items: ['eternal_hammer', 'shadow_crystals', 'cult_documents', 'dark_artifacts'],
    exits: [
      {
        id: 'to_whispering_woods',
        name: 'Exit to Whispering Woods',
        targetLocation: 'whispering-woods',
        position: { x: 50, y: 300 }
      },
      {
        id: 'to_deeper_caves',
        name: 'Deeper into the Caves',
        targetLocation: 'sunken-cathedral',
        position: { x: 950, y: 300 },
        requirements: { quest: 'ancient-evil' }
      }
    ],
    weather: ['dark'],
    discoveryReward: {
      experience: 200,
      gold: 100,
      items: ['shadow_resistance_potion']
    }
  },
  {
    id: 'sunken-cathedral',
    name: 'The Sunken Cathedral',
    type: 'ruins',
    description: 'A massive underground cathedral where an ancient evil lies imprisoned.',
    lore: 'Built in the Age of Heroes to contain the Ancient Shadow Lord, this cathedral was deliberately sunk beneath the earth to hide it from the world above. The architecture is unlike anything seen in modern times, with soaring arches and intricate stonework that seems to absorb light. The seals that bind the Shadow Lord are carved into every surface, but they grow weaker with each passing year.',
    level: 15,
    size: { width: 1500, height: 1000 },
    background: 'ancient_cathedral',
    music: 'epic_boss_theme',
    ambientSounds: ['ancient_whispers', 'crumbling_stone', 'ethereal_chanting', 'shadow_energy'],
    npcs: ['ancient_spirit_guide'],
    enemies: ['shadow_guardian', 'corrupted_paladin', 'shadow_lord', 'void_spawn'],
    items: ['holy_artifacts', 'ancient_weapons', 'shadow_lord_treasure', 'cathedral_relics'],
    exits: [
      {
        id: 'to_shadow_cave',
        name: 'Return to Cave Entrance',
        targetLocation: 'shadow-cave',
        position: { x: 100, y: 500 }
      }
    ],
    weather: ['dark', 'supernatural'],
    discoveryReward: {
      experience: 1000,
      gold: 500,
      items: ['cathedral_blessing', 'ancient_knowledge']
    }
  },
  {
    id: 'sacred-grove',
    name: 'Sacred Grove of Elderoak',
    type: 'forest',
    description: 'A mystical grove where ancient magic flows freely and nature spirits dwell.',
    lore: 'This grove was planted by the first druids who settled in the region over a millennium ago. Each tree was blessed with protective magic, creating a natural sanctuary where wounded creatures could heal and lost souls could find peace. The great Elderoak at the center is said to be connected to the World Tree itself, the source of all natural magic.',
    level: 8,
    size: { width: 1000, height: 800 },
    background: 'sacred_grove',
    music: 'mystical_nature_theme',
    ambientSounds: ['magical_chimes', 'flowing_water', 'spirit_whispers', 'rustling_leaves'],
    npcs: ['grove_keeper', 'nature_spirit', 'druid_elder'],
    enemies: ['corrupted_spirit', 'blight_beast', 'corruption_wraith'],
    items: ['elderoak_bark', 'sacred_spring_water', 'nature_crystals', 'druid_herbs'],
    exits: [
      {
        id: 'to_village',
        name: 'Return to Village',
        targetLocation: 'village-square',
        position: { x: 50, y: 400 }
      },
      {
        id: 'to_world_tree',
        name: 'Path to World Tree',
        targetLocation: 'world-tree',
        position: { x: 950, y: 400 },
        requirements: { quest: 'cleanse-corruption' }
      }
    ],
    weather: ['clear', 'mystical'],
    discoveryReward: {
      experience: 300,
      gold: 150,
      items: ['grove_blessing', 'nature_affinity']
    }
  },
  {
    id: 'volcanic-peaks',
    name: 'The Volcanic Peaks',
    type: 'cave',
    description: 'A treacherous mountain range dominated by active volcanoes and flowing lava.',
    lore: 'These peaks were formed during the Great Cataclysm that reshaped the world centuries ago. The constant volcanic activity has created a harsh but mineral-rich environment. Dragons are drawn to these peaks by the intense heat and the abundance of precious metals. Pyraxis the Eternal has made his lair in the largest volcano, where he has slumbered for three centuries.',
    level: 20,
    size: { width: 1400, height: 1000 },
    background: 'volcanic_landscape',
    music: 'epic_dragon_theme',
    ambientSounds: ['bubbling_lava', 'rumbling_earth', 'dragon_roars', 'volcanic_wind'],
    npcs: ['dragon_cultist', 'fire_sage'],
    enemies: ['flame_elemental', 'lava_golem', 'fire_drake', 'pyraxis_eternal'],
    items: ['dragon_scales', 'volcanic_glass', 'fire_crystals', 'molten_ore'],
    exits: [
      {
        id: 'to_mountain_path',
        name: 'Mountain Path',
        targetLocation: 'mountain-path',
        position: { x: 100, y: 500 }
      }
    ],
    weather: ['hot', 'volcanic'],
    timeRestrictions: ['day'],
    discoveryReward: {
      experience: 800,
      gold: 400,
      items: ['fire_resistance', 'volcanic_blessing']
    }
  },
  {
    id: 'thornbridge',
    name: 'Thornbridge Crossing',
    type: 'ruins',
    description: 'An ancient stone bridge overgrown with thorny vines, spanning a deep ravine.',
    lore: 'Built by the dwarves in the Second Age, this bridge was once a marvel of engineering. Over the centuries, magical thorns have grown over its surface, making passage treacherous. The thorns are said to be cursed, growing back immediately when cut. Only those with pure intentions can pass safely, while those with evil in their hearts find the thorns turning against them.',
    level: 7,
    size: { width: 800, height: 400 },
    background: 'ancient_bridge',
    music: 'mysterious_crossing_theme',
    ambientSounds: ['wind_through_thorns', 'creaking_stone', 'distant_water', 'rustling_vines'],
    npcs: ['bridge_guardian'],
    enemies: ['thorn_beast', 'vine_strangler', 'bridge_troll'],
    items: ['thornbridge_key', 'ancient_coins', 'bridge_stones'],
    exits: [
      {
        id: 'to_whispering_woods',
        name: 'Whispering Woods',
        targetLocation: 'whispering-woods',
        position: { x: 50, y: 200 }
      },
      {
        id: 'to_seahaven',
        name: 'Road to Seahaven',
        targetLocation: 'seahaven-road',
        position: { x: 750, y: 200 }
      }
    ],
    weather: ['windy', 'cloudy'],
    discoveryReward: {
      experience: 250,
      gold: 125,
      items: ['bridge_blessing']
    }
  },
  {
    id: 'seahaven-road',
    name: 'Road to Seahaven',
    type: 'ruins',
    description: 'A winding road through bandit-infested territory leading to the port city.',
    lore: 'This road was once the main trade route between the inland villages and the coastal cities. However, increased bandit activity has made travel dangerous. The Iron Wolves have set up camps along the route, ambushing merchant caravans and travelers. The road passes through several abandoned settlements, victims of the ongoing bandit raids.',
    level: 9,
    size: { width: 1600, height: 600 },
    background: 'dangerous_road',
    music: 'tense_travel_theme',
    ambientSounds: ['distant_howls', 'rustling_bushes', 'horse_hooves', 'weapon_clashing'],
    npcs: ['merchant_survivor', 'road_patrol'],
    enemies: ['iron_wolf_bandit', 'highway_robber', 'bandit_leader', 'war_hound'],
    items: ['bandit_loot', 'abandoned_supplies', 'road_markers'],
    exits: [
      {
        id: 'to_thornbridge',
        name: 'Return to Thornbridge',
        targetLocation: 'thornbridge',
        position: { x: 50, y: 300 }
      },
      {
        id: 'to_seahaven',
        name: 'Seahaven City',
        targetLocation: 'seahaven-city',
        position: { x: 1550, y: 300 }
      }
    ],
    weather: ['clear', 'stormy', 'foggy'],
    discoveryReward: {
      experience: 350,
      gold: 200,
      items: ['road_map', 'traveler_supplies']
    }
  },
  {
    id: 'seahaven-city',
    name: 'Seahaven Port City',
    type: 'village',
    description: 'A bustling port city where ships from distant lands bring exotic goods and news.',
    lore: 'Seahaven is the largest port on the western coast, serving as a hub for international trade and naval operations. The city is ruled by the Merchant Council, a group of wealthy traders who control the flow of goods and information. The harbor is always busy with ships loading and unloading cargo, while the markets overflow with exotic goods from distant lands.',
    level: 10,
    size: { width: 1200, height: 800 },
    background: 'port_city',
    music: 'bustling_port_theme',
    ambientSounds: ['seagulls', 'ship_bells', 'market_noise', 'ocean_waves'],
    npcs: ['captain_aldric', 'harbor_master', 'exotic_merchant', 'ship_captain'],
    enemies: ['city_thief', 'smuggler', 'corrupt_guard'],
    items: ['exotic_goods', 'ship_supplies', 'port_documents'],
    exits: [
      {
        id: 'to_seahaven_road',
        name: 'Road back to Thornbridge',
        targetLocation: 'seahaven-road',
        position: { x: 50, y: 400 }
      },
      {
        id: 'to_ship_passage',
        name: 'Ship to Distant Lands',
        targetLocation: 'distant-shores',
        position: { x: 600, y: 750 },
        requirements: { gold: 100 }
      }
    ],
    weather: ['clear', 'rainy', 'stormy'],
    discoveryReward: {
      experience: 400,
      gold: 300,
      items: ['port_pass', 'merchant_contacts']
    }
  },
  {
    id: 'temple-whispers',
    name: 'Temple of Whispers',
    type: 'ruins',
    description: 'An ancient temple where the walls themselves seem to speak in forgotten tongues.',
    lore: 'Built by a long-dead civilization, this temple was dedicated to the god of knowledge and secrets. The walls are covered in inscriptions that change when no one is looking, and visitors often report hearing whispers in languages that predate recorded history. The temple contains one of the fragments of the Shattered Prophecy, hidden within its deepest sanctum.',
    level: 12,
    size: { width: 1000, height: 800 },
    background: 'ancient_temple',
    music: 'mysterious_temple_theme',
    ambientSounds: ['ancient_whispers', 'stone_echoes', 'mystical_chanting', 'wind_through_ruins'],
    npcs: ['temple_guardian', 'ancient_oracle'],
    enemies: ['temple_sentinel', 'knowledge_wraith', 'forgotten_guardian'],
    items: ['prophecy_fragment_temple', 'ancient_scrolls', 'temple_treasures'],
    exits: [
      {
        id: 'to_arcanum_library',
        name: 'Path to Arcanum Library',
        targetLocation: 'arcanum-library',
        position: { x: 950, y: 400 }
      }
    ],
    weather: ['mystical', 'ethereal'],
    discoveryReward: {
      experience: 600,
      gold: 350,
      items: ['temple_blessing', 'ancient_wisdom']
    }
  },
  {
    id: 'arcanum-library',
    name: 'Abandoned Library of Arcanum',
    type: 'ruins',
    description: 'A vast library containing the collected knowledge of a fallen magical academy.',
    lore: 'The Academy of Arcanum was once the premier institution for magical learning, but it was abandoned after a catastrophic magical experiment went wrong. The library contains thousands of books, scrolls, and magical texts, but many are protected by dangerous enchantments. Scholars and treasure hunters alike seek the knowledge hidden within its halls.',
    level: 14,
    size: { width: 1300, height: 900 },
    background: 'magical_library',
    music: 'scholarly_mystery_theme',
    ambientSounds: ['turning_pages', 'magical_humming', 'distant_explosions', 'ghostly_reading'],
    npcs: ['librarian_ghost', 'knowledge_seeker'],
    enemies: ['animated_book', 'spell_guardian', 'knowledge_demon'],
    items: ['prophecy_fragment_library', 'spell_scrolls', 'magical_tomes', 'arcane_components'],
    exits: [
      {
        id: 'to_temple_whispers',
        name: 'Return to Temple',
        targetLocation: 'temple-whispers',
        position: { x: 50, y: 450 }
      },
      {
        id: 'to_lich_tower',
        name: 'Tower of the Lich Lord',
        targetLocation: 'lich-tower',
        position: { x: 1250, y: 450 }
      }
    ],
    weather: ['magical', 'unstable'],
    discoveryReward: {
      experience: 700,
      gold: 400,
      items: ['library_pass', 'magical_knowledge']
    }
  },
  {
    id: 'lich-tower',
    name: 'Tower of Lich Lord Malachar',
    type: 'tower',
    description: 'A twisted spire of black stone where the undead Lich Lord conducts his dark experiments.',
    lore: 'Once a brilliant wizard seeking immortality, Malachar transformed himself into a lich to escape death. His tower serves as both fortress and laboratory, where he conducts experiments on life, death, and the nature of the soul. The tower is filled with undead servants and magical traps, and the very air is thick with necromantic energy.',
    level: 18,
    size: { width: 800, height: 1200 },
    background: 'dark_tower',
    music: 'necromantic_theme',
    ambientSounds: ['undead_moaning', 'magical_crackling', 'bone_rattling', 'dark_chanting'],
    npcs: ['lich_lord_malachar'],
    enemies: ['skeleton_warrior', 'zombie_mage', 'death_knight', 'bone_dragon'],
    items: ['prophecy_fragment_lich', 'necromantic_artifacts', 'lich_phylactery', 'undead_tomes'],
    exits: [
      {
        id: 'to_arcanum_library',
        name: 'Return to Library',
        targetLocation: 'arcanum-library',
        position: { x: 400, y: 1150 }
      }
    ],
    weather: ['dark', 'necromantic'],
    discoveryReward: {
      experience: 1000,
      gold: 600,
      items: ['death_resistance', 'necromantic_knowledge']
    }
  },
  {
    id: 'shadow-stronghold',
    name: 'The Shadow Cult Stronghold',
    type: 'castle',
    description: 'A massive fortress hidden in the mountains, serving as the Shadow Cult\'s main base.',
    lore: 'Built in secret over decades, this stronghold serves as the Shadow Cult\'s center of operations. The fortress is carved directly into the mountain, with chambers extending deep underground. Here, the Shadow Master conducts the final preparations for the Eternal Eclipse ritual, surrounded by his most devoted followers and powerful magical defenses.',
    level: 25,
    size: { width: 1800, height: 1200 },
    background: 'shadow_fortress',
    music: 'final_boss_theme',
    ambientSounds: ['dark_rituals', 'shadow_energy', 'cultist_chanting', 'ominous_bells'],
    npcs: ['shadow_master'],
    enemies: ['shadow_high_priest', 'elite_cultist', 'shadow_demon', 'void_knight'],
    items: ['eclipse_artifact', 'shadow_master_regalia', 'cult_treasures', 'void_crystals'],
    exits: [
      {
        id: 'to_mountain_pass',
        name: 'Mountain Pass',
        targetLocation: 'mountain-pass',
        position: { x: 100, y: 600 }
      }
    ],
    weather: ['dark', 'supernatural', 'eclipse'],
    discoveryReward: {
      experience: 2000,
      gold: 1000,
      items: ['shadow_mastery', 'cult_secrets']
    }
  }
]