import { Component } from '@angular/core';
import { CepSearchComponent } from './components/cep-search/cep-search.component';
import { WeatherDisplayComponent } from './components/weather-display/weather-display.component';
import { CepResponse } from './models/cep-response';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CepSearchComponent, WeatherDisplayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  addressData: CepResponse | null = null;

  onAddressFound(data: CepResponse): void {
    this.addressData = data;
  }
}
