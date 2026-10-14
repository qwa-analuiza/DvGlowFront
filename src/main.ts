import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { rotas } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(rotas)],
}).catch((erro) => console.error(erro));
