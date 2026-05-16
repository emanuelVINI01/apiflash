# apiflash

Cliente HTTP leve para testar endpoints direto no navegador.

## Leitura arquitetural

- Foco em baixa fricção: método, headers, body e resposta JSON em uma interface direta.
- É uma ferramenta de produtividade para ciclos rápidos de API/debug.
- A estrutura do repositório foi lida como evidência principal; este README evita prometer features que não aparecem no código ou no contexto técnico consolidado do portfólio.

## Stack identificada

Framer Motion, Next.js, Node.js, React, Tailwind CSS, TypeScript

## Decisões de engenharia

- Separação explícita entre interface, regras de domínio e persistência sempre que a estrutura do projeto permite.
- Validação de entrada e contratos de API são tratados como fronteira de segurança, não como detalhe de UI.
- Persistência e autenticação são documentadas como partes críticas do sistema quando aparecem no stack.
- O projeto prioriza fundamentos verificáveis: modelagem de dados, fluxo operacional claro e manutenção pragmática.

## Evidências observadas

- package.json declara o pacote `apiflash`.
- scripts disponíveis: `build`, `dev`, `lint`, `start`.
- diretório `app/` sugere Next.js App Router ou estrutura web moderna.
- diretório `src/` concentra a implementação principal.

## Operação

Antes de rodar em produção, revise variáveis de ambiente, migrações, credenciais, build e políticas de deploy. O repositório deve ser tratado como produto técnico auditável: dependências explícitas, scripts reproduzíveis e logs suficientes para investigar erro real.
