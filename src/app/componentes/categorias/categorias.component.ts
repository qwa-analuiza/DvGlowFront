import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconeComponent } from '../icone/icone.component';
import { ListaServico } from '../../servicos/lista.servico';
import { configuracao } from '../../configuracao';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, IconeComponent],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
})
export class CategoriasComponent {
  linkMercadoLivre = configuracao.linkMercadoLivre;

  categorias = [
    { etiqueta: 'Cor & expressão', titulo: 'Maquiagem', descricao: 'Realce sua beleza com tons, texturas e acabamentos para todos os momentos.' },
    { etiqueta: 'Cuidado diário', titulo: 'Skin care', descricao: 'Rituais essenciais para uma pele bem cuidada, luminosa e naturalmente radiante.' },
    { etiqueta: 'Sua assinatura', titulo: 'Perfumaria', descricao: 'Fragrâncias que traduzem sua personalidade e deixam uma lembrança delicada.' },
  ];

  constructor(public lista: ListaServico) {}
}
