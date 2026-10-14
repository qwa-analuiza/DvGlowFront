import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconeComponent } from '../icone/icone.component';
import { ListaServico } from '../../servicos/lista.servico';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CommonModule, IconeComponent],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css'],
})
export class ListaComponent {
  constructor(public lista: ListaServico) {}
}
