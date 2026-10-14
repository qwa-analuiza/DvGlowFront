import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { SupabaseServico } from './supabase.servico';

@Injectable({ providedIn: 'root' })
export class AutenticacaoServico {
  constructor(private supabase: SupabaseServico, private roteador: Router) {}

  async estaAutenticado(): Promise<boolean> {
    const { data } = await this.supabase.cliente.auth.getSession();
    return data.session !== null;
  }

  entrar(email: string, senha: string): Observable<void> {
    return from(this.fazerLogin(email, senha));
  }

  sair(): void {
    this.supabase.cliente.auth.signOut().finally(() => this.roteador.navigate(['/admin/login']));
  }

  private async fazerLogin(email: string, senha: string): Promise<void> {
    const { error } = await this.supabase.cliente.auth.signInWithPassword({ email, password: senha });
    if (error) throw error;
  }
}
