import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { AuthService } from '../seguranca/auth.service';
import { ErrorHandlerService } from './error-handler.service';
import { NavbarComponent } from './navbar/navbar.component';
import { LancamentoService } from '../lancamentos/lancamento.service';
import { PessoaService } from '../pessoas/pessoa.service';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada.component';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    NavbarComponent,
    PaginaNaoEncontradaComponent
  ],
  imports: [
    CommonModule,
    RouterModule,

    ToastModule,
    ConfirmDialogModule,
  ],
  exports: [
    NavbarComponent,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [
    LancamentoService,
    PessoaService,
    ErrorHandlerService,
    AuthService,

    ConfirmationService,
    MessageService,
    Title,
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
})
export class CoreModule { }
