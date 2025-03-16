import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CepService } from '../../services/cep.service';
import { CepResponse } from '../../models/cep-response';

@Component({
  selector: 'app-cep-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './cep-search.component.html',
  styleUrl: './cep-search.component.scss'
})
export class CepSearchComponent {
  @Output() addressFound = new EventEmitter<CepResponse>();
  @Input() addressData: CepResponse | null = null;
  
  cepForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private cepService: CepService
  ) {
    this.cepForm = this.fb.group({
      cep: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(9)]]
    });
  }

  onSubmit(): void {
    if (this.cepForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    
    const cep = this.cepForm.get('cep')?.value;
    
    this.cepService.searchCep(cep).subscribe({
      next: (response) => {
        this.loading = false;
        
        if (response.erro) {
          this.errorMessage = 'CEP não encontrado. Verifique e tente novamente.';
          return;
        }
        
        this.addressData = response;
        this.addressFound.emit(response);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Erro ao buscar o CEP. Tente novamente mais tarde.';
      }
    });
  }
  
  // Formata o CEP enquanto o usuário digita (99999-999)
  formatCep(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length > 5) {
      value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }
    
    this.cepForm.get('cep')?.setValue(value, { emitEvent: false });
  }
}
