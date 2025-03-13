import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CepSearchComponent } from './components/cep-search/cep-search.component';
import { WeatherDisplayComponent } from './components/weather-display/weather-display.component';
import { CepResponse } from './models/cep-response';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CepSearchComponent, WeatherDisplayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Clima e CEP';
  addressData: CepResponse | null = null;

  onAddressFound(data: CepResponse): void {
    this.addressData = data;
  }
}
