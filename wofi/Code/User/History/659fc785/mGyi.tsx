"use client"

import { useState } from "react"
import { 
  Send, 
  Search, 
  Paperclip, 
  Smile, 
  Phone,
  Video,
  MoreVertical,
  Users,
  Hash,
  Plus,
  Bell,
  BellOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Dados mock de conversas
const conversations = [
  {
    id: 1,
    type: "direct",
    name: "Gabriel Monteiro",
    avatar: "/avatars/gabriel.jpg",
    lastMessage: "Podemos revisar o código hoje?",
    timestamp: "14:30",
    unread: 2,
    online: true
  },
  {
    id: 2,
    type: "direct",
    name: "Maria Silva",
    avatar: "/avatars/maria.jpg",
    lastMessage: "Aprovado! Pode prosseguir",
    timestamp: "13:45",
    unread: 0,
    online: false
  },
  {
    id: 3,
    type: "channel",
    name: "projeto-crm",
    avatar: null,
    lastMessage: "Ana: Tarefa de backend concluída",
    timestamp: "12:20",
    unread: 5,
    online: null
  },
  {
    id: 4,
    type: "channel",
    name: "geral",
    avatar: null,
    lastMessage: "João: Reunião amanhã às 9h",
    timestamp: "11:15",
    unread: 1,
    online: null
  },
  {
    id: 5,
    type: "direct",
    name: "Ana Costa",
    avatar: "/avatars/ana.jpg",
    lastMessage: "Obrigada pelo feedback!",
    timestamp: "10:30",
    unread: 0,
    online: true
  }
]

// Mensagens da conversa ativa
const messages = [
  {
    id: 1,
    sender: "Gabriel Monteiro",
    avatar: "/avatars/gabriel.jpg",
    content: "Oi! Como está o progresso do projeto?",
    timestamp: "14:20",
    isMe: false
  },
  {
    id: 2,
    sender: "Eu",
    avatar: "/avatars/me.jpg",
    content: "Está indo bem! Finalizei a parte do dashboard",
    timestamp: "14:22",
    isMe: true
  },
  {
    id: 3,
    sender: "Gabriel Monteiro",
    avatar: "/avatars/gabriel.jpg",
    content: "Excelente! Podemos revisar o código hoje?",
    timestamp: "14:30",
    isMe: false
  },
  {
    id: 4,
    sender: "Eu",
    avatar: "/avatars/me.jpg",
    content: "Claro! Que tal às 16h?",
    timestamp: "14:32",
    isMe: true
  }
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Aqui seria a lógica para enviar a mensagem
      console.log("Enviando:", newMessage)
      setNewMessage("")
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Sidebar de Conversas */}
      <div className="w-80 border-r bg-muted/30">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Mensagens</h2>
            <Button size="sm" variant="ghost">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100%-5rem)]">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedConversation.id === conversation.id ? "bg-muted" : ""
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="relative">
                  {conversation.type === "direct" ? (
                    <Avatar>
                      <AvatarImage src={conversation.avatar} alt={conversation.name} />
                      <AvatarFallback>
                        {conversation.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Hash className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  
                  {conversation.type === "direct" && conversation.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">
                      {conversation.type === "channel" ? "#" : ""}{conversation.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {conversation.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage}
                  </p>
                </div>

                {conversation.unread > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {conversation.unread}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Área Principal de Chat */}
      <div className="flex-1 flex flex-col">
        {/* Header da Conversa */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="relative">
              {selectedConversation.type === "direct" ? (
                <Avatar>
                  <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                  <AvatarFallback>
                    {selectedConversation.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Hash className="h-5 w-5 text-primary" />
                </div>
              )}
              
              {selectedConversation.type === "direct" && selectedConversation.online && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              )}
            </div>

            <div>
              <h2 className="font-semibold">
                {selectedConversation.type === "channel" ? "#" : ""}{selectedConversation.name}
              </h2>
              {selectedConversation.type === "direct" && (
                <p className="text-sm text-muted-foreground">
                  {selectedConversation.online ? "Online" : "Offline"}
                </p>
              )}
              {selectedConversation.type === "channel" && (
                <p className="text-sm text-muted-foreground">
                  <Users className="inline h-3 w-3 mr-1" />
                  12 membros
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedConversation.type === "direct" && (
              <>
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
              </>
            )}
            
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Opções</DropdownMenuLabel>
                <DropdownMenuItem>
                  <BellOff className="mr-2 h-4 w-4" />
                  Silenciar
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  Ver Membros
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Sair da Conversa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Área de Mensagens */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.isMe ? "flex-row-reverse" : ""}`}
              >
                {!message.isMe && (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={message.avatar} alt={message.sender} />
                    <AvatarFallback>
                      {message.sender.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={`max-w-xs lg:max-w-md ${message.isMe ? "text-right" : ""}`}>
                  {!message.isMe && (
                    <p className="text-sm font-medium mb-1">{message.sender}</p>
                  )}
                  <div
                    className={`rounded-lg px-3 py-2 text-sm ${
                      message.isMe
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input de Nova Mensagem */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                className="pr-10"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={sendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
