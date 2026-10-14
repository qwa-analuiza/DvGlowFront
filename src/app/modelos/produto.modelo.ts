export interface Produto {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  imagem: string;
  imagens: string[];
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
  imagens: File[];
}

export function lerImagens(valor: string | null | undefined): string[] {
  if (!valor) return [];

  try {
    const imagens: unknown = JSON.parse(valor);
    if (Array.isArray(imagens)) {
      return imagens
        .filter((imagem): imagem is string => typeof imagem === 'string' && imagem.length > 0)
        .slice(0, 3);
    }
  } catch {
    // Valores antigos armazenam uma única URL sem serialização.
  }

  return [valor];
}

export function normalizarProduto(produto: Omit<Produto, 'imagens'>): Produto {
  const imagens = lerImagens(produto.imagem);
  return { ...produto, imagem: imagens[0] ?? produto.imagem, imagens };
}

export function serializarImagens(imagens: string[]): string {
  return imagens.length === 1 ? imagens[0] : JSON.stringify(imagens);
}
