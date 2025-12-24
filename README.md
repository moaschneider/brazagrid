# BrazaGrid - Protótipo do Jogo

Um jogo de adivinhação de estados brasileiros baseado em características.

## Como usar

1. Abra o arquivo `index.html` em um navegador moderno
2. O jogo selecionará aleatoriamente um estado brasileiro
3. Clique nas características no grid para ver quais estados as possuem
4. Use essas informações para adivinhar qual é o estado
5. Selecione o estado no menu dropdown e clique em "Adivinhar"

## Arquivos

- `index.html` - Interface do jogo
- `game.js` - Lógica do jogo
- `data.json` - Dados das características e estados (convertido do CSV)

## Deploy no Vercel

### Opção 1: Deploy via Interface Web (Recomendado)

1. Acesse [vercel.com](https://vercel.com) e faça login (pode usar GitHub, GitLab ou email)
2. Clique em "Add New..." > "Project"
3. Se você já tem o projeto no GitHub/GitLab:
   - Conecte seu repositório
   - Clique em "Import"
   - O Vercel detectará automaticamente as configurações
   - Clique em "Deploy"
4. Se você não tem o projeto no Git:
   - Instale o Vercel CLI: `npm i -g vercel`
   - No terminal, navegue até a pasta do projeto
   - Execute: `vercel`
   - Siga as instruções

### Opção 2: Deploy via CLI

1. Instale o Vercel CLI:
```bash
npm i -g vercel
```

2. No terminal, navegue até a pasta do projeto:
```bash
cd C:\Users\Moa-Schneider\Desktop\Dev\BrazaGrid
```

3. Execute o deploy:
```bash
vercel
```

4. Siga as instruções:
   - Primeira vez: faça login
   - Link to existing project? **N** (criar novo)
   - Project name: **brazagrid** (ou o nome que preferir)
   - Directory: **.** (ponto, significa a pasta atual)
   - Override settings? **N**

5. Após o deploy, você receberá uma URL como: `https://brazagrid.vercel.app`

### Opção 3: Deploy via GitHub (Recomendado para atualizações)

1. Crie um repositório no GitHub
2. Faça commit e push dos arquivos:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/SEU_USUARIO/brazagrid.git
git push -u origin main
```

3. No Vercel:
   - Clique em "Add New..." > "Project"
   - Conecte seu repositório do GitHub
   - Clique em "Import"
   - O Vercel fará deploy automático e atualizará sempre que você fizer push

## Nota Local

Para testar localmente, você precisa abrir o arquivo através de um servidor local (não apenas abrir o arquivo diretamente), pois o JavaScript precisa fazer uma requisição HTTP para carregar o `data.json`.

### Opções para rodar um servidor local:

**Python:**
```bash
python -m http.server 8000
```
Depois acesse: http://localhost:8000

**Node.js (com http-server):**
```bash
npx http-server
```

**VS Code:**
Use a extensão "Live Server" e clique com botão direito no `index.html` > "Open with Live Server"

