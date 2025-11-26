export interface LocacaoRequestDTO {
  veiculoId: number;
  clienteId: number;
  dataHoraInicial: string;
  dataHoraPrevistaDevolucao: string;
  kmEntrega: number;
}
