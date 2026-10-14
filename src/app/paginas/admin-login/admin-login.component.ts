import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IconeComponent } from '../../componentes/icone/icone.component';
import { AutenticacaoServico } from '../../servicos/autenticacao.servico';
import { mensagemDeErro } from '../../utilitarios/mensagem-de-erro';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, IconeComponent],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent implements OnInit {
  formulario = this.construtor.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required],
  });
  entrando = false;
  erro = '';

  constructor(
    private construtor: FormBuilder,
    private autenticacao: AutenticacaoServico,
    private roteador: Router
  ) {}

  async ngOnInit(): Promise<void> {
    if (await this.autenticacao.estaAutenticado()) this.roteador.navigate(['/admin']);
  }

  entrar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.entrando = true;
    this.erro = '';
    const { email, senha } = this.formulario.getRawValue();

    this.autenticacao.entrar(email, senha).subscribe({
      next: () => this.roteador.navigate(['/admin']),
      error: (erro) => {
        this.erro = mensagemDeErro(erro, 'Não foi possível entrar.');
        this.entrando = false;
      },
    });
  }
}
