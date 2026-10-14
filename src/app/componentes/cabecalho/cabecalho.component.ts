import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconeComponent } from '../icone/icone.component';
import { ListaServico } from '../../servicos/lista.servico';

@Component({
  selector: 'app-cabecalho',
  standalone: true,
  imports: [CommonModule, IconeComponent],
  templateUrl: './cabecalho.component.html',
  styleUrls: ['./cabecalho.component.css'],
})
export class CabecalhoComponent {
  constructor(public lista: ListaServico) {}
}
