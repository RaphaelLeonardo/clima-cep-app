import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { WeatherResponse } from '../models/weather-response';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private readonly apiKey = '41dfb7d713f8cb49ade8a0612e0aa90f'; // Você precisará obter uma API key no site OpenWeatherMap

  constructor(private http: HttpClient) { }

  getWeatherByCityName(city: string): Observable<WeatherResponse> {
    if (!city) {
      return of({ cod: 404, message: 'City not found' } as WeatherResponse);
    }

    return this.http.get<WeatherResponse>(this.apiUrl, {
      params: {
        q: city,
        appid: this.apiKey,
        units: 'metric',
        lang: 'pt_br'
      }
    }).pipe(
      catchError(() => of({ cod: 500, message: 'Error fetching weather data' } as WeatherResponse))
    );
  }
}
