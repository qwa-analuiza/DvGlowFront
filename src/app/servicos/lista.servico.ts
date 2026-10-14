import { Injectable } from '@angular/core';
import { ItemLista, Produto } from '../modelos/produto.modelo';
import { configuracao } from '../configuracao';

@Injectable({ providedIn: 'root' })
export class ListaServico {
  itens: ItemLista[] = [];
  listaAberta = false;
  menuAberto = false;
  categoriaSelecionada = 'Todos';
  notificacaoProduto: Produto | null = null;
  private temporizadorNotificacao: ReturnType<typeof setTimeout> | undefined;

  get quantidadeTotal(): number {
    return this.itens.reduce((soma, item) => soma + item.quantidade, 0);
  }

  get valorTotal(): number {
    return this.itens.reduce((soma, item) => soma + item.produto.preco * item.quantidade, 0);
  }

  formatarPreco(valor: number): string {
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
  }

  adicionar(produto: Produto): void {
    const existente = this.itens.find((item) => item.produto.id === produto.id);
    if (existente) {
      existente.quantidade++;
    } else {
      this.itens.push({ produto, quantidade: 1 });
    }
    this.notificacaoProduto = produto;
    this.agendarFechamentoNotificacao();
  }

  alterarQuantidade(id: number, variacao: number): void {
    const item = this.itens.find((i) => i.produto.id === id);
    if (!item) return;
    item.quantidade += variacao;
    if (item.quantidade <= 0) this.remover(id);
  }

  remover(id: number): void {
    this.itens = this.itens.filter((item) => item.produto.id !== id);
  }

  filtrarCategoria(categoria: string): void {
    this.categoriaSelecionada = categoria;
    this.fecharMenu();
  }

  abrirMenu(): void { this.menuAberto = true; this.atualizarRolagem(); }
  fecharMenu(): void { this.menuAberto = false; this.atualizarRolagem(); }
  abrirLista(): void {
    this.fecharNotificacao();
    this.listaAberta = true;
    this.menuAberto = false;
    this.atualizarRolagem();
  }
  fecharLista(): void { this.listaAberta = false; this.atualizarRolagem(); }

  fecharNotificacao(): void {
    this.notificacaoProduto = null;
    if (this.temporizadorNotificacao) {
      clearTimeout(this.temporizadorNotificacao);
      this.temporizadorNotificacao = undefined;
    }
  }

  private agendarFechamentoNotificacao(): void {
    if (this.temporizadorNotificacao) clearTimeout(this.temporizadorNotificacao);
    this.temporizadorNotificacao = setTimeout(() => this.fecharNotificacao(), 5000);
  }

  private atualizarRolagem(): void {
    document.body.style.overflow = this.menuAberto || this.listaAberta ? 'hidden' : '';
  }

  linkWhatsapp(): string {
    let mensagem = 'Olá! Vim pelo site da DV Glow e gostaria de montar uma lista de produtos.';
    if (this.itens.length > 0) {
      const linhas = this.itens.map(
        (item) => `• ${item.quantidade}x ${item.produto.nome} - ${this.formatarPreco(item.produto.preco * item.quantidade)}`
      );
      mensagem = 'Olá! Gostaria de pedir os produtos da minha lista:\n\n' + linhas.join('\n') +
        '\n\nTotal: ' + this.formatarPreco(this.valorTotal);
    }
    return `https://wa.me/${configuracao.numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;
  }
}
