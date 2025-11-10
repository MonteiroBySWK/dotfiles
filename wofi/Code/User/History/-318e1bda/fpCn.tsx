"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  MessageCircle,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Search,
  Plus,
  Settings,
  Users,
  Hash,
  Lock,
  Globe,
  Pin,
  Star,
  Archive,
  Trash2,
  Edit,
  Reply,
  Forward,
  Download,
  Image,
  File,
  Mic,
  Camera
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { PageContainer } from "@/components/layout/page-container"

type Message = {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  timestamp: string
  type: "text" | "image" | "file" | "system"
  attachments?: {
    name: string
    url: string
    type: string
    size: string
  }[]
  isEdited?: boolean
  replies?: string[]
  reactions?: {
    emoji: string
    users: string[]
  }[]
}

type Channel = {
  id: string
  name: string
  description?: string
  type: "public" | "private" | "direct"
  members: string[]
  unreadCount: number
  lastMessage?: string
  lastActivity: string
  isOnline?: boolean
}

type User = {
  id: string
  name: string
  avatar: string
  status: "online" | "away" | "busy" | "offline"
  role: string
  department: string
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "João Silva",
    avatar: "/avatars/joao.jpg",
    status: "online",
    role: "Desenvolvedor Senior",
    department: "Tecnologia"
  },
  {
    id: "2",
    name: "Maria Santos",
    avatar: "/avatars/maria.jpg",
    status: "online",
    role: "Designer UX/UI",
    department: "Design"
  },
  {
    id: "3",
    name: "Carlos Oliveira",
    avatar: "/avatars/carlos.jpg",
    status: "away",
    role: "Project Manager",
    department: "Gestão"
  },
  {
    id: "4",
    name: "Ana Costa",
    avatar: "/avatars/ana.jpg",
    status: "busy",
    role: "QA Analyst",
    department: "Qualidade"
  },
  {
    id: "5",
    name: "Pedro Lima",
    avatar: "/avatars/pedro.jpg",
    status: "offline",
    role: "DevOps Engineer",
    department: "Infraestrutura"
  }
]

const mockChannels: Channel[] = [
  {
    id: "general",
    name: "geral",
    description: "Canal principal para discussões gerais",
    type: "public",
    members: ["1", "2", "3", "4", "5"],
    unreadCount: 3,
    lastMessage: "Boa tarde, pessoal! Como estão os projetos?",
    lastActivity: "2024-01-15T14:30:00Z"
  },
  {
    id: "development",
    name: "desenvolvimento",
    description: "Discussões técnicas e código",
    type: "public",
    members: ["1", "3", "5"],
    unreadCount: 1,
    lastMessage: "Precisamos revisar a PR #234",
    lastActivity: "2024-01-15T13:45:00Z"
  },
  {
    id: "design",
    name: "design",
    description: "Feedback de design e UI/UX",
    type: "public",
    members: ["2", "3"],
    unreadCount: 0,
    lastMessage: "Mockups do novo dashboard prontos",
    lastActivity: "2024-01-15T10:20:00Z"
  },
  {
    id: "dm-maria",
    name: "Maria Santos",
    type: "direct",
    members: ["1", "2"],
    unreadCount: 2,
    lastMessage: "Vamos alinhar sobre o projeto amanhã?",
    lastActivity: "2024-01-15T15:10:00Z",
    isOnline: true
  },
  {
    id: "dm-carlos",
    name: "Carlos Oliveira",
    type: "direct",
    members: ["1", "3"],
    unreadCount: 0,
    lastMessage: "Relatório enviado por email",
    lastActivity: "2024-01-15T11:30:00Z",
    isOnline: false
  }
]

const mockMessages: Message[] = [
  {
    id: "1",
    userId: "2",
    userName: "Maria Santos",
    userAvatar: "/avatars/maria.jpg",
    content: "Bom dia, pessoal! Como estão os projetos desta semana?",
    timestamp: "2024-01-15T09:00:00Z",
    type: "text"
  },
  {
    id: "2",
    userId: "1",
    userName: "João Silva",
    userAvatar: "/avatars/joao.jpg",
    content: "Bom dia! O projeto do e-commerce está indo bem, já temos 75% concluído.",
    timestamp: "2024-01-15T09:05:00Z",
    type: "text"
  },
  {
    id: "3",
    userId: "3",
    userName: "Carlos Oliveira",
    userAvatar: "/avatars/carlos.jpg",
    content: "Ótimo! Vou atualizar o roadmap hoje.",
    timestamp: "2024-01-15T09:10:00Z",
    type: "text"
  },
  {
    id: "4",
    userId: "2",
    userName: "Maria Santos",
    userAvatar: "/avatars/maria.jpg",
    content: "Pessoal, anexei os mockups da nova interface. Podem dar uma olhada?",
    timestamp: "2024-01-15T10:30:00Z",
    type: "file",
    attachments: [
      {
        name: "interface-mockups.fig",
        url: "/files/mockups.fig",
        type: "figma",
        size: "2.5 MB"
      }
    ]
  },
  {
    id: "5",
    userId: "4",
    userName: "Ana Costa",
    userAvatar: "/avatars/ana.jpg",
    content: "Mockups estão excelentes! Só tenho algumas sugestões de melhorias na usabilidade.",
    timestamp: "2024-01-15T11:15:00Z",
    type: "text",
    reactions: [
      { emoji: "👍", users: ["1", "2", "3"] },
      { emoji: "❤️", users: ["2"] }
    ]
  },
  {
    id: "6",
    userId: "1",
    userName: "João Silva",
    userAvatar: "/avatars/joao.jpg",
    content: "Concordo com a Ana. O fluxo de checkout pode ser simplificado.",
    timestamp: "2024-01-15T11:20:00Z",
    type: "text"
  },
  {
    id: "7",
    userId: "system",
    userName: "Sistema",
    userAvatar: "",
    content: "Pedro Lima entrou no canal",
    timestamp: "2024-01-15T13:00:00Z",
    type: "system"
  },
  {
    id: "8",
    userId: "5",
    userName: "Pedro Lima",
    userAvatar: "/avatars/pedro.jpg",
    content: "Oi pessoal! Desculpem o atraso. Estava resolvendo uns problemas no servidor.",
    timestamp: "2024-01-15T13:05:00Z",
    type: "text"
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "online": return "bg-green-500"
    case "away": return "bg-yellow-500"
    case "busy": return "bg-red-500"
    case "offline": return "bg-gray-400"
    default: return "bg-gray-400"
  }
}

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  })
}

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return "Hoje"
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Ontem"
  } else {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit"
    })
  }
}

export default function ChatPage() {
  const [selectedChannel, setSelectedChannel] = useState<Channel>(mockChannels[0])
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showUserList, setShowUserList] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: (messages.length + 1).toString(),
        userId: "1", // Current user
        userName: "Você",
        userAvatar: "/avatars/current-user.jpg",
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        type: "text"
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions?.find(r => r.emoji === emoji)
        if (existingReaction) {
          if (existingReaction.users.includes("1")) {
            // Remove reaction
            existingReaction.users = existingReaction.users.filter(u => u !== "1")
            if (existingReaction.users.length === 0) {
              msg.reactions = msg.reactions?.filter(r => r.emoji !== emoji)
            }
          } else {
            // Add reaction
            existingReaction.users.push("1")
          }
        } else {
          // New reaction
          if (!msg.reactions) msg.reactions = []
          msg.reactions.push({ emoji, users: ["1"] })
        }
      }
      return msg
    }))
  }

  const filteredChannels = mockChannels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <PageContainer>
      <div className="h-[calc(100vh-12rem)] flex border rounded-lg overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r bg-muted/30 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Chat da Equipe</h2>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
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

          {/* Channels */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              <div className="mb-4">
                <h3 className="text-xs font-medium text-muted-foreground mb-2 px-2">CANAIS</h3>
                {filteredChannels.filter(c => c.type === "public").map((channel) => (
                  <Button
                    key={channel.id}
                    variant={selectedChannel.id === channel.id ? "secondary" : "ghost"}
                    className="w-full justify-start mb-1 h-auto py-2"
                    onClick={() => setSelectedChannel(channel)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <Hash className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="truncate">{channel.name}</span>
                      </div>
                      {channel.unreadCount > 0 && (
                        <Badge variant="destructive" className="h-5 text-xs">
                          {channel.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </Button>
                ))}
              </div>

              <div className="mb-4">
                <h3 className="text-xs font-medium text-muted-foreground mb-2 px-2">MENSAGENS DIRETAS</h3>
                {filteredChannels.filter(c => c.type === "direct").map((channel) => {
                  const user = mockUsers.find(u => u.name === channel.name)
                  return (
                    <Button
                      key={channel.id}
                      variant={selectedChannel.id === channel.id ? "secondary" : "ghost"}
                      className="w-full justify-start mb-1 h-auto py-2"
                      onClick={() => setSelectedChannel(channel)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <div className="relative mr-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={user?.avatar} alt={channel.name} />
                              <AvatarFallback>
                                {channel.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            {user && (
                              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`} />
                            )}
                          </div>
                          <span className="truncate">{channel.name}</span>
                        </div>
                        {channel.unreadCount > 0 && (
                          <Badge variant="destructive" className="h-5 text-xs">
                            {channel.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </Button>
                  )
                })}
              </div>

              <Separator className="my-4" />

              <div>
                <h3 className="text-xs font-medium text-muted-foreground mb-2 px-2">EQUIPE ONLINE</h3>
                {mockUsers.filter(u => u.status === "online").map((user) => (
                  <div key={user.id} className="flex items-center gap-2 px-2 py-1 hover:bg-muted rounded">
                    <div className="relative">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b bg-background">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {selectedChannel.type === "public" ? (
                  <Hash className="h-5 w-5 mr-2 text-muted-foreground" />
                ) : (
                  <div className="relative mr-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={mockUsers.find(u => u.name === selectedChannel.name)?.avatar} alt={selectedChannel.name} />
                      <AvatarFallback>
                        {selectedChannel.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {selectedChannel.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{selectedChannel.name}</h3>
                  {selectedChannel.description && (
                    <p className="text-sm text-muted-foreground">{selectedChannel.description}</p>
                  )}
                  {selectedChannel.type === "direct" && (
                    <p className="text-xs text-muted-foreground">
                      {selectedChannel.isOnline ? "Online" : `Último acesso: ${formatDate(selectedChannel.lastActivity)}`}
                    </p>
                  )}
                  {selectedChannel.type === "public" && (
                    <p className="text-xs text-muted-foreground">
                      {selectedChannel.members.length} membros
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedChannel.type === "direct" && (
                  <>
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="sm" onClick={() => setShowUserList(!showUserList)}>
                  <Users className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Pin className="h-4 w-4 mr-2" />
                      Fixar conversa
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Star className="h-4 w-4 mr-2" />
                      Favoritar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Archive className="h-4 w-4 mr-2" />
                      Arquivar
                    </DropdownMenuItem>
                    {selectedChannel.type === "direct" && (
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Deletar conversa
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {messages.map((message, index) => {
                const showDate = index === 0 || formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp)
                const showAvatar = index === 0 || messages[index - 1].userId !== message.userId
                
                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="flex items-center justify-center my-4">
                        <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                          {formatDate(message.timestamp)}
                        </div>
                      </div>
                    )}
                    
                    {message.type === "system" ? (
                      <div className="flex justify-center">
                        <p className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                          {message.content}
                        </p>
                      </div>
                    ) : (
                      <div className="flex gap-3 group hover:bg-muted/50 px-2 py-1 rounded">
                        <div className="flex-shrink-0">
                          {showAvatar ? (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={message.userAvatar} alt={message.userName} />
                              <AvatarFallback>
                                {message.userName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="w-8 h-8" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          {showAvatar && (
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{message.userName}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatTime(message.timestamp)}
                              </span>
                              {message.isEdited && (
                                <span className="text-xs text-muted-foreground">(editado)</span>
                              )}
                            </div>
                          )}
                          <div className="text-sm">
                            {message.content}
                          </div>
                          
                          {message.attachments && (
                            <div className="mt-2">
                              {message.attachments.map((attachment, idx) => (
                                <div key={idx} className="flex items-center gap-2 p-2 border rounded bg-muted/30 max-w-sm">
                                  <File className="h-4 w-4 text-muted-foreground" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{attachment.name}</p>
                                    <p className="text-xs text-muted-foreground">{attachment.size}</p>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {message.reactions && message.reactions.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {message.reactions.map((reaction, idx) => (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => addReaction(message.id, reaction.emoji)}
                                >
                                  {reaction.emoji} {reaction.users.length}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => addReaction(message.id, "👍")}>
                                <span className="mr-2">👍</span> Reagir
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Reply className="h-4 w-4 mr-2" />
                                Responder
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Forward className="h-4 w-4 mr-2" />
                                Encaminhar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {message.userId === "1" && (
                                <>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Deletar
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t bg-background">
            <div className="flex items-end gap-2">
              <div className="flex items-center gap-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  onChange={(e) => {
                    // Handle file upload
                    console.log("Files selected:", e.target.files)
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Image className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1">
                <Textarea
                  placeholder={`Enviar mensagem para ${selectedChannel.name}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="min-h-[40px] max-h-32 resize-none"
                  rows={1}
                />
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* User List Sidebar */}
        {showUserList && (
          <div className="w-64 border-l bg-muted/30">
            <div className="p-4">
              <h3 className="font-medium mb-4">Membros ({selectedChannel.members.length})</h3>
              <div className="space-y-2">
                {selectedChannel.members.map((memberId) => {
                  const user = mockUsers.find(u => u.id === memberId)
                  if (!user) return null
                  
                  return (
                    <div key={user.id} className="flex items-center gap-2 p-2 hover:bg-muted rounded">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.role}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
