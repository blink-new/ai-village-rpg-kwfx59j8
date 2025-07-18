import { Character, Player } from '../types/game'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { ScrollText, Clock, CheckCircle, Hammer, Package, Home, Map, Zap, Heart, Shield, Star, Users, Cloud, Sun, Moon } from 'lucide-react'
import { Quest } from './QuestSystem'

interface GameHUDProps {
  character: Character
  player: Player
  quests?: Quest[]
  gameStats: {
    fps: number
    entitiesCount: number
    chunksLoaded: number
    timeOfDay: string
    weather: string
  }
  onBackToSelection: () => void
  onOpenQuests?: () => void
  onOpenCrafting?: () => void
  onOpenInventory?: () => void
  onOpenBuilding?: () => void
  onOpenMap?: () => void
}

export function GameHUD({ 
  character, 
  player, 
  quests = [], 
  gameStats,
  onBackToSelection, 
  onOpenQuests,
  onOpenCrafting,
  onOpenInventory,
  onOpenBuilding,
  onOpenMap
}: GameHUDProps) {
  const activeQuests = quests.filter(q => q.status === 'active')
  const completedQuests = quests.filter(q => q.status === 'completed')
  
  const getTimeIcon = () => {
    switch (gameStats.timeOfDay) {
      case 'dawn':
      case 'day':
        return <Sun className="h-4 w-4" />
      case 'dusk':
      case 'night':
        return <Moon className="h-4 w-4" />
      default:
        return <Sun className="h-4 w-4" />
    }
  }

  const getWeatherIcon = () => {
    switch (gameStats.weather.toLowerCase()) {
      case 'rain':
      case 'storm':
        return '🌧️'
      case 'snow':
        return '❄️'
      case 'fog':
        return '🌫️'
      default:
        return '☀️'
    }
  }
  
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 flex justify-between items-center border-b-2 border-amber-600">
      <div className="flex items-center space-x-6">
        {/* Character Info */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <span className="text-3xl">{character.sprite}</span>
            <div className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {player.level}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg text-amber-400">{player.name}</h3>
            <p className="text-sm text-slate-300 capitalize">{player.class}</p>
          </div>
        </div>
        
        {/* Vital Stats */}
        <Card className="bg-black bg-opacity-50 border-slate-600">
          <CardContent className="p-3">
            <div className="space-y-2 min-w-[220px]">
              <div className="flex items-center justify-between">
                <span className="text-red-400 text-sm flex items-center">
                  <Heart className="h-3 w-3 mr-1" />
                  Health
                </span>
                <span className="text-sm">{player.stats.health}/{player.stats.maxHealth}</span>
              </div>
              <Progress value={(player.stats.health / player.stats.maxHealth) * 100} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-blue-400 text-sm flex items-center">
                  <Zap className="h-3 w-3 mr-1" />
                  Mana
                </span>
                <span className="text-sm">{player.stats.mana}/{player.stats.maxMana}</span>
              </div>
              <Progress value={(player.stats.mana / player.stats.maxMana) * 100} className="h-2" />

              <div className="flex items-center justify-between">
                <span className="text-green-400 text-sm flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  Stamina
                </span>
                <span className="text-sm">{Math.floor(player.stats.stamina)}/{player.stats.maxStamina}</span>
              </div>
              <Progress value={(player.stats.stamina / player.stats.maxStamina) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Experience & Level */}
        <Card className="bg-black bg-opacity-50 border-slate-600">
          <CardContent className="p-3">
            <div className="space-y-2 min-w-[180px]">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 text-sm flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  Level {player.level}
                </span>
                <span className="text-xs text-slate-400">{player.skillPoints} SP</span>
              </div>
              <div className="text-xs text-slate-300">
                XP: {player.experience.toLocaleString()}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-red-400">ATK: {player.stats.attack}</div>
                <div className="text-blue-400">DEF: {player.stats.defense}</div>
                <div className="text-green-400">SPD: {player.stats.speed}</div>
                <div className="text-purple-400">MAG: {player.stats.magic}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quest Summary */}
        {(activeQuests.length > 0 || completedQuests.length > 0) && (
          <Card className="bg-black bg-opacity-50 border-slate-600">
            <CardContent className="p-3">
              <div className="space-y-2 min-w-[150px]">
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 text-sm flex items-center">
                    <ScrollText className="h-3 w-3 mr-1" />
                    Quests
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  {activeQuests.length > 0 && (
                    <Badge variant="outline" className="text-blue-400 border-blue-400 px-2 py-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {activeQuests.length}
                    </Badge>
                  )}
                  {completedQuests.length > 0 && (
                    <Badge variant="outline" className="text-green-400 border-green-400 px-2 py-1">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {completedQuests.length}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* World Info */}
        <Card className="bg-black bg-opacity-50 border-slate-600">
          <CardContent className="p-3">
            <div className="space-y-1 min-w-[160px]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300 flex items-center">
                  {getTimeIcon()}
                  <span className="ml-1 capitalize">{gameStats.timeOfDay}</span>
                </span>
                <span className="text-slate-400 flex items-center">
                  <span className="mr-1">{getWeatherIcon()}</span>
                  {gameStats.weather}
                </span>
              </div>
              <div className="text-xs text-slate-400 space-y-1">
                <div>Entities: {gameStats.entitiesCount}</div>
                <div>Chunks: {gameStats.chunksLoaded}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        {/* Quick Action Buttons */}
        <div className="flex items-center space-x-2">
          {onOpenInventory && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onOpenInventory}
              className="bg-slate-700 hover:bg-slate-600 text-white border-slate-500"
              title="Inventory (I)"
            >
              <Package className="h-4 w-4" />
            </Button>
          )}
          
          {onOpenCrafting && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onOpenCrafting}
              className="bg-orange-700 hover:bg-orange-600 text-white border-orange-500"
              title="Crafting (C)"
            >
              <Hammer className="h-4 w-4" />
            </Button>
          )}

          {onOpenBuilding && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onOpenBuilding}
              className="bg-brown-700 hover:bg-brown-600 text-white border-brown-500"
              title="Building (B)"
            >
              <Home className="h-4 w-4" />
            </Button>
          )}

          {onOpenMap && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onOpenMap}
              className="bg-green-700 hover:bg-green-600 text-white border-green-500"
              title="Map (M)"
            >
              <Map className="h-4 w-4" />
            </Button>
          )}

          {onOpenQuests && (
            <Button 
              variant="outline" 
              onClick={onOpenQuests}
              className="bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-500"
              title="Quests (Q)"
            >
              <ScrollText className="h-4 w-4 mr-2" />
              Quests ({activeQuests.length})
            </Button>
          )}
        </div>
        
        {/* Settings & Exit */}
        <div className="flex items-center space-x-2 border-l border-slate-600 pl-3">
          <Button 
            variant="outline" 
            onClick={onBackToSelection}
            className="bg-amber-600 hover:bg-amber-700 text-white border-amber-500"
          >
            Change Character
          </Button>
        </div>
      </div>
    </div>
  )
}