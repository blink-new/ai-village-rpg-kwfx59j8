export interface CraftingRecipe {
  id: string;
  name: string;
  category: 'weapons' | 'armor' | 'tools' | 'consumables' | 'building' | 'magic';
  description: string;
  ingredients: {
    itemId: string;
    quantity: number;
  }[];
  result: {
    itemId: string;
    quantity: number;
  };
  requiredLevel: number;
  requiredStation?: string;
  craftingTime: number; // in milliseconds
  experience: number;
  unlocked: boolean;
}

export interface CraftingStation {
  id: string;
  name: string;
  type: 'workbench' | 'forge' | 'alchemy' | 'enchanting' | 'cooking';
  level: number;
  recipes: string[]; // recipe IDs this station can craft
  upgradeCost: {
    itemId: string;
    quantity: number;
  }[];
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'tool' | 'consumable' | 'material' | 'building' | 'quest';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  quantity: number;
  maxStack: number;
  description: string;
  value: number;
  weight: number;
  durability?: number;
  maxDurability?: number;
  stats?: Record<string, number>;
  effects?: string[];
}

export interface CraftingProgress {
  recipeId: string;
  startTime: number;
  duration: number;
  stationId: string;
}

export class CraftingSystem {
  private recipes: Map<string, CraftingRecipe> = new Map();
  private stations: Map<string, CraftingStation> = new Map();
  private inventory: Map<string, InventoryItem> = new Map();
  private craftingQueue: CraftingProgress[] = [];
  private playerLevel: number = 1;
  private playerExperience: number = 0;

  constructor() {
    this.initializeRecipes();
    this.initializeStations();
    this.initializeItems();
  }

  private initializeItems(): void {
    const items: InventoryItem[] = [
      // Materials
      {
        id: 'wood',
        name: 'Wood',
        type: 'material',
        rarity: 'common',
        quantity: 0,
        maxStack: 64,
        description: 'Basic building material from trees',
        value: 1,
        weight: 0.5
      },
      {
        id: 'stone',
        name: 'Stone',
        type: 'material',
        rarity: 'common',
        quantity: 0,
        maxStack: 64,
        description: 'Sturdy building material',
        value: 2,
        weight: 1
      },
      {
        id: 'iron_ore',
        name: 'Iron Ore',
        type: 'material',
        rarity: 'uncommon',
        quantity: 0,
        maxStack: 32,
        description: 'Raw iron that can be smelted',
        value: 5,
        weight: 2
      },
      {
        id: 'iron_ingot',
        name: 'Iron Ingot',
        type: 'material',
        rarity: 'uncommon',
        quantity: 0,
        maxStack: 32,
        description: 'Refined iron ready for crafting',
        value: 10,
        weight: 1.5
      },
      {
        id: 'gold_ore',
        name: 'Gold Ore',
        type: 'material',
        rarity: 'rare',
        quantity: 0,
        maxStack: 16,
        description: 'Precious metal ore',
        value: 20,
        weight: 3
      },
      {
        id: 'diamond',
        name: 'Diamond',
        type: 'material',
        rarity: 'epic',
        quantity: 0,
        maxStack: 8,
        description: 'Extremely rare and valuable gem',
        value: 100,
        weight: 0.1
      },
      {
        id: 'leather',
        name: 'Leather',
        type: 'material',
        rarity: 'common',
        quantity: 0,
        maxStack: 32,
        description: 'Flexible material from animals',
        value: 3,
        weight: 0.3
      },
      {
        id: 'cloth',
        name: 'Cloth',
        type: 'material',
        rarity: 'common',
        quantity: 0,
        maxStack: 64,
        description: 'Soft fabric material',
        value: 2,
        weight: 0.1
      },
      // Weapons
      {
        id: 'wooden_sword',
        name: 'Wooden Sword',
        type: 'weapon',
        rarity: 'common',
        quantity: 0,
        maxStack: 1,
        description: 'A basic training sword',
        value: 15,
        weight: 2,
        durability: 50,
        maxDurability: 50,
        stats: { attack: 10, speed: 1.0 }
      },
      {
        id: 'iron_sword',
        name: 'Iron Sword',
        type: 'weapon',
        rarity: 'uncommon',
        quantity: 0,
        maxStack: 1,
        description: 'A reliable iron blade',
        value: 50,
        weight: 3,
        durability: 100,
        maxDurability: 100,
        stats: { attack: 25, speed: 1.0 }
      },
      // Tools
      {
        id: 'wooden_pickaxe',
        name: 'Wooden Pickaxe',
        type: 'tool',
        rarity: 'common',
        quantity: 0,
        maxStack: 1,
        description: 'Basic mining tool',
        value: 20,
        weight: 2,
        durability: 40,
        maxDurability: 40,
        stats: { mining: 1 }
      },
      {
        id: 'iron_pickaxe',
        name: 'Iron Pickaxe',
        type: 'tool',
        rarity: 'uncommon',
        quantity: 0,
        maxStack: 1,
        description: 'Efficient mining tool',
        value: 75,
        weight: 4,
        durability: 120,
        maxDurability: 120,
        stats: { mining: 3 }
      },
      // Consumables
      {
        id: 'health_potion',
        name: 'Health Potion',
        type: 'consumable',
        rarity: 'common',
        quantity: 0,
        maxStack: 16,
        description: 'Restores 50 health points',
        value: 25,
        weight: 0.2,
        effects: ['heal_50']
      },
      {
        id: 'mana_potion',
        name: 'Mana Potion',
        type: 'consumable',
        rarity: 'common',
        quantity: 0,
        maxStack: 16,
        description: 'Restores 30 mana points',
        value: 20,
        weight: 0.2,
        effects: ['restore_mana_30']
      }
    ];

    items.forEach(item => this.inventory.set(item.id, item));
  }

  private initializeStations(): void {
    const stations: CraftingStation[] = [
      {
        id: 'workbench',
        name: 'Workbench',
        type: 'workbench',
        level: 1,
        recipes: ['wooden_sword', 'wooden_pickaxe', 'wooden_axe'],
        upgradeCost: [
          { itemId: 'wood', quantity: 20 },
          { itemId: 'iron_ingot', quantity: 5 }
        ]
      },
      {
        id: 'forge',
        name: 'Forge',
        type: 'forge',
        level: 1,
        recipes: ['iron_ingot', 'iron_sword', 'iron_pickaxe', 'iron_armor'],
        upgradeCost: [
          { itemId: 'stone', quantity: 30 },
          { itemId: 'iron_ingot', quantity: 10 }
        ]
      },
      {
        id: 'alchemy_table',
        name: 'Alchemy Table',
        type: 'alchemy',
        level: 1,
        recipes: ['health_potion', 'mana_potion', 'strength_potion'],
        upgradeCost: [
          { itemId: 'wood', quantity: 15 },
          { itemId: 'glass', quantity: 8 }
        ]
      },
      {
        id: 'enchanting_table',
        name: 'Enchanting Table',
        type: 'enchanting',
        level: 1,
        recipes: ['enchanted_sword', 'magic_armor', 'spell_scroll'],
        upgradeCost: [
          { itemId: 'diamond', quantity: 2 },
          { itemId: 'gold_ingot', quantity: 5 }
        ]
      }
    ];

    stations.forEach(station => this.stations.set(station.id, station));
  }

  private initializeRecipes(): void {
    const recipes: CraftingRecipe[] = [
      // Basic weapons
      {
        id: 'wooden_sword',
        name: 'Wooden Sword',
        category: 'weapons',
        description: 'A basic training weapon',
        ingredients: [
          { itemId: 'wood', quantity: 3 },
          { itemId: 'cloth', quantity: 1 }
        ],
        result: { itemId: 'wooden_sword', quantity: 1 },
        requiredLevel: 1,
        requiredStation: 'workbench',
        craftingTime: 5000,
        experience: 10,
        unlocked: true
      },
      {
        id: 'iron_sword',
        name: 'Iron Sword',
        category: 'weapons',
        description: 'A reliable iron blade',
        ingredients: [
          { itemId: 'iron_ingot', quantity: 3 },
          { itemId: 'wood', quantity: 1 },
          { itemId: 'leather', quantity: 1 }
        ],
        result: { itemId: 'iron_sword', quantity: 1 },
        requiredLevel: 5,
        requiredStation: 'forge',
        craftingTime: 15000,
        experience: 25,
        unlocked: false
      },
      // Tools
      {
        id: 'wooden_pickaxe',
        name: 'Wooden Pickaxe',
        category: 'tools',
        description: 'Basic mining tool',
        ingredients: [
          { itemId: 'wood', quantity: 3 },
          { itemId: 'stone', quantity: 2 }
        ],
        result: { itemId: 'wooden_pickaxe', quantity: 1 },
        requiredLevel: 1,
        requiredStation: 'workbench',
        craftingTime: 8000,
        experience: 15,
        unlocked: true
      },
      {
        id: 'iron_pickaxe',
        name: 'Iron Pickaxe',
        category: 'tools',
        description: 'Efficient mining tool',
        ingredients: [
          { itemId: 'iron_ingot', quantity: 3 },
          { itemId: 'wood', quantity: 2 }
        ],
        result: { itemId: 'iron_pickaxe', quantity: 1 },
        requiredLevel: 4,
        requiredStation: 'forge',
        craftingTime: 12000,
        experience: 20,
        unlocked: false
      },
      // Materials
      {
        id: 'iron_ingot',
        name: 'Iron Ingot',
        category: 'building',
        description: 'Refined iron for crafting',
        ingredients: [
          { itemId: 'iron_ore', quantity: 2 }
        ],
        result: { itemId: 'iron_ingot', quantity: 1 },
        requiredLevel: 2,
        requiredStation: 'forge',
        craftingTime: 3000,
        experience: 5,
        unlocked: false
      },
      // Consumables
      {
        id: 'health_potion',
        name: 'Health Potion',
        category: 'consumables',
        description: 'Restores health',
        ingredients: [
          { itemId: 'berries', quantity: 3 },
          { itemId: 'water', quantity: 1 }
        ],
        result: { itemId: 'health_potion', quantity: 1 },
        requiredLevel: 1,
        requiredStation: 'alchemy_table',
        craftingTime: 4000,
        experience: 8,
        unlocked: true
      },
      {
        id: 'mana_potion',
        name: 'Mana Potion',
        category: 'consumables',
        description: 'Restores mana',
        ingredients: [
          { itemId: 'blue_flower', quantity: 2 },
          { itemId: 'water', quantity: 1 }
        ],
        result: { itemId: 'mana_potion', quantity: 1 },
        requiredLevel: 2,
        requiredStation: 'alchemy_table',
        craftingTime: 4000,
        experience: 8,
        unlocked: false
      }
    ];

    recipes.forEach(recipe => this.recipes.set(recipe.id, recipe));
  }

  // Add item to inventory
  addItem(itemId: string, quantity: number): boolean {
    const item = this.inventory.get(itemId);
    if (!item) return false;

    const availableSpace = item.maxStack - item.quantity;
    const amountToAdd = Math.min(quantity, availableSpace);
    
    item.quantity += amountToAdd;
    return amountToAdd === quantity;
  }

  // Remove item from inventory
  removeItem(itemId: string, quantity: number): boolean {
    const item = this.inventory.get(itemId);
    if (!item || item.quantity < quantity) return false;

    item.quantity -= quantity;
    return true;
  }

  // Check if player has required items for recipe
  canCraft(recipeId: string): {
    canCraft: boolean;
    missingItems: { itemId: string; needed: number; have: number }[];
    levelRequirement: boolean;
    stationAvailable: boolean;
  } {
    const recipe = this.recipes.get(recipeId);
    if (!recipe) {
      return {
        canCraft: false,
        missingItems: [],
        levelRequirement: false,
        stationAvailable: false
      };
    }

    const missingItems: { itemId: string; needed: number; have: number }[] = [];
    let hasAllItems = true;

    // Check ingredients
    for (const ingredient of recipe.ingredients) {
      const item = this.inventory.get(ingredient.itemId);
      const have = item ? item.quantity : 0;
      
      if (have < ingredient.quantity) {
        hasAllItems = false;
        missingItems.push({
          itemId: ingredient.itemId,
          needed: ingredient.quantity,
          have
        });
      }
    }

    // Check level requirement
    const levelRequirement = this.playerLevel >= recipe.requiredLevel;

    // Check station availability
    const stationAvailable = !recipe.requiredStation || 
                           this.stations.has(recipe.requiredStation);

    // Check if recipe is unlocked
    const isUnlocked = recipe.unlocked;

    return {
      canCraft: hasAllItems && levelRequirement && stationAvailable && isUnlocked,
      missingItems,
      levelRequirement,
      stationAvailable
    };
  }

  // Start crafting process
  startCrafting(recipeId: string, stationId?: string): boolean {
    const recipe = this.recipes.get(recipeId);
    if (!recipe) return false;

    const craftCheck = this.canCraft(recipeId);
    if (!craftCheck.canCraft) return false;

    const requiredStation = recipe.requiredStation || stationId;
    if (!requiredStation) return false;

    // Consume ingredients
    for (const ingredient of recipe.ingredients) {
      if (!this.removeItem(ingredient.itemId, ingredient.quantity)) {
        return false; // This shouldn't happen if canCraft returned true
      }
    }

    // Add to crafting queue
    const craftingProgress: CraftingProgress = {
      recipeId,
      startTime: Date.now(),
      duration: recipe.craftingTime,
      stationId: requiredStation
    };

    this.craftingQueue.push(craftingProgress);
    return true;
  }

  // Update crafting progress
  update(): void {
    const currentTime = Date.now();
    
    for (let i = this.craftingQueue.length - 1; i >= 0; i--) {
      const craft = this.craftingQueue[i];
      
      if (currentTime >= craft.startTime + craft.duration) {
        // Crafting complete
        this.completeCrafting(craft);
        this.craftingQueue.splice(i, 1);
      }
    }
  }

  private completeCrafting(craft: CraftingProgress): void {
    const recipe = this.recipes.get(craft.recipeId);
    if (!recipe) return;

    // Add result item to inventory
    this.addItem(recipe.result.itemId, recipe.result.quantity);

    // Add experience
    this.addExperience(recipe.experience);

    // Check for recipe unlocks
    this.checkRecipeUnlocks();
  }

  private addExperience(amount: number): void {
    this.playerExperience += amount;
    
    // Check for level up
    const requiredExp = this.getRequiredExperience(this.playerLevel + 1);
    if (this.playerExperience >= requiredExp) {
      this.playerLevel++;
      this.checkRecipeUnlocks();
    }
  }

  private getRequiredExperience(level: number): number {
    return level * level * 100; // Exponential growth
  }

  private checkRecipeUnlocks(): void {
    for (const recipe of this.recipes.values()) {
      if (!recipe.unlocked && this.playerLevel >= recipe.requiredLevel) {
        recipe.unlocked = true;
      }
    }
  }

  // Get available recipes for a station
  getAvailableRecipes(stationId?: string): CraftingRecipe[] {
    const recipes = Array.from(this.recipes.values());
    
    if (stationId) {
      const station = this.stations.get(stationId);
      if (station) {
        return recipes.filter(recipe => 
          recipe.unlocked && 
          station.recipes.includes(recipe.id)
        );
      }
    }
    
    return recipes.filter(recipe => recipe.unlocked);
  }

  // Get recipes by category
  getRecipesByCategory(category: CraftingRecipe['category']): CraftingRecipe[] {
    return Array.from(this.recipes.values()).filter(recipe => 
      recipe.category === category && recipe.unlocked
    );
  }

  // Get inventory items
  getInventory(): InventoryItem[] {
    return Array.from(this.inventory.values()).filter(item => item.quantity > 0);
  }

  // Get specific inventory item
  getInventoryItem(itemId: string): InventoryItem | undefined {
    return this.inventory.get(itemId);
  }

  // Get crafting queue status
  getCraftingQueue(): (CraftingProgress & {
    recipe: CraftingRecipe;
    progress: number;
    timeRemaining: number;
  })[] {
    const currentTime = Date.now();
    
    return this.craftingQueue.map(craft => {
      const recipe = this.recipes.get(craft.recipeId)!;
      const elapsed = currentTime - craft.startTime;
      const progress = Math.min(1, elapsed / craft.duration);
      const timeRemaining = Math.max(0, craft.duration - elapsed);
      
      return {
        ...craft,
        recipe,
        progress,
        timeRemaining
      };
    });
  }

  // Get player crafting stats
  getPlayerStats(): {
    level: number;
    experience: number;
    experienceToNext: number;
    totalRecipes: number;
    unlockedRecipes: number;
  } {
    const totalRecipes = this.recipes.size;
    const unlockedRecipes = Array.from(this.recipes.values()).filter(r => r.unlocked).length;
    const experienceToNext = this.getRequiredExperience(this.playerLevel + 1) - this.playerExperience;
    
    return {
      level: this.playerLevel,
      experience: this.playerExperience,
      experienceToNext,
      totalRecipes,
      unlockedRecipes
    };
  }

  // Upgrade crafting station
  upgradeStation(stationId: string): boolean {
    const station = this.stations.get(stationId);
    if (!station) return false;

    // Check if player has upgrade materials
    for (const cost of station.upgradeCost) {
      const item = this.inventory.get(cost.itemId);
      if (!item || item.quantity < cost.quantity) {
        return false;
      }
    }

    // Consume upgrade materials
    for (const cost of station.upgradeCost) {
      this.removeItem(cost.itemId, cost.quantity);
    }

    // Upgrade station
    station.level++;
    
    // Unlock new recipes based on station level
    this.checkRecipeUnlocks();
    
    return true;
  }

  // Get station information
  getStation(stationId: string): CraftingStation | undefined {
    return this.stations.get(stationId);
  }

  // Get all stations
  getAllStations(): CraftingStation[] {
    return Array.from(this.stations.values());
  }
}