import { Quest } from '../types/game'

export const availableQuests: Quest[] = [
  {
    id: 'missing-hammer',
    title: 'The Forgemaster\'s Lost Hammer',
    description: 'Thorin Ironforge\'s legendary hammer has vanished from his workshop.',
    longDescription: 'In the dead of night, thieves broke into Thorin Ironforge\'s workshop and made off with his most prized possession - the Hammer of Eternal Flames. This ancient tool, passed down through seven generations of master smiths, is not merely a crafting implement but a relic of immense power. Without it, Thorin cannot forge the weapons needed to defend the village against the growing darkness. The hammer\'s theft was no random act of burglary; it bears the mark of the Shadow Cult, who seek to corrupt its divine flames for their dark rituals.',
    type: 'main',
    giver: 'Thorin Ironforge',
    location: 'Blacksmith Workshop',
    objectives: [
      {
        id: 'investigate-workshop',
        description: 'Investigate the blacksmith workshop for clues',
        type: 'explore',
        target: 'workshop_clues',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'track-thieves',
        description: 'Follow the thieves\' trail to their hideout',
        type: 'explore',
        target: 'shadow_cave',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'defeat-cultists',
        description: 'Defeat the Shadow Cult members (0/8)',
        type: 'kill',
        target: 'shadow_cultist',
        current: 0,
        required: 8,
        completed: false,
        optional: false
      },
      {
        id: 'recover-hammer',
        description: 'Retrieve the Hammer of Eternal Flames',
        type: 'collect',
        target: 'eternal_hammer',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'return-hammer',
        description: 'Return the hammer to Thorin Ironforge',
        type: 'deliver',
        target: 'thorin_ironforge',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      }
    ],
    rewards: [
      { type: 'experience', value: 500, quantity: 1 },
      { type: 'gold', value: 200, quantity: 1 },
      { type: 'item', value: 'blessed_weapon_upgrade', quantity: 1 },
      { type: 'reputation', value: 'village', quantity: 100 }
    ],
    status: 'available',
    difficulty: 'medium',
    level: 5,
    lore: 'The Hammer of Eternal Flames was forged in the First Age by the dwarven smith-king Durin Ironbeard. It is said that whoever wields it can forge weapons capable of slaying dragons and armor that can turn aside the spells of archmages. The Shadow Cult seeks to corrupt its divine flames to create weapons of mass destruction.'
  },
  {
    id: 'dangerous-delivery',
    title: 'The Merchant\'s Perilous Package',
    description: 'Mira Goldleaf needs a package delivered through bandit-infested roads.',
    longDescription: 'Mira Goldleaf has received a contract to deliver a mysterious package to the port city of Seahaven, but the roads have become increasingly dangerous. Bandit gangs, led by the notorious "Iron Wolves," have been attacking merchant caravans with unprecedented coordination and brutality. The package she needs delivered is sealed with magical wards and bears the seal of the Arcane Council - its contents are unknown, but clearly of great importance. The journey will take you through the Whispering Woods, across the Thornbridge, and past the ruins of Oldcastle, each location harboring its own unique dangers.',
    type: 'side',
    giver: 'Mira Goldleaf',
    location: 'Market Square',
    objectives: [
      {
        id: 'accept-package',
        description: 'Accept the sealed package from Mira',
        type: 'collect',
        target: 'sealed_package',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'survive-ambush',
        description: 'Survive the bandit ambush in Whispering Woods',
        type: 'survive',
        target: 'bandit_ambush',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'cross-thornbridge',
        description: 'Navigate the treacherous Thornbridge',
        type: 'explore',
        target: 'thornbridge',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'defeat-iron-wolves',
        description: 'Defeat Iron Wolf bandits (0/12)',
        type: 'kill',
        target: 'iron_wolf_bandit',
        current: 0,
        required: 12,
        completed: false,
        optional: false
      },
      {
        id: 'deliver-package',
        description: 'Deliver the package to Captain Aldric in Seahaven',
        type: 'deliver',
        target: 'captain_aldric',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'optional-investigate',
        description: 'Investigate the package\'s true contents (Optional)',
        type: 'explore',
        target: 'package_mystery',
        current: 0,
        required: 1,
        completed: false,
        optional: true
      }
    ],
    rewards: [
      { type: 'experience', value: 750, quantity: 1 },
      { type: 'gold', value: 300, quantity: 1 },
      { type: 'item', value: 'merchants_favor_token', quantity: 1 },
      { type: 'reputation', value: 'merchants', quantity: 150 }
    ],
    status: 'available',
    difficulty: 'hard',
    level: 8,
    timeLimit: 604800000, // 7 days
    lore: 'The Iron Wolves were once honorable mercenaries who served the crown, but they turned to banditry after being betrayed and abandoned during the War of the Crimson Crown. Their leader, Gareth "Iron Fang" Blackwood, bears a personal grudge against all merchants and nobles.'
  },
  {
    id: 'ancient-evil',
    title: 'The Awakening Darkness',
    description: 'An ancient evil stirs beneath the village, threatening all life.',
    longDescription: 'Deep beneath the village lies the Sunken Cathedral, a massive underground structure that predates the current settlement by millennia. Recent earthquakes have cracked the ancient seals that kept a primordial evil dormant for over a thousand years. Captain Marcus has reported strange phenomena: livestock found drained of blood, villagers experiencing nightmares of a dark presence, and shadows that move independently of their casters. The village\'s protective wards, maintained by generations of priests, are failing. If this ancient evil fully awakens, it will consume not just the village, but spread its corruption across the entire realm.',
    type: 'main',
    giver: 'Captain Marcus',
    location: 'Guard Tower',
    objectives: [
      {
        id: 'investigate-disturbances',
        description: 'Investigate the supernatural disturbances around the village',
        type: 'explore',
        target: 'supernatural_sites',
        current: 0,
        required: 5,
        completed: false,
        optional: false
      },
      {
        id: 'consult-elder',
        description: 'Speak with Elder Henrik about the ancient evil',
        type: 'talk',
        target: 'henrik_wise',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'gather-holy-artifacts',
        description: 'Collect sacred artifacts to strengthen the seals (0/3)',
        type: 'collect',
        target: 'holy_artifact',
        current: 0,
        required: 3,
        completed: false,
        optional: false
      },
      {
        id: 'enter-sunken-cathedral',
        description: 'Descend into the Sunken Cathedral',
        type: 'explore',
        target: 'sunken_cathedral',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'defeat-shadow-guardians',
        description: 'Defeat the corrupted guardians (0/6)',
        type: 'kill',
        target: 'shadow_guardian',
        current: 0,
        required: 6,
        completed: false,
        optional: false
      },
      {
        id: 'confront-ancient-evil',
        description: 'Confront the Ancient Shadow Lord',
        type: 'kill',
        target: 'shadow_lord',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'restore-seals',
        description: 'Restore the ancient seals to imprison the evil',
        type: 'explore',
        target: 'seal_restoration',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      }
    ],
    rewards: [
      { type: 'experience', value: 2000, quantity: 1 },
      { type: 'gold', value: 1000, quantity: 1 },
      { type: 'item', value: 'shadowbane_weapon', quantity: 1 },
      { type: 'item', value: 'ancient_knowledge_tome', quantity: 1 },
      { type: 'reputation', value: 'village', quantity: 500 },
      { type: 'skill_point', value: 'all', quantity: 3 }
    ],
    status: 'available',
    difficulty: 'extreme',
    level: 15,
    prerequisites: ['missing-hammer', 'strange-creatures'],
    followUp: 'shadow-cult-conspiracy',
    lore: 'The Ancient Shadow Lord was once a powerful sorcerer-king who ruled this land in the Age of Darkness. His thirst for immortality led him to make a pact with entities from the Void Realm, transforming him into an undying abomination. The first heroes of the realm sacrificed their lives to seal him away, but the seals weaken with each passing century.'
  },
  {
    id: 'dragon-scale-armor',
    title: 'The Dragon\'s Legacy',
    description: 'Forge legendary armor from the scales of an ancient dragon.',
    longDescription: 'Thorin Ironforge has discovered ancient blueprints for crafting Dragon Scale Armor, a legendary set of protective gear that was once worn by the Dragon Knights of old. However, creating this masterwork requires scales from Pyraxis the Eternal, an ancient red dragon who has slumbered in the Volcanic Peaks for three centuries. The dragon is not merely a beast to be slain - it is an intelligent, ancient being with its own agenda. Some say it can be reasoned with, others claim it must be defeated in combat. The choice of approach will determine not only the success of the quest but also the nature of the armor\'s enchantments.',
    type: 'side',
    giver: 'Thorin Ironforge',
    location: 'Blacksmith Workshop',
    objectives: [
      {
        id: 'study-blueprints',
        description: 'Study the ancient Dragon Knight blueprints',
        type: 'explore',
        target: 'dragon_blueprints',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'gather-materials',
        description: 'Gather rare crafting materials (0/5)',
        type: 'collect',
        target: 'rare_material',
        current: 0,
        required: 5,
        completed: false,
        optional: false
      },
      {
        id: 'journey-volcanic-peaks',
        description: 'Travel to the Volcanic Peaks',
        type: 'explore',
        target: 'volcanic_peaks',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'approach-dragon',
        description: 'Approach Pyraxis the Eternal',
        type: 'talk',
        target: 'pyraxis_eternal',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'dragon-challenge',
        description: 'Complete Pyraxis\'s challenge or defeat the dragon',
        type: 'kill',
        target: 'pyraxis_eternal',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'collect-scales',
        description: 'Collect pristine dragon scales (0/10)',
        type: 'collect',
        target: 'dragon_scale',
        current: 0,
        required: 10,
        completed: false,
        optional: false
      },
      {
        id: 'forge-armor',
        description: 'Return to Thorin and forge the Dragon Scale Armor',
        type: 'craft',
        target: 'dragon_scale_armor',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      }
    ],
    rewards: [
      { type: 'experience', value: 1500, quantity: 1 },
      { type: 'gold', value: 500, quantity: 1 },
      { type: 'item', value: 'dragon_scale_armor_set', quantity: 1 },
      { type: 'reputation', value: 'village', quantity: 300 },
      { type: 'skill_point', value: 'combat', quantity: 2 }
    ],
    status: 'available',
    difficulty: 'extreme',
    level: 20,
    prerequisites: ['missing-hammer'],
    lore: 'Pyraxis the Eternal is one of the last Great Dragons, beings of immense power and wisdom who witnessed the birth of civilizations. Unlike younger dragons driven by greed and destruction, Pyraxis values honor and respects those who prove themselves worthy. The Dragon Knights were an order of warriors who earned their armor through trials set by the dragons themselves.'
  },
  {
    id: 'lost-prophecy',
    title: 'The Shattered Prophecy',
    description: 'Piece together fragments of an ancient prophecy that foretells the realm\'s fate.',
    longDescription: 'Elder Henrik has discovered that an ancient prophecy, known as the Codex of Eternal Cycles, has been deliberately shattered and its fragments scattered across the realm to prevent its fulfillment. This prophecy speaks of a "Chosen One" who will either save the world from an age of darkness or become the catalyst for its destruction. The fragments are hidden in places of power: ancient temples, forgotten libraries, and the lairs of powerful beings. Each fragment reveals part of the prophecy, but also attracts the attention of those who would see it remain hidden forever.',
    type: 'main',
    giver: 'Henrik the Wise',
    location: 'Elder\'s House',
    objectives: [
      {
        id: 'learn-prophecy-history',
        description: 'Learn the history of the Shattered Prophecy',
        type: 'talk',
        target: 'henrik_wise',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'temple-fragment',
        description: 'Retrieve the fragment from the Temple of Whispers',
        type: 'collect',
        target: 'prophecy_fragment_temple',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'library-fragment',
        description: 'Find the fragment in the Abandoned Library of Arcanum',
        type: 'collect',
        target: 'prophecy_fragment_library',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'lich-fragment',
        description: 'Claim the fragment from the Lich Lord Malachar',
        type: 'collect',
        target: 'prophecy_fragment_lich',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'defeat-prophecy-guardians',
        description: 'Defeat the Guardians of Silence (0/4)',
        type: 'kill',
        target: 'silence_guardian',
        current: 0,
        required: 4,
        completed: false,
        optional: false
      },
      {
        id: 'assemble-prophecy',
        description: 'Assemble the complete prophecy',
        type: 'craft',
        target: 'complete_prophecy',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'interpret-prophecy',
        description: 'Work with Henrik to interpret the prophecy\'s meaning',
        type: 'talk',
        target: 'henrik_wise',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      }
    ],
    rewards: [
      { type: 'experience', value: 1800, quantity: 1 },
      { type: 'gold', value: 750, quantity: 1 },
      { type: 'item', value: 'prophets_insight', quantity: 1 },
      { type: 'item', value: 'codex_eternal_cycles', quantity: 1 },
      { type: 'skill_point', value: 'magic', quantity: 3 }
    ],
    status: 'available',
    difficulty: 'hard',
    level: 12,
    followUp: 'chosen-one-destiny',
    lore: 'The Codex of Eternal Cycles was written by the Oracle of the First Dawn, a being of immense prophetic power who could see across all possible timelines. The prophecy was shattered by the Council of Shadows, who feared that its fulfillment would end their reign of influence over the realm\'s destiny.'
  },
  {
    id: 'cleanse-corruption',
    title: 'The Spreading Corruption',
    description: 'Cleanse the magical corruption that threatens to consume the sacred grove.',
    longDescription: 'The Sacred Grove of Elderoak, a place of natural power that has protected the village for centuries, is being consumed by a creeping magical corruption. The ancient trees are withering, the healing springs have turned black, and the forest spirits have fled or been twisted into malevolent shadows. Father Benedict believes this corruption stems from a desecrated shrine deep within the grove, where dark rituals have been performed. The corruption spreads daily, and if not stopped, it will reach the village within a fortnight, turning the land itself into a wasteland of shadow and death.',
    type: 'side',
    giver: 'Father Benedict',
    location: 'Village Temple',
    objectives: [
      {
        id: 'investigate-grove',
        description: 'Investigate the corruption in the Sacred Grove',
        type: 'explore',
        target: 'sacred_grove',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'gather-holy-water',
        description: 'Gather blessed water from the Temple\'s sacred spring',
        type: 'collect',
        target: 'blessed_water',
        current: 0,
        required: 5,
        completed: false,
        optional: false
      },
      {
        id: 'defeat-corrupted-spirits',
        description: 'Defeat the corrupted forest spirits (0/10)',
        type: 'kill',
        target: 'corrupted_spirit',
        current: 0,
        required: 10,
        completed: false,
        optional: false
      },
      {
        id: 'find-desecrated-shrine',
        description: 'Locate the desecrated shrine at the grove\'s heart',
        type: 'explore',
        target: 'desecrated_shrine',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'banish-corruption-source',
        description: 'Banish the Corruption Wraith',
        type: 'kill',
        target: 'corruption_wraith',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'purify-shrine',
        description: 'Purify the desecrated shrine with holy rituals',
        type: 'explore',
        target: 'shrine_purification',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'restore-grove',
        description: 'Help the grove spirits restore the natural balance',
        type: 'talk',
        target: 'grove_spirit',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      }
    ],
    rewards: [
      { type: 'experience', value: 1200, quantity: 1 },
      { type: 'gold', value: 400, quantity: 1 },
      { type: 'item', value: 'natures_blessing', quantity: 1 },
      { type: 'item', value: 'purified_grove_essence', quantity: 3 },
      { type: 'reputation', value: 'temple', quantity: 200 }
    ],
    status: 'available',
    difficulty: 'medium',
    level: 10,
    lore: 'The Sacred Grove of Elderoak was planted by the first druids who settled this land over a millennium ago. Each tree was blessed with protective magic, creating a natural barrier against dark forces. The corruption appears to be the work of the Blight Cult, necromancers who seek to turn all living things into undead servants.'
  },
  {
    id: 'rare-ingredients',
    title: 'The Alchemist\'s Grand Experiment',
    description: 'Help Zara Moonwhisper gather rare ingredients for a revolutionary potion.',
    longDescription: 'Zara Moonwhisper has been working on a revolutionary alchemical formula that could change the nature of magic itself - a potion that temporarily grants non-magical individuals the ability to cast spells. However, the ingredients required are extraordinarily rare and dangerous to obtain: Starfall Crystals that only appear during meteor showers, the Heart of a Flame Elemental, Tears of the Moon Goddess collected during a lunar eclipse, and the Essence of Time itself, found only in temporal anomalies. Each ingredient presents its own unique challenges and dangers, and some can only be obtained during specific celestial events.',
    type: 'side',
    giver: 'Zara Moonwhisper',
    location: 'Alchemist Laboratory',
    objectives: [
      {
        id: 'learn-formula',
        description: 'Study Zara\'s revolutionary alchemical formula',
        type: 'talk',
        target: 'zara_moonwhisper',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'collect-starfall-crystals',
        description: 'Collect Starfall Crystals during the meteor shower (0/3)',
        type: 'collect',
        target: 'starfall_crystal',
        current: 0,
        required: 3,
        completed: false,
        optional: false
      },
      {
        id: 'defeat-flame-elemental',
        description: 'Defeat the Flame Elemental and extract its heart',
        type: 'kill',
        target: 'flame_elemental',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'collect-moon-tears',
        description: 'Collect Tears of the Moon Goddess during lunar eclipse (0/5)',
        type: 'collect',
        target: 'moon_tear',
        current: 0,
        required: 5,
        completed: false,
        optional: false
      },
      {
        id: 'find-temporal-anomaly',
        description: 'Locate and investigate a temporal anomaly',
        type: 'explore',
        target: 'temporal_anomaly',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'extract-time-essence',
        description: 'Extract the Essence of Time from the anomaly',
        type: 'collect',
        target: 'time_essence',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'brew-potion',
        description: 'Help Zara brew the revolutionary potion',
        type: 'craft',
        target: 'magic_awakening_potion',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'test-potion',
        description: 'Volunteer to test the completed potion (Optional)',
        type: 'explore',
        target: 'potion_testing',
        current: 0,
        required: 1,
        completed: false,
        optional: true
      }
    ],
    rewards: [
      { type: 'experience', value: 1000, quantity: 1 },
      { type: 'gold', value: 600, quantity: 1 },
      { type: 'item', value: 'magic_awakening_potion', quantity: 2 },
      { type: 'item', value: 'alchemists_masterwork_kit', quantity: 1 },
      { type: 'reputation', value: 'mages', quantity: 250 },
      { type: 'skill_point', value: 'survival', quantity: 2 }
    ],
    status: 'available',
    difficulty: 'hard',
    level: 14,
    timeLimit: 1209600000, // 14 days (for celestial events)
    lore: 'Zara\'s research is based on ancient texts that describe a time when magic was not limited to those born with the gift. The formula, if successful, could democratize magic and fundamentally change the balance of power in the realm. However, some believe that magic should remain the domain of the naturally gifted, and they will stop at nothing to prevent this breakthrough.'
  },
  {
    id: 'shadow-cult-conspiracy',
    title: 'The Shadow Cult\'s Grand Design',
    description: 'Uncover and stop the Shadow Cult\'s plan to plunge the realm into eternal darkness.',
    longDescription: 'Your victory over the Ancient Shadow Lord was only the beginning. Intelligence gathered from the Sunken Cathedral reveals that the Shadow Cult has been orchestrating events across the entire realm as part of a grand design called "The Eternal Eclipse." They seek to corrupt the Seven Pillars of Light - ancient monuments that maintain the balance between light and darkness. If they succeed, the sun itself will be extinguished, plunging the world into an age of perpetual night where the undead reign supreme. The cult has infiltrated governments, corrupted nobles, and turned heroes to their cause. Trust no one, for the shadows have eyes everywhere.',
    type: 'main',
    giver: 'Captain Marcus',
    location: 'Guard Tower',
    objectives: [
      {
        id: 'analyze-cult-documents',
        description: 'Analyze the Shadow Cult documents from the cathedral',
        type: 'explore',
        target: 'cult_documents',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'investigate-cult-cells',
        description: 'Investigate Shadow Cult cells in major cities (0/5)',
        type: 'explore',
        target: 'cult_cell',
        current: 0,
        required: 5,
        completed: false,
        optional: false
      },
      {
        id: 'protect-light-pillars',
        description: 'Protect the Seven Pillars of Light from corruption (0/7)',
        type: 'explore',
        target: 'light_pillar',
        current: 0,
        required: 7,
        completed: false,
        optional: false
      },
      {
        id: 'defeat-cult-leaders',
        description: 'Defeat the Shadow Cult High Priests (0/3)',
        type: 'kill',
        target: 'shadow_high_priest',
        current: 0,
        required: 3,
        completed: false,
        optional: false
      },
      {
        id: 'infiltrate-cult-stronghold',
        description: 'Infiltrate the Shadow Cult\'s hidden stronghold',
        type: 'explore',
        target: 'shadow_stronghold',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'confront-shadow-master',
        description: 'Confront the Shadow Master, leader of the cult',
        type: 'kill',
        target: 'shadow_master',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      },
      {
        id: 'prevent-eternal-eclipse',
        description: 'Prevent the ritual of Eternal Eclipse',
        type: 'explore',
        target: 'eclipse_prevention',
        current: 0,
        required: 1,
        completed: false,
        optional: false
      }
    ],
    rewards: [
      { type: 'experience', value: 3000, quantity: 1 },
      { type: 'gold', value: 2000, quantity: 1 },
      { type: 'item', value: 'lightbringer_legendary_weapon', quantity: 1 },
      { type: 'item', value: 'shadow_master_cloak', quantity: 1 },
      { type: 'reputation', value: 'village', quantity: 1000 },
      { type: 'reputation', value: 'guards', quantity: 500 },
      { type: 'skill_point', value: 'all', quantity: 5 }
    ],
    status: 'available',
    difficulty: 'extreme',
    level: 25,
    prerequisites: ['ancient-evil'],
    lore: 'The Shadow Cult was founded by survivors of the Ancient Shadow Lord\'s original army. For a thousand years, they have worked in secret, manipulating events and gathering power for this moment. The Eternal Eclipse is not just a magical ritual - it is the culmination of centuries of planning, sacrifice, and unwavering devotion to their dark cause.'
  }
]