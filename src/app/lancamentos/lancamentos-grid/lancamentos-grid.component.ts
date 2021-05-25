import { Component, Input, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { LazyLoadEvent, MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';

import { LancamentoFiltro, LancamentoService } from '../lancamento.service';
import { LancamentosPesquisaComponent } from '../lancamentos-pesquisa/lancamentos-pesquisa.component';

@Component({
  selector: 'app-lancamentos-grid',
  templateUrl: './lancamentos-grid.component.html',
  styleUrls: ['./lancamentos-grid.component.css']
})
export class LancamentosGridComponent {

  @ViewChild('tabela') grid: Table;

  constructor(private lancamentoService: LancamentoService,
              private lancamentoPesquisa: LancamentosPesquisaComponent,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private errorHandler: ErrorHandlerService,
              private title: Title
  ) {}

 @Input() lancamentos = [];
 @Input() totalRegistros;
 @Input() filtro = new LancamentoFiltro;

 ngOnInit() {
  this.title.setTitle('Pesquisa de pessoas');
 }

 confirmarExclusao(lancamento: any) {
  const numPagina = this.filtro.pagina;
  this.confirmationService.confirm({
    message: 'Confirma exclusão?',
    accept: () => {
      this.excluir(lancamento, numPagina);
    },
    reject: () => {
      this.lancamentoPesquisa.pesquisar(numPagina);
    }
  });
 }

 excluir(lancamento: any, numPagina: number) {
  this.lancamentoService.excluir(lancamento.id)
    .then(() => {
      //this.grid.reset(); volta para a primeira página
      if (this.lancamentos.length === 1 && this.filtro.pagina > 0) {
        this.grid.first = (this.filtro.pagina - 1) * this.filtro.itensPorPagina;
      } else {
        this.lancamentoPesquisa.pesquisar(numPagina);
      } // continua na página atual de pesquisa.

      this.messageService.add({ severity: 'success', detail: 'Lançamento excluído com sucesso!' });
    })
    .catch(erro => this.errorHandler.handle(erro));
}

 aoMudarPagina(event: LazyLoadEvent) {
   const pagina = event.first / event.rows;
   this.lancamentoPesquisa.pesquisar(pagina);
 }

}
