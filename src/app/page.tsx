"use client"

import { useState, useEffect } from 'react'
import { 
  Calendar, Package, Users, DollarSign, BarChart3, Settings, 
  Plus, Search, Filter, Edit, Trash2, Eye, Share, FileText,
  Phone, MapPin, Clock, TrendingUp, Download, Send, MessageCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FormularioBrinquedo, FormularioCliente, FormularioOrcamento } from '@/components/Formularios'
import { Brinquedo, Cliente, Agendamento, Orcamento } from '@/lib/types'
import { generateId, gerarLinkWhatsApp, gerarTextoOrcamento, gerarContrato } from '@/lib/utils'

export default function SistemaAluguelBrinquedos() {
  // Estados principais
  const [activeTab, setActiveTab] = useState('dashboard')
  const [brinquedos, setBrinquedos] = useState<Brinquedo[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  
  // Estados de formulários
  const [showAddBrinquedo, setShowAddBrinquedo] = useState(false)
  const [showAddCliente, setShowAddCliente] = useState(false)
  const [showAddOrcamento, setShowAddOrcamento] = useState(false)
  const [editingBrinquedo, setEditingBrinquedo] = useState<Brinquedo | null>(null)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [editingOrcamento, setEditingOrcamento] = useState<Orcamento | null>(null)
  
  // Estados de busca e filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Carregar dados do localStorage
  useEffect(() => {
    const savedBrinquedos = localStorage.getItem('brinquedos')
    const savedClientes = localStorage.getItem('clientes')
    const savedAgendamentos = localStorage.getItem('agendamentos')
    const savedOrcamentos = localStorage.getItem('orcamentos')

    if (savedBrinquedos) setBrinquedos(JSON.parse(savedBrinquedos))
    if (savedClientes) setClientes(JSON.parse(savedClientes))
    if (savedAgendamentos) setAgendamentos(JSON.parse(savedAgendamentos))
    if (savedOrcamentos) setOrcamentos(JSON.parse(savedOrcamentos))

    // Dados de exemplo se não houver dados salvos
    if (!savedBrinquedos) {
      const exemplosBrinquedos: Brinquedo[] = [
        {
          id: generateId(),
          nome: 'Pula-Pula Castelo',
          categoria: 'Infláveis',
          valorDiario: 150,
          valorSemanal: 800,
          valorMensal: 2500,
          descricao: 'Pula-pula em formato de castelo, ideal para crianças de 3 a 12 anos',
          especificacoes: 'Dimensões: 4x4x3m, Capacidade: 8 crianças, Peso máximo: 300kg',
          fotos: [],
          videos: [],
          disponivel: true,
          totalAlugueis: 15,
          rendimentoTotal: 4500,
          criadoEm: new Date()
        },
        {
          id: generateId(),
          nome: 'Tobogã Gigante',
          categoria: 'Infláveis',
          valorDiario: 200,
          valorSemanal: 1200,
          valorMensal: 4000,
          descricao: 'Tobogã inflável gigante com piscina de bolinhas',
          especificacoes: 'Dimensões: 6x3x4m, Idade: 4 a 14 anos, Inclui piscina de bolinhas',
          fotos: [],
          videos: [],
          disponivel: true,
          totalAlugueis: 8,
          rendimentoTotal: 3200,
          criadoEm: new Date()
        },
        {
          id: generateId(),
          nome: 'Mesa de Ping Pong',
          categoria: 'Esportes',
          valorDiario: 50,
          valorSemanal: 300,
          valorMensal: 1000,
          descricao: 'Mesa oficial de ping pong com raquetes e bolinhas',
          especificacoes: 'Mesa oficial, 4 raquetes, 6 bolinhas, rede oficial',
          fotos: [],
          videos: [],
          disponivel: false,
          totalAlugueis: 25,
          rendimentoTotal: 2500,
          criadoEm: new Date()
        }
      ]
      setBrinquedos(exemplosBrinquedos)
    }

    if (!savedClientes) {
      const exemplosClientes: Cliente[] = [
        {
          id: generateId(),
          nome: 'Maria Silva',
          telefone: '(11) 99999-9999',
          email: 'maria@email.com',
          enderecoEvento: 'Rua das Flores, 123 - São Paulo/SP',
          criadoEm: new Date()
        },
        {
          id: generateId(),
          nome: 'João Santos',
          telefone: '(11) 88888-8888',
          cpfRg: '123.456.789-00',
          endereco: 'Av. Principal, 456',
          enderecoEvento: 'Salão de Festas - Rua da Alegria, 789',
          criadoEm: new Date()
        }
      ]
      setClientes(exemplosClientes)
    }
  }, [])

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('brinquedos', JSON.stringify(brinquedos))
  }, [brinquedos])

  useEffect(() => {
    localStorage.setItem('clientes', JSON.stringify(clientes))
  }, [clientes])

  useEffect(() => {
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos))
  }, [agendamentos])

  useEffect(() => {
    localStorage.setItem('orcamentos', JSON.stringify(orcamentos))
  }, [orcamentos])

  // Funções de cálculo para dashboard
  const calcularEstatisticas = () => {
    const hoje = new Date()
    const inicioMes = new Date(selectedYear, selectedMonth, 1)
    const fimMes = new Date(selectedYear, selectedMonth + 1, 0)

    const agendamentosMes = agendamentos.filter(a => {
      const data = new Date(a.dataInicio)
      return data >= inicioMes && data <= fimMes
    })

    const rendimentoMensal = agendamentosMes
      .filter(a => a.status === 'finalizado')
      .reduce((total, a) => total + a.valorTotal, 0)

    const agendamentosHoje = agendamentos.filter(a => {
      const data = new Date(a.dataInicio)
      return data.toDateString() === hoje.toDateString()
    })

    return {
      rendimentoMensal,
      agendamentosMes: agendamentosMes.length,
      agendamentosHoje: agendamentosHoje.length,
      brinquedosDisponiveis: brinquedos.filter(b => b.disponivel).length,
      totalClientes: clientes.length,
      orcamentosPendentes: orcamentos.filter(o => o.status === 'enviado').length
    }
  }

  const stats = calcularEstatisticas()

  // Handlers para CRUD
  const handleSaveBrinquedo = (brinquedo: Brinquedo) => {
    if (editingBrinquedo) {
      setBrinquedos(brinquedos.map(b => b.id === brinquedo.id ? brinquedo : b))
      setEditingBrinquedo(null)
    } else {
      setBrinquedos([...brinquedos, brinquedo])
    }
    setShowAddBrinquedo(false)
  }

  const handleSaveCliente = (cliente: Cliente) => {
    if (editingCliente) {
      setClientes(clientes.map(c => c.id === cliente.id ? cliente : c))
      setEditingCliente(null)
    } else {
      setClientes([...clientes, cliente])
    }
    setShowAddCliente(false)
  }

  const handleSaveOrcamento = (orcamento: Orcamento) => {
    if (editingOrcamento) {
      setOrcamentos(orcamentos.map(o => o.id === orcamento.id ? orcamento : o))
      setEditingOrcamento(null)
    } else {
      setOrcamentos([...orcamentos, orcamento])
    }
    setShowAddOrcamento(false)
  }

  const handleWhatsAppBrinquedo = (brinquedo: Brinquedo) => {
    const telefoneEmpresa = '11999999999' // Configurar no sistema
    const link = gerarLinkWhatsApp(telefoneEmpresa, brinquedo)
    window.open(link, '_blank')
  }

  const handleEnviarOrcamento = (orcamento: Orcamento) => {
    const cliente = clientes.find(c => c.id === orcamento.clienteId)
    if (!cliente) return

    const textoOrcamento = gerarTextoOrcamento(cliente, brinquedos, orcamento)
    const telefone = cliente.telefone.replace(/\D/g, '')
    const link = `https://wa.me/55${telefone}?text=${encodeURIComponent(textoOrcamento)}`
    
    // Atualizar status do orçamento
    setOrcamentos(orcamentos.map(o => 
      o.id === orcamento.id ? { ...o, status: 'enviado' as const } : o
    ))
    
    window.open(link, '_blank')
  }

  // Componente Dashboard
  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">
              R$ {stats.rendimentoMensal.toLocaleString('pt-BR')}
            </div>
            <div className="text-sm text-gray-600">Rendimento Mensal</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">{stats.agendamentosMes}</div>
            <div className="text-sm text-gray-600">Agendamentos Mês</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-orange-600">{stats.agendamentosHoje}</div>
            <div className="text-sm text-gray-600">Hoje</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Package className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-600">{stats.brinquedosDisponiveis}</div>
            <div className="text-sm text-gray-600">Disponíveis</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
            <div className="text-2xl font-bold text-indigo-600">{stats.totalClientes}</div>
            <div className="text-sm text-gray-600">Clientes</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="w-8 h-8 mx-auto mb-2 text-red-600" />
            <div className="text-2xl font-bold text-red-600">{stats.orcamentosPendentes}</div>
            <div className="text-sm text-gray-600">Orçamentos</div>
          </CardContent>
        </Card>
      </div>

      {/* Seletor de mês/ano */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Dashboard Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-2 border rounded-md"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(2024, i).toLocaleDateString('pt-BR', { month: 'long' })}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 border rounded-md"
            >
              {Array.from({ length: 5 }, (_, i) => (
                <option key={i} value={2024 + i}>
                  {2024 + i}
                </option>
              ))}
            </select>
          </div>

          {/* Top 5 brinquedos mais rentáveis */}
          <div className="space-y-3">
            <h3 className="font-semibold">Top 5 Brinquedos Mais Rentáveis</h3>
            {brinquedos
              .sort((a, b) => b.rendimentoTotal - a.rendimentoTotal)
              .slice(0, 5)
              .map((brinquedo, index) => (
                <div key={brinquedo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{brinquedo.nome}</div>
                      <div className="text-sm text-gray-600">{brinquedo.totalAlugueis} aluguéis</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      R$ {brinquedo.rendimentoTotal.toLocaleString('pt-BR')}
                    </div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Componente Catálogo
  const CatalogoContent = () => (
    <div className="space-y-6">
      {/* Header com busca e botão adicionar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar brinquedos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setShowAddBrinquedo(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Brinquedo
        </Button>
      </div>

      {/* Lista de brinquedos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brinquedos
          .filter(b => b.nome.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((brinquedo) => (
            <Card key={brinquedo.id} className="overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <Package className="w-16 h-16 text-gray-400" />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{brinquedo.nome}</h3>
                  <Badge variant={brinquedo.disponivel ? "default" : "secondary"}>
                    {brinquedo.disponivel ? "Disponível" : "Ocupado"}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{brinquedo.categoria}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Diária:</span>
                    <span className="font-semibold">R$ {brinquedo.valorDiario}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Semanal:</span>
                    <span className="font-semibold">R$ {brinquedo.valorSemanal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Mensal:</span>
                    <span className="font-semibold">R$ {brinquedo.valorMensal}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="font-bold text-green-600">{brinquedo.totalAlugueis}</div>
                    <div className="text-gray-600">Aluguéis</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="font-bold text-blue-600">
                      R$ {brinquedo.rendimentoTotal.toLocaleString('pt-BR')}
                    </div>
                    <div className="text-gray-600">Rendimento</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleWhatsAppBrinquedo(brinquedo)}
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    WhatsApp
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setEditingBrinquedo(brinquedo)
                      setShowAddBrinquedo(true)
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )

  // Componente Clientes
  const ClientesContent = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar clientes..."
            className="pl-10"
          />
        </div>
        <Button onClick={() => setShowAddCliente(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="grid gap-4">
        {clientes.map((cliente) => (
          <Card key={cliente.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{cliente.nome}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {cliente.telefone}
                      </span>
                      {cliente.email && (
                        <span>{cliente.email}</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {cliente.enderecoEvento}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setEditingCliente(cliente)
                      setShowAddCliente(true)
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  // Componente Agenda
  const AgendaContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Agenda</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      <div className="grid gap-4">
        {agendamentos.map((agendamento) => {
          const cliente = clientes.find(c => c.id === agendamento.clienteId)
          const brinquedo = brinquedos.find(b => b.id === agendamento.brinquedoId)
          
          return (
            <Card key={agendamento.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{cliente?.nome}</h3>
                      <p className="text-sm text-gray-600">{brinquedo?.nome}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>
                          {new Date(agendamento.dataInicio).toLocaleDateString('pt-BR')} - 
                          {new Date(agendamento.dataFim).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="font-semibold text-green-600">
                          R$ {agendamento.valorTotal.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        agendamento.status === 'confirmado' ? 'default' :
                        agendamento.status === 'finalizado' ? 'secondary' :
                        'outline'
                      }
                    >
                      {agendamento.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  // Componente Orçamentos
  const OrcamentosContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Orçamentos</h2>
        <Button onClick={() => setShowAddOrcamento(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Orçamento
        </Button>
      </div>

      <div className="grid gap-4">
        {orcamentos.map((orcamento) => {
          const cliente = clientes.find(c => c.id === orcamento.clienteId)
          
          return (
            <Card key={orcamento.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{cliente?.nome}</h3>
                      <p className="text-sm text-gray-600">
                        {orcamento.brinquedos.length} item(s)
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="font-semibold text-green-600">
                          R$ {orcamento.valorTotal.toLocaleString('pt-BR')}
                        </span>
                        <span>
                          Válido até {new Date(orcamento.validadeAte).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        orcamento.status === 'aprovado' ? 'default' :
                        orcamento.status === 'enviado' ? 'secondary' :
                        'outline'
                      }
                    >
                      {orcamento.status}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEnviarOrcamento(orcamento)}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setEditingOrcamento(orcamento)
                        setShowAddOrcamento(true)
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Aluguel de Brinquedos
              </h1>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="catalogo" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Catálogo</span>
            </TabsTrigger>
            <TabsTrigger value="clientes" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Clientes</span>
            </TabsTrigger>
            <TabsTrigger value="agenda" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Agenda</span>
            </TabsTrigger>
            <TabsTrigger value="orcamentos" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Orçamentos</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardContent />
          </TabsContent>

          <TabsContent value="catalogo">
            <CatalogoContent />
          </TabsContent>

          <TabsContent value="clientes">
            <ClientesContent />
          </TabsContent>

          <TabsContent value="agenda">
            <AgendaContent />
          </TabsContent>

          <TabsContent value="orcamentos">
            <OrcamentosContent />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modais */}
      {showAddBrinquedo && (
        <FormularioBrinquedo
          brinquedo={editingBrinquedo || undefined}
          onSave={handleSaveBrinquedo}
          onCancel={() => {
            setShowAddBrinquedo(false)
            setEditingBrinquedo(null)
          }}
        />
      )}

      {showAddCliente && (
        <FormularioCliente
          cliente={editingCliente || undefined}
          onSave={handleSaveCliente}
          onCancel={() => {
            setShowAddCliente(false)
            setEditingCliente(null)
          }}
        />
      )}

      {showAddOrcamento && (
        <FormularioOrcamento
          orcamento={editingOrcamento || undefined}
          clientes={clientes}
          brinquedos={brinquedos}
          onSave={handleSaveOrcamento}
          onCancel={() => {
            setShowAddOrcamento(false)
            setEditingOrcamento(null)
          }}
        />
      )}
    </div>
  )
}