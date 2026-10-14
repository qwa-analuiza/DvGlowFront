import { Routes } from '@angular/router';
import { LojaComponent } from './paginas/loja/loja.component';
import { AdminLoginComponent } from './paginas/admin-login/admin-login.component';
import { AdminPainelComponent } from './paginas/admin-painel/admin-painel.component';
import { adminGuarda } from './guardas/admin.guarda';

export const rotas: Routes = [
  { path: '', component: LojaComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin', component: AdminPainelComponent, canActivate: [adminGuarda] },
  { path: '**', redirectTo: '' },
];
