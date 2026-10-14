import { Component, OnInit } from '@angular/core';
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
export class ProdutosComponent implements OnInit {
  filtros = ['Todos', 'Maquiagem', 'Perfumaria', 'Skin care'];
  produtos: Produto[] = [];
  favoritos: number[] = [];
  erroAoCarregar = false;

  constructor(public lista: ListaServico, private catalogo: CatalogoServico) {}

  ngOnInit(): void {
    this.catalogo.listar().subscribe({
      next: (produtos) => (this.produtos = produtos),
      error: () => (this.erroAoCarregar = true),
    });
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
}
