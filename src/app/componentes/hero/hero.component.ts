import { Component } from '@angular/core';
import { IconeComponent } from '../icone/icone.component';
import { ListaServico } from '../../servicos/lista.servico';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [IconeComponent],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
})
export class HeroComponent {
  constructor(public lista: ListaServico) {}
}
