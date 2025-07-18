import React, { useState } from 'react';
import { Player, BuildingStructure } from '../types/game';
import { X, Home, Hammer, Shield, Zap, Package, Users } from 'lucide-react';

interface BuildingSystemProps {
  player: Player;
  onClose: () => void;
}

interface BuildingTemplate {
  id: string;
  name: string;
  type: BuildingStructure['type'];
  description: string;
  icon: React.ReactNode;
  size: { width: number; height: number };
  cost: { itemId: string; quantity: number }[];
  requirements: {
    level?: number;
    skills?: Record<string, number>;
  };
  benefits: string[];
}

export function BuildingSystem({ player, onClose }: BuildingSystemProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('residential');
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingTemplate | null>(null);
  const [buildingMode, setBuildingMode] = useState<'browse' | 'place'>('browse');

  const categories = [
    { id: 'residential', name: 'Residential', icon: <Home className="w-5 h-5" /> },
    { id: 'production', name: 'Production', icon: <Hammer className="w-5 h-5" /> },
    { id: 'defense', name: 'Defense', icon: <Shield className="w-5 h-5" /> },
    { id: 'utility', name: 'Utility', icon: <Zap className="w-5 h-5" /> },
    { id: 'storage', name: 'Storage', icon: <Package className="w-5 h-5" /> },
    { id: 'social', name: 'Social', icon: <Users className="w-5 h-5" /> }
  ];

  const buildingTemplates: BuildingTemplate[] = [
    // Residential
    {
      id: 'basic_house',
      name: 'Basic House',
      type: 'house',
      description: 'A simple dwelling that provides basic shelter and storage.',
      icon: <Home className="w-8 h-8" />,
      size: { width: 4, height: 4 },
      cost: [
        { itemId: 'wood', quantity: 50 },
        { itemId: 'stone', quantity: 20 },
        { itemId: 'iron_ingot', quantity: 5 }
      ],
      requirements: { level: 5 },
      benefits: [
        'Provides respawn point',
        'Basic storage (20 slots)',
        'Rest bonus (+10% XP for 1 hour)'
      ]
    },
    {
      id: 'manor',
      name: 'Manor House',
      type: 'house',
      description: 'A large, luxurious home for the wealthy adventurer.',
      icon: <Home className="w-8 h-8" />,
      size: { width: 8, height: 6 },
      cost: [
        { itemId: 'wood', quantity: 200 },
        { itemId: 'stone', quantity: 100 },
        { itemId: 'iron_ingot', quantity: 50 },
        { itemId: 'gold_ingot', quantity: 10 }
      ],
      requirements: { level: 25, skills: { crafting: 50 } },
      benefits: [
        'Premium respawn point',
        'Large storage (100 slots)',
        'Extended rest bonus (+25% XP for 2 hours)',
        'Can house NPCs'
      ]
    },

    // Production
    {
      id: 'workshop',
      name: 'Crafting Workshop',
      type: 'workshop',
      description: 'A dedicated space for crafting and item creation.',
      icon: <Hammer className="w-8 h-8" />,
      size: { width: 6, height: 4 },
      cost: [
        { itemId: 'wood', quantity: 80 },
        { itemId: 'stone', quantity: 40 },
        { itemId: 'iron_ingot', quantity: 20 }
      ],
      requirements: { level: 10, skills: { crafting: 25 } },
      benefits: [
        '+25% crafting speed',
        'Access to advanced recipes',
        'Automatic material sorting',
        'Can hire crafting assistants'
      ]
    },
    {
      id: 'farm',
      name: 'Agricultural Farm',
      type: 'farm',
      description: 'Grow crops and raise animals for sustainable resources.',
      icon: <Package className="w-8 h-8" />,
      size: { width: 10, height: 8 },
      cost: [
        { itemId: 'wood', quantity: 60 },
        { itemId: 'stone', quantity: 30 },
        { itemId: 'seeds', quantity: 20 }
      ],
      requirements: { level: 8, skills: { farming: 20 } },
      benefits: [
        'Produces food automatically',
        'Renewable resource generation',
        'Can expand with additional plots',
        'Attracts friendly animals'
      ]
    },
    {
      id: 'mine',
      name: 'Resource Mine',
      type: 'mine',
      description: 'Extract valuable ores and minerals from the earth.',
      icon: <Hammer className="w-8 h-8" />,
      size: { width: 6, height: 6 },
      cost: [
        { itemId: 'wood', quantity: 40 },
        { itemId: 'stone', quantity: 80 },
        { itemId: 'iron_pickaxe', quantity: 3 }
      ],
      requirements: { level: 15, skills: { mining: 30 } },
      benefits: [
        'Automatic ore extraction',
        'Discovers rare minerals',
        'Can be upgraded for efficiency',
        'Provides mining XP over time'
      ]
    },

    // Defense
    {
      id: 'watchtower',
      name: 'Watch Tower',
      type: 'tower',
      description: 'A tall structure that provides early warning of threats.',
      icon: <Shield className="w-8 h-8" />,
      size: { width: 3, height: 3 },
      cost: [
        { itemId: 'stone', quantity: 100 },
        { itemId: 'iron_ingot', quantity: 30 },
        { itemId: 'wood', quantity: 20 }
      ],
      requirements: { level: 12 },
      benefits: [
        'Reveals enemies on minimap',
        'Increases base defense rating',
        'Can station archer NPCs',
        'Provides high vantage point'
      ]
    },
    {
      id: 'wall_section',
      name: 'Stone Wall',
      type: 'wall',
      description: 'Defensive walls to protect your base from invaders.',
      icon: <Shield className="w-8 h-8" />,
      size: { width: 1, height: 4 },
      cost: [
        { itemId: 'stone', quantity: 20 },
        { itemId: 'iron_ingot', quantity: 5 }
      ],
      requirements: { level: 8 },
      benefits: [
        'Blocks enemy movement',
        'High durability',
        'Can be upgraded with spikes',
        'Connects to other wall sections'
      ]
    },
    {
      id: 'gate',
      name: 'Reinforced Gate',
      type: 'gate',
      description: 'A sturdy gate that allows controlled access through walls.',
      icon: <Shield className="w-8 h-8" />,
      size: { width: 2, height: 1 },
      cost: [
        { itemId: 'wood', quantity: 30 },
        { itemId: 'iron_ingot', quantity: 15 },
        { itemId: 'leather', quantity: 10 }
      ],
      requirements: { level: 10 },
      benefits: [
        'Can be locked/unlocked',
        'Allows friendly passage',
        'Automated opening for owner',
        'Can withstand siege attacks'
      ]
    },

    // Storage
    {
      id: 'warehouse',
      name: 'Storage Warehouse',
      type: 'storage',
      description: 'A large building dedicated to storing vast quantities of items.',
      icon: <Package className="w-8 h-8" />,
      size: { width: 8, height: 6 },
      cost: [
        { itemId: 'wood', quantity: 120 },
        { itemId: 'stone', quantity: 60 },
        { itemId: 'iron_ingot', quantity: 25 }
      ],
      requirements: { level: 18 },
      benefits: [
        'Massive storage capacity (500 slots)',
        'Automatic item sorting',
        'Climate controlled preservation',
        'Can be accessed remotely'
      ]
    }
  ];

  const filteredBuildings = buildingTemplates.filter(building => {
    if (selectedCategory === 'residential') return building.type === 'house';
    if (selectedCategory === 'production') return ['workshop', 'farm', 'mine'].includes(building.type);
    if (selectedCategory === 'defense') return ['tower', 'wall', 'gate'].includes(building.type);
    if (selectedCategory === 'storage') return building.type === 'storage';
    return true;
  });

  const canBuild = (building: BuildingTemplate) => {
    if (building.requirements.level && player.level < building.requirements.level) {
      return false;
    }
    if (building.requirements.skills) {
      for (const [skill, required] of Object.entries(building.requirements.skills)) {
        if ((player.skills as any)[skill] < required) {
          return false;
        }
      }
    }
    // TODO: Check if player has required materials
    return true;
  };

  const handleBuildingSelect = (building: BuildingTemplate) => {
    setSelectedBuilding(building);
  };

  const handleStartBuilding = (building: BuildingTemplate) => {
    setBuildingMode('place');
    // TODO: Enter building placement mode
    console.log('Starting to build:', building.name);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-6xl h-5/6 flex flex-col border-2 border-amber-600">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-600">
          <div className="flex items-center space-x-3">
            <Hammer className="w-8 h-8 text-amber-500" />
            <div>
              <h2 className="text-2xl font-bold text-white">Building System</h2>
              <p className="text-slate-400">Construct and upgrade your base</p>
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
                  {category.icon}
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* Player Building Stats */}
            <div className="mt-6 p-3 bg-slate-800 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Building Stats</h4>
              <div className="text-sm text-slate-300 space-y-1">
                <div>Structures Built: {player.homeBase?.structures.length || 0}</div>
                <div>Building Level: {player.level}</div>
                <div>Crafting Skill: {player.skills.crafting}</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex">
            {/* Buildings List */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredBuildings.map(building => {
                  const buildable = canBuild(building);

                  return (
                    <div
                      key={building.id}
                      onClick={() => handleBuildingSelect(building)}
                      className={`bg-slate-700 rounded-lg p-4 border-2 cursor-pointer transition-all ${
                        selectedBuilding?.id === building.id
                          ? 'border-amber-500'
                          : buildable 
                            ? 'border-green-500 hover:border-green-400' 
                            : 'border-slate-600'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="text-amber-400">
                          {building.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-1">{building.name}</h3>
                          <p className="text-slate-400 text-sm mb-3">{building.description}</p>
                          
                          {/* Size */}
                          <div className="text-xs text-slate-500 mb-2">
                            Size: {building.size.width}x{building.size.height} tiles
                          </div>

                          {/* Requirements */}
                          <div className="mb-3">
                            <h4 className="text-slate-300 text-sm font-semibold mb-1">Requirements:</h4>
                            <div className="text-xs text-slate-400 space-y-1">
                              {building.requirements.level && (
                                <div className={player.level >= building.requirements.level ? 'text-green-400' : 'text-red-400'}>
                                  Level {building.requirements.level}
                                </div>
                              )}
                              {building.requirements.skills && Object.entries(building.requirements.skills).map(([skill, required]) => (
                                <div 
                                  key={skill}
                                  className={(player.skills as any)[skill] >= required ? 'text-green-400' : 'text-red-400'}
                                >
                                  {skill}: {required}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Materials */}
                          <div className="mb-3">
                            <h4 className="text-slate-300 text-sm font-semibold mb-1">Materials:</h4>
                            <div className="grid grid-cols-2 gap-1">
                              {building.cost.map((cost, index) => (
                                <div key={index} className="text-xs text-slate-400">
                                  {cost.quantity}x {cost.itemId}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Benefits Preview */}
                          <div className="mb-3">
                            <h4 className="text-slate-300 text-sm font-semibold mb-1">Benefits:</h4>
                            <div className="text-xs text-green-400">
                              {building.benefits.slice(0, 2).map((benefit, index) => (
                                <div key={index}>• {benefit}</div>
                              ))}
                              {building.benefits.length > 2 && (
                                <div className="text-slate-500">+{building.benefits.length - 2} more...</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredBuildings.length === 0 && (
                <div className="text-center py-12">
                  <Hammer className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-400 mb-2">No Buildings Available</h3>
                  <p className="text-slate-500">Level up and improve your skills to unlock more buildings!</p>
                </div>
              )}
            </div>

            {/* Building Details Sidebar */}
            <div className="w-80 bg-slate-900 border-l border-slate-600 p-4">
              {selectedBuilding ? (
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-amber-400">
                      {selectedBuilding.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white">{selectedBuilding.name}</h3>
                  </div>

                  <p className="text-slate-300 mb-4">{selectedBuilding.description}</p>

                  {/* Detailed Stats */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-semibold mb-2">Specifications</h4>
                      <div className="text-sm text-slate-300 space-y-1">
                        <div>Type: {selectedBuilding.type}</div>
                        <div>Size: {selectedBuilding.size.width} × {selectedBuilding.size.height} tiles</div>
                        <div>Area: {selectedBuilding.size.width * selectedBuilding.size.height} tiles²</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-2">All Benefits</h4>
                      <div className="text-sm text-green-400 space-y-1">
                        {selectedBuilding.benefits.map((benefit, index) => (
                          <div key={index}>• {benefit}</div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-2">Required Materials</h4>
                      <div className="space-y-2">
                        {selectedBuilding.cost.map((cost, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-slate-800 rounded">
                            <span className="text-slate-300">{cost.itemId}</span>
                            <span className="text-amber-400">{cost.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-2">Construction Time</h4>
                      <div className="text-sm text-slate-300">
                        Estimated: {Math.ceil(selectedBuilding.size.width * selectedBuilding.size.height * 30)} seconds
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartBuilding(selectedBuilding)}
                    disabled={!canBuild(selectedBuilding)}
                    className={`w-full mt-6 py-3 rounded-lg font-semibold transition-colors ${
                      canBuild(selectedBuilding)
                        ? 'bg-green-600 hover:bg-green-500 text-white'
                        : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {canBuild(selectedBuilding) ? 'Start Building' : 'Requirements Not Met'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Home className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-400 mb-2">Select a Building</h3>
                  <p className="text-slate-500">Choose a building from the list to view details and construction options.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}