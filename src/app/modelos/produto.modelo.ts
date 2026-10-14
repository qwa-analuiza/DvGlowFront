export interface Produto {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  imagem: string;
}

export interface ItemLista {
  produto: Produto;
  quantidade: number;
}

/** Dados enviados pelo formulário do painel ao cadastrar ou editar um produto. */
export interface DadosProduto {
  nome: string;
  categoria: string;
  preco: number;
  imagem: File | null;
}
