export interface Vehicle {
  id: string;
  placa: string;
  modelo: string;
  ano?: number;
  cor?: string;
  categoria?: string;
}

export interface Client {
  id: string;
  nome: string;
  cpf?: string;
  telefone?: string;
  email?: string;
}

export interface Rental {
  id: string;
  clienteId: string;
  veiculoId: string;
  dataInicio: string;
  dataPrevista: string;
  dataFim?: string;
  valor?: number;
  status?: 'ativo' | 'finalizado';
}
