export class Pessoa {
  id: number;
  nome: string;
  endereco = new Endereco;
  ativo = true;
}

export class Endereco {
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
}

export class Usuario {
  login: string;
  senha: string;
}

export class Categoria {
  id: number;
}

export class Lancamento {
  id: number;
  tipo = 'RECEITA';
  descricao: string;
  dataVencimento: string;
  dataPagamento: string;
  valor: number;
  observacao: string;
  pessoa = new Pessoa();
  categoria = new Categoria();
}
