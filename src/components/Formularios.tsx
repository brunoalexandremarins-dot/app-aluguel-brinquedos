"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Upload, Calendar, DollarSign } from 'lucide-react'
import { Brinquedo, Cliente, Orcamento } from '@/lib/types'
import { generateId, calcularValorOrcamento, formatarTelefone, validarCPF } from '@/lib/utils'

interface FormularioBrinquedoProps {
  brinquedo?: Brinquedo
  onSave: (brinquedo: Brinquedo) => void
  onCancel: () => void
}

export function FormularioBrinquedo({ brinquedo, onSave, onCancel }: FormularioBrinquedoProps) {
  const [formData, setFormData] = useState({
    nome: brinquedo?.nome || '',
    categoria: brinquedo?.categoria || '',
    valorDiario: brinquedo?.valorDiario || 0,
    valorSemanal: brinquedo?.valorSemanal || 0,
    valorMensal: brinquedo?.valorMensal || 0,
    descricao: brinquedo?.descricao || '',
    especificacoes: brinquedo?.especificacoes || '',
    fotos: brinquedo?.fotos || [],
    videos: brinquedo?.videos || []
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const novoBrinquedo: Brinquedo = {
      id: brinquedo?.id || generateId(),
      ...formData,
      disponivel: brinquedo?.disponivel ?? true,
      totalAlugueis: brinquedo?.totalAlugueis || 0,
      rendimentoTotal: brinquedo?.rendimentoTotal || 0,
      criadoEm: brinquedo?.criadoEm || new Date()
    }

    onSave(novoBrinquedo)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {brinquedo ? 'Editar Brinquedo' : 'Novo Brinquedo'}
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Nome do brinquedo *"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
              <Input
                placeholder="Categoria *"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Valor Diário (R$)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.valorDiario}
                  onChange={(e) => setFormData({ ...formData, valorDiario: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Valor Semanal (R$)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.valorSemanal}
                  onChange={(e) => setFormData({ ...formData, valorSemanal: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Valor Mensal (R$)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.valorMensal}
                  onChange={(e) => setFormData({ ...formData, valorMensal: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Descrição
              </label>
              <textarea
                placeholder="Descrição do brinquedo..."
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="w-full p-3 border rounded-md h-24 resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Especificações Técnicas
              </label>
              <textarea
                placeholder="Dimensões, peso, capacidade, idade recomendada..."
                value={formData.especificacoes}
                onChange={(e) => setFormData({ ...formData, especificacoes: e.target.value })}
                className="w-full p-3 border rounded-md h-24 resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Fotos e Vídeos
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Clique para adicionar fotos e vídeos
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Formatos aceitos: JPG, PNG, MP4
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {brinquedo ? 'Atualizar' : 'Salvar'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

interface FormularioClienteProps {
  cliente?: Cliente
  onSave: (cliente: Cliente) => void
  onCancel: () => void
}

export function FormularioCliente({ cliente, onSave, onCancel }: FormularioClienteProps) {
  const [formData, setFormData] = useState({
    nome: cliente?.nome || '',
    telefone: cliente?.telefone || '',
    email: cliente?.email || '',
    cpfRg: cliente?.cpfRg || '',
    endereco: cliente?.endereco || '',
    enderecoEvento: cliente?.enderecoEvento || ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório'
    }

    if (!formData.enderecoEvento.trim()) {
      newErrors.enderecoEvento = 'Endereço do evento é obrigatório'
    }

    if (formData.cpfRg && !validarCPF(formData.cpfRg)) {
      newErrors.cpfRg = 'CPF inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const novoCliente: Cliente = {
      id: cliente?.id || generateId(),
      ...formData,
      telefone: formatarTelefone(formData.telefone),
      criadoEm: cliente?.criadoEm || new Date()
    }

    onSave(novoCliente)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {cliente ? 'Editar Cliente' : 'Novo Cliente'}
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Nome completo *"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className={errors.nome ? 'border-red-500' : ''}
              />
              {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
            </div>

            <div>
              <Input
                placeholder="Telefone *"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className={errors.telefone ? 'border-red-500' : ''}
              />
              {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone}</p>}
            </div>

            <Input
              placeholder="Email (opcional)"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <div>
              <Input
                placeholder="CPF/RG (opcional)"
                value={formData.cpfRg}
                onChange={(e) => setFormData({ ...formData, cpfRg: e.target.value })}
                className={errors.cpfRg ? 'border-red-500' : ''}
              />
              {errors.cpfRg && <p className="text-red-500 text-sm mt-1">{errors.cpfRg}</p>}
            </div>

            <Input
              placeholder="Endereço residencial (opcional)"
              value={formData.endereco}
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
            />

            <div>
              <Input
                placeholder="Endereço do evento *"
                value={formData.enderecoEvento}
                onChange={(e) => setFormData({ ...formData, enderecoEvento: e.target.value })}
                className={errors.enderecoEvento ? 'border-red-500' : ''}
              />
              {errors.enderecoEvento && <p className="text-red-500 text-sm mt-1">{errors.enderecoEvento}</p>}
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {cliente ? 'Atualizar' : 'Salvar'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

interface FormularioOrcamentoProps {
  orcamento?: Orcamento
  clientes: Cliente[]
  brinquedos: Brinquedo[]
  onSave: (orcamento: Orcamento) => void
  onCancel: () => void
}

export function FormularioOrcamento({ orcamento, clientes, brinquedos, onSave, onCancel }: FormularioOrcamentoProps) {
  const [clienteId, setClienteId] = useState(orcamento?.clienteId || '')
  const [itens, setItens] = useState(orcamento?.brinquedos || [])
  const [validadeAte, setValidadeAte] = useState(
    orcamento?.validadeAte ? new Date(orcamento.validadeAte).toISOString().split('T')[0] : 
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  )

  const adicionarItem = () => {
    setItens([...itens, { brinquedoId: '', quantidade: 1, dias: 1 }])
  }

  const removerItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index))
  }

  const atualizarItem = (index: number, campo: string, valor: any) => {
    const novosItens = [...itens]
    novosItens[index] = { ...novosItens[index], [campo]: valor }
    setItens(novosItens)
  }

  const valorTotal = calcularValorOrcamento(brinquedos, itens)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!clienteId || itens.length === 0) return

    const novoOrcamento: Orcamento = {
      id: orcamento?.id || generateId(),
      clienteId,
      brinquedos: itens,
      valorTotal,
      status: orcamento?.status || 'rascunho',
      validadeAte: new Date(validadeAte),
      criadoEm: orcamento?.criadoEm || new Date()
    }

    onSave(novoOrcamento)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {orcamento ? 'Editar Orçamento' : 'Novo Orçamento'}
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Cliente *
                </label>
                <select
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome} - {cliente.telefone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Válido até *
                </label>
                <Input
                  type="date"
                  value={validadeAte}
                  onChange={(e) => setValidadeAte(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Itens do Orçamento</h3>
                <Button type="button" onClick={adicionarItem} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Item
                </Button>
              </div>

              <div className="space-y-3">
                {itens.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center p-3 border rounded-lg">
                    <div className="col-span-5">
                      <select
                        value={item.brinquedoId}
                        onChange={(e) => atualizarItem(index, 'brinquedoId', e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                        required
                      >
                        <option value="">Selecione um brinquedo</option>
                        {brinquedos.filter(b => b.disponivel).map(brinquedo => (
                          <option key={brinquedo.id} value={brinquedo.id}>
                            {brinquedo.nome} - R$ {brinquedo.valorDiario}/dia
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantidade}
                        onChange={(e) => atualizarItem(index, 'quantidade', parseInt(e.target.value))}
                        placeholder="Qtd"
                        className="text-sm"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.dias}
                        onChange={(e) => atualizarItem(index, 'dias', parseInt(e.target.value))}
                        placeholder="Dias"
                        className="text-sm"
                      />
                    </div>
                    
                    <div className="col-span-2 text-sm font-medium text-green-600">
                      {(() => {
                        const brinquedo = brinquedos.find(b => b.id === item.brinquedoId)
                        if (!brinquedo) return 'R$ 0'
                        
                        let valor = brinquedo.valorDiario * item.dias
                        if (item.dias >= 30) valor = brinquedo.valorMensal
                        else if (item.dias >= 7) valor = brinquedo.valorSemanal
                        
                        return `R$ ${(valor * item.quantidade).toLocaleString('pt-BR')}`
                      })()}
                    </div>
                    
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removerItem(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Valor Total:</span>
                <span className="text-green-600">R$ {valorTotal.toLocaleString('pt-BR')}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {orcamento ? 'Atualizar' : 'Salvar'} Orçamento
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}