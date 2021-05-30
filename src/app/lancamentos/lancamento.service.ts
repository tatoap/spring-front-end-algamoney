import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { Lancamento } from '../core/model';

export class LancamentoFiltro {
  descricao: string;
  dataVencimentoInicio: Date;
  dataVencimentoFim: Date;
  pagina = 0;
  itensPorPagina = 3;
}

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  lancamentosUrl: string;

  constructor(private http: HttpClient) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
  }

  pesquisar(filtro: LancamentoFiltro): Promise<any> {
    let params = new HttpParams()
      .set('page', filtro.pagina.toString())
      .set('size', filtro.itensPorPagina.toString());

    if (filtro.descricao) {
      params = params.set('descricao', filtro.descricao);
    }

    if (filtro.dataVencimentoInicio) {
      params = params.set('dataVencimentoDe',
        moment(filtro.dataVencimentoInicio).format('DD/MM/YYYY'));
    }

    if (filtro.dataVencimentoFim) {
      params = params.set('dataVencimentoAte',
        moment(filtro.dataVencimentoFim).format('DD/MM/YYYY'));
    }

    return this.http.get(`${this.lancamentosUrl}?resumo`, { params })
      .toPromise()
      .then(response => {
          const lancamentos = response['content'];

          const resultado = {
            lancamentos,
            total: response['totalElements']
          };

          return resultado;
        });
  }

  adicionar(lancamento: Lancamento): Promise<Lancamento> {
    this.converterDateParaString(lancamento);

    return this.http.post<Lancamento>(this.lancamentosUrl, lancamento)
      .toPromise();
  }

  atualizar(lancamento: Lancamento): Promise<Lancamento> {
    this.converterDateParaString(lancamento);

    return this.http.put<Lancamento>(`${this.lancamentosUrl}/${lancamento.id}`, lancamento)
      .toPromise()
      .then(response => {
        const lancamento = response;

        return lancamento;
      });
  }

  buscaPorId(id: number): Promise<Lancamento> {
    return this.http.get<Lancamento>(`${this.lancamentosUrl}/${id}`)
      .toPromise()
      .then(response => {
        const lancamento = response;

        this.converterStringParaDate([lancamento]);

        return lancamento;
      });
  }

  private converterDateParaString(lancamento: Lancamento) {
    lancamento.dataVencimento = moment(lancamento.dataVencimento).format('DD/MM/YYYY');

    if (lancamento.dataPagamento) {
      lancamento.dataPagamento = moment(lancamento.dataPagamento).format('DD/MM/YYYY');
    }

  }

  private converterStringParaDate(lancamentos: Array<Lancamento>) {
    return lancamentos.map(lancamento => {
      return {
      ...lancamento,
      dataVencimento: moment(lancamento.dataVencimento, 'YYYY-MM-DD').toDate(),
      dataPagamento: lancamento.dataPagamento ? moment(lancamento.dataPagamento, 'YYYY-MM-DD').toDate() : null
      };
    });
  }

  excluir(id: number): Promise<void> {
    return this.http.delete(`${this.lancamentosUrl}/${id}`)
      .toPromise()
      .then(() => null);
  }

}

