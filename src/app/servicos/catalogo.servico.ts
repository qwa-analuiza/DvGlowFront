import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { normalizarProduto, Produto } from '../modelos/produto.modelo';
import { SupabaseServico } from './supabase.servico';

/** Catálogo público da loja, lido direto do Supabase. */
@Injectable({ providedIn: 'root' })
export class CatalogoServico {
  constructor(private supabase: SupabaseServico) {}

  listar(): Observable<Produto[]> {
    return from(this.buscar());
  }

  private async buscar(): Promise<Produto[]> {
    const { data, error } = await this.supabase.cliente
      .from('produtos')
      .select('id, nome, categoria, preco, imagem')
      .order('id');
    if (error) throw error;
    return data.map((produto) => normalizarProduto(produto));
  }
}
