import { useState, useEffect } from 'react'
import { Character } from './types/game'
import { CharacterSelection } from './components/CharacterSelection'
import { GameWorld } from './components/GameWorld'
import { blink } from './blink/client'

function App() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character)
  }

  const handleBackToSelection = () => {
    setSelectedCharacter(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚔️</div>
          <h1 className="text-2xl font-bold text-amber-900 mb-2">Loading Adventure...</h1>
          <p className="text-amber-700">Preparing your village RPG experience</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏰</div>
          <h1 className="text-3xl font-bold text-amber-900 mb-4">AI-Powered Village RPG</h1>
          <p className="text-amber-700 mb-6">Please sign in to begin your adventure</p>
          <button
            onClick={() => blink.auth.login()}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Sign In to Play
          </button>
        </div>
      </div>
    )
  }

  if (!selectedCharacter) {
    return <CharacterSelection onCharacterSelect={handleCharacterSelect} />
  }

  return (
    <GameWorld 
      selectedCharacter={selectedCharacter} 
      onBackToSelection={handleBackToSelection}
    />
  )
}

export default App