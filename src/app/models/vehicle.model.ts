export interface Vehicle {
  id: number;
  placa: string;
  modelo: string;
  status: 'DISPONIVEL' | 'LOCADO' | 'EM_MANUTENCAO';
}
