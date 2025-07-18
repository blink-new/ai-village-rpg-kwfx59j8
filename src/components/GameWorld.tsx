import { useEffect, useRef, useState, useCallback } from 'react'
import { Character, Player } from '../types/game'
import { GameEngine, GameConfig } from '../engine/GameEngine'
import { EpicRenderer, RenderConfig } from '../engine/EpicRenderer'
import { DialogueSystem } from './DialogueSystem'
import { GameHUD } from './GameHUD'
import { QuestSystem, Quest } from './QuestSystem'
import { CraftingSystem } from './CraftingSystem'
import { InventorySystem } from './InventorySystem'
import { BuildingSystem } from './BuildingSystem'
import { soundSystem, initSoundsOnInteraction } from '../utils/soundSystem'
import { createClient } from '../blink/client'

const blink = createClient({
  projectId: 'ai-village-rpg-kwfx59j8',
  authRequired: true
})

interface GameWorldProps {
  selectedCharacter: Character
  onBackToSelection: () => void
}

export function GameWorld({ selectedCharacter, onBackToSelection }: GameWorldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameEngineRef = useRef<GameEngine | null>(null)
  const rendererRef = useRef<EpicRenderer | null>(null)
  const keysPressed = useRef<Set<string>>(new Set())
  
  const [gameInitialized, setGameInitialized] = useState(false)
  const [player, setPlayer] = useState<Player | null>(null)
  const [currentDialogue, setCurrentDialogue] = useState<{
    npc: any | null
    messages: Array<{ role: 'user' | 'npc'; content: string }>
    isActive: boolean
  }>({
    npc: null,
    messages: [],
    isActive: false
  })
  
  // UI State
  const [showQuestSystem, setShowQuestSystem] = useState(false)
  const [showCrafting, setShowCrafting] = useState(false)
  const [showInventory, setShowInventory] = useState(false)
  const [showBuilding, setShowBuilding] = useState(false)
  const [showMap, setShowMap] = useState(false)
  
  // Game state
  const [quests, setQuests] = useState<Quest[]>([])
  const [gameStats, setGameStats] = useState({
    fps: 0,
    entitiesCount: 0,
    chunksLoaded: 0,
    timeOfDay: 'day',
    weather: 'clear'
  })

  // Initialize game engine and renderer
  useEffect(() => {
    if (!canvasRef.current || gameInitialized) return

    const canvas = canvasRef.current
    
    // Convert character to player
    const initialPlayer: Player = {
      id: 'player',
      name: selectedCharacter.name,
      class: selectedCharacter.class as any,
      level: selectedCharacter.level,
      experience: selectedCharacter.experience,
      skillPoints: 0,
      stats: {
        health: selectedCharacter.stats.health,
        maxHealth: selectedCharacter.stats.maxHealth,
        mana: selectedCharacter.stats.mana,
        maxMana: selectedCharacter.stats.maxMana,
        stamina: selectedCharacter.stats.stamina,
        maxStamina: selectedCharacter.stats.maxStamina,
        attack: selectedCharacter.stats.strength,
        defense: selectedCharacter.stats.vitality,
        speed: selectedCharacter.stats.agility,
        magic: selectedCharacter.stats.intelligence,
        luck: selectedCharacter.stats.luck,
        charisma: selectedCharacter.stats.faith
      },
      position: {
        x: 0,
        y: 0,
        chunkX: 0,
        chunkY: 0
      },
      inventory: [],
      equipment: {
        weapon: selectedCharacter.equipment.weapon?.id,
        armor: selectedCharacter.equipment.armor?.id,
        helmet: selectedCharacter.equipment.helmet?.id,
        boots: selectedCharacter.equipment.boots?.id,
        gloves: selectedCharacter.equipment.gloves?.id,
        ring1: selectedCharacter.equipment.ring1?.id,
        ring2: selectedCharacter.equipment.ring2?.id,
        amulet: selectedCharacter.equipment.amulet?.id
      },
      quests: [],
      skills: {
        combat: selectedCharacter.skills.combat.swordMastery,
        magic: selectedCharacter.skills.magic.destruction,
        crafting: selectedCharacter.skills.survival.crafting,
        mining: 1,
        farming: 1,
        fishing: 1,
        cooking: selectedCharacter.skills.survival.cooking,
        alchemy: selectedCharacter.skills.survival.alchemy,
        enchanting: selectedCharacter.skills.magic.enchantment,
        lockpicking: selectedCharacter.skills.stealth.lockpicking,
        stealth: selectedCharacter.skills.stealth.sneak,
        archery: selectedCharacter.skills.combat.archery
      },
      achievements: [],
      reputation: {
        village: 0,
        merchants: 0,
        guards: 0,
        thieves: 0,
        mages: 0
      }
    }

    // Game engine configuration
    const gameConfig: GameConfig = {
      worldSeed: Math.random() * 1000000,
      renderDistance: 1, // Reduced from 3 to 1 for instant loading
      tickRate: 60,
      autoSave: true,
      autoSaveInterval: 30000
    }

    // Renderer configuration
    const renderConfig: RenderConfig = {
      tileSize: 32,
      viewportWidth: canvas.width,
      viewportHeight: canvas.height,
      renderDistance: 10, // Reduced from 20 to 10
      enableParticles: false, // Disabled initially for faster loading
      enableLighting: false,  // Disabled initially for faster loading
      enableWeatherEffects: false, // Disabled initially for faster loading
      enableShadows: false,   // Disabled initially for faster loading
      pixelArt: true,
      antiAliasing: false,
      bloomEffect: false,     // Disabled initially for faster loading
      screenShake: true
    }

    // Initialize game engine
    const gameEngine = new GameEngine(gameConfig, initialPlayer)
    gameEngineRef.current = gameEngine

    // Initialize epic renderer
    const renderer = new EpicRenderer(canvas, gameEngine, renderConfig)
    rendererRef.current = renderer

    // Set up event listeners
    gameEngine.on('onPlayerMove', (x, y) => {
      // Update player position in state if needed
    })

    gameEngine.on('onEntitySpawn', (entity) => {
      console.log('Entity spawned:', entity.id)
    })

    gameEngine.on('onCombatEvent', (event) => {
      if (event.type === 'attack') {
        renderer.shakeCamera(5, 200)
        soundSystem.playSound('combat', 0.4)
      }
    })

    gameEngine.on('onLevelUp', (newLevel) => {
      soundSystem.playSound('levelUp', 0.6)
      renderer.shakeCamera(10, 500)
    })

    // Start game loop
    gameEngine.start()
    setPlayer(initialPlayer)
    setGameInitialized(true)

    // Start render loop
    const renderLoop = () => {
      renderer.render()
      requestAnimationFrame(renderLoop)
    }
    renderLoop()

    // Cleanup
    return () => {
      gameEngine.stop()
    }
  }, [selectedCharacter, gameInitialized])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      keysPressed.current.add(key)

      // Handle UI toggles
      if (currentDialogue.isActive) {
        if (key === 'escape') {
          closeDialogue()
        }
        return
      }

      switch (key) {
        case 'e':
          handleInteraction()
          break
        case 'q':
          setShowQuestSystem(true)
          break
        case 'c':
          setShowCrafting(true)
          break
        case 'i':
          setShowInventory(true)
          break
        case 'b':
          setShowBuilding(true)
          break
        case 'm':
          setShowMap(true)
          break
        case 'space':
          gameEngineRef.current?.playerJump()
          break
        case 'escape':
          // Close any open UI
          setShowQuestSystem(false)
          setShowCrafting(false)
          setShowInventory(false)
          setShowBuilding(false)
          setShowMap(false)
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase())
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [currentDialogue.isActive])

  // Continuous movement handling
  useEffect(() => {
    if (!gameEngineRef.current) return

    const movePlayer = () => {
      const gameEngine = gameEngineRef.current!
      const moveIntensity = 1

      if (keysPressed.current.has('w') || keysPressed.current.has('arrowup')) {
        gameEngine.movePlayer('up', moveIntensity)
      }
      if (keysPressed.current.has('s') || keysPressed.current.has('arrowdown')) {
        gameEngine.movePlayer('down', moveIntensity)
      }
      if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) {
        gameEngine.movePlayer('left', moveIntensity)
      }
      if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) {
        gameEngine.movePlayer('right', moveIntensity)
      }
    }

    const interval = setInterval(movePlayer, 16) // ~60 FPS
    return () => clearInterval(interval)
  }, [gameInitialized])

  // Update game stats periodically
  useEffect(() => {
    if (!gameEngineRef.current) return

    const updateStats = () => {
      const gameEngine = gameEngineRef.current!
      const entities = gameEngine.getEntities()
      const worldState = gameEngine.getWorldState()
      const timeInfo = gameEngine.getTimeInfo()
      const weatherInfo = gameEngine.getWeatherEffects()

      setGameStats({
        fps: 60, // Placeholder
        entitiesCount: entities.length,
        chunksLoaded: worldState.loadedChunks.size,
        timeOfDay: timeInfo.dayPhase || 'day',
        weather: weatherInfo.weatherString || 'clear'
      })

      // Update player state
      const currentPlayer = gameEngine.getPlayer()
      setPlayer(currentPlayer)
    }

    const interval = setInterval(updateStats, 1000)
    return () => clearInterval(interval)
  }, [gameInitialized])

  const handleInteraction = useCallback(() => {
    if (!gameEngineRef.current) return

    initSoundsOnInteraction()
    
    const gameEngine = gameEngineRef.current
    const entities = gameEngine.getEntities()
    const player = gameEngine.getPlayer()

    // Find nearby NPCs
    const nearbyNPC = entities.find(entity => {
      if (entity.type !== 'npc') return false
      
      const distance = Math.sqrt(
        Math.pow(player.position.x - entity.x, 2) + 
        Math.pow(player.position.y - entity.y, 2)
      )
      return distance < 64
    })

    if (nearbyNPC) {
      soundSystem.playSound('interact', 0.3)
      startDialogue(nearbyNPC)
    } else {
      // Try to attack nearby enemies
      const nearbyEnemy = entities.find(entity => {
        if (entity.type !== 'enemy') return false
        
        const distance = Math.sqrt(
          Math.pow(player.position.x - entity.x, 2) + 
          Math.pow(player.position.y - entity.y, 2)
        )
        return distance < 64
      })

      if (nearbyEnemy) {
        gameEngine.playerAttack(nearbyEnemy.id)
      } else {
        soundSystem.playSound('error', 0.2)
      }
    }
  }, [gameInitialized])

  const startDialogue = (npc: any) => {
    setCurrentDialogue({
      npc,
      messages: [],
      isActive: true
    })
  }

  const closeDialogue = () => {
    setCurrentDialogue({
      npc: null,
      messages: [],
      isActive: false
    })
  }

  const handleAcceptQuest = (questId: string) => {
    setQuests(prev => prev.map(quest => 
      quest.id === questId ? { ...quest, status: 'active' as const } : quest
    ))
    const quest = quests.find(q => q.id === questId)
    if (quest) {
      soundSystem.playSound('questAccept', 0.4)
    }
  }

  const handleCompleteQuest = (questId: string) => {
    setQuests(prev => prev.map(quest => 
      quest.id === questId ? { ...quest, status: 'completed' as const } : quest
    ))
    const quest = quests.find(q => q.id === questId)
    if (quest) {
      soundSystem.playSound('questComplete', 0.5)
    }
  }

  const handleCraftItem = (recipeId: string) => {
    if (!gameEngineRef.current) return
    
    const craftingSystem = gameEngineRef.current.getCraftingSystem()
    const success = craftingSystem.startCrafting(recipeId)
    
    if (success) {
      soundSystem.playSound('craft', 0.4)
    } else {
      soundSystem.playSound('error', 0.2)
    }
  }

  if (!gameInitialized || !player) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Initializing Game Engine...</h2>
          <p className="text-amber-300">Setting up procedural world generation, physics, and AI systems...</p>
          <div className="mt-4 text-sm text-gray-400">
            ⚡ Optimized for instant loading - world generates as you explore!
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-700 flex flex-col">
      <GameHUD 
        character={selectedCharacter}
        player={player}
        quests={quests}
        gameStats={gameStats}
        onBackToSelection={onBackToSelection}
        onOpenQuests={() => setShowQuestSystem(true)}
        onOpenCrafting={() => setShowCrafting(true)}
        onOpenInventory={() => setShowInventory(true)}
        onOpenBuilding={() => setShowBuilding(true)}
        onOpenMap={() => setShowMap(true)}
      />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={1200}
            height={800}
            className="border-4 border-amber-600 rounded-lg shadow-2xl bg-slate-800"
          />
          
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-sm space-y-1">
            <div className="text-amber-400 font-bold">Epic 2D Open World RPG</div>
            <div>WASD: Move • SPACE: Jump • E: Interact/Attack</div>
            <div>Q: Quests • C: Crafting • I: Inventory • B: Building • M: Map</div>
            <div className="text-xs text-gray-400 mt-2">
              Entities: {gameStats.entitiesCount} | Chunks: {gameStats.chunksLoaded} | {gameStats.timeOfDay} | {gameStats.weather}
            </div>
          </div>

          {/* Weather indicator */}
          <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-2 rounded-lg text-sm">
            <div className="flex items-center space-x-2">
              <span>🌤️</span>
              <span>{gameStats.weather}</span>
              <span>•</span>
              <span>{gameStats.timeOfDay}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogue System */}
      {currentDialogue.isActive && currentDialogue.npc && (
        <DialogueSystem
          npc={currentDialogue.npc}
          character={selectedCharacter}
          messages={currentDialogue.messages}
          gameContext={[`Playing in an epic open world as ${player.name}`]}
          onClose={closeDialogue}
          onUpdateMessages={(messages) => 
            setCurrentDialogue(prev => ({ ...prev, messages }))
          }
          onAddContext={() => {}}
        />
      )}

      {/* Quest System */}
      {showQuestSystem && (
        <QuestSystem
          quests={quests}
          onClose={() => setShowQuestSystem(false)}
          onAcceptQuest={handleAcceptQuest}
          onCompleteQuest={handleCompleteQuest}
        />
      )}

      {/* Crafting System */}
      {showCrafting && gameEngineRef.current && (
        <CraftingSystem
          craftingSystem={gameEngineRef.current.getCraftingSystem()}
          onClose={() => setShowCrafting(false)}
          onCraftItem={handleCraftItem}
        />
      )}

      {/* Inventory System */}
      {showInventory && gameEngineRef.current && (
        <InventorySystem
          craftingSystem={gameEngineRef.current.getCraftingSystem()}
          player={player}
          onClose={() => setShowInventory(false)}
        />
      )}

      {/* Building System */}
      {showBuilding && (
        <BuildingSystem
          player={player}
          onClose={() => setShowBuilding(false)}
        />
      )}
    </div>
  )
}