import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { NotAuthenticatedError } from '../seguranca/money-http-interceptor';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private messageService: MessageService,
              private router: Router
  ) { }

  handle(errorResponse: any) {
    let msg: string;

    console.log("userMessage:" + errorResponse.error.userMessage);

    if (typeof errorResponse === 'string') {
      msg = errorResponse;

    } else if (errorResponse instanceof NotAuthenticatedError) {
      msg = 'Sua sessão expirou!';
      this.router.navigate(['/login']);

    } else if (errorResponse instanceof HttpErrorResponse &&
              errorResponse.status >= 400 && errorResponse.status <= 499) {
      msg = 'Ocorreu um erro ao processar a sua solicitação.';

      try {
        if (errorResponse.error.userMessage) {
          if (errorResponse.status === 403) {
            msg = 'Você não tem permissão para executar esta ação!';
          } else {
            msg = errorResponse.error.userMessage;
            console.log("userMessage:" + errorResponse.error.userMessage);
          }
        } else {
          if (errorResponse.status === 403) {
            msg = 'Você não tem permissão para executar esta ação!';
          } else {
            msg = errorResponse.error.error_description;
            console.log("userMessage:" + errorResponse.error.userMessage);
          }
        }
      } catch (e) { }

      console.error('Ocorreu um erro', errorResponse);

    } else {
      msg = 'Erro ao processar serviço remoto. Tente novamente.';
      console.error('Ocorreu um erro', errorResponse);
    }

    // direciona para a página não encontrada caso o usuário altere o código para um inexistente.
    /*if (errorResponse.status === 400 && errorResponse) {
      this.router.navigate(['/pagina-nao-encontrada']);
      return ;
    }*/

    this.messageService.add({ severity: 'error', detail: msg });
  }
}
