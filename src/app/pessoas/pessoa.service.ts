import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { tokenize } from '@angular/compiler/src/ml_parser/lexer';
import { Injectable } from '@angular/core';

import { Pessoa } from '../core/model';

export class PessoaFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  pessoasUrl = 'http://localhost:8080/pessoas';

  pessoaToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhZG1pbkBhbGdhbW9uZXkuY29tIiwic2NvcGUiOlsicmVhZCIsIndyaXRlIl0sIm5vbWUiOiJBZG1pbmlzdHJhZG9yIiwiZXhwIjoxNjIxOTExNTc1LCJhdXRob3JpdGllcyI6WyJST0xFX0NBREFTVFJBUl9DQVRFR09SSUEiLCJST0xFX1BFU1FVSVNBUl9QRVNTT0EiLCJST0xFX1JFTU9WRVJfUEVTU09BIiwiUk9MRV9DQURBU1RSQVJfTEFOQ0FNRU5UTyIsIlJPTEVfUEVTUVVJU0FSX0xBTkNBTUVOVE8iLCJST0xFX1JFTU9WRVJfTEFOQ0FNRU5UTyIsIlJPTEVfQ0FEQVNUUkFSX1BFU1NPQSIsIlJPTEVfUEVTUVVJU0FSX0NBVEVHT1JJQSJdLCJqdGkiOiJmMTM5OWU0Ni0zNzJlLTQ3OWQtOTZlMi0xOTEzYTNjYzZjMzciLCJjbGllbnRfaWQiOiJhbmd1bGFyIn0.INgAtrxZU59LX0YxtXGXBmNMUVNEyi3KdEAva_y1efk';

  constructor(private http: HttpClient) { }

  pesquisar(filtro: PessoaFiltro): Promise<any> {
    const headers = new HttpHeaders()
      .append('Authorization', this.pessoaToken);
    let params = new HttpParams()
      .set('page', filtro.pagina.toString())
      .set('size', filtro.itensPorPagina.toString());

    if (filtro.nome) {
        params = params.set('nome', filtro.nome);
      }

    return this.http.get(`${this.pessoasUrl}`, { headers, params })
        .toPromise()
        .then(response => {
          const pessoas = response['content'];

          const resultado = {
            pessoas,
            total: response['totalElements']
          };

          return resultado;
        });
  }

  adicionar(pessoa: Pessoa): Promise<Pessoa> {
    const headers = new HttpHeaders()
      .append('Authorization', this.pessoaToken)
      .append('Content-Type', 'application/json');

    return this.http.post<Pessoa>(this.pessoasUrl, pessoa, { headers })
      .toPromise();
  }

  ativar(id: number): Promise<void> {
    const headers = new HttpHeaders()
      .append('Authorization', this.pessoaToken);

    return this.http.put(`${this.pessoasUrl}/${id}/ativo`, { headers })
        .toPromise()
        .then(() => null);
  }

  inativar(id: number): Promise<void> {
    const headers = new HttpHeaders()
      .append('Authorization', this.pessoaToken);

    return this.http.delete(`${this.pessoasUrl}/${id}/ativo`, { headers })
        .toPromise()
        .then(() => null);
  }

  excluir(id: number): Promise<void> {
    const headers = new HttpHeaders()
      .append('Authorization', this.pessoaToken);

    return this.http.delete(`${this.pessoasUrl}/${id}`, { headers })
      .toPromise()
      .then(() => null);
  }

  listarTodas(): Promise<any> {
    const headers = new HttpHeaders()
      .append('Authorization', this.pessoaToken);

    return this.http.get(this.pessoasUrl, { headers })
      .toPromise()
      .then(response => response['content']);
  }

}
