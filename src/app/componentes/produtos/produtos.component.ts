import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconeComponent } from '../icone/icone.component';
import { ListaServico } from '../../servicos/lista.servico';
import { Produto } from '../../modelos/produto.modelo';
import { CatalogoServico } from '../../servicos/catalogo.servico';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, IconeComponent],
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css'],
})
export class ProdutosComponent implements OnDestroy, OnInit {
  filtros = ['Todos', 'Maquiagem', 'Perfumaria', 'Skin care'];
  produtos: Produto[] = [];
  favoritos: number[] = [];
  erroAoCarregar = false;
  private indicesDeImagem: Record<number, number> = {};
  private temporizadorCarrossel: ReturnType<typeof setInterval> | undefined;

  constructor(public lista: ListaServico, private catalogo: CatalogoServico) {}

  ngOnInit(): void {
    this.catalogo.listar().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        if (produtos.some((produto) => this.imagensDo(produto).length > 1)) {
          this.temporizadorCarrossel = setInterval(() => {
            this.produtos.forEach((produto) => this.alterarImagem(produto, 1));
          }, 4000);
        }
      },
      error: () => (this.erroAoCarregar = true),
    });
  }

  ngOnDestroy(): void {
    if (this.temporizadorCarrossel) clearInterval(this.temporizadorCarrossel);
  }

  get produtosFiltrados(): Produto[] {
    if (this.lista.categoriaSelecionada === 'Todos') return this.produtos;
    return this.produtos.filter((p) => p.categoria === this.lista.categoriaSelecionada);
  }

  alternarFavorito(id: number): void {
    this.favoritos = this.favoritos.includes(id)
      ? this.favoritos.filter((f) => f !== id)
      : [...this.favoritos, id];
  }

  ehFavorito(id: number): boolean {
    return this.favoritos.includes(id);
  }

  imagensDo(produto: Produto): string[] {
    return produto.imagens?.length ? produto.imagens : [produto.imagem];
  }

  imagemAtual(produto: Produto): string {
    const imagens = this.imagensDo(produto);
    return imagens[this.indiceDaImagem(produto)] ?? produto.imagem;
  }

  indiceDaImagem(produto: Produto): number {
    return Math.min(this.indicesDeImagem[produto.id] ?? 0, this.imagensDo(produto).length - 1);
  }

  alterarImagem(produto: Produto, variacao: number): void {
    const quantidade = this.imagensDo(produto).length;
    if (quantidade < 2) return;

    const indiceAtual = this.indiceDaImagem(produto);
    this.indicesDeImagem[produto.id] = (indiceAtual + variacao + quantidade) % quantidade;
  }

}
