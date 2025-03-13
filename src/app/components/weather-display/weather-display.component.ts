import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { WeatherService } from '../../services/weather.service';
import { CepResponse } from '../../models/cep-response';
import { WeatherResponse } from '../../models/weather-response';

@Component({
  selector: 'app-weather-display',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    DatePipe
  ],
  templateUrl: './weather-display.component.html',
  styleUrl: './weather-display.component.scss'
})
export class WeatherDisplayComponent implements OnChanges {
  @Input() addressData: CepResponse | null = null;
  
  weatherData: WeatherResponse | null = null;
  loading = false;
  errorMessage = '';

  constructor(private weatherService: WeatherService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['addressData'] && this.addressData && !this.addressData.erro) {
      this.getWeatherData();
    }
  }

  private getWeatherData(): void {
    if (!this.addressData) return;

    const cityName = `${this.addressData.localidade},${this.addressData.uf},BR`;
    
    this.loading = true;
    this.errorMessage = '';
    this.weatherData = null;
    
    this.weatherService.getWeatherByCityName(cityName).subscribe({
      next: (data) => {
        this.loading = false;
        
        if (data.cod === 200) {
          this.weatherData = data;
        } else {
          this.errorMessage = data.message || 'Erro ao obter dados meteorológicos.';
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Erro ao conectar-se ao serviço de previsão do tempo.';
      }
    });
  }

  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }
  
  getCurrentDate(): Date {
    return new Date();
  }
}
