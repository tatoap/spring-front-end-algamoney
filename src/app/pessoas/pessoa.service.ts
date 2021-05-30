import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

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

  pessoasUrl: string;

  constructor(private http: HttpClient) {
    this.pessoasUrl = `${environment.apiUrl}/pessoas`;
  }

  pesquisar(filtro: PessoaFiltro): Promise<any> {
    let params = new HttpParams()
      .set('page', filtro.pagina.toString())
      .set('size', filtro.itensPorPagina.toString());

    if (filtro.nome) {
        params = params.set('nome', filtro.nome);
      }

    return this.http.get(`${this.pessoasUrl}`, { params })
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

  buscarPorId(id: number): Promise<Pessoa> {
    return this.http.get<Pessoa>(`${this.pessoasUrl}/${id}`)
      .toPromise()
      .then(response => {
        const pessoa = response;

        return pessoa;
      });
  }

  adicionar(pessoa: Pessoa): Promise<Pessoa> {
    return this.http.post<Pessoa>(this.pessoasUrl, pessoa)
      .toPromise();
  }

  atualizar(pessoa: Pessoa): Promise<Pessoa> {
    return this.http.put<Pessoa>(`${this.pessoasUrl}/${pessoa.id}`, pessoa)
      .toPromise()
      .then(response => {
        const pessoa = response;

        return pessoa;
      });
  }

  ativar(id: number): Promise<void> {
    return this.http.put(`${this.pessoasUrl}/${id}/ativo`, true)
        .toPromise()
        .then(() => null);
  }

  inativar(id: number): Promise<void> {
    return this.http.delete(`${this.pessoasUrl}/${id}/ativo`)
        .toPromise()
        .then(() => null);
  }

  excluir(id: number): Promise<void> {
    return this.http.delete(`${this.pessoasUrl}/${id}`)
      .toPromise()
      .then(() => null);
  }

  listarTodas(): Promise<any> {
    return this.http.get(this.pessoasUrl)
      .toPromise()
      .then(response => response['content']);
  }

}
