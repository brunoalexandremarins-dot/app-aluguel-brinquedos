export interface Brinquedo {
  id: string
  nome: string
  categoria: string
  valorDiario: number
  valorSemanal: number
  valorMensal: number
  descricao: string
  especificacoes: string
  fotos: string[]
  videos: string[]
  disponivel: boolean
  totalAlugueis: number
  rendimentoTotal: number
  criadoEm: Date
}

export interface Cliente {
  id: string
  nome: string
  telefone: string
  email?: string
  cpfRg?: string
  endereco?: string
  enderecoEvento: string
  criadoEm: Date
}

export interface Agendamento {
  id: string
  clienteId: string
  brinquedoId: string
  dataInicio: Date
  dataFim: Date
  valorTotal: number
  status: 'pendente' | 'confirmado' | 'entregue' | 'finalizado' | 'cancelado'
  observacoes?: string
  criadoEm: Date
}

export interface Orcamento {
  id: string
  clienteId: string
  brinquedos: { brinquedoId: string; quantidade: number; dias: number }[]
  valorTotal: number
  status: 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado'
  validadeAte: Date
  criadoEm: Date
}

export interface Contrato {
  id: string
  orcamentoId: string
  clienteId: string
  dataAssinatura: Date
  termos: string
  status: 'ativo' | 'finalizado' | 'cancelado'
}

export interface ConfiguracaoEmpresa {
  nome: string
  cnpj?: string
  endereco: string
  telefone: string
  email: string
  logo?: string
  termosContrato: string
  politicaCancelamento: string
}

export interface DashboardStats {
  rendimentoMensal: number
  rendimentoAnual: number
  agendamentosMes: number
  agendamentosHoje: number
  brinquedosDisponiveis: number
  totalClientes: number
  orcamentosPendentes: number
  brinquedoMaisRentavel: string
}