import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacaoServico } from '../servicos/autenticacao.servico';

export const adminGuarda: CanActivateFn = async () => {
  const autenticacao = inject(AutenticacaoServico);
  const roteador = inject(Router);
  return (await autenticacao.estaAutenticado()) || roteador.createUrlTree(['/admin/login']);
};
