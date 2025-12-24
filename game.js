let gameData = null;
let rowCharacteristics = []; // Características das linhas (A, B, C)
let colCharacteristics = []; // Características das colunas (1, 2, 3)
let currentCell = null; // Célula atual sendo preenchida
let answers = {}; // Respostas dadas: { "A1": "RS", "A2": "SC", ... }
let usedStates = new Set(); // Estados já utilizados (não podem ser reutilizados)
let guessesCount = 0; // Contador de palpites
const MAX_GUESSES = 12; // Limite máximo de palpites

// Nomes completos dos estados
const stateNames = {
    'AC': 'Acre', 'AL': 'Alagoas', 'AM': 'Amazonas', 'AP': 'Amapá',
    'BA': 'Bahia', 'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo',
    'GO': 'Goiás', 'MA': 'Maranhão', 'MG': 'Minas Gerais', 'MS': 'Mato Grosso do Sul',
    'MT': 'Mato Grosso', 'PA': 'Pará', 'PB': 'Paraíba', 'PE': 'Pernambuco',
    'PI': 'Piauí', 'PR': 'Paraná', 'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte',
    'RO': 'Rondônia', 'RR': 'Roraima', 'RS': 'Rio Grande do Sul', 'SC': 'Santa Catarina',
    'SE': 'Sergipe', 'SP': 'São Paulo', 'TO': 'Tocantins'
};

// Mapeamento reverso: estado -> sigla
const stateNameToSigla = {};
Object.keys(stateNames).forEach(sigla => {
    stateNameToSigla[stateNames[sigla].toLowerCase()] = sigla;
    stateNameToSigla[sigla.toLowerCase()] = sigla;
});

// Carregar dados do JSON
async function loadData() {
    try {
        const response = await fetch('data.json');
        gameData = await response.json();
        initializeGame();
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar os dados do jogo. Verifique se o arquivo data.json existe.');
    }
}

// Validar se todas as interseções têm pelo menos um estado possível
function validateIntersections(rowChars, colChars) {
    for (let rowIndex = 0; rowIndex < rowChars.length; rowIndex++) {
        for (let colIndex = 0; colIndex < colChars.length; colIndex++) {
            const intersection = getIntersectionStates(rowChars[rowIndex].estados, colChars[colIndex].estados);
            if (intersection.length === 0) {
                return false; // Encontrou uma interseção sem estados possíveis
            }
        }
    }
    return true; // Todas as interseções têm pelo menos um estado
}

// Selecionar características válidas (todas as interseções devem ter estados possíveis)
function selectValidCharacteristics() {
    const maxAttempts = 1000; // Limite de tentativas para evitar loop infinito
    let attempts = 0;

    while (attempts < maxAttempts) {
        // Selecionar 3 características para linhas e 3 para colunas
        const shuffled = [...gameData.caracteristicas].sort(() => Math.random() - 0.5);
        const rowChars = shuffled.slice(0, 3);
        const colChars = shuffled.slice(3, 6);

        // Verificar se todas as interseções têm estados possíveis
        if (validateIntersections(rowChars, colChars)) {
            return { rowChars, colChars };
        }

        attempts++;
    }

    // Se não encontrou após muitas tentativas, usar as primeiras válidas encontradas
    console.warn('Não foi possível encontrar características com todas interseções válidas após', maxAttempts, 'tentativas. Usando características padrão.');
    return {
        rowChars: gameData.caracteristicas.slice(0, 3),
        colChars: gameData.caracteristicas.slice(3, 6)
    };
}

// Inicializar o jogo
function initializeGame() {
    if (!gameData) return;

    // Selecionar características válidas (todas as interseções devem ter estados possíveis)
    const { rowChars, colChars } = selectValidCharacteristics();
    rowCharacteristics = rowChars;
    colCharacteristics = colChars;

    // Limpar respostas anteriores
    answers = {};
    usedStates.clear();
    currentCell = null;
    guessesCount = 0;

    // Atualizar contador de palpites
    updateGuessesCounter();

    // Criar grid
    createGrid();
}

// Criar grid 4x4
function createGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    // Criar células do grid (4x4 = 16 células)
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';

            if (row === 0 && col === 0) {
                // Canto superior esquerdo - vazio
                cell.classList.add('header-cell');
            } else if (row === 0) {
                // Primeira linha - características das colunas (1, 2, 3)
                cell.classList.add('characteristic-cell');
                const colIndex = col - 1;
                if (colCharacteristics[colIndex]) {
                    cell.textContent = colCharacteristics[colIndex].texto;
                }
            } else if (col === 0) {
                // Primeira coluna - características das linhas (A, B, C)
                cell.classList.add('characteristic-cell');
                const rowIndex = row - 1;
                if (rowCharacteristics[rowIndex]) {
                    cell.textContent = rowCharacteristics[rowIndex].texto;
                }
            } else {
                // Células de resposta (A1, A2, A3, B1, B2, B3, C1, C2, C3)
                cell.classList.add('answer-cell');
                const rowLabel = String.fromCharCode(64 + row); // A, B, C
                const colLabel = col; // 1, 2, 3
                const cellId = `${rowLabel}${colLabel}`;
                cell.dataset.cellId = cellId;
                cell.onclick = () => openModal(cellId, row - 1, col - 1);

                // Se já tem resposta, mostrar
                if (answers[cellId]) {
                    cell.textContent = stateNames[answers[cellId]];
                    cell.classList.add('filled');
                }
            }

            grid.appendChild(cell);
        }
    }
}

// Abrir modal para entrada de estado
function openModal(cellId, rowIndex, colIndex) {
    // Verificar se ainda pode fazer palpites
    if (guessesCount >= MAX_GUESSES) {
        alert(`Você atingiu o limite de ${MAX_GUESSES} palpites!`);
        return;
    }

    currentCell = { cellId, rowIndex, colIndex };
    
    const modal = document.getElementById('modalOverlay');
    const stateInput = document.getElementById('stateInput');
    const messageDiv = document.getElementById('modalMessage');

    // Limpar mensagens
    messageDiv.classList.remove('show', 'success', 'error');
    messageDiv.textContent = '';

    // Se já tem resposta, mostrar
    if (answers[cellId]) {
        stateInput.value = stateNames[answers[cellId]];
    } else {
        stateInput.value = '';
    }

    // Focar no input
    modal.classList.add('active');
    setTimeout(() => stateInput.focus(), 100);

    // Permitir Enter para submeter
    stateInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
            submitAnswer();
        }
    };
}

// Fechar modal
function closeModal(event) {
    if (event && event.target.id !== 'modalOverlay') return;
    document.getElementById('modalOverlay').classList.remove('active');
    currentCell = null;
}

// Obter estados que têm ambas as características (interseção)
function getIntersectionStates(estados1, estados2) {
    return estados1.filter(sigla => estados2.includes(sigla));
}

// Submeter resposta
function submitAnswer() {
    if (!currentCell) return;

    const stateInput = document.getElementById('stateInput');
    const inputValue = stateInput.value.trim();
    const messageDiv = document.getElementById('modalMessage');

    if (!inputValue) {
        messageDiv.textContent = 'Por favor, digite um estado!';
        messageDiv.classList.add('show', 'error');
        return;
    }

    // Converter entrada para sigla
    let stateSigla = null;
    const inputLower = inputValue.toLowerCase();
    
    if (stateNameToSigla[inputLower]) {
        stateSigla = stateNameToSigla[inputLower];
    } else {
        // Tentar encontrar por nome parcial
        for (const [sigla, name] of Object.entries(stateNames)) {
            if (name.toLowerCase() === inputLower || name.toLowerCase().includes(inputLower)) {
                stateSigla = sigla;
                break;
            }
        }
    }

    if (!stateSigla) {
        // Estado não reconhecido - fechar modal mas não contar como palpite
        closeModal();
        return;
    }

    // Verificar se o estado já foi usado em outra célula
    if (usedStates.has(stateSigla) && answers[currentCell.cellId] !== stateSigla) {
        // Estado já usado - fechar modal mas não contar como palpite
        closeModal();
        return;
    }

    // Verificar se o estado está na interseção
    const rowChar = rowCharacteristics[currentCell.rowIndex];
    const colChar = colCharacteristics[currentCell.colIndex];
    const possibleStates = getIntersectionStates(rowChar.estados, colChar.estados);

    // Salvar informações da célula antes de fechar o modal
    const cellId = currentCell.cellId;
    const rowIndex = currentCell.rowIndex;
    const colIndex = currentCell.colIndex;

    // Incrementar contador de palpites
    guessesCount++;
    updateGuessesCounter();
    
    // Processar resposta ANTES de fechar o modal
    const cell = document.querySelector(`[data-cell-id="${cellId}"]`);
    
    if (!cell) {
        console.error('Célula não encontrada:', cellId);
        closeModal();
        return;
    }

    if (possibleStates.includes(stateSigla)) {
        // Remover estado anterior desta célula (se houver)
        const previousState = answers[cellId];
        if (previousState && previousState !== stateSigla) {
            usedStates.delete(previousState);
        }

        // Correto! Adicionar estado às respostas e aos usados
        answers[cellId] = stateSigla;
        usedStates.add(stateSigla);
        
        // Atualizar célula no grid
        cell.textContent = stateNames[stateSigla];
        cell.classList.add('filled', 'correct');
        cell.classList.remove('incorrect');
        
        console.log('✓ Resposta correta:', stateNames[stateSigla], 'na célula', cellId);
        
        // Verificar se o grid está completo
        if (isGridComplete()) {
            showVictoryMessage();
            disableAllCells();
        }
    } else {
        // Incorreto - marcar célula como incorreta temporariamente
        cell.classList.add('incorrect');
        console.log('✗ Resposta incorreta:', stateNames[stateSigla], 'na célula', cellId, 'Estados possíveis:', possibleStates);
        setTimeout(() => {
            cell.classList.remove('incorrect');
        }, 2000);
    }

    // Fechar modal após processar
    closeModal();

    // Desabilitar células se atingiu o limite
    if (guessesCount >= MAX_GUESSES) {
        disableAllCells();
        showGameOverMessage();
    }
}

// Atualizar contador de palpites na interface
function updateGuessesCounter() {
    const counterElement = document.getElementById('guessesCounter');
    if (counterElement) {
        counterElement.textContent = `Palpites: ${guessesCount}/${MAX_GUESSES}`;
        
        // Mudar cor quando próximo do limite
        if (guessesCount >= MAX_GUESSES) {
            counterElement.style.color = '#f87171';
        } else if (guessesCount >= MAX_GUESSES - 3) {
            counterElement.style.color = '#FEDD00';
        }
    }
}

// Desabilitar todas as células
function disableAllCells() {
    document.querySelectorAll('.answer-cell').forEach(cell => {
        cell.classList.add('disabled');
        cell.style.cursor = 'not-allowed';
        cell.style.opacity = '0.5';
        cell.onclick = null;
    });
}

// Verificar se o grid está completo (todas as 9 células preenchidas)
function isGridComplete() {
    const totalCells = 9; // A1, A2, A3, B1, B2, B3, C1, C2, C3
    return Object.keys(answers).length === totalCells;
}

// Mostrar mensagem de vitória
function showVictoryMessage() {
    const gameInfo = document.querySelector('.game-info');
    
    // Remover mensagens anteriores se houver
    const existingMessage = gameInfo.querySelector('.victory-message, .game-over-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const message = document.createElement('div');
    message.className = 'victory-message';
    message.style.marginTop = '15px';
    message.style.padding = '20px';
    message.style.background = 'rgba(0, 200, 0, 0.2)';
    message.style.borderRadius = '8px';
    message.style.color = '#4ade80';
    message.style.fontWeight = 'bold';
    message.style.fontSize = '18px';
    message.style.textAlign = 'center';
    message.innerHTML = `🎉 <strong>Parabéns!</strong> 🎉<br>Você completou o grid em ${guessesCount} ${guessesCount === 1 ? 'palpite' : 'palpites'}!`;
    gameInfo.appendChild(message);
}

// Mostrar mensagem de fim de jogo
function showGameOverMessage() {
    const gameInfo = document.querySelector('.game-info');
    
    // Remover mensagens anteriores se houver
    const existingMessage = gameInfo.querySelector('.victory-message, .game-over-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const message = document.createElement('div');
    message.className = 'game-over-message';
    message.style.marginTop = '15px';
    message.style.padding = '15px';
    message.style.background = 'rgba(200, 0, 0, 0.2)';
    message.style.borderRadius = '8px';
    message.style.color = '#f87171';
    message.style.fontWeight = 'bold';
    message.textContent = `Você atingiu o limite de ${MAX_GUESSES} palpites!`;
    gameInfo.appendChild(message);
}

// Inicializar quando a página carregar
window.addEventListener('DOMContentLoaded', loadData);
