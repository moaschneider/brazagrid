# BrazaGrid

Jogo de associação de características baseado em personalidades brasileiras.

O **BrazaGrid** utiliza dados do **Wikidata** para construir uma base local de personalidades brasileiras e suas características. A partir dessa base, o jogo gera um tabuleiro em que o jogador precisa identificar personalidades que atendam simultaneamente a diferentes critérios.

## 🎮 Como funciona

O tabuleiro possui **4 colunas (A–D)** e **4 linhas (1–4)**.

Seis células funcionam como **células-critério**:

* B1
* C1
* D1
* A2
* A3
* A4

As outras nove são **células-resposta**.

Cada célula-resposta representa a interseção de dois critérios.

Por exemplo:

```text
            A            B          C           D
        ┌──────────┬──────────┬──────────┬──────────┐
        │          │          │          │          │
    1   │          │          │Nordestino│          │
        │          │          │          │          │
        ├──────────┼──────────┼──────────┼──────────┤       
        │          │          │  Alceu   │          │
    2   │  Músico  │          │  Elba    │          │
        │          │          │  Ivete   │          │
        ├──────────┼──────────┼──────────┼──────────┤             
        │          │          │Jorge Amad│          │
    3   │ Escritor │          │ Suassuna │          │
        │          │          │ Itamar VJ│          │
        ├──────────┼──────────┼──────────┼──────────┤       
        │          │          │  Marta   │          │
    4   │  Atleta  │          │ Rivaldo  │          │
        │          │          │ Isaquias │          │
        └──────────┴──────────┴──────────┴──────────┘        
        
```

Se uma linha tiver o critério **Músico** e uma coluna tiver o critério **Nordestino**, a célula correspondente deverá ser preenchida com uma personalidade que satisfaça **os dois critérios**.

### Regras iniciais

* O tabuleiro possui **9 células-resposta**.
* Cada combinação de dois critérios deve possuir **pelo menos 3 personalidades possíveis**.
* O jogador precisa preencher as 9 células.
* O jogador possui no máximo **12 palpites**.
* Os critérios e as respostas são determinados a partir da base de dados do projeto.
* As regras poderão ser modificadas e ampliadas durante o desenvolvimento.

## 🗃️ Dados

O **Wikidata** será utilizado como principal fonte de dados.

O projeto não fará consultas ao Wikidata durante uma partida. O fluxo previsto é:

```text
Wikidata
    ↓
Consultas SPARQL
    ↓
Importação e normalização
    ↓
Base local
    ↓
Características derivadas
    ↓
Geração do tabuleiro
    ↓
Jogo
```

Os dados originais obtidos do Wikidata serão mantidos conceitualmente separados das **características derivadas** pelas regras do jogo.

Isso permite, por exemplo, definir uma característica como `É escritor` utilizando diferentes evidências do Wikidata, sem transformar essa classificação em um dado arbitrariamente atribuído à personalidade.

## 🧩 Características

As características utilizadas como critérios, chamadas provisoriamente de **retrancas**, poderão representar diferentes tipos de informação.

Exemplos:

* profissão ou ocupação;
* gênero;
* estado ou região de nascimento;
* década de nascimento;
* músico;
* cantor;
* compositor;
* ator ou atriz;
* escritor;
* político;
* atleta;
* jornalista;
* diretor;
* artista;
* possui apelido;
* possui parente famoso;
* possui carreira em mais de uma área;
* publicou uma obra literária;
* recebeu determinado prêmio;
* participou de determinada obra;
* pertenceu a determinado grupo ou banda.

Nem todas as retrancas serão necessariamente correspondentes a uma única propriedade do Wikidata. Algumas poderão ser **características derivadas de múltiplos dados**.

Quando uma característica utilizar uma heurística, essa regra deverá ser documentada.

## 🛠️ Stack

### Front-end

* **React**
* **Vite**
* **CSS**

O React será responsável pela interface e pelo tabuleiro do jogo.

### Scripts e lógica

* **Node.js**
* **JavaScript**

O Node.js será utilizado inicialmente para os scripts de importação, normalização, análise e validação dos dados.

### Dados

* **Wikidata**
* **Wikidata Query Service (SPARQL)**
* **JSON** inicialmente
* **SQLite** como possível evolução da persistência local

### Qualidade e desenvolvimento

* **Vitest** — testes automatizados
* **ESLint** — análise estática
* **Prettier** — formatação
* **Git + GitHub** — versionamento

TypeScript, SQLite e outras ferramentas poderão ser incorporados posteriormente quando o crescimento do projeto justificar seu uso.

## 📁 Estrutura inicial

A estrutura ainda é provisória e poderá evoluir:

```text
BrazaGrid/
├── data/
│   └── people.json
│
├── scripts/
│   ├── importWikidata.js
│   ├── generateCharacteristics.js
│   └── validateGrid.js
│
├── src/
│   ├── game.js
│   ├── rules.js
│   └── grid.js
│
├── package.json
└── README.md
```

## 🚧 Status atual

**Em desenvolvimento — fase de definição e modelagem.**

Neste momento, o foco do projeto está na construção de uma **base confiável de personalidades brasileiras** e na definição de características que possam ser identificadas de maneira consistente a partir dos dados do Wikidata.

Já foram exploradas consultas SPARQL para diferentes tipos de características, incluindo a identificação de escritores através da combinação de ocupação e autoria de obras literárias.

A arquitetura e o modelo de dados ainda estão sujeitos a alterações.

## 🗺️ Próximos passos

### 1. Definir o universo inicial de personalidades

Estabelecer critérios para inclusão na base, como:

* pessoa brasileira;
* artigo disponível na Wikipédia em português;
* número mínimo de sitelinks no Wikidata;
* dados mínimos necessários para utilização no jogo.

O número de sitelinks será utilizado apenas como um **indicador aproximado de notoriedade**.

### 2. Definir o modelo de dados

Determinar quais informações serão importadas diretamente do Wikidata e quais serão calculadas posteriormente.

### 3. Criar os primeiros scripts de importação

Desenvolver as consultas SPARQL e o processo de normalização dos dados.

### 4. Criar o sistema de características

Implementar regras capazes de transformar os dados brutos em características utilizadas pelo jogo.

### 5. Analisar as interseções

Calcular quantas personalidades satisfazem cada combinação de duas características.

Exemplo:

```text
Músico × Nordestino       → 37
Ator × Escritor           → 48
Político × Atleta         → 5
```

Combinações com menos de três possibilidades deverão ser descartadas ou tratadas conforme as regras do jogo.

### 6. Desenvolver o gerador de tabuleiros

Criar um algoritmo capaz de selecionar seis critérios e gerar um tabuleiro em que todas as nove interseções sejam válidas.

### 7. Implementar a lógica da partida

Adicionar:

* entrada de palpites;
* validação das respostas;
* controle das 9 células;
* limite de 12 palpites;
* identificação de vitória ou encerramento da partida.

### 8. Desenvolver a interface

Criar o tabuleiro e os demais elementos da interface utilizando React.

### 9. Testar e aprimorar

Testar diferentes combinações de critérios, identificar casos problemáticos e aprimorar as regras de derivação das características.

## 📌 Princípios do projeto

O desenvolvimento do BrazaGrid seguirá alguns princípios:

* **Dados verificáveis:** evitar informações sem evidência na fonte utilizada.
* **Separação entre fato e regra:** diferenciar dados obtidos do Wikidata de características derivadas pelo projeto.
* **Regras gerais:** evitar exceções específicas para personalidades individuais sempre que uma regra geral puder resolver o problema.
* **Desenvolvimento incremental:** testar as consultas e regras progressivamente.
* **Transparência das heurísticas:** documentar características que dependam de interpretações ou aproximações.
* **Independência durante a partida:** o jogo não deve depender de consultas ao Wikidata em tempo real.
* **Extensibilidade:** permitir a criação de novas características sem exigir uma reformulação completa do modelo de dados.
* **Validação:** garantir que os tabuleiros gerados respeitem as regras estabelecidas.

---

## 💡 Sobre o projeto

O BrazaGrid também funciona como projeto de estudo e portfólio, envolvendo conceitos de:

**JavaScript · React · Node.js · SPARQL · Wikidata · tratamento de dados · lógica de programação · algoritmos · testes · Git**

O projeto será desenvolvido de forma incremental, priorizando primeiro a qualidade e a consistência dos dados e das regras antes da implementação completa da interface do jogo.
