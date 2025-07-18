import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { X, CheckCircle, Clock, Star } from 'lucide-react'

export interface Quest {
  id: string
  title: string
  description: string
  giver: string
  reward: string
  status: 'available' | 'active' | 'completed'
  difficulty: 'easy' | 'medium' | 'hard'
  progress?: string
}

interface QuestSystemProps {
  quests: Quest[]
  onClose: () => void
  onAcceptQuest: (questId: string) => void
  onCompleteQuest: (questId: string) => void
}

export function QuestSystem({ quests, onClose, onAcceptQuest, onCompleteQuest }: QuestSystemProps) {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'hard': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'active': return <Clock className="h-4 w-4 text-blue-600" />
      default: return <Star className="h-4 w-4 text-yellow-600" />
    }
  }

  const activeQuests = quests.filter(q => q.status === 'active')
  const availableQuests = quests.filter(q => q.status === 'available')
  const completedQuests = quests.filter(q => q.status === 'completed')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[80vh] bg-amber-50 border-amber-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">📜</span>
            <div>
              <CardTitle className="text-2xl text-amber-900 font-serif">Quest Journal</CardTitle>
              <p className="text-sm text-amber-700">Track your adventures and missions</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-amber-700 hover:text-amber-900"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[60vh]">
            {/* Quest List */}
            <div className="lg:col-span-1 space-y-4">
              {/* Active Quests */}
              {activeQuests.length > 0 && (
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Active Quests ({activeQuests.length})
                  </h3>
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {activeQuests.map((quest) => (
                        <div
                          key={quest.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedQuest?.id === quest.id
                              ? 'bg-blue-100 border-blue-300'
                              : 'bg-white border-amber-200 hover:bg-amber-50'
                          }`}
                          onClick={() => setSelectedQuest(quest)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(quest.status)}
                              <span className="font-medium text-sm">{quest.title}</span>
                            </div>
                            <Badge className={getDifficultyColor(quest.difficulty)}>
                              {quest.difficulty}
                            </Badge>
                          </div>
                          {quest.progress && (
                            <p className="text-xs text-gray-600 mt-1">{quest.progress}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* Available Quests */}
              {availableQuests.length > 0 && (
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2 flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    Available Quests ({availableQuests.length})
                  </h3>
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {availableQuests.map((quest) => (
                        <div
                          key={quest.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedQuest?.id === quest.id
                              ? 'bg-blue-100 border-blue-300'
                              : 'bg-white border-amber-200 hover:bg-amber-50'
                          }`}
                          onClick={() => setSelectedQuest(quest)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(quest.status)}
                              <span className="font-medium text-sm">{quest.title}</span>
                            </div>
                            <Badge className={getDifficultyColor(quest.difficulty)}>
                              {quest.difficulty}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">From: {quest.giver}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* Completed Quests */}
              {completedQuests.length > 0 && (
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completed ({completedQuests.length})
                  </h3>
                  <ScrollArea className="h-24">
                    <div className="space-y-2">
                      {completedQuests.map((quest) => (
                        <div
                          key={quest.id}
                          className={`p-2 rounded-lg border cursor-pointer transition-colors opacity-75 ${
                            selectedQuest?.id === quest.id
                              ? 'bg-blue-100 border-blue-300'
                              : 'bg-white border-amber-200 hover:bg-amber-50'
                          }`}
                          onClick={() => setSelectedQuest(quest)}
                        >
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(quest.status)}
                            <span className="font-medium text-sm line-through">{quest.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>

            {/* Quest Details */}
            <div className="lg:col-span-2">
              {selectedQuest ? (
                <div className="bg-white rounded-lg border border-amber-200 p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(selectedQuest.status)}
                      <h2 className="text-xl font-bold text-amber-900 font-serif">
                        {selectedQuest.title}
                      </h2>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getDifficultyColor(selectedQuest.difficulty)}>
                        {selectedQuest.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-amber-700 border-amber-300">
                        {selectedQuest.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-amber-800 mb-2">Quest Giver</h3>
                      <p className="text-amber-700">{selectedQuest.giver}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-amber-800 mb-2">Description</h3>
                      <p className="text-amber-700 leading-relaxed">{selectedQuest.description}</p>
                    </div>

                    {selectedQuest.progress && (
                      <div>
                        <h3 className="font-semibold text-amber-800 mb-2">Progress</h3>
                        <p className="text-blue-700 italic">{selectedQuest.progress}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold text-amber-800 mb-2">Reward</h3>
                      <p className="text-green-700 font-medium">{selectedQuest.reward}</p>
                    </div>

                    <div className="flex space-x-2 pt-4">
                      {selectedQuest.status === 'available' && (
                        <Button
                          onClick={() => onAcceptQuest(selectedQuest.id)}
                          className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                          Accept Quest
                        </Button>
                      )}
                      {selectedQuest.status === 'active' && (
                        <Button
                          onClick={() => onCompleteQuest(selectedQuest.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Complete Quest
                        </Button>
                      )}
                      {selectedQuest.status === 'completed' && (
                        <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
                          ✓ Quest Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-amber-200 p-6 h-full flex items-center justify-center">
                  <div className="text-center text-amber-600">
                    <div className="text-4xl mb-4">📜</div>
                    <p className="text-lg font-medium">Select a quest to view details</p>
                    <p className="text-sm mt-2">Choose from available, active, or completed quests</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}