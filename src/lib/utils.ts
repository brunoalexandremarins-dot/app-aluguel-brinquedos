import { Brinquedo, Cliente, Orcamento, Contrato } from './types'

// Função para gerar ID único
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Função para calcular valor do orçamento
export const calcularValorOrcamento = (
  brinquedos: Brinquedo[],
  itens: { brinquedoId: string; quantidade: number; dias: number }[]
): number => {
  return itens.reduce((total, item) => {
    const brinquedo = brinquedos.find(b => b.id === item.brinquedoId)
    if (!brinquedo) return total

    let valorUnitario = brinquedo.valorDiario
    
    // Aplicar desconto para períodos maiores
    if (item.dias >= 30) {
      valorUnitario = brinquedo.valorMensal
    } else if (item.dias >= 7) {
      valorUnitario = brinquedo.valorSemanal
    } else {
      valorUnitario = brinquedo.valorDiario * item.dias
    }

    return total + (valorUnitario * item.quantidade)
  }, 0)
}

// Função para gerar texto do orçamento
export const gerarTextoOrcamento = (
  cliente: Cliente,
  brinquedos: Brinquedo[],
  orcamento: Orcamento
): string => {
  const itensTexto = orcamento.brinquedos.map(item => {
    const brinquedo = brinquedos.find(b => b.id === item.brinquedoId)
    if (!brinquedo) return ''

    let valorUnitario = brinquedo.valorDiario
    if (item.dias >= 30) {
      valorUnitario = brinquedo.valorMensal
    } else if (item.dias >= 7) {
      valorUnitario = brinquedo.valorSemanal
    } else {
      valorUnitario = brinquedo.valorDiario * item.dias
    }

    return `• ${brinquedo.nome} - ${item.quantidade}x por ${item.dias} dias - R$ ${(valorUnitario * item.quantidade).toLocaleString('pt-BR')}`
  }).join('\n')

  return `
ORÇAMENTO - ALUGUEL DE BRINQUEDOS

Cliente: ${cliente.nome}
Telefone: ${cliente.telefone}
Endereço do Evento: ${cliente.enderecoEvento}

ITENS:
${itensTexto}

VALOR TOTAL: R$ ${orcamento.valorTotal.toLocaleString('pt-BR')}

Válido até: ${new Date(orcamento.validadeAte).toLocaleDateString('pt-BR')}

Observações:
- Entrega e retirada incluídas
- Montagem e desmontagem incluídas
- Limpeza e higienização garantidas
- Seguro contra danos incluído

Para confirmar, responda este orçamento.
  `.trim()
}

// Função para gerar contrato
export const gerarContrato = (
  cliente: Cliente,
  brinquedos: Brinquedo[],
  orcamento: Orcamento,
  configuracao: any
): string => {
  const itensTexto = orcamento.brinquedos.map(item => {
    const brinquedo = brinquedos.find(b => b.id === item.brinquedoId)
    if (!brinquedo) return ''

    return `${brinquedo.nome} (${item.quantidade} unidade(s) por ${item.dias} dias)`
  }).join(', ')

  return `
CONTRATO DE LOCAÇÃO DE BRINQUEDOS

LOCADOR: ${configuracao?.nome || 'Empresa de Aluguel de Brinquedos'}
CNPJ: ${configuracao?.cnpj || ''}
Endereço: ${configuracao?.endereco || ''}
Telefone: ${configuracao?.telefone || ''}

LOCATÁRIO: ${cliente.nome}
Telefone: ${cliente.telefone}
${cliente.cpfRg ? `CPF/RG: ${cliente.cpfRg}` : ''}
${cliente.endereco ? `Endereço: ${cliente.endereco}` : ''}
Endereço do Evento: ${cliente.enderecoEvento}

OBJETO DO CONTRATO:
Locação dos seguintes brinquedos: ${itensTexto}

VALOR TOTAL: R$ ${orcamento.valorTotal.toLocaleString('pt-BR')}

CONDIÇÕES:
1. O prazo de locação é conforme especificado no orçamento
2. A entrega e retirada serão realizadas no endereço do evento
3. O locatário é responsável pela segurança dos equipamentos durante o evento
4. Danos ou perdas serão cobrados conforme tabela de valores
5. O pagamento deve ser realizado conforme acordado

TERMOS ADICIONAIS:
${configuracao?.termosContrato || 'Termos padrão aplicáveis'}

POLÍTICA DE CANCELAMENTO:
${configuracao?.politicaCancelamento || 'Cancelamentos com até 24h de antecedência'}

Data: ${new Date().toLocaleDateString('pt-BR')}

_________________________        _________________________
    LOCADOR                           LOCATÁRIO
  `.trim()
}

// Função para gerar link do WhatsApp
export const gerarLinkWhatsApp = (
  telefone: string,
  brinquedo: Brinquedo
): string => {
  const mensagem = `Olá! Gostaria de saber mais sobre o aluguel do brinquedo *${brinquedo.nome}*.

*Categoria:* ${brinquedo.categoria}
*Valores:*
• Diária: R$ ${brinquedo.valorDiario}
• Semanal: R$ ${brinquedo.valorSemanal}
• Mensal: R$ ${brinquedo.valorMensal}

*Descrição:* ${brinquedo.descricao}

Poderia me enviar mais informações?`

  const telefoneFormatado = telefone.replace(/\D/g, '')
  return `https://wa.me/55${telefoneFormatado}?text=${encodeURIComponent(mensagem)}`
}

// Função para formatar moeda
export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

// Função para calcular dias entre datas
export const calcularDias = (dataInicio: Date, dataFim: Date): number => {
  const diffTime = Math.abs(dataFim.getTime() - dataInicio.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Função para validar CPF
export const validarCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/\D/g, '')
  
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false
  }

  let soma = 0
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i)
  }
  
  let resto = 11 - (soma % 11)
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cpf.charAt(9))) return false

  soma = 0
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i)
  }
  
  resto = 11 - (soma % 11)
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cpf.charAt(10))) return false

  return true
}

// Função para formatar telefone
export const formatarTelefone = (telefone: string): string => {
  const numero = telefone.replace(/\D/g, '')
  
  if (numero.length === 11) {
    return numero.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (numero.length === 10) {
    return numero.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  
  return telefone
}