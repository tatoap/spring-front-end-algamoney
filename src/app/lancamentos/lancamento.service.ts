import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { Lancamento } from '../core/model';

export class LancamentoFiltro {
  descricao: string;
  dataVencimentoInicio: string;
  dataVencimentoFim: string;
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
    console.log(lancamento.dataVencimento);
    this.converterDateParaString([lancamento]);
    return this.http.post<Lancamento>(this.lancamentosUrl, lancamento)
      .toPromise();
  }

  atualizar(lancamento: Lancamento): Promise<Lancamento> {
    this.converterDateParaString([lancamento]);

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

        return lancamento;
      });
  }

  private converterDateParaString(lancamentos: Lancamento[]) {
    for (const lancamento of lancamentos) {
      lancamento.dataVencimento = moment(lancamento.dataVencimento).format('DD/MM/YYYY');
      console.log("data -> " + lancamento.dataPagamento);

      if (lancamento.dataPagamento) {
        lancamento.dataPagamento = moment(lancamento.dataPagamento).format('DD/MM/YYYY');
      }
    }
  }

  /*private converterStringParaDate(lancamentos: Lancamento[]) {

    for (const lancamento of lancamentos) {
      lancamento.dataVencimento = moment(lancamento.dataVencimento,
        'DD-MM-YYYY').toDate();

      if (lancamento.dataPagamento) {
        lancamento.dataPagamento = moment(lancamento.dataPagamento,
          'DD-MM-YYYY').toDate();
      }
    }
  }*/

  excluir(id: number): Promise<void> {
    return this.http.delete(`${this.lancamentosUrl}/${id}`)
      .toPromise()
      .then(() => null);
  }

  /*return lancamentos.map(lancamento => {
      return {
      ...lancamento,
      dataVencimento: moment(lancamento.dataVencimento, 'DD-MM-YYYY').toDate(),
      dataPagamento: lancamento.dataPagamento ? moment(lancamento.dataPagamento, 'DD-MM-YYYY').toDate() : null
      };
    });*/

}

