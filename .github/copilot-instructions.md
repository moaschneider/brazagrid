O BrazaGrid é um jogo de associação de características sobre personalidades brasileiras. O Wikidata é a fonte principal para construir uma base local; durante a partida, o jogo não deve depender de consultas externas.

## Regras essenciais do jogo

- O tabuleiro tem 4 colunas (A–D) e 4 linhas (1–4).
- As células-critério são B1, C1, D1, A2, A3 e A4; as outras 9 células são respostas.
- Cada resposta deve satisfazer simultaneamente os critérios de sua linha e coluna.
- Cada combinação precisa ter pelo menos 3 respostas possíveis; a partida permite até 12 palpites para preencher as 9 células.

## Orientações de desenvolvimento

- Antes de propor ou alterar código, examine a estrutura, as implementações e os padrões que realmente existem no repositório. Trate estruturas descritas como exemplos ou planos, não como arquivos já existentes.
- Trabalhe incrementalmente e prefira a solução simples que atenda aos requisitos.
- Ao propor código ou consultas SPARQL, explique primeiro a lógica e o motivo das partes principais.
- Priorize fatos verificáveis. Não invente dados sobre personalidades; quando possível, registre o QID e a propriedade ou consulta que sustenta cada fato, além da data da extração.
- Mantenha fatos importados separados de características derivadas. Documente as regras e identifique explicitamente qualquer heurística.
- Considere incompletudes e classificações imperfeitas do Wikidata; prefira regras gerais a exceções por pessoa.
- Valide as interseções antes de usar critérios no tabuleiro e não consulte o Wikidata durante a partida.

O README contém o contexto detalhado do jogo, das características, do modelo de dados e das consultas SPARQL.