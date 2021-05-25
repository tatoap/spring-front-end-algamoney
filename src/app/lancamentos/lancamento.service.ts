import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as moment from 'moment';
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

  lancamentosUrl = 'http://localhost:8080/lancamentos';

  lancamentoToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhZG1pbkBhbGdhbW9uZXkuY29tIiwic2NvcGUiOlsicmVhZCIsIndyaXRlIl0sIm5vbWUiOiJBZG1pbmlzdHJhZG9yIiwiZXhwIjoxNjIxOTExNTc1LCJhdXRob3JpdGllcyI6WyJST0xFX0NBREFTVFJBUl9DQVRFR09SSUEiLCJST0xFX1BFU1FVSVNBUl9QRVNTT0EiLCJST0xFX1JFTU9WRVJfUEVTU09BIiwiUk9MRV9DQURBU1RSQVJfTEFOQ0FNRU5UTyIsIlJPTEVfUEVTUVVJU0FSX0xBTkNBTUVOVE8iLCJST0xFX1JFTU9WRVJfTEFOQ0FNRU5UTyIsIlJPTEVfQ0FEQVNUUkFSX1BFU1NPQSIsIlJPTEVfUEVTUVVJU0FSX0NBVEVHT1JJQSJdLCJqdGkiOiJmMTM5OWU0Ni0zNzJlLTQ3OWQtOTZlMi0xOTEzYTNjYzZjMzciLCJjbGllbnRfaWQiOiJhbmd1bGFyIn0.INgAtrxZU59LX0YxtXGXBmNMUVNEyi3KdEAva_y1efk';

  constructor(private http: HttpClient) { }

  pesquisar(filtro: LancamentoFiltro): Promise<any> {
    const headers = new HttpHeaders()
      .append('Authorization', this.lancamentoToken);
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

    return this.http.get(`${this.lancamentosUrl}?resumo`, { headers, params })
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
    const headers = new HttpHeaders()
      .append('Authorization', this.lancamentoToken)
      .append('Content-Type', 'application/json');

    this.converterDateParaString(lancamento);

    return this.http.post<Lancamento>(this.lancamentosUrl, lancamento, { headers })
      .toPromise();
  }

  atualizar(lancamento: Lancamento): Promise<Lancamento> {
    const headers = new HttpHeaders()
      .append('Authorization', this.lancamentoToken)
      .append('Content-Type', 'application/json');

    this.converterDateParaString(lancamento);

    return this.http.put<Lancamento>(`${this.lancamentosUrl}/${lancamento.id}`, lancamento, { headers })
      .toPromise()
      .then(response => {
        const lancamento = response;

        return lancamento;
      });
  }

  buscaPorId(id: number): Promise<Lancamento> {
    const headers = new HttpHeaders()
    .append('Authorization', this.lancamentoToken);

    return this.http.get<Lancamento>(`${this.lancamentosUrl}/${id}`, { headers })
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
    const headers = new HttpHeaders()
      .append('Authorization', this.lancamentoToken);

    return this.http.delete(`${this.lancamentosUrl}/${id}`, { headers })
      .toPromise()
      .then(() => null);
  }

}
function str(str: any, arg1: string) {
  throw new Error('Function not implemented.');
}

