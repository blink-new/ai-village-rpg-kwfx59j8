import { useState } from 'react'
import { Character, NPC } from '../types/game'
import { blink } from '../blink/client'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { ScrollArea } from './ui/scroll-area'
import { X, Send } from 'lucide-react'
import { soundSystem } from '../utils/soundSystem'

interface DialogueSystemProps {
  npc: NPC
  character: Character
  messages: Array<{ role: 'user' | 'npc'; content: string }>
  gameContext: string[]
  onClose: () => void
  onUpdateMessages: (messages: Array<{ role: 'user' | 'npc'; content: string }>) => void
  onAddContext: (context: string) => void
}

export function DialogueSystem({
  npc,
  character,
  messages,
  gameContext,
  onClose,
  onUpdateMessages,
  onAddContext
}: DialogueSystemProps) {
  const [userInput, setUserInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const generateNPCResponse = async (userMessage: string) => {
    setIsGenerating(true)
    
    try {
      // Determine conversation tone and context based on message content
      const isGreeting = /^(hi|hello|hey|greetings|good)/i.test(userMessage)
      const isQuestion = userMessage.includes('?') || /^(what|where|when|why|how|who|can|do|are|is)/i.test(userMessage)
      const isQuest = /quest|task|help|mission|job|work/i.test(userMessage)
      const isTrade = /buy|sell|trade|shop|price|cost|gold|coin/i.test(userMessage)
      
      let roleSpecificContext = ''
      switch (npc.role.toLowerCase()) {
        case 'village blacksmith':
          roleSpecificContext = isQuest ? 
            'You have a quest: "My hammer has gone missing! I suspect goblins took it from my workshop. Could you help me retrieve it?"' :
            isTrade ? 'You can craft and repair weapons and armor. Your prices are fair and your work is the finest in the village.' :
            'You are busy working at your forge, the sound of hammer on anvil echoing through your shop.'
          break
        case 'traveling merchant':
          roleSpecificContext = isQuest ?
            'You have a quest: "I need someone trustworthy to deliver this package to the next village. The roads have been dangerous lately."' :
            isTrade ? 'You have exotic goods from distant lands: rare potions, magical trinkets, and fine silks. Everything has a price!' :
            'You are arranging your colorful wares, always ready to make a deal.'
          break
        case 'village guard captain':
          roleSpecificContext = isQuest ?
            'You have a quest: "Strange creatures have been spotted near the old ruins. We need someone brave to investigate and report back."' :
            'You are vigilant, watching over the village and its people. Security is your top priority.'
          break
        case 'village elder':
          roleSpecificContext = isQuest ?
            'You have a quest: "The ancient tome in our library speaks of a hidden treasure. Perhaps someone with courage could seek it out?"' :
            'You possess great wisdom about the village history and ancient lore. You speak thoughtfully and offer guidance.'
          break
        case 'village baker':
          roleSpecificContext = isQuest ?
            'You have a quest: "My special ingredient shipment never arrived! Could you check what happened to the merchant caravan?"' :
            isTrade ? 'You have fresh bread, sweet pastries, and hearty meals. The aroma fills the air around your shop.' :
            'You are kneading dough, flour dusting your apron as you work on the day\'s bread.'
          break
      }

      const contextPrompt = `
You are ${npc.name}, a ${npc.role} in the medieval village of Eldermere.

CHARACTER DETAILS:
- Personality: ${npc.personality}
- Background: ${npc.context.join(', ')}
- Current Situation: ${roleSpecificContext}

GAME CONTEXT:
${gameContext.join('\n')}

PLAYER CHARACTER:
- Name: ${character.name}
- Class: ${character.class}
- Description: ${character.description}

CONVERSATION HISTORY:
${messages.map(m => `${m.role === 'user' ? character.name : npc.name}: ${m.content}`).join('\n')}

CONVERSATION TYPE: ${isGreeting ? 'Greeting' : isQuestion ? 'Question' : isQuest ? 'Quest-related' : isTrade ? 'Trade/Commerce' : 'General'}

INSTRUCTIONS:
- Stay in character as ${npc.name}
- Respond naturally to: "${userMessage}"
- ${isGreeting ? 'Give a warm, character-appropriate greeting' : ''}
- ${isQuestion ? 'Answer helpfully while staying in character' : ''}
- ${isQuest ? 'Offer a quest or discuss quest-related matters if appropriate' : ''}
- ${isTrade ? 'Discuss trade, prices, or available goods/services' : ''}
- Keep responses 1-3 sentences for natural dialogue
- Be immersive and engaging
- Reference the current situation and your role

Player (${character.name}) says: "${userMessage}"

${npc.name} responds:
      `

      const { text } = await blink.ai.generateText({
        prompt: contextPrompt,
        model: 'gpt-4o-mini',
        maxTokens: 200
      })

      const npcResponse = text.trim()
      
      // Update messages with both user input and NPC response
      const newMessages = [
        ...messages,
        { role: 'user' as const, content: userMessage },
        { role: 'npc' as const, content: npcResponse }
      ]
      
      onUpdateMessages(newMessages)
      
      // Play dialogue sound
      soundSystem.playSound('dialogue', 0.2)
      
      // Add to game context with more detail
      const contextEntry = isQuest ? 
        `${character.name} discussed a quest with ${npc.name}` :
        isTrade ?
        `${character.name} talked about trade with ${npc.name}` :
        `${character.name} had a conversation with ${npc.name} about: ${userMessage.substring(0, 50)}${userMessage.length > 50 ? '...' : ''}`
      
      if (userMessage.length > 5) {
        onAddContext(contextEntry)
      }
      
    } catch (error) {
      console.error('Error generating NPC response:', error)
      const fallbackResponses = [
        `*${npc.name} looks thoughtful but seems distracted by their work*`,
        `*${npc.name} nods but appears to be considering something else*`,
        `*${npc.name} smiles politely but doesn't seem to hear you clearly*`
      ]
      const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
      
      const newMessages = [
        ...messages,
        { role: 'user' as const, content: userMessage },
        { role: 'npc' as const, content: fallbackResponse }
      ]
      
      onUpdateMessages(newMessages)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSendMessage = async () => {
    if (!userInput.trim() || isGenerating) return
    
    const message = userInput.trim()
    setUserInput('')
    
    await generateNPCResponse(message)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] bg-amber-50 border-amber-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{npc.sprite}</span>
            <div>
              <CardTitle className="text-xl text-amber-900">{npc.name}</CardTitle>
              <p className="text-sm text-amber-700">{npc.role}</p>
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
          <ScrollArea className="h-64 w-full border rounded-md p-4 bg-white">
            {messages.length === 0 ? (
              <div className="text-center text-amber-600 italic">
                {npc.name} looks at you expectantly. What would you like to say?
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}
                    >
                      <div className="text-xs font-medium mb-1">
                        {message.role === 'user' ? character.name : npc.name}
                      </div>
                      <div className="text-sm">{message.content}</div>
                    </div>
                  </div>
                ))}
                
                {isGenerating && (
                  <div className="flex justify-start">
                    <div className="bg-amber-100 text-amber-900 border border-amber-200 p-3 rounded-lg">
                      <div className="text-xs font-medium mb-1">{npc.name}</div>
                      <div className="text-sm italic">*thinking...*</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
          
          <div className="flex space-x-2">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Speak to ${npc.name}...`}
              disabled={isGenerating}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!userInput.trim() || isGenerating}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-xs text-amber-600 text-center">
            Press Enter to send • Shift+Enter for new line • ESC to close
          </div>
        </CardContent>
      </Card>
    </div>
  )
}