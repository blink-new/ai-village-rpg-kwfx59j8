import { useState } from 'react'
import { Character } from '../types/game'
import { availableCharacters } from '../data/characters'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'

interface CharacterSelectionProps {
  onCharacterSelect: (character: Character) => void
}

export function CharacterSelection({ onCharacterSelect }: CharacterSelectionProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)

  const handleSelect = (character: Character) => {
    setSelectedCharacter(character)
  }

  const handleConfirm = () => {
    if (selectedCharacter) {
      onCharacterSelect(selectedCharacter)
    }
  }

  const getClassColor = (characterClass: string) => {
    switch (characterClass) {
      case 'warrior': return 'bg-red-100 text-red-800 border-red-200'
      case 'mage': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'rogue': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'archer': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-amber-100 to-amber-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Medieval background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0 bg-repeat" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M30 30l15-15v30l-15-15zm-15 0l15 15v-30l-15 15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>
      
      <div className="max-w-6xl w-full relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-4">
            <span className="text-6xl">⚔️</span>
          </div>
          <h1 className="text-5xl font-bold text-amber-900 mb-4 font-serif tracking-wide">
            Choose Your Hero
          </h1>
          <p className="text-amber-700 text-xl font-medium">
            Select a character to begin your adventure in the mystical village of Eldermere
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-400 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {availableCharacters.map((character, index) => (
            <Card
              key={character.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-b from-amber-50 to-amber-100 border-2 animate-slide-up ${
                selectedCharacter?.id === character.id
                  ? 'ring-4 ring-amber-500 shadow-2xl scale-105 border-amber-400'
                  : 'hover:shadow-xl border-amber-200 hover:border-amber-300'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleSelect(character)}
            >
              <CardHeader className="text-center pb-2 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-amber-100/50 rounded-t-lg"></div>
                <div className="relative z-10">
                  <div className="text-7xl mb-3 transform hover:scale-110 transition-transform duration-200">
                    {character.sprite}
                  </div>
                  <CardTitle className="text-xl text-amber-900 font-serif mb-2">
                    {character.name}
                  </CardTitle>
                  <Badge className={`${getClassColor(character.class)} font-medium px-3 py-1`}>
                    {character.class.charAt(0).toUpperCase() + character.class.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-sm text-amber-700 mb-6 leading-relaxed">
                  {character.description}
                </CardDescription>
                
                <div className="space-y-3 bg-amber-50/50 p-4 rounded-lg border border-amber-200">
                  <div className="text-center text-xs font-semibold text-amber-800 mb-2 uppercase tracking-wide">
                    Character Stats
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-red-600 font-medium">❤️ Health</span>
                      <span className="font-bold text-red-700">{character.stats.health}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-medium">✨ Mana</span>
                      <span className="font-bold text-blue-700">{character.stats.mana}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-600 font-medium">💪 Strength</span>
                      <span className="font-bold text-orange-700">{character.stats.strength}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-600 font-medium">⚡ Agility</span>
                      <span className="font-bold text-green-700">{character.stats.agility}</span>
                    </div>
                    <div className="flex items-center justify-between col-span-2">
                      <span className="text-purple-600 font-medium">🧠 Intelligence</span>
                      <span className="font-bold text-purple-700">{character.stats.intelligence}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedCharacter && (
          <div className="text-center animate-fade-in">
            <div className="mb-4">
              <p className="text-amber-800 font-medium">
                Ready to embark on your quest as <span className="font-serif font-bold">{selectedCharacter.name}</span>?
              </p>
            </div>
            <Button
              onClick={handleConfirm}
              size="lg"
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-12 py-4 text-lg font-serif font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-amber-500"
            >
              <span className="mr-2">⚔️</span>
              Begin Adventure
              <span className="ml-2">🏰</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}