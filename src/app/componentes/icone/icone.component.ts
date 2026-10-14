import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icone',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg [attr.width]="tamanho" [attr.height]="tamanho" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"
         [ngSwitch]="nome">
      <g *ngSwitchCase="'menu'"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></g>
      <g *ngSwitchCase="'sacola'"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></g>
      <g *ngSwitchCase="'fechar'"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></g>
      <g *ngSwitchCase="'seta'"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></g>
      <g *ngSwitchCase="'brilho'"><path d="M10 3l1.9 5.1L17 10l-5.1 1.9L10 17l-1.9-5.1L3 10l5.1-1.9z"/><path d="M18 14l.7 1.8 1.8.7-1.8.7L18 19l-.7-1.8-1.8-.7 1.8-.7z"/></g>
      <path *ngSwitchCase="'coracao'" d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>
      <path *ngSwitchCase="'coracao-cheio'" fill="currentColor" d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>
      <g *ngSwitchCase="'escudo'"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></g>
      <g *ngSwitchCase="'instagram'"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></g>
      <path *ngSwitchCase="'tiktok'" d="M10 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
      <g *ngSwitchCase="'mercado'"><path d="M2 12l4-4 5 1 3-1 4 3 4 0"/><path d="M6 8l-4 4 4 4 3 1 3 2 2-1 4-3 3-3"/></g>
      <g *ngSwitchCase="'whatsapp'"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></g>
      <g *ngSwitchCase="'mais'"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></g>
      <g *ngSwitchCase="'voltar'"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="11 6 5 12 11 18"/></g>
      <g *ngSwitchCase="'lapis'"><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4z"/><line x1="13.5" y1="6.5" x2="17.5" y2="10.5"/></g>
      <g *ngSwitchCase="'lixeira'"><path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 13h10l1-13"/><path d="M9 7V4h6v3"/></g>
      <g *ngSwitchCase="'busca'"><circle cx="11" cy="11" r="6"/><line x1="20" y1="20" x2="15.5" y2="15.5"/></g>
      <g *ngSwitchCase="'caixa'"><path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5"/><line x1="12" y1="13" x2="12" y2="21"/></g>
      <g *ngSwitchCase="'sair'"><path d="M9 4H5v16h4"/><polyline points="16 8 20 12 16 16"/><line x1="20" y1="12" x2="9" y2="12"/></g>
      <g *ngSwitchCase="'imagem'"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-8 8"/></g>
    </svg>
  `,
  styles: [`:host { display: inline-flex; line-height: 0; }`],
})
export class IconeComponent {
  @Input() nome = '';
  @Input() tamanho = 20;
}
