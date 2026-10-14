import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { DadosProduto, normalizarProduto, Produto, lerImagens, serializarImagens } from '../modelos/produto.modelo';
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
    return data.map((produto) => normalizarProduto(produto));
  }

  private async cadastrar(dados: DadosProduto): Promise<void> {
    const imagens = await this.enviarImagens(dados.imagens);
    const { error } = await this.supabase.cliente
      .from('produtos')
      .insert({
        nome: dados.nome,
        categoria: dados.categoria,
        preco: dados.preco,
        imagem: serializarImagens(imagens),
      });

    if (error) {
      await this.removerImagens(imagens);
      throw error;
    }
  }

  private async editar(id: number, dados: DadosProduto): Promise<void> {
    const campos: Record<string, unknown> = { nome: dados.nome, categoria: dados.categoria, preco: dados.preco };
    let imagensAntigas: string[] = [];
    let imagensNovas: string[] = [];

    if (dados.imagens.length > 0) {
      imagensAntigas = lerImagens(await this.buscarImagem(id));
      imagensNovas = await this.enviarImagens(dados.imagens);
      campos['imagem'] = serializarImagens(imagensNovas);
    }

    const { data, error } = await this.supabase.cliente.from('produtos').update(campos).eq('id', id).select('id');

    if (error || data.length === 0) {
      await this.removerImagens(imagensNovas);
      throw error ?? new Error('row-level security');
    }
    await this.removerImagens(imagensAntigas);
  }

  private async remover(id: number): Promise<void> {
    const imagens = lerImagens(await this.buscarImagem(id));
    const { data, error } = await this.supabase.cliente.from('produtos').delete().eq('id', id).select('id');

    if (error) throw error;
    if (data.length === 0) throw new Error('row-level security');
    await this.removerImagens(imagens);
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

  private async enviarImagens(arquivos: File[]): Promise<string[]> {
    const imagens: string[] = [];
    try {
      for (const arquivo of arquivos) imagens.push(await this.enviarImagem(arquivo));
      return imagens;
    } catch (erro) {
      await this.removerImagens(imagens);
      throw erro;
    }
  }

  private async removerImagens(imagens: string[]): Promise<void> {
    await Promise.all(imagens.map((imagem) => this.removerImagem(imagem)));
  }

  /** Só apaga imagens que estão no bucket; as que vêm de assets/ não são tocadas. */
  private async removerImagem(url: string): Promise<void> {
    const marcador = `/object/public/${BUCKET}/`;
    const posicao = url.indexOf(marcador);
    if (posicao === -1) return;
    await this.supabase.cliente.storage.from(BUCKET).remove([decodeURIComponent(url.slice(posicao + marcador.length))]);
  }
}
