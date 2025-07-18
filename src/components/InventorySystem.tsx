import React, { useState, useEffect } from 'react';
import { CraftingSystem, InventoryItem } from '../engine/CraftingSystem';
import { Player } from '../types/game';
import { X, Package, Search, Filter, Trash2, Star } from 'lucide-react';

interface InventorySystemProps {
  craftingSystem: CraftingSystem;
  player: Player;
  onClose: () => void;
}

export function InventorySystem({ craftingSystem, player, onClose }: InventorySystemProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'rarity' | 'value'>('name');

  useEffect(() => {
    const updateInventory = () => {
      setInventory(craftingSystem.getInventory());
    };

    updateInventory();
    const interval = setInterval(updateInventory, 1000);
    return () => clearInterval(interval);
  }, [craftingSystem]);

  const filters = [
    { id: 'all', name: 'All Items', icon: '📦' },
    { id: 'weapon', name: 'Weapons', icon: '⚔️' },
    { id: 'armor', name: 'Armor', icon: '🛡️' },
    { id: 'tool', name: 'Tools', icon: '🔨' },
    { id: 'consumable', name: 'Consumables', icon: '🧪' },
    { id: 'material', name: 'Materials', icon: '🪨' },
    { id: 'building', name: 'Building', icon: '🏗️' },
    { id: 'quest', name: 'Quest Items', icon: '📜' }
  ];

  const filteredInventory = inventory
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'rarity': {
          const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'artifact'];
          return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
        }
        case 'value':
          return b.value - a.value;
        default:
          return 0;
      }
    });

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'border-gray-400 text-gray-400',
      uncommon: 'border-green-400 text-green-400',
      rare: 'border-blue-400 text-blue-400',
      epic: 'border-purple-400 text-purple-400',
      legendary: 'border-orange-400 text-orange-400',
      artifact: 'border-red-400 text-red-400'
    };
    return colors[rarity as keyof typeof colors] || 'border-gray-400 text-gray-400';
  };

  const getRarityBg = (rarity: string) => {
    const colors = {
      common: 'bg-gray-900',
      uncommon: 'bg-green-900',
      rare: 'bg-blue-900',
      epic: 'bg-purple-900',
      legendary: 'bg-orange-900',
      artifact: 'bg-red-900'
    };
    return colors[rarity as keyof typeof colors] || 'bg-gray-900';
  };

  const getTotalWeight = () => {
    return inventory.reduce((total, item) => total + (item.weight * item.quantity), 0);
  };

  const getTotalValue = () => {
    return inventory.reduce((total, item) => total + (item.value * item.quantity), 0);
  };

  const handleUseItem = (item: InventoryItem) => {
    if (item.type === 'consumable') {
      // Handle consumable use
      console.log('Using item:', item.name);
    }
  };

  const handleDropItem = (item: InventoryItem) => {
    // Handle item dropping
    console.log('Dropping item:', item.name);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-7xl h-5/6 flex flex-col border-2 border-amber-600">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-600">
          <div className="flex items-center space-x-3">
            <Package className="w-8 h-8 text-amber-500" />
            <div>
              <h2 className="text-2xl font-bold text-white">Inventory</h2>
              <p className="text-slate-400">
                {inventory.length} items • {getTotalWeight().toFixed(1)} kg • {getTotalValue()} gold value
              </p>
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
          {/* Filters Sidebar */}
          <div className="w-48 bg-slate-900 border-r border-slate-600 p-4">
            <h3 className="text-white font-semibold mb-4">Filters</h3>
            <div className="space-y-2">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-center space-x-2 ${
                    selectedFilter === filter.id
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span className="text-lg">{filter.icon}</span>
                  <span className="text-sm">{filter.name}</span>
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="mt-6">
              <h4 className="text-white font-semibold mb-2">Sort By</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600"
              >
                <option value="name">Name</option>
                <option value="type">Type</option>
                <option value="rarity">Rarity</option>
                <option value="value">Value</option>
              </select>
            </div>

            {/* Player Stats */}
            <div className="mt-6 p-3 bg-slate-800 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Carrying Capacity</h4>
              <div className="text-sm text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span>Weight:</span>
                  <span>{getTotalWeight().toFixed(1)}/100 kg</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (getTotalWeight() / 100) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex">
            {/* Items Grid */}
            <div className="flex-1 p-6">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-700 text-white pl-10 pr-4 py-3 rounded-lg border border-slate-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 overflow-y-auto">
                {filteredInventory.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    onClick={() => setSelectedItem(item)}
                    className={`relative aspect-square ${getRarityBg(item.rarity)} rounded-lg border-2 ${getRarityColor(item.rarity)} cursor-pointer hover:scale-105 transition-transform p-2 flex flex-col items-center justify-center`}
                  >
                    {/* Item Icon/Image */}
                    <div className="text-2xl mb-1">
                      {item.type === 'weapon' && '⚔️'}
                      {item.type === 'armor' && '🛡️'}
                      {item.type === 'tool' && '🔨'}
                      {item.type === 'consumable' && '🧪'}
                      {item.type === 'material' && '🪨'}
                      {item.type === 'building' && '🏗️'}
                      {item.type === 'quest' && '📜'}
                    </div>

                    {/* Quantity */}
                    {item.quantity > 1 && (
                      <div className="absolute bottom-1 right-1 bg-slate-800 text-white text-xs px-1 rounded">
                        {item.quantity}
                      </div>
                    )}

                    {/* Durability Bar */}
                    {item.durability !== undefined && item.maxDurability && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700 rounded-b">
                        <div
                          className="h-full bg-green-500 rounded-b"
                          style={{ width: `${(item.durability / item.maxDurability) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}

                {/* Empty Slots */}
                {Array.from({ length: Math.max(0, 60 - filteredInventory.length) }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="aspect-square bg-slate-700 rounded-lg border-2 border-slate-600 opacity-50"
                  />
                ))}
              </div>

              {filteredInventory.length === 0 && searchTerm && (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-400 mb-2">No Items Found</h3>
                  <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>

            {/* Item Details Sidebar */}
            <div className="w-80 bg-slate-900 border-l border-slate-600 p-4">
              {selectedItem ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-xl font-bold ${getRarityColor(selectedItem.rarity)}`}>
                      {selectedItem.name}
                    </h3>
                    <div className="flex space-x-2">
                      {selectedItem.type === 'consumable' && (
                        <button
                          onClick={() => handleUseItem(selectedItem)}
                          className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-sm"
                        >
                          Use
                        </button>
                      )}
                      <button
                        onClick={() => handleDropItem(selectedItem)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-sm"
                      >
                        Drop
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Basic Info */}
                    <div>
                      <p className="text-slate-300 text-sm mb-2">{selectedItem.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-slate-400">Type:</div>
                        <div className="text-white capitalize">{selectedItem.type}</div>
                        <div className="text-slate-400">Rarity:</div>
                        <div className={getRarityColor(selectedItem.rarity).split(' ')[1]}>
                          {selectedItem.rarity}
                        </div>
                        <div className="text-slate-400">Value:</div>
                        <div className="text-amber-400">{selectedItem.value} gold</div>
                        <div className="text-slate-400">Weight:</div>
                        <div className="text-white">{selectedItem.weight} kg</div>
                        {selectedItem.quantity > 1 && (
                          <>
                            <div className="text-slate-400">Quantity:</div>
                            <div className="text-white">{selectedItem.quantity}</div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    {selectedItem.stats && Object.keys(selectedItem.stats).length > 0 && (
                      <div>
                        <h4 className="text-white font-semibold mb-2">Stats</h4>
                        <div className="space-y-1">
                          {Object.entries(selectedItem.stats).map(([stat, value]) => (
                            <div key={stat} className="flex justify-between text-sm">
                              <span className="text-slate-400 capitalize">{stat}:</span>
                              <span className="text-green-400">+{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Durability */}
                    {selectedItem.durability !== undefined && selectedItem.maxDurability && (
                      <div>
                        <h4 className="text-white font-semibold mb-2">Durability</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${(selectedItem.durability / selectedItem.maxDurability) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-slate-300">
                            {selectedItem.durability}/{selectedItem.maxDurability}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Effects */}
                    {selectedItem.effects && selectedItem.effects.length > 0 && (
                      <div>
                        <h4 className="text-white font-semibold mb-2">Effects</h4>
                        <div className="space-y-1">
                          {selectedItem.effects.map((effect, index) => (
                            <div key={index} className="text-sm text-blue-400">
                              {effect.type}: {effect.value}
                              {effect.duration && ` (${effect.duration}s)`}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Requirements */}
                    {selectedItem.requirements && (
                      <div>
                        <h4 className="text-white font-semibold mb-2">Requirements</h4>
                        <div className="space-y-1 text-sm">
                          {selectedItem.requirements.level && (
                            <div className="text-slate-300">Level: {selectedItem.requirements.level}</div>
                          )}
                          {selectedItem.requirements.class && (
                            <div className="text-slate-300">
                              Class: {selectedItem.requirements.class.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-400 mb-2">Select an Item</h3>
                  <p className="text-slate-500">Click on an item to view its details and actions.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}