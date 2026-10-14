# DV Glow – Site em Angular 16

## Como rodar
```bash
npm install      # instala também o @supabase/supabase-js
npm start        # abre em http://localhost:4200
npm run build    # gera a pasta dist/dv-glow
```
Requisitos: Node 16.14+ ou 18+.

## Onde mexer
- `src/app/configuracao.ts` → número do WhatsApp, links do Mercado Livre, Instagram e TikTok
- `src/assets/imagens/` → imagens
- `src/styles.css` → cores (variáveis `--rosa-escuro`, `--rosa`, etc.)

## Estrutura
- `servicos/lista.servico.ts` → lista de produtos, menu, filtro e link do WhatsApp
- `componentes/` → cabecalho, hero, categorias (com faixa Mercado Livre), produtos, sobre (com benefícios), rodape, lista, icone

## Painel administrativo (Angular + Supabase, sem backend próprio)
- `/admin/login` → entrada do painel · `/admin` → gestão de produtos (protegida por login)
- `src/app/paginas/admin-login` e `src/app/paginas/admin-painel` → telas do painel
- `src/app/componentes/produto-formulario` → janela de adicionar/editar produto
- `src/app/servicos/supabase.servico.ts` → conexão com o Supabase
- `src/app/servicos/autenticacao.servico.ts` → login do admin (Supabase Auth)
- `src/app/servicos/produto.servico.ts` → cadastrar, editar e excluir produtos e fotos (admin)
- `src/app/servicos/catalogo.servico.ts` → lista de produtos exibida na loja (`/`)
- O que o admin cadastra, edita ou exclui aparece na loja.

## Configurando o Supabase
1. No SQL Editor do Supabase, rode o arquivo `supabase/script.sql` (tabela `produtos`, permissões e bucket `produtos` para as fotos).
2. Em Authentication > Users > Add user, crie o admin (e-mail e senha) marcando **Auto Confirm User**.
3. Em Authentication > Sign In / Providers > Email, **desative "Allow new users to sign up"**. Sem isso qualquer pessoa poderia criar conta e alterar o catálogo.
4. Copie a Project URL e a chave `anon` (Project Settings > API) para `src/app/configuracao.ts` (`supabaseUrl` e `supabaseChave`). A chave anon é pública por natureza; quem protege os dados são as permissões do script.

## Hospedagem na Vercel
O arquivo `vercel.json` já faz as rotas (como `/admin`) devolverem o `index.html`. Importe o projeto na Vercel e publique; o build é `npm run build` e a saída é `dist/dv-glow`.
