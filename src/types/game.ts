export interface Player {
  id: string;
  name: string;
  class: 'warrior' | 'mage' | 'rogue' | 'archer' | 'paladin' | 'necromancer' | 'ranger' | 'monk';
  level: number;
  experience: number;
  skillPoints: number;
  stats: {
    health: number;
    maxHealth: number;
    mana: number;
    maxMana: number;
    stamina: number;
    maxStamina: number;
    attack: number;
    defense: number;
    speed: number;
    magic: number;
    luck: number;
    charisma: number;
  };
  position: {
    x: number;
    y: number;
    chunkX: number;
    chunkY: number;
  };
  inventory: InventoryItem[];
  equipment: {
    weapon?: string;
    armor?: string;
    helmet?: string;
    boots?: string;
    gloves?: string;
    ring1?: string;
    ring2?: string;
    amulet?: string;
  };
  quests: Quest[];
  skills: {
    combat: number;
    magic: number;
    crafting: number;
    mining: number;
    farming: number;
    fishing: number;
    cooking: number;
    alchemy: number;
    enchanting: number;
    lockpicking: number;
    stealth: number;
    archery: number;
  };
  achievements: Achievement[];
  reputation: Record<string, number>; // faction reputation
  homeBase?: {
    x: number;
    y: number;
    structures: BuildingStructure[];
  };
}

export interface Character {
  id: string
  name: string
  class: 'warrior' | 'mage' | 'rogue' | 'archer' | 'paladin' | 'necromancer' | 'ranger' | 'assassin'
  sprite: string
  description: string
  lore: string
  startingLocation: string
  stats: {
    health: number
    maxHealth: number
    mana: number
    maxMana: number
    stamina: number
    maxStamina: number
    strength: number
    agility: number
    intelligence: number
    vitality: number
    endurance: number
    faith: number
    luck: number
  }
  level: number
  experience: number
  experienceToNext: number
  skills: SkillTree
  equipment: Equipment
  inventory: InventoryItem[]
  statusEffects: StatusEffect[]
  resistances: {
    physical: number
    magical: number
    fire: number
    ice: number
    poison: number
    curse: number
  }
}

export interface SkillTree {
  combat: {
    swordMastery: number
    archery: number
    dualWield: number
    heavyArmor: number
    shield: number
  }
  magic: {
    destruction: number
    restoration: number
    illusion: number
    conjuration: number
    enchantment: number
  }
  stealth: {
    sneak: number
    lockpicking: number
    pickpocket: number
    backstab: number
    trap: number
  }
  survival: {
    alchemy: number
    crafting: number
    hunting: number
    herbalism: number
    cooking: number
  }
}

export interface Equipment {
  weapon: InventoryItem | null
  offhand: InventoryItem | null
  helmet: InventoryItem | null
  armor: InventoryItem | null
  gloves: InventoryItem | null
  boots: InventoryItem | null
  ring1: InventoryItem | null
  ring2: InventoryItem | null
  amulet: InventoryItem | null
}

export interface InventoryItem {
  id: string
  name: string
  type: 'weapon' | 'armor' | 'consumable' | 'material' | 'quest' | 'tool' | 'building' | 'book' | 'key'
  subtype: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'artifact'
  icon: string
  description: string
  lore: string
  value: number
  weight: number
  quantity: number
  maxStack: number
  durability?: number
  maxDurability?: number
  stats?: {
    damage?: number
    defense?: number
    magicDamage?: number
    magicDefense?: number
    critChance?: number
    attack?: number
    health?: number
    mana?: number
    speed?: number
    magic?: number
    luck?: number
  }
  effects?: ItemEffect[]
  enchantments?: Enchantment[]
  requirements?: {
    level?: number
    strength?: number
    agility?: number
    intelligence?: number
    class?: string[]
    stats?: Record<string, number>
  }
  craftingMaterial?: boolean
  tradeable?: boolean
  questItem?: boolean
}

export interface ItemEffect {
  type: 'stat_boost' | 'damage_over_time' | 'heal' | 'mana_restore' | 'buff' | 'debuff' | 'damage' | 'teleport'
  value: number
  duration?: number
  stat?: string
  target: 'self' | 'enemy' | 'ally' | 'area'
}

export interface Enchantment {
  id: string;
  name: string;
  level: number;
  effect: string;
  value: number;
}

export interface StatusEffect {
  id: string
  name: string
  type: 'buff' | 'debuff' | 'dot' | 'hot' | 'stun' | 'slow' | 'haste'
  icon: string
  description: string
  duration: number
  intensity: number
  tickDamage?: number
  effects: {
    stat: string
    modifier: number
  }[]
  statModifiers?: Record<string, number>
  immunities?: string[]
  stackable: boolean
  maxStacks?: number
}

export interface NPC {
  id: string
  name: string
  title: string
  role: string
  type: 'villager' | 'merchant' | 'guard' | 'elder' | 'blacksmith' | 'mage' | 'priest' | 'innkeeper' | 'farmer' | 'hunter'
  sprite: string
  x: number
  y: number
  level: number
  faction: string
  personality: {
    friendliness: number
    helpfulness: number
    knowledge: number
    greed: number
    courage: number
    mood: number
    primaryTrait: string
    interests: string[]
  }
  context: string[]
  dialogue: DialogueNode[]
  quests: string[]
  shop?: ShopInventory
  isInteracting: boolean
  isHostile: boolean
  health: number
  maxHealth: number
  stats: {
    strength: number
    agility: number
    intelligence: number
    defense: number
  }
  loot: InventoryItem[]
  respawnTime?: number
  patrolRoute?: Position[]
  currentPatrolIndex?: number
  lastSeen?: number
  schedule: NPCSchedule[]
  relationship: number // -100 to 100
  memoryBank: NPCMemory[]
  tradingPrices: Record<string, number>
}

export interface NPCSchedule {
  time: number; // hour of day
  activity: 'work' | 'eat' | 'sleep' | 'socialize' | 'patrol' | 'pray';
  location: { x: number; y: number };
}

export interface NPCMemory {
  event: string;
  timestamp: number;
  importance: number;
  relatedEntities: string[];
}

export interface DialogueNode {
  id: string
  text: string
  conditions?: DialogueCondition[]
  responses: DialogueResponse[]
  actions?: DialogueAction[]
  effects?: {
    relationship?: number;
    reputation?: Record<string, number>;
    mood?: number;
  };
  aiGenerated?: boolean;
  context?: string;
}

export interface DialogueCondition {
  type: 'quest_status' | 'item_in_inventory' | 'stat_check' | 'reputation' | 'time_of_day' | 'weather' | 'relationship'
  value: any
}

export interface DialogueResponse {
  id: string
  text: string
  nextNodeId?: string
  conditions?: DialogueCondition[]
  actions?: DialogueAction[]
  requirements?: {
    level?: number;
    items?: { id: string; quantity: number }[];
    gold?: number;
    reputation?: Record<string, number>;
    skills?: Record<string, number>;
  };
  consequences?: {
    relationship?: number;
    reputation?: Record<string, number>;
    removeItems?: { id: string; quantity: number }[];
    addItems?: InventoryItem[];
  };
}

export interface DialogueAction {
  type: 'give_item' | 'take_item' | 'start_quest' | 'complete_quest' | 'change_reputation' | 'teleport' | 'teach_skill'
  value: any
}

export interface ShopInventory {
  items: InventoryItem[]
  gold: number
  refreshTime: number
  lastRefresh: number
}

export interface Position {
  x: number
  y: number
}

export interface GameState {
  player: Player;
  currentLocation: string
  timeOfDay: 'dawn' | 'morning' | 'midday' | 'afternoon' | 'evening' | 'night' | 'midnight'
  weather: 'clear' | 'cloudy' | 'rainy' | 'stormy' | 'foggy' | 'snowy'
  season: 'spring' | 'summer' | 'autumn' | 'winter'
  gameTime: number;
  dayCount: number;
  questsCompleted: string[]
  questsActive: string[]
  questsAvailable: string[]
  reputation: {
    village: number
    merchants: number
    guards: number
    thieves: number
    mages: number
  }
  discoveries: string[]
  killedEnemies: { [key: string]: number }
  craftedItems: string[]
  daysPassed: number
  difficulty: 'easy' | 'normal' | 'hard' | 'nightmare'
  npcs: NPC[];
  enemies: Enemy[];
  activeQuests: Quest[];
  completedQuests: Quest[];
  worldEvents: WorldEvent[];
  discoveredLocations: string[];
  unlockedRecipes: string[];
  globalFlags: Record<string, boolean>;
  economyState: EconomyState;
  factions: Faction[];
}

export interface Quest {
  id: string
  title: string
  description: string
  longDescription: string
  type: 'main' | 'side' | 'daily' | 'bounty' | 'exploration' | 'weekly' | 'chain' | 'repeatable'
  giver: string
  location: string
  objectives: QuestObjective[]
  rewards: QuestReward[]
  status: 'available' | 'active' | 'completed' | 'failed' | 'turned_in'
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme'
  level: number
  timeLimit?: number
  prerequisites?: string[]
  followUp?: string
  lore: string
  category: string;
  isRepeatable: boolean;
  cooldown?: number;
}

export interface QuestObjective {
  id: string
  description: string
  type: 'kill' | 'collect' | 'deliver' | 'talk' | 'explore' | 'craft' | 'survive' | 'escort' | 'build'
  target: string
  current: number
  required: number
  completed: boolean
  optional: boolean
  location?: { x: number; y: number };
  timeLimit?: number;
}

export interface QuestReward {
  type: 'experience' | 'gold' | 'item' | 'reputation' | 'skill_point'
  value: any
  quantity: number
}

export interface Enemy {
  id: string
  name: string
  type: 'beast' | 'undead' | 'demon' | 'humanoid' | 'elemental' | 'dragon'
  sprite: string
  level: number
  health: number
  maxHealth: number
  mana: number
  maxMana: number
  stats: {
    strength: number
    agility: number
    intelligence: number
    defense: number
    magicDefense: number
  }
  abilities: EnemyAbility[]
  loot: LootDrop[]
  experience: number
  gold: number
  behavior: 'passive' | 'aggressive' | 'territorial' | 'pack' | 'defensive' | 'pack_hunter'
  aiState: 'idle' | 'patrol' | 'chase' | 'attack' | 'flee' | 'search';
  resistances: {
    physical: number
    magical: number
    fire: number
    ice: number
    poison: number
  }
  weaknesses: string[]
  description: string
  lore: string
  spawnBiome: string[];
  rarity: 'common' | 'uncommon' | 'rare' | 'boss' | 'legendary';
}

export interface EnemyAbility {
  id: string
  name: string
  type: 'attack' | 'spell' | 'buff' | 'debuff' | 'heal' | 'summon' | 'teleport'
  damage: number
  manaCost: number
  cooldown: number
  range: number
  effects: ItemEffect[]
  description: string
}

export interface LootDrop {
  itemId: string
  chance: number
  minQuantity: number
  maxQuantity: number
}

export interface Location {
  id: string
  name: string
  type: 'village' | 'dungeon' | 'forest' | 'cave' | 'ruins' | 'castle' | 'tower'
  description: string
  lore: string
  level: number
  size: { width: number; height: number }
  background: string
  music: string
  ambientSounds: string[]
  npcs: string[]
  enemies: string[]
  items: string[]
  exits: LocationExit[]
  weather: string[]
  timeRestrictions?: string[]
  discoveryReward?: {
    experience: number
    gold: number
    items: string[]
  }
}

export interface LocationExit {
  id: string
  name: string
  targetLocation: string
  position: Position
  requirements?: {
    key?: string
    quest?: string
    level?: number
  }
}

export interface WorldEvent {
  id: string;
  type: 'weather_change' | 'enemy_spawn' | 'merchant_arrival' | 'festival' | 'invasion' | 'eclipse' | 'meteor_shower';
  startTime: number;
  duration: number;
  effects: any;
  location?: { x: number; y: number };
  participants?: string[];
  rewards?: InventoryItem[];
}

export interface EconomyState {
  inflation: number;
  supply: Record<string, number>;
  demand: Record<string, number>;
  priceModifiers: Record<string, number>;
  tradeRoutes: TradeRoute[];
}

export interface TradeRoute {
  from: string;
  to: string;
  goods: string[];
  profitMargin: number;
  danger: number;
  travelTime: number;
}

export interface Faction {
  id: string;
  name: string;
  description: string;
  reputation: number;
  leader: string;
  territory: { x: number; y: number; radius: number }[];
  allies: string[];
  enemies: string[];
  questLines: string[];
  rewards: Record<number, InventoryItem[]>; // reputation level -> rewards
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'combat' | 'exploration' | 'crafting' | 'social' | 'collection' | 'story';
  progress: number;
  maxProgress: number;
  completed: boolean;
  reward?: {
    experience: number;
    items: InventoryItem[];
    title?: string;
  };
  hidden: boolean;
}

export interface BuildingStructure {
  id: string;
  type: 'house' | 'workshop' | 'farm' | 'mine' | 'tower' | 'wall' | 'gate' | 'storage';
  position: { x: number; y: number };
  size: { width: number; height: number };
  level: number;
  health: number;
  maxHealth: number;
  functionality: Record<string, any>;
  upgradeCosts: Record<number, InventoryItem[]>;
  workers?: string[]; // NPC IDs
  production?: {
    input: InventoryItem[];
    output: InventoryItem[];
    rate: number; // per hour
  };
}

export interface CombatAction {
  type: 'attack' | 'spell' | 'item' | 'defend' | 'flee' | 'dodge' | 'charge' | 'combo'
  target?: string
  itemId?: string
  spellId?: string
  weaponId?: string
  position?: { x: number; y: number };
  modifiers?: Record<string, number>;
}

export interface CombatResult {
  damage: number
  healing?: number
  critical: boolean
  blocked: boolean
  dodged: boolean
  effects: StatusEffect[]
  statusEffects?: StatusEffect[];
  knockback?: { x: number; y: number };
  animation?: string;
  message: string
}

export interface Spell {
  id: string
  name: string
  school: 'destruction' | 'restoration' | 'illusion' | 'conjuration' | 'enchantment' | 'fire' | 'ice' | 'lightning' | 'earth' | 'healing' | 'dark' | 'light' | 'arcane'
  level: number
  manaCost: number
  castTime: number
  cooldown: number
  range: number
  areaOfEffect: number
  damage?: number
  healing?: number
  effects: ItemEffect[]
  description: string
  lore: string
  requirements: {
    intelligence: number
    skill: number
    level: number
    skills: Record<string, number>
  }
  components?: string[] // material components
}

export interface Recipe {
  id: string
  name: string
  type: 'smithing' | 'alchemy' | 'cooking' | 'enchanting'
  result: {
    itemId: string
    quantity: number
  }
  materials: {
    itemId: string
    quantity: number
  }[]
  requirements: {
    skill: number
    tool?: string
    location?: string
  }
  experience: number
  description: string
}

export interface Skill {
  id: string;
  name: string;
  category: 'combat' | 'magic' | 'crafting' | 'survival' | 'social';
  level: number;
  experience: number;
  maxLevel: number;
  bonuses: Record<number, string[]>; // level -> bonus descriptions
  prerequisites?: string[];
}

export interface ParticleEffect {
  id: string;
  type: 'fire' | 'ice' | 'lightning' | 'blood' | 'magic' | 'smoke' | 'sparkle';
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
  gravity: boolean;
}

export interface SoundEffect {
  id: string;
  type: 'sfx' | 'music' | 'ambient';
  file: string;
  volume: number;
  loop: boolean;
  position?: { x: number; y: number };
  range?: number;
  priority: number;
}