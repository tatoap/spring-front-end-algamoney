import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { CategoriaService } from 'src/app/categorias/categoria.service';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';

import { Lancamento } from 'src/app/core/model';
import { PessoaService } from 'src/app/pessoas/pessoa.service';
import { LancamentoService } from '../lancamento.service';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

  tipos = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' }
  ];

  categorias = [];

  pessoas = [];

  lancamento = new Lancamento();

  constructor(
            private categoriaService: CategoriaService,
            private pessoaService: PessoaService,
            private lancamentoService: LancamentoService,
            private messageService: MessageService,
            private errorHandler: ErrorHandlerService,
            private route: ActivatedRoute,
            private router: Router,
            private title: Title
  ) { }

  ngOnInit(): void {
    const idLancamento = this.route.snapshot.params['id'];

    this.title.setTitle('Novo lançamento');

    if (idLancamento) {
      this.carregarLancamento(idLancamento);
    }

    this.carregarCategorias();
    this.carregarPessoas();
  }

  get editando() {
    return Boolean(this.lancamento.id);
  }

  salvar(form: FormControl) {
    if (this.editando) {
      this.atualizarLancamento(form);
    } else {
      this.adicionarLancamento(form);
    }
  }

  adicionarLancamento(form: FormControl) {
    this.lancamentoService.adicionar(this.lancamento)
      .then(lancamentoAdicionado => {
        this.messageService.add({ severity: 'success', detail: 'Lançamento adicionado com sucesso!' });

        this.router.navigate(['/lancamentos', lancamentoAdicionado.id]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarLancamento(form: FormControl) {
    this.lancamentoService.atualizar(this.lancamento)
      .then(lancamento => {
        this.lancamento = lancamento;

        this.atualizarTituloEdicao();
        this.messageService.add({ severity: 'success', detail: 'Lançamento atualizado com sucesso!' });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarLancamento(id: number) {
    return this.lancamentoService.buscaPorId(id)
      .then(lancamento => {
        this.lancamento = lancamento;
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarPessoas() {
    return this.pessoaService.listarTodas()
      .then(pessoas => {
        this.pessoas = pessoas.map( p => ({ label: p.nome, value: p.id }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarCategorias() {
    return this.categoriaService.listarTodas()
      .then(categorias => {
        this.categorias = categorias.map(c => ({ label: c.nome, value: c.id }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: FormControl) {
    form.reset(new Lancamento());

    this.router.navigate(['/lancamentos/novo']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição de lançamento: ${this.lancamento.descricao}`);
  }

}
