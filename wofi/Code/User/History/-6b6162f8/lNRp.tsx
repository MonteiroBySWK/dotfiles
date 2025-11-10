"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { 
  Plus,
  X,
  ArrowLeft,
  Save,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  DollarSign,
  Star,
  Calendar,
  Users,
  Briefcase,
  FileText,
  Link as LinkIcon
} from "lucide-react"
import { cn } from "@/lib/utils"

type ClientType = "individual" | "company"
type Industry = string
type ProjectSize = "small" | "medium" | "large" | "enterprise"

const industries = [
  "Tecnologia",
  "Saúde",
  "Educação",
  "Varejo",
  "Serviços Financeiros",
  "Manufatura",
  "Imobiliário",
  "Mídia e Entretenimento",
  "Governo",
  "Sem fins lucrativos",
  "Consultoria",
  "Outros"
]

const projectSizes = [
  { id: "small", name: "Pequeno", budget: "< R$ 10.000", duration: "1-2 meses" },
  { id: "medium", name: "Médio", budget: "R$ 10.000 - R$ 50.000", duration: "2-6 meses" },
  { id: "large", name: "Grande", budget: "R$ 50.000 - R$ 200.000", duration: "6-12 meses" },
  { id: "enterprise", name: "Enterprise", budget: "> R$ 200.000", duration: "12+ meses" }
]

const leadSources = [
  "Website",
  "Indicação",
  "Redes Sociais",
  "Publicidade Online",
  "Evento/Conferência",
  "Cold Email",
  "Parceiro",
  "Outros"
]

export default function NewClientPage() {
  const router = useRouter()
  const [clientType, setClientType] = useState<ClientType>("company")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [socialLinks, setSocialLinks] = useState<Array<{platform: string, url: string}>>([])
  const [newSocialPlatform, setNewSocialPlatform] = useState("")
  const [newSocialUrl, setNewSocialUrl] = useState("")
  const [isPriority, setIsPriority] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [allowMarketing, setAllowMarketing] = useState(false)
  
  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    email: "",
    phone: "",
    website: "",
    
    // Company specific
    companyName: "",
    position: "",
    department: "",
    employeeCount: "",
    
    // Address
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Brasil",
    
    // Business
    industry: "",
    projectSize: "",
    estimatedBudget: "",
    leadSource: "",
    
    // Additional
    notes: "",
    referredBy: "",
    expectedProjectStart: "",
    communicationPreference: "email"
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const addSocialLink = () => {
    if (newSocialPlatform && newSocialUrl) {
      setSocialLinks([...socialLinks, { platform: newSocialPlatform, url: newSocialUrl }])
      setNewSocialPlatform("")
      setNewSocialUrl("")
    }
  }

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    const clientData = {
      ...formData,
      clientType,
      tags,
      socialLinks,
      isPriority,
      isActive,
      allowMarketing,
      createdAt: new Date().toISOString()
    }
    
    console.log("Client data:", clientData)
    router.push("/dashboard/clients")
  }

  const getClientTypeIcon = (type: ClientType) => {
    return type === "company" ? Building : User
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Cliente</h1>
          <p className="text-muted-foreground">
            Adicione um novo cliente ao seu portfólio
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Type */}
          <Card>
            <CardHeader>
              <CardTitle>Tipo de Cliente</CardTitle>
              <CardDescription>
                Selecione se é pessoa física ou jurídica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <div
                  className={cn(
                    "relative cursor-pointer rounded-lg border p-4 hover:bg-accent transition-colors",
                    clientType === "company" && "border-primary bg-accent"
                  )}
                  onClick={() => setClientType("company")}
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "h-4 w-4 rounded-full border-2",
                      clientType === "company" 
                        ? "border-primary bg-primary" 
                        : "border-muted-foreground"
                    )} />
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Empresa</h4>
                      <p className="text-sm text-muted-foreground">
                        Pessoa jurídica
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={cn(
                    "relative cursor-pointer rounded-lg border p-4 hover:bg-accent transition-colors",
                    clientType === "individual" && "border-primary bg-accent"
                  )}
                  onClick={() => setClientType("individual")}
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "h-4 w-4 rounded-full border-2",
                      clientType === "individual" 
                        ? "border-primary bg-primary" 
                        : "border-muted-foreground"
                    )} />
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Pessoa Física</h4>
                      <p className="text-sm text-muted-foreground">
                        Individual
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {clientType === "company" ? <Building className="h-5 w-5" /> : <User className="h-5 w-5" />}
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {clientType === "company" ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Nome da Empresa *</Label>
                      <Input
                        id="company-name"
                        placeholder="Ex: Empresa ABC Ltda"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Nome do Contato *</Label>
                      <Input
                        id="contact-name"
                        placeholder="Nome da pessoa de contato"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="position">Cargo</Label>
                      <Input
                        id="position"
                        placeholder="Ex: Diretor de TI"
                        value={formData.position}
                        onChange={(e) => handleInputChange("position", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Departamento</Label>
                      <Input
                        id="department"
                        placeholder="Ex: Tecnologia"
                        value={formData.department}
                        onChange={(e) => handleInputChange("department", e.target.value)}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="individual-name">Nome Completo *</Label>
                  <Input
                    id="individual-name"
                    placeholder="Nome completo do cliente"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="contato@empresa.com"
                      className="pl-9"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="(11) 99999-9999"
                      className="pl-9"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    placeholder="https://www.empresa.com.br"
                    className="pl-9"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  placeholder="Rua, número, complemento"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    placeholder="Cidade"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    placeholder="Estado"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipcode">CEP</Label>
                  <Input
                    id="zipcode"
                    placeholder="00000-000"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Informações Comerciais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Setor/Indústria</Label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar setor..." />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tamanho do Projeto</Label>
                  <Select value={formData.projectSize} onValueChange={(value) => handleInputChange("projectSize", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar tamanho..." />
                    </SelectTrigger>
                    <SelectContent>
                      {projectSizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          <div className="space-y-1">
                            <div className="font-medium">{size.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {size.budget} • {size.duration}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="budget">Orçamento Estimado</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="budget"
                      placeholder="Ex: R$ 50.000"
                      className="pl-9"
                      value={formData.estimatedBudget}
                      onChange={(e) => handleInputChange("estimatedBudget", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Origem do Lead</Label>
                  <Select value={formData.leadSource} onValueChange={(value) => handleInputChange("leadSource", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Como conheceu..." />
                    </SelectTrigger>
                    <SelectContent>
                      {leadSources.map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {clientType === "company" && (
                <div className="space-y-2">
                  <Label htmlFor="employee-count">Número de Funcionários</Label>
                  <Select value={formData.employeeCount} onValueChange={(value) => handleInputChange("employeeCount", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 funcionários</SelectItem>
                      <SelectItem value="11-50">11-50 funcionários</SelectItem>
                      <SelectItem value="51-200">51-200 funcionários</SelectItem>
                      <SelectItem value="201-500">201-500 funcionários</SelectItem>
                      <SelectItem value="500+">500+ funcionários</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="referred-by">Indicado por</Label>
                  <Input
                    id="referred-by"
                    placeholder="Nome de quem indicou"
                    value={formData.referredBy}
                    onChange={(e) => handleInputChange("referredBy", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preferência de Comunicação</Label>
                  <Select value={formData.communicationPreference} onValueChange={(value) => handleInputChange("communicationPreference", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Telefone</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="video">Videochamada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informações Adicionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  placeholder="Informações importantes sobre o cliente, histórico, necessidades específicas..."
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected-start">Início Esperado do Projeto</Label>
                <Input
                  id="expected-start"
                  placeholder="Ex: Janeiro 2024"
                  value={formData.expectedProjectStart}
                  onChange={(e) => handleInputChange("expectedProjectStart", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {clientType === "company" ? (
                      <Building className="h-6 w-6" />
                    ) : (
                      <User className="h-6 w-6" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">
                    {clientType === "company" ? formData.companyName || "Nova Empresa" : formData.name || "Novo Cliente"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {clientType === "company" ? formData.name : formData.email}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                {formData.industry && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Setor:</span>
                    <span>{formData.industry}</span>
                  </div>
                )}
                {formData.projectSize && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Projeto:</span>
                    <span>{projectSizes.find(p => p.id === formData.projectSize)?.name}</span>
                  </div>
                )}
                {formData.estimatedBudget && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Orçamento:</span>
                    <span>{formData.estimatedBudget}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Organize seus clientes com tags
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Nova tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                />
                <Button onClick={addTag} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Redes Sociais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Plataforma (ex: LinkedIn)"
                  value={newSocialPlatform}
                  onChange={(e) => setNewSocialPlatform(e.target.value)}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="URL do perfil"
                    value={newSocialUrl}
                    onChange={(e) => setNewSocialUrl(e.target.value)}
                  />
                  <Button onClick={addSocialLink} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {socialLinks.length > 0 && (
                <div className="space-y-2">
                  {socialLinks.map((link, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded">
                      <div>
                        <div className="font-medium text-sm">{link.platform}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {link.url}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSocialLink(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Cliente Prioritário
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Marcar como VIP
                  </p>
                </div>
                <Switch
                  checked={isPriority}
                  onCheckedChange={setIsPriority}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cliente Ativo</Label>
                  <p className="text-sm text-muted-foreground">
                    Disponível para novos projetos
                  </p>
                </div>
                <Switch
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing</Label>
                  <p className="text-sm text-muted-foreground">
                    Pode receber materiais promocionais
                  </p>
                </div>
                <Switch
                  checked={allowMarketing}
                  onCheckedChange={setAllowMarketing}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            <Button onClick={handleSave} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Adicionar Cliente
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.back()}>
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
