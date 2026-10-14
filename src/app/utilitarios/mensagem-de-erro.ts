/** Traduz os erros do Supabase para mensagens simples de mostrar na tela. */
export function mensagemDeErro(erro: any, mensagemPadrao: string): string {
  const texto = String(erro?.message ?? '').toLowerCase();

  if (texto.includes('failed to fetch') || texto.includes('networkerror') || texto.includes('load failed')) {
    return 'Não foi possível conectar ao servidor.';
  }
  if (texto.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (texto.includes('email not confirmed')) return 'O e-mail do administrador ainda não foi confirmado no Supabase.';
  if (texto.includes('row-level security')) return 'Sem permissão. Entre novamente como administrador.';
  return mensagemPadrao;
}
