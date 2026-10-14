import { Component } from '@angular/core';
import { IconeComponent } from '../icone/icone.component';
import { ListaServico } from '../../servicos/lista.servico';
import { configuracao } from '../../configuracao';

@Component({
  selector: 'app-rodape',
  standalone: true,
  imports: [IconeComponent],
  templateUrl: './rodape.component.html',
  styleUrls: ['./rodape.component.css'],
})
export class RodapeComponent {
  linkInstagram = configuracao.linkInstagram;
  linkMercadoLivre = configuracao.linkMercadoLivre;

  constructor(public lista: ListaServico) {}
}
