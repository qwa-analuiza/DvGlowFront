import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { DadosProduto, Produto } from '../modelos/produto.modelo';
import { SupabaseServico } from './supabase.servico';

const BUCKET = 'produtos';
const COLUNAS = 'id, nome, categoria, preco, imagem';

/** Gestão do catálogo pelo painel admin: tabela "produtos" e bucket "produtos" do Supabase. */
@Injectable({ providedIn: 'root' })
export class ProdutoServico {
  constructor(private supabase: SupabaseServico) {}

  listar(): Observable<Produto[]> {
    return from(this.buscarTodos());
  }

  criar(dados: DadosProduto): Observable<void> {
    return from(this.cadastrar(dados));
  }

  atualizar(id: number, dados: DadosProduto): Observable<void> {
    return from(this.editar(id, dados));
  }

  excluir(id: number): Observable<void> {
    return from(this.remover(id));
  }

  private async buscarTodos(): Promise<Produto[]> {
    const { data, error } = await this.supabase.cliente.from('produtos').select(COLUNAS).order('id');
    if (error) throw error;
    return data as Produto[];
  }

  private async cadastrar(dados: DadosProduto): Promise<void> {
    const imagem = await this.enviarImagem(dados.imagem!);
    const { error } = await this.supabase.cliente
      .from('produtos')
      .insert({ nome: dados.nome, categoria: dados.categoria, preco: dados.preco, imagem });

    if (error) {
      await this.removerImagem(imagem);
      throw error;
    }
  }

  private async editar(id: number, dados: DadosProduto): Promise<void> {
    const campos: Record<string, unknown> = { nome: dados.nome, categoria: dados.categoria, preco: dados.preco };
    let imagemAntiga: string | null = null;

    if (dados.imagem) {
      imagemAntiga = await this.buscarImagem(id);
      campos['imagem'] = await this.enviarImagem(dados.imagem);
    }

    const { data, error } = await this.supabase.cliente.from('produtos').update(campos).eq('id', id).select('id');

    if (error || data.length === 0) {
      if (campos['imagem']) await this.removerImagem(campos['imagem'] as string);
      throw error ?? new Error('row-level security');
    }
    if (imagemAntiga) await this.removerImagem(imagemAntiga);
  }

  private async remover(id: number): Promise<void> {
    const imagem = await this.buscarImagem(id);
    const { data, error } = await this.supabase.cliente.from('produtos').delete().eq('id', id).select('id');

    if (error) throw error;
    if (data.length === 0) throw new Error('row-level security');
    if (imagem) await this.removerImagem(imagem);
  }

  private async buscarImagem(id: number): Promise<string | null> {
    const { data } = await this.supabase.cliente.from('produtos').select('imagem').eq('id', id).maybeSingle();
    return data?.imagem ?? null;
  }

  private async enviarImagem(arquivo: File): Promise<string> {
    const extensao = arquivo.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const caminho = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extensao}`;
    const armazenamento = this.supabase.cliente.storage.from(BUCKET);

    const { error } = await armazenamento.upload(caminho, arquivo, { contentType: arquivo.type, cacheControl: '31536000' });
    if (error) throw error;
    return armazenamento.getPublicUrl(caminho).data.publicUrl;
  }

  /** Só apaga imagens que estão no bucket; as que vêm de assets/ não são tocadas. */
  private async removerImagem(url: string): Promise<void> {
    const marcador = `/object/public/${BUCKET}/`;
    const posicao = url.indexOf(marcador);
    if (posicao === -1) return;
    await this.supabase.cliente.storage.from(BUCKET).remove([decodeURIComponent(url.slice(posicao + marcador.length))]);
  }
}
