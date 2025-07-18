import React, { useState, useEffect } from 'react';
import { CraftingSystem as CraftingEngine, CraftingRecipe, InventoryItem } from '../engine/CraftingSystem';
import { X, Hammer, Clock, Star, Package } from 'lucide-react';

interface CraftingSystemProps {
  craftingSystem: CraftingEngine;
  onClose: () => void;
  onCraftItem: (recipeId: string) => void;
}

export function CraftingSystem({ craftingSystem, onClose, onCraftItem }: CraftingSystemProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [availableRecipes, setAvailableRecipes] = useState<CraftingRecipe[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [craftingQueue, setCraftingQueue] = useState<any[]>([]);
  const [playerStats, setPlayerStats] = useState<any>({});

  useEffect(() => {
    // Update data periodically
    const updateData = () => {
      setAvailableRecipes(craftingSystem.getAvailableRecipes());
      setInventory(craftingSystem.getInventory());
      setCraftingQueue(craftingSystem.getCraftingQueue());
      setPlayerStats(craftingSystem.getPlayerStats());
    };

    updateData();
    const interval = setInterval(updateData, 1000);
    return () => clearInterval(interval);
  }, [craftingSystem]);

  const categories = [
    { id: 'all', name: 'All', icon: '🔧' },
    { id: 'weapons', name: 'Weapons', icon: '⚔️' },
    { id: 'armor', name: 'Armor', icon: '🛡️' },
    { id: 'tools', name: 'Tools', icon: '🔨' },
    { id: 'consumables', name: 'Potions', icon: '🧪' },
    { id: 'building', name: 'Building', icon: '🏗️' },
    { id: 'magic', name: 'Magic', icon: '✨' }
  ];

  const filteredRecipes = selectedCategory === 'all' 
    ? availableRecipes 
    : availableRecipes.filter(recipe => recipe.category === selectedCategory);

  const canCraft = (recipe: CraftingRecipe) => {
    const result = craftingSystem.canCraft(recipe.id);
    return result.canCraft;
  };

  const getCraftRequirements = (recipe: CraftingRecipe) => {
    return craftingSystem.canCraft(recipe.id);
  };

  const handleCraft = (recipeId: string) => {
    onCraftItem(recipeId);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000);
    return `${seconds}s`;
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'text-gray-400',
      uncommon: 'text-green-400',
      rare: 'text-blue-400',
      epic: 'text-purple-400',
      legendary: 'text-orange-400'
    };
    return colors[rarity as keyof typeof colors] || 'text-gray-400';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-6xl h-5/6 flex flex-col border-2 border-amber-600">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-600">
          <div className="flex items-center space-x-3">
            <Hammer className="w-8 h-8 text-amber-500" />
            <div>
              <h2 className="text-2xl font-bold text-white">Crafting Workshop</h2>
              <p className="text-slate-400">Level {playerStats.level} Crafter • {playerStats.unlockedRecipes}/{playerStats.totalRecipes} Recipes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Categories Sidebar */}
          <div className="w-48 bg-slate-900 border-r border-slate-600 p-4">
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-center space-x-2 ${
                    selectedCategory === category.id
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* Player Stats */}
            <div className="mt-6 p-3 bg-slate-800 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Crafting Stats</h4>
              <div className="text-sm text-slate-300 space-y-1">
                <div>Level: {playerStats.level}</div>
                <div>XP: {playerStats.experience}</div>
                <div>To Next: {playerStats.experienceToNext}</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex">
            {/* Recipes List */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredRecipes.map(recipe => {
                  const requirements = getCraftRequirements(recipe);
                  const craftable = canCraft(recipe);

                  return (
                    <div
                      key={recipe.id}
                      className={`bg-slate-700 rounded-lg p-4 border-2 transition-all ${
                        craftable 
                          ? 'border-green-500 hover:border-green-400' 
                          : 'border-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-white font-semibold">{recipe.name}</h3>
                          <p className="text-slate-400 text-sm">{recipe.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-amber-400 font-semibold">
                            +{recipe.experience} XP
                          </div>
                          <div className="text-slate-400 text-sm flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(recipe.craftingTime)}
                          </div>
                        </div>
                      </div>

                      {/* Ingredients */}
                      <div className="mb-3">
                        <h4 className="text-slate-300 text-sm font-semibold mb-2">Materials Required:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {recipe.ingredients.map((ingredient, index) => {
                            const item = inventory.find(i => i.id === ingredient.itemId);
                            const have = item?.quantity || 0;
                            const need = ingredient.quantity;
                            const hasEnough = have >= need;

                            return (
                              <div
                                key={index}
                                className={`flex items-center justify-between p-2 rounded ${
                                  hasEnough ? 'bg-green-900' : 'bg-red-900'
                                }`}
                              >
                                <span className="text-sm text-white">
                                  {item?.name || ingredient.itemId}
                                </span>
                                <span className={`text-sm ${hasEnough ? 'text-green-400' : 'text-red-400'}`}>
                                  {have}/{need}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Result */}
                      <div className="mb-4">
                        <h4 className="text-slate-300 text-sm font-semibold mb-2">Creates:</h4>
                        <div className="flex items-center space-x-2 p-2 bg-slate-600 rounded">
                          <Package className="w-4 h-4 text-amber-400" />
                          <span className="text-white">{recipe.result.quantity}x {recipe.name}</span>
                        </div>
                      </div>

                      {/* Requirements & Craft Button */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-400">
                          {!requirements.levelRequirement && (
                            <span className="text-red-400">Level {recipe.requiredLevel} required</span>
                          )}
                          {!requirements.stationAvailable && recipe.requiredStation && (
                            <span className="text-red-400">Requires {recipe.requiredStation}</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleCraft(recipe.id)}
                          disabled={!craftable}
                          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            craftable
                              ? 'bg-green-600 hover:bg-green-500 text-white'
                              : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          Craft
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredRecipes.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-400 mb-2">No Recipes Available</h3>
                  <p className="text-slate-500">
                    {selectedCategory === 'all' 
                      ? 'Discover new recipes by exploring the world and leveling up!'
                      : `No ${selectedCategory} recipes unlocked yet.`
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Crafting Queue Sidebar */}
            <div className="w-80 bg-slate-900 border-l border-slate-600 p-4">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Crafting Queue
              </h3>

              {craftingQueue.length > 0 ? (
                <div className="space-y-3">
                  {craftingQueue.map((craft, index) => (
                    <div key={index} className="bg-slate-800 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{craft.recipe.name}</span>
                        <span className="text-slate-400 text-sm">
                          {formatTime(craft.timeRemaining)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-amber-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${craft.progress * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500">No items being crafted</p>
                </div>
              )}

              {/* Quick Stats */}
              <div className="mt-6 p-3 bg-slate-800 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Quick Stats</h4>
                <div className="text-sm text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span>Items Crafted:</span>
                    <span className="text-amber-400">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="text-green-400">100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Queue Slots:</span>
                    <span className="text-blue-400">{craftingQueue.length}/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}