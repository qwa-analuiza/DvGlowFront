import { Component } from '@angular/core';
import { CabecalhoComponent } from '../../componentes/cabecalho/cabecalho.component';
import { HeroComponent } from '../../componentes/hero/hero.component';
import { CategoriasComponent } from '../../componentes/categorias/categorias.component';
import { ProdutosComponent } from '../../componentes/produtos/produtos.component';
import { SobreComponent } from '../../componentes/sobre/sobre.component';
import { RodapeComponent } from '../../componentes/rodape/rodape.component';
import { ListaComponent } from '../../componentes/lista/lista.component';
import { IconeComponent } from '../../componentes/icone/icone.component';
import { ListaServico } from '../../servicos/lista.servico';

@Component({
  selector: 'app-loja',
  standalone: true,
  imports: [
    CabecalhoComponent, HeroComponent, CategoriasComponent, ProdutosComponent,
    SobreComponent, RodapeComponent, ListaComponent, IconeComponent,
  ],
  template: `
    <app-cabecalho></app-cabecalho>
    <main>
      <app-hero></app-hero>
      <app-categorias></app-categorias>
      <app-produtos></app-produtos>
      <app-sobre></app-sobre>
    </main>
    <app-rodape></app-rodape>
    <app-lista></app-lista>
    <a class="whatsapp-flutuante" [href]="lista.linkWhatsapp()" target="_blank" rel="noopener" aria-label="WhatsApp">
      <app-icone nome="whatsapp" [tamanho]="26"></app-icone>
    </a>
  `,
  styles: [`
    .whatsapp-flutuante {
      position: fixed; right: 18px; bottom: 18px; z-index: 30;
      width: 54px; height: 54px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      background: #fff; color: var(--rosa-escuro);
      box-shadow: 0 8px 24px rgba(120, 60, 75, 0.25);
    }
  `],
})
export class LojaComponent {
  constructor(public lista: ListaServico) {}
}
