import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocacaoRequestDTO } from '../../models/locacao-request.dto';

export interface Rental {
  id: number;
  cliente: { id: number; nome: string; cpf: string };
  veiculo: { id: number; modelo: string; placa: string };
  dataHoraInicial: string;
  dataHoraPrevistaDevolucao: string;
  status: string;
  kmEntrega: number;
}

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/locacoes';

  getRentals(): Observable<Rental[]> {
    return this.http.get<Rental[]>(this.apiUrl);
  }

  startRental(rentalData: LocacaoRequestDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/iniciar`, rentalData);
  }
}
