import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconeComponent } from '../icone/icone.component';

@Component({
  selector: 'app-sobre',
  standalone: true,
  imports: [CommonModule, IconeComponent],
  templateUrl: './sobre.component.html',
  styleUrls: ['./sobre.component.css'],
})
export class SobreComponent {
  beneficios = [
    { icone: 'coracao', titulo: 'Escolha seus favoritos', texto: 'Monte sua lista sem compromisso' },
    { icone: 'brilho', titulo: 'Atendimento pessoal', texto: 'Finalize diretamente pelo WhatsApp' },
    { icone: 'escudo', titulo: 'Também no Mercado Livre', texto: 'Compre pela plataforma se preferir' },
  ];
}
