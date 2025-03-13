import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { CepResponse } from '../models/cep-response';

@Injectable({
  providedIn: 'root'
})
export class CepService {
  private readonly apiUrl = 'https://viacep.com.br/ws/';

  constructor(private http: HttpClient) { }

  searchCep(cep: string): Observable<CepResponse> {
    // Remove qualquer caractere não numérico
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      return of({ erro: true } as CepResponse);
    }

    return this.http.get<CepResponse>(`${this.apiUrl}${cleanCep}/json/`)
      .pipe(
        catchError(() => of({ erro: true } as CepResponse))
      );
  }
}
