import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { AuthService } from 'src/app/seguranca/auth.service';
import { PessoaFiltro, PessoaService } from '../pessoa.service';
import { PessoasPesquisaComponent } from '../pessoas-pesquisa/pessoas-pesquisa.component';

@Component({
  selector: 'app-pessoas-grid',
  templateUrl: './pessoas-grid.component.html',
  styleUrls: ['./pessoas-grid.component.css']
})
export class PessoasGridComponent implements OnInit {

  @ViewChild('tabela') grid: Table;

  constructor(private pessoaService: PessoaService,
              private pessoaPesquisa: PessoasPesquisaComponent,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private errorHandler: ErrorHandlerService,
              private title: Title,
              public auth: AuthService
  ) {}

  @Input() pessoas = [];
  @Input() totalRegistros;
  @Input() filtro = new PessoaFiltro;

  ngOnInit() {
    this.title.setTitle('Pesquisa de pessoas');
  }

  confirmarExclusao(pessoa: any) {
    const numPagina = this.filtro.pagina;
    this.confirmationService.confirm({
      message: 'Confirma exclusão?',
      accept: () => {
        this.excluir(pessoa, numPagina);
      },
      reject: () => {
        this.pessoaPesquisa.pesquisar(numPagina);
      }
    });
  }

  excluir(pessoa: any, numPagina: number) {
    this.pessoaService.excluir(pessoa.id)
      .then(() => {
        this.manterNaPaginaDePesquisa(numPagina);

        this.messageService.add({ severity: 'success', detail: 'Pessoa excluída com sucesso!' });
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
        this.manterNaPaginaDePesquisa(numPagina);
      });
  }

  manterNaPaginaDePesquisa(numPagina: number) {
    //this.grid.reset(); volta para a primeira página
    if (this.pessoas.length === 1 && this.filtro.pagina > 0) {
      this.grid.first = (this.filtro.pagina - 1) * this.filtro.itensPorPagina;
    } else {
      this.pessoaPesquisa.pesquisar(numPagina);
    } // continua na página atual de pesquisa.
  }

  alternarStatus(pessoa: any): void {
    const novoStatus = !pessoa.ativo;

    if (pessoa.ativo) {
      this.pessoaService.inativar(pessoa.id)
        .then(() => {
          this.mensagem(novoStatus);
          pessoa.ativo = novoStatus;
        })
        .catch(erro => this.errorHandler.handle(erro));
    } else {
      this.pessoaService.ativar(pessoa.id)
        .then(() => {
          this.mensagem(novoStatus);
          pessoa.ativo = novoStatus;
        })
        .catch(erro => this.errorHandler.handle(erro));
    }
  }

  mensagem(novoStatus: any) {
    const acao = novoStatus ? 'ativada' : 'inativada';
    this.messageService.add({ severity: 'success', detail: `Pessoa ${acao} com sucesso!` });
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pessoaPesquisa.pesquisar(pagina);
  }

}
