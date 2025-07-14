document.addEventListener('DOMContentLoaded', () => {
    // Verifica o modo escuro salvo no localStorage
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        updateToggleButton(true);
    }
    
    // Verifica o modo daltonismo salvo no localStorage
    const colorBlindMode = localStorage.getItem('colorBlindMode') === 'true';
    if (colorBlindMode) {
        document.body.classList.add('color-blind-mode');
        updateColorBlindButton(true);
    }

    // Verifica o modo daltonismo salvo no localStorage
    const colorPinkMode = localStorage.getItem('colorPinkMode') === 'true';
    if (colorPinkMode) {
        document.body.classList.add('pink-mode');
        updatePinkButton(true);
    }
    
    // EVENT LISTENER 1: Carrega as tarefas do localStorage quando o DOM estiver pronto
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    atualizarLista(tarefas);
    
    // EVENT LISTENER 2: Adiciona evento de tecla Enter no input
    document.getElementById('tarefa').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            adicionarTarefa();
        }
    });

    // Inicializa o contador de cliques ao carregar a página
    let initialClickCount = localStorage.getItem('clickcount') || 0;
    document.getElementById('clickCounter').textContent = 'Nº de Cliques: ' + initialClickCount;
    
    // EVENT LISTENER 3: Adiciona evento de clique no botão
    document.getElementById('adicionarBtn').addEventListener('click', adicionarTarefa);
    
    // EVENT LISTENER 4: Alternar modo escuro/claro
    document.getElementById('toggleDarkMode').addEventListener('click', toggleDarkMode);
    
    // EVENT LISTENER 5: Alternar modo daltonismo
    document.getElementById('toggleColorBlindMode').addEventListener('click', toggleColorBlindMode);

    // Alternar modo rosa
    document.getElementById('togglePinkMode').addEventListener('click', togglePinkMode);

     document.getElementById('clickCounter').addEventListener('click', () => {
        let clickcount = localStorage.getItem('clickcount') || 0;
        clickcount++;
        localStorage.setItem('clickcount', clickcount);
        document.getElementById('clickCounter').textContent = 'Nº de Cliques: ' + clickcount;
    });
});

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    updateToggleButton(isDarkMode);
}

function toggleColorBlindMode() {
    const body = document.body;
    body.classList.toggle('color-blind-mode');
    
    const isColorBlindMode = body.classList.contains('color-blind-mode');
    localStorage.setItem('colorBlindMode', isColorBlindMode);
    
    updateColorBlindButton(isColorBlindMode);
}

function togglePinkMode() {
    const body = document.body;
    body.classList.toggle('pink-mode');
    
    const isPinkMode = body.classList.contains('pink-mode');
    localStorage.setItem('colorPinkMode', isPinkMode);
    
    updatePinkButton(isPinkMode);
}

function updateToggleButton(isDarkMode) {
    const toggleBtn1 = document.getElementById('toggleDarkMode');
    if (isDarkMode) {
        toggleBtn1.innerHTML = '<i class="fas fa-sun"></i> Escuro';
    } else {
        toggleBtn1.innerHTML = '<i class="fas fa-moon"></i> Claro';
    }
}

function updateColorBlindButton(isColorBlindMode) {
    const toggleBtn2 = document.getElementById('toggleColorBlindMode');
    if (isColorBlindMode) {
        toggleBtn2.innerHTML = '<i class="fas fa-eye-slash"></i> Normal';
        toggleBtn2.style.backgroundColor = '#0066cc';
    } else {
        toggleBtn2.innerHTML = '<i class="fas fa-eye"></i> Daltonismo';
        toggleBtn2.style.backgroundColor = '';
    }
}

function updatePinkButton(isPinkMode) {
    const toggleBtn3 = document.getElementById('togglePinkMode');
    if (isPinkMode) {
        toggleBtn3.textContent = 'Rosa'; 
    } else {
        toggleBtn3.textContent = 'Normal';
    }
}

function adicionarTarefa() {
    const input = document.getElementById('tarefa');
    const fileInput = document.getElementById('imagemTarefa');
    const texto = input.value.trim();
    
    if (texto) {
        const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
        
        const novaTarefa = {
            texto: texto,
            completa: false,
            imagem: null
        };
        
        // Processa a imagem se foi selecionada
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                novaTarefa.imagem = e.target.result;
                tarefas.push(novaTarefa);
                // LOCALSTORAGE 1: Salva tarefas com imagem
                localStorage.setItem('tarefas', JSON.stringify(tarefas));
                input.value = '';
                fileInput.value = '';
                input.focus();
                atualizarLista(tarefas);
            };
            
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            tarefas.push(novaTarefa);
            // LOCALSTORAGE 2: Salva tarefas sem imagem
            localStorage.setItem('tarefas', JSON.stringify(tarefas));
            input.value = '';
            fileInput.value = '';
            input.focus();
            atualizarLista(tarefas);
        }
    }
}

function atualizarLista(tarefas) {
    const lista = document.getElementById('listaTarefas');
    
    if (tarefas.length === 0) {
        lista.innerHTML = '<div class="empty-state">Nenhuma tarefa cadastrada. Adicione sua primeira tarefa!</div>';
        return;
    }
    
    lista.innerHTML = '';
    
    tarefas.forEach((tarefa, index) => {
        const item = document.createElement('li');
        if (tarefa.completa) {
            item.classList.add('completed');
        }
        
        // Container principal do conteúdo
        const content = document.createElement('div');
        content.className = 'task-content';
        
        // Container da imagem (se existir)
        if (tarefa.imagem) {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'task-image-container';
            
            const image = document.createElement('img');
            image.className = 'task-image';
            image.src = tarefa.imagem;
            image.alt = 'Imagem da tarefa';
            
            imageContainer.appendChild(image);
            content.appendChild(imageContainer);
        }
        
        // Container do texto
        const textContainer = document.createElement('div');
        textContainer.className = 'task-text-container';
        
        const texto = document.createElement('div');
        texto.className = 'task-text';
        texto.textContent = tarefa.texto;
        
        textContainer.appendChild(texto);
        content.appendChild(textContainer);
        
        // Ações
        const actions = document.createElement('div');
        actions.className = 'task-actions';
        
        const btnComplete = document.createElement('button');
        btnComplete.className = 'btn-success';
        btnComplete.innerHTML = tarefa.completa ? '<i class="fas fa-check"></i> Concluída' : '<i class="far fa-circle"></i> Feito';
        // EVENT LISTENER 4: Alterna status de completude da tarefa
        btnComplete.onclick = () => toggleCompleta(index);
        
        const btnRemove = document.createElement('button');
        btnRemove.className = 'btn-danger';
        btnRemove.innerHTML = '<i class="fas fa-trash"></i> Remover';
        // EVENT LISTENER 5: Remove tarefa
        btnRemove.onclick = () => removerTarefa(index);
        
        actions.appendChild(btnComplete);
        actions.appendChild(btnRemove);
        
        item.appendChild(content);
        item.appendChild(actions);
        lista.appendChild(item);
    });
}

function toggleCompleta(index) {
    const tarefas = JSON.parse(localStorage.getItem('tarefas'));
    tarefas[index].completa = !tarefas[index].completa;
    // LOCALSTORAGE 3: Atualiza status de completude
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    atualizarLista(tarefas);
}

function removerTarefa(index) {
    const tarefas = JSON.parse(localStorage.getItem('tarefas'));
    tarefas.splice(index, 1);
    // LOCALSTORAGE 4: Remove tarefa do armazenamento
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    atualizarLista(tarefas);
}