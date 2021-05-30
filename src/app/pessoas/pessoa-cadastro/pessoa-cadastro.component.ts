import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { Pessoa } from 'src/app/core/model';
import { PessoaService } from '../pessoa.service';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

  pessoa = new Pessoa();

  constructor(private pessoaService: PessoaService,
              private messageService: MessageService,
              private errorHandler: ErrorHandlerService,
              private route: ActivatedRoute,
              private router: Router,
              private title: Title
  ) {}

  ngOnInit(): void {
    const idPessoa = this.route.snapshot.params['id'];

    this.title.setTitle('Nova Pessoa');

    if (idPessoa) {
      this.carregarPessoa(idPessoa);
    }

  }

  get editando(){
    return Boolean(this.pessoa.id);
  }

  salvar(form: FormControl) {
    if (this.editando) {
      this.atualizarPessoa(form);
    } else {
      this.adicionarPessoa(form);
    }
  }

  adicionarPessoa(form: FormControl) {
    console.log(this.pessoa);
    this.pessoaService.adicionar(this.pessoa)
      .then(pessoaAdicionada => {
        this.messageService.add({ severity: 'success', detail: 'Pessoa adicionada com sucesso!' });

        this.router.navigate(['/pessoas', pessoaAdicionada.id]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarPessoa(form: FormControl) {
    //console.log(this.pessoa);
    this.pessoaService.atualizar(this.pessoa)
      .then(pessoa => {
        this.pessoa = pessoa;

        this.atualizarTituloEdicao();
        this.messageService.add({ severity: 'success', detail: 'Pessoa atualizada com sucesso!' });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarPessoa(id: number) {
    return this.pessoaService.buscarPorId(id)
      .then(pessoa => {
        this.pessoa = pessoa;
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: FormControl) {
    form.reset(new Pessoa());

    this.router.navigate(['/pessoas/novo']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição de pessoa: ${this.pessoa.nome}`);
  }

}
