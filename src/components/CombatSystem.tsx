import { useState, useEffect } from 'react'
import { Character, Enemy, CombatAction, CombatResult } from '../types/game'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'

interface CombatSystemProps {
  player: Character
  enemy: Enemy
  onCombatEnd: (victory: boolean, rewards?: any) => void
  onPlayerUpdate: (player: Character) => void
}

export function CombatSystem({ player, enemy, onCombatEnd, onPlayerUpdate }: CombatSystemProps) {
  const [currentPlayer, setCurrentPlayer] = useState<Character>(player)
  const [currentEnemy, setCurrentEnemy] = useState<Enemy>(enemy)
  const [combatLog, setCombatLog] = useState<string[]>([])
  const [playerTurn, setPlayerTurn] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedAction, setSelectedAction] = useState<CombatAction | null>(null)

  useEffect(() => {
    if (!playerTurn && currentEnemy.health > 0) {
      const timer = setTimeout(() => {
        performEnemyAction()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [playerTurn, currentEnemy.health])

  useEffect(() => {
    if (currentPlayer.stats.health <= 0) {
      onCombatEnd(false)
    } else if (currentEnemy.health <= 0) {
      const rewards = calculateRewards()
      onCombatEnd(true, rewards)
    }
  }, [currentPlayer.stats.health, currentEnemy.health])

  const calculateDamage = (attacker: any, defender: any, action: CombatAction): CombatResult => {
    let baseDamage = 0
    let critical = false
    let blocked = false
    const effects: any[] = []

    // Calculate base damage
    if (action.type === 'attack') {
      baseDamage = attacker.stats?.strength || attacker.strength || 10
      if (attacker.equipment?.weapon) {
        baseDamage += attacker.equipment.weapon.stats?.damage || 0
      }
    } else if (action.type === 'spell') {
      baseDamage = (attacker.stats?.intelligence || attacker.intelligence || 10) * 2
      if (attacker.equipment?.weapon) {
        baseDamage += attacker.equipment.weapon.stats?.magicDamage || 0
      }
    }

    // Critical hit calculation
    const critChance = attacker.equipment?.weapon?.stats?.critChance || 5
    if (Math.random() * 100 < critChance) {
      critical = true
      baseDamage *= 2
    }

    // Defense calculation
    const defense = action.type === 'spell' 
      ? (defender.stats?.magicDefense || defender.magicDefense || 0)
      : (defender.stats?.defense || defender.defense || 0)
    
    const finalDamage = Math.max(1, baseDamage - defense)

    // Block chance (if defender has shield)
    if (defender.equipment?.offhand?.subtype === 'shield' && Math.random() < 0.2) {
      blocked = true
      return {
        damage: Math.floor(finalDamage * 0.3),
        critical: false,
        blocked: true,
        effects,
        message: `${defender.name || 'Enemy'} blocks most of the attack!`
      }
    }

    return {
      damage: finalDamage,
      critical,
      blocked,
      effects,
      message: critical ? 'Critical hit!' : ''
    }
  }

  const performPlayerAction = (action: CombatAction) => {
    if (isAnimating) return

    setIsAnimating(true)
    setSelectedAction(action)

    const result = calculateDamage(currentPlayer, currentEnemy, action)
    
    // Apply damage to enemy
    const newEnemyHealth = Math.max(0, currentEnemy.health - result.damage)
    setCurrentEnemy(prev => ({ ...prev, health: newEnemyHealth }))

    // Update combat log
    const logMessage = `${currentPlayer.name} ${action.type}s for ${result.damage} damage! ${result.message}`
    setCombatLog(prev => [...prev, logMessage])

    // Check for special effects
    if (action.type === 'spell' && currentPlayer.stats.mana >= 20) {
      setCurrentPlayer(prev => ({
        ...prev,
        stats: { ...prev.stats, mana: prev.stats.mana - 20 }
      }))
    }

    setTimeout(() => {
      setIsAnimating(false)
      setPlayerTurn(false)
    }, 1000)
  }

  const performEnemyAction = () => {
    if (currentEnemy.health <= 0) return

    // AI chooses action based on enemy type and current situation
    const availableAbilities = currentEnemy.abilities.filter(ability => 
      currentEnemy.mana >= ability.manaCost
    )

    const chosenAbility = availableAbilities.length > 0 
      ? availableAbilities[Math.floor(Math.random() * availableAbilities.length)]
      : null

    const action: CombatAction = chosenAbility 
      ? { type: 'spell', spellId: chosenAbility.id }
      : { type: 'attack' }

    const result = calculateDamage(currentEnemy, currentPlayer, action)
    
    // Apply damage to player
    const newPlayerHealth = Math.max(0, currentPlayer.stats.health - result.damage)
    setCurrentPlayer(prev => ({
      ...prev,
      stats: { ...prev.stats, health: newPlayerHealth }
    }))

    // Update mana if spell was used
    if (chosenAbility) {
      setCurrentEnemy(prev => ({
        ...prev,
        mana: prev.mana - chosenAbility.manaCost
      }))
    }

    // Update combat log
    const actionName = chosenAbility ? chosenAbility.name : 'Basic Attack'
    const logMessage = `${currentEnemy.name} uses ${actionName} for ${result.damage} damage! ${result.message}`
    setCombatLog(prev => [...prev, logMessage])

    setTimeout(() => {
      setPlayerTurn(true)
    }, 1000)
  }

  const consumeItem = (itemId: string) => {
    const item = currentPlayer.inventory.find(i => i.id === itemId && i.type === 'consumable')
    if (!item || item.quantity <= 0) return

    // Apply item effects
    item.effects?.forEach(effect => {
      if (effect.type === 'heal') {
        const newHealth = Math.min(
          currentPlayer.stats.maxHealth,
          currentPlayer.stats.health + effect.value
        )
        setCurrentPlayer(prev => ({
          ...prev,
          stats: { ...prev.stats, health: newHealth }
        }))
        setCombatLog(prev => [...prev, `${currentPlayer.name} heals for ${effect.value} HP!`])
      } else if (effect.type === 'mana_restore') {
        const newMana = Math.min(
          currentPlayer.stats.maxMana,
          currentPlayer.stats.mana + effect.value
        )
        setCurrentPlayer(prev => ({
          ...prev,
          stats: { ...prev.stats, mana: newMana }
        }))
        setCombatLog(prev => [...prev, `${currentPlayer.name} restores ${effect.value} MP!`])
      }
    })

    // Consume item
    setCurrentPlayer(prev => ({
      ...prev,
      inventory: prev.inventory.map(i => 
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      )
    }))

    setPlayerTurn(false)
  }

  const calculateRewards = () => {
    return {
      experience: currentEnemy.experience,
      gold: currentEnemy.gold,
      items: currentEnemy.loot.filter(loot => Math.random() < loot.chance)
        .map(loot => ({
          id: loot.itemId,
          quantity: Math.floor(Math.random() * (loot.maxQuantity - loot.minQuantity + 1)) + loot.minQuantity
        }))
    }
  }

  const getHealthPercentage = (current: number, max: number) => {
    return (current / max) * 100
  }

  const getManaPercentage = (current: number, max: number) => {
    return (current / max) * 100
  }

  const consumableItems = currentPlayer.inventory.filter(item => 
    item.type === 'consumable' && item.quantity > 0
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="max-w-6xl w-full mx-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Player Status */}
        <Card className="bg-gradient-to-b from-blue-50 to-blue-100 border-blue-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <span className="text-2xl">{currentPlayer.sprite}</span>
              {currentPlayer.name}
              <Badge variant="outline" className="ml-auto">
                Level {currentPlayer.level}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-red-600 font-medium">Health</span>
                <span className="font-bold">{currentPlayer.stats.health}/{currentPlayer.stats.maxHealth}</span>
              </div>
              <Progress 
                value={getHealthPercentage(currentPlayer.stats.health, currentPlayer.stats.maxHealth)} 
                className="h-3"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-blue-600 font-medium">Mana</span>
                <span className="font-bold">{currentPlayer.stats.mana}/{currentPlayer.stats.maxMana}</span>
              </div>
              <Progress 
                value={getManaPercentage(currentPlayer.stats.mana, currentPlayer.stats.maxMana)} 
                className="h-3"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span>⚔️ STR</span>
                <span className="font-bold">{currentPlayer.stats.strength}</span>
              </div>
              <div className="flex justify-between">
                <span>⚡ AGI</span>
                <span className="font-bold">{currentPlayer.stats.agility}</span>
              </div>
              <div className="flex justify-between">
                <span>🧠 INT</span>
                <span className="font-bold">{currentPlayer.stats.intelligence}</span>
              </div>
              <div className="flex justify-between">
                <span>🛡️ DEF</span>
                <span className="font-bold">{currentPlayer.equipment.armor?.stats?.defense || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Combat Actions */}
        <Card className="bg-gradient-to-b from-amber-50 to-amber-100 border-amber-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-amber-900">
              {playerTurn ? 'Your Turn' : 'Enemy Turn'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {playerTurn && !isAnimating && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => performPlayerAction({ type: 'attack' })}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    ⚔️ Attack
                  </Button>
                  <Button
                    onClick={() => performPlayerAction({ type: 'spell' })}
                    disabled={currentPlayer.stats.mana < 20}
                    className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                  >
                    ✨ Cast Spell
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-amber-900">Use Items:</h4>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {consumableItems.map(item => (
                      <Button
                        key={item.id}
                        onClick={() => {
                          consumeItem(item.id)
                        }}
                        variant="outline"
                        size="sm"
                        className="text-xs p-2 h-auto"
                      >
                        <span className="mr-1">{item.icon}</span>
                        {item.name}
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {item.quantity}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {isAnimating && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2 animate-bounce">⚡</div>
                <p className="text-amber-700 font-medium">Executing action...</p>
              </div>
            )}

            {!playerTurn && !isAnimating && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2 animate-pulse">{currentEnemy.sprite}</div>
                <p className="text-amber-700 font-medium">Enemy is thinking...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enemy Status */}
        <Card className="bg-gradient-to-b from-red-50 to-red-100 border-red-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-900">
              <span className="text-2xl">{currentEnemy.sprite}</span>
              {currentEnemy.name}
              <Badge variant="outline" className="ml-auto">
                Level {currentEnemy.level}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-red-600 font-medium">Health</span>
                <span className="font-bold">{currentEnemy.health}/{currentEnemy.maxHealth}</span>
              </div>
              <Progress 
                value={getHealthPercentage(currentEnemy.health, currentEnemy.maxHealth)} 
                className="h-3"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-blue-600 font-medium">Mana</span>
                <span className="font-bold">{currentEnemy.mana}/{currentEnemy.maxMana}</span>
              </div>
              <Progress 
                value={getManaPercentage(currentEnemy.mana, currentEnemy.maxMana)} 
                className="h-3"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span>⚔️ STR</span>
                <span className="font-bold">{currentEnemy.stats.strength}</span>
              </div>
              <div className="flex justify-between">
                <span>⚡ AGI</span>
                <span className="font-bold">{currentEnemy.stats.agility}</span>
              </div>
              <div className="flex justify-between">
                <span>🧠 INT</span>
                <span className="font-bold">{currentEnemy.stats.intelligence}</span>
              </div>
              <div className="flex justify-between">
                <span>🛡️ DEF</span>
                <span className="font-bold">{currentEnemy.stats.defense}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-red-900">Abilities:</h4>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {currentEnemy.abilities.map(ability => (
                  <div key={ability.id} className="text-xs bg-red-200 p-2 rounded">
                    <div className="font-medium">{ability.name}</div>
                    <div className="text-red-700">{ability.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Combat Log */}
        <Card className="lg:col-span-3 bg-gradient-to-b from-gray-50 to-gray-100 border-gray-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-900">Combat Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 overflow-y-auto space-y-1 bg-black text-green-400 p-3 rounded font-mono text-sm">
              {combatLog.length === 0 && (
                <div className="text-green-600">Combat begins! Choose your action...</div>
              )}
              {combatLog.map((log, index) => (
                <div key={index} className="animate-fade-in">
                  &gt; {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}