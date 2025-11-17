export interface Vehicle {
  id: string;
  placa: string;
  modelo: string;
  ano?: number;
  cor?: string;
  categoria?: string;
  kmAtual?: number;
  status?: 'disponivel' | 'locado' | 'manutencao';
}

export interface Client {
  id: string;
  nome: string;
  cpf?: string;
  telefone?: string;
  email?: string;
  cnhNumero?: string;
  cnhValidade?: string;
}

export interface Rental {
  id: string;
  clienteId: string;
  veiculoId: string;
  dataInicio: string;
  dataPrevista: string;
  kmEntrega?: number;
  dataFim?: string;
  valor?: number;
  status: 'ativo' | 'finalizado' | 'cancelado';
  criadoEm: string;
}
