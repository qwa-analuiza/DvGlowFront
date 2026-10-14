import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IconeComponent } from '../../componentes/icone/icone.component';
import { ProdutoFormularioComponent } from '../../componentes/produto-formulario/produto-formulario.component';
import { Produto } from '../../modelos/produto.modelo';
import { PrecoPipe } from '../../pipes/preco.pipe';
import { AutenticacaoServico } from '../../servicos/autenticacao.servico';
import { ProdutoServico } from '../../servicos/produto.servico';
import { mensagemDeErro } from '../../utilitarios/mensagem-de-erro';

const semAcentos = (texto: string): string =>
  texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

@Component({
  selector: 'app-admin-painel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, IconeComponent, ProdutoFormularioComponent, PrecoPipe],
  templateUrl: './admin-painel.component.html',
  styleUrls: ['./admin-painel.component.css'],
})
export class AdminPainelComponent implements OnInit {
  produtos: Produto[] = [];
  busca = new FormControl('', { nonNullable: true });
  carregando = true;
  erro = '';

  formularioAberto = false;
  produtoEmEdicao: Produto | null = null;
  produtoParaExcluir: Produto | null = null;
  excluindo = false;

  constructor(private produtoServico: ProdutoServico, private autenticacao: AutenticacaoServico) {}

  get produtosFiltrados(): Produto[] {
    const termo = semAcentos(this.busca.value.trim());
    return this.produtos.filter((produto) => semAcentos(produto.nome).includes(termo));
  }

  get categoriasAtivas(): number {
    return new Set(this.produtos.map((produto) => produto.categoria)).size;
  }

  get valorMedio(): number {
    if (this.produtos.length === 0) return 0;
    return this.produtos.reduce((soma, produto) => soma + produto.preco, 0) / this.produtos.length;
  }

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.produtoServico.listar().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.erro = '';
        this.carregando = false;
      },
      error: (erro) => {
        this.erro = mensagemDeErro(erro, 'Não foi possível carregar os produtos.');
        this.carregando = false;
      },
    });
  }

  urlDaImagem(produto: Produto): string {
    return produto.imagem;
  }

  abrirFormulario(produto: Produto | null = null): void {
    this.produtoEmEdicao = produto;
    this.formularioAberto = true;
  }

  fecharFormulario(): void {
    this.formularioAberto = false;
    this.produtoEmEdicao = null;
  }

  aoSalvar(): void {
    this.fecharFormulario();
    this.carregar();
  }

  confirmarExclusao(): void {
    if (!this.produtoParaExcluir) return;
    this.excluindo = true;

    this.produtoServico.excluir(this.produtoParaExcluir.id).subscribe({
      next: () => {
        this.produtoParaExcluir = null;
        this.excluindo = false;
        this.carregar();
      },
      error: (erro) => {
        this.erro = mensagemDeErro(erro, 'Não foi possível excluir o produto.');
        this.produtoParaExcluir = null;
        this.excluindo = false;
      },
    });
  }

  sair(): void {
    this.autenticacao.sair();
  }
}
