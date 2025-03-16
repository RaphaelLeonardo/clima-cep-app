import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { WeatherResponse } from '../models/weather-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private readonly apiKey = environment.weatherApiKey;

  constructor(private http: HttpClient) { }

  getWeatherByCityName(city: string): Observable<WeatherResponse> {
    if (!city) {
      return of({ cod: 404, message: 'Cidade não encontrada' } as WeatherResponse);
    }

    return this.http.get<WeatherResponse>(this.apiUrl, {
      params: {
        q: city,
        appid: this.apiKey,
        units: 'metric',
        lang: 'pt_br'
      }
    }).pipe(
      catchError(() => of({ cod: 500, message: 'Erro ao buscar dados meteorológicos' } as WeatherResponse))
    );
  }
}
