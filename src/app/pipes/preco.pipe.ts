import { Pipe, PipeTransform } from '@angular/core';

const formatadorDeMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

@Pipe({ name: 'preco', standalone: true })
export class PrecoPipe implements PipeTransform {
  transform(valor: number): string {
    return formatadorDeMoeda.format(valor).replace(/\u00a0/g, ' ');
  }
}
