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
  forecastDays: { date: Date, temp: number }[] = [];

  constructor(private weatherService: WeatherService) {
    // Inicializar com datas de previsão para os próximos 6 dias
    this.generateForecastDays();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['addressData'] && this.addressData && !this.addressData.erro) {
      this.getWeatherData();
    }
  }

  private generateForecastDays(): void {
    this.forecastDays = [];
    const today = new Date();
    
    for (let i = 0; i < 6; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      
      // Temperatura aleatória entre 9 e 25 graus para simular previsão
      const randomTemp = Math.floor(Math.random() * (25 - 9 + 1)) + 9;
      
      this.forecastDays.push({
        date: nextDate,
        temp: randomTemp
      });
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
          // Gerar as previsões para os próximos dias
          this.generateForecastDays();
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
  
  formatDate(date: Date): string {
    // Formato: dd/mm
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  }
  
  getWeatherDescription(weatherData: WeatherResponse): string {
    if (!weatherData || !weatherData.weather || weatherData.weather.length === 0) {
      return 'Desconhecido';
    }
    
    const description = weatherData.weather[0].description.toLowerCase();
    
    if (description.includes('chuva') || description.includes('chuvisco') || description.includes('rain')) {
      return 'Chuva';
    } else if (description.includes('nublado') || description.includes('nuvens') || description.includes('cloud')) {
      return 'Nublado';
    } else if (description.includes('sol') || description.includes('limpo') || description.includes('clear')) {
      return 'Ensolarado';
    } else {
      return weatherData.weather[0].description;
    }
  }
  
  isNightTime(): boolean {
    const currentHour = new Date().getHours();
    // Considera noite entre 18h (6PM) e 6h (6AM)
    return currentHour >= 18 || currentHour < 6;
  }

  getMainWeatherIcon(): string {
    if (!this.weatherData || !this.weatherData.weather || this.weatherData.weather.length === 0) {
      return 'assets/images/Sun cloud angled rain.png';
    }
    
    const description = this.weatherData.weather[0].description.toLowerCase();
    const isNight = this.isNightTime();
    
    if (description.includes('chuva') || description.includes('chuvisco') || description.includes('rain')) {
      return isNight ? 'assets/images/Moon cloud mid rain.png' : 'assets/images/Sun cloud angled rain.png';
    } else if (description.includes('vento') || description.includes('wind')) {
      return isNight ? 'assets/images/Moon cloud fast wind.png' : 'assets/images/Sun cloud angled rain.png';
    } else if (description.includes('limpo') || description.includes('clear')) {
      return isNight ? 'assets/images/Moon cloud mid rain.png' : 'assets/images/sun.png';
    } else {
      return isNight ? 'assets/images/Moon cloud mid rain.png' : 'assets/images/Sun cloud angled rain.png';
    }
  }
  
  getWeatherImage(index: number): string {
    // Para previsões futuras, sempre usamos ícones com sol
    // Dias 0 é hoje, dia 1+ são futuros 
    if (index === 0 && this.isNightTime()) {
      // Para o dia atual, verificamos se é noite
      const description = this.weatherData?.weather[0]?.description?.toLowerCase() || '';
      
      if (description.includes('chuva') || description.includes('rain')) {
        return 'assets/images/Moon cloud mid rain.png';
      } else if (description.includes('vento') || description.includes('wind')) {
        return 'assets/images/Moon cloud fast wind.png';
      } else {
        return 'assets/images/Moon cloud mid rain.png';
      }
    } else {
      // Para dias futuros ou dia atual em horário diurno, usamos ícones com sol
      switch (index % 3) {
        case 0:
          return 'assets/images/Sun cloud angled rain.png';
        case 1:
          return 'assets/images/sun.png';
        case 2:
          return 'assets/images/Sun cloud angled rain.png';
        default:
          return 'assets/images/Sun cloud angled rain.png';
      }
    }
  }
}
