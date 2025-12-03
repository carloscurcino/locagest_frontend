import { Component, OnInit, inject, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';








// --- Funções de Validação Customizadas ---

/**
 * Valida um número de CPF brasileiro.
 * Verifica a estrutura, dígitos repetidos e os dois dígitos verificadores.
 */
function cpfValidator(control: AbstractControl ): ValidationErrors | null {
  const cpf = control.value?.replace(/\D/g, '');
  if (!cpf || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return { cpfInvalido: true };
  }
  let sum = 0;
  let remainder;
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return { cpfInvalido: true };
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return { cpfInvalido: true };
  return null;
}

/**
 * Valida se a data de nascimento corresponde a uma idade de 18 anos ou mais.
 */
function ageValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const birthDate = new Date(control.value);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 18 ? null : { menorDeIdade: true };
}


@Component({
  selector: 'app-client-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-registration.component.html',
  styleUrl: './client-registration.component.css'
})
export class ClientRegistrationComponent implements OnInit {
  clientForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  cepLoading: boolean[] = []; // Array para controlar o loading de cada endereço

  @Output() onSaved = new EventEmitter<void>();
  @Output() onCanceled = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private http = inject(HttpClient );
  private apiUrl = 'http://localhost:8080/api/clientes';

  ngOnInit( ): void {
    this.clientForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', [Validators.required, cpfValidator]],
      dataNascimento: ['', [Validators.required, ageValidator]],
      cnh: this.fb.group({
        numero: ['', Validators.required],
        validade: ['', Validators.required],
        tipo: ['', Validators.required]
      }),
      telefones: this.fb.array([this.createTelefoneGroup()]),
      enderecos: this.fb.array([this.createEnderecoGroup()])
    });
    this.cepLoading = [false]; // Inicializa o estado de loading para o primeiro endereço
  }

  // --- Getters para facilitar o acesso no template ---
  get telefones() {
    return this.clientForm.get('telefones') as FormArray;
  }

  get enderecos() {
    return this.clientForm.get('enderecos') as FormArray;
  }

  // --- Métodos para criar FormGroups para os FormArrays ---
  createTelefoneGroup(): FormGroup {
    return this.fb.group({
      numero: ['', Validators.required]
    });
  }

  createEnderecoGroup(): FormGroup {
    return this.fb.group({
      cep: ['', Validators.required],
      rua: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required]
    });
  }

  // --- Métodos para adicionar e remover itens dos FormArrays ---
  adicionarTelefone(): void {
    this.telefones.push(this.createTelefoneGroup());
  }

  removerTelefone(index: number): void {
    if (this.telefones.length > 1) {
      this.telefones.removeAt(index);
    }
  }

  adicionarEndereco(): void {
    this.enderecos.push(this.createEnderecoGroup());
    this.cepLoading.push(false); // Adiciona um estado de loading para o novo endereço
  }

  removerEndereco(index: number): void {
    if (this.enderecos.length > 1) {
      this.enderecos.removeAt(index);
      this.cepLoading.splice(index, 1); // Remove o estado de loading correspondente
    }
  }

  // --- LÓGICA DE BUSCA DE CEP ---
  buscarCep(index: number): void {
    const enderecoGroup = this.enderecos.at(index);
    const cep = enderecoGroup.get('cep')?.value?.replace(/\D/g, '');

    if (!cep || cep.length !== 8) {
      return; // Sai se o CEP for nulo ou não tiver 8 dígitos
    }

    this.cepLoading[index] = true;
    // Limpa os campos antes da busca
    enderecoGroup.patchValue({ rua: '', bairro: '', cidade: '', estado: '' });

    this.http.get(`https://viacep.com.br/ws/${cep}/json/` ).pipe(
      tap((dados: any) => {
        if (dados.erro) {
          enderecoGroup.get('cep')?.setErrors({ cepInvalido: true });
        } else {
          enderecoGroup.patchValue({
            rua: dados.logradouro,
            bairro: dados.bairro,
            cidade: dados.localidade,
            estado: dados.uf
          });
        }
      }),
      catchError(error => {
        console.error('Erro ao buscar CEP:', error);
        enderecoGroup.get('cep')?.setErrors({ cepInvalido: true });
        return of(null); // Retorna um observable nulo para o pipe continuar
      }),
      finalize(() => {
        this.cepLoading[index] = false; // Garante que o loading termine
      })
    ).subscribe();
  }

  // --- Métodos de controle e validação para o template ---
  getControl(name: string): AbstractControl | null {
    return this.clientForm.get(name);
  }

  isInvalid(name: string): boolean {
    const control = this.getControl(name);
    return !!control && control.invalid && control.touched;
  }

  getTelefoneControl(index: number): AbstractControl | null {
    return this.telefones.at(index).get('numero');
  }

  isTelefoneInvalid(index: number): boolean {
    const control = this.getTelefoneControl(index);
    return !!control && control.invalid && control.touched;
  }

  getEnderecoControl(index: number, field: string): AbstractControl | null {
    return this.enderecos.at(index).get(field);
  }

  isEnderecoInvalid(index: number, field: string): boolean {
    const control = this.getEnderecoControl(index, field);
    return !!control && control.invalid && control.touched;
  }

  // --- Ações do formulário ---
  onSubmit() {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      this.errorMessage = 'Por favor, corrija os erros no formulário.';
      return;
    }

    this.isSubmitting = true;
    this.http.post(this.apiUrl, this.clientForm.value ).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Cliente salvo com sucesso!';
        this.resetForm();
        setTimeout(() => {
          this.successMessage = null;
          this.onSaved.emit();
        }, 2000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Erro ao salvar cliente. Verifique os dados e tente novamente.';
        console.error(err);
      }
    });
  }

  onCancel() {
    this.resetForm();
    this.onCanceled.emit();
  }

  private resetForm(): void {
    this.clientForm.reset();

    // Limpa e recria os FormArrays para o estado inicial
    this.enderecos.clear();
    this.telefones.clear();
    this.adicionarEndereco();
    this.adicionarTelefone();
  }
}
