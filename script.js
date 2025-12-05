/* LÓGICA DE MÚLTIPLOS CARROSSÉIS + AUTO PLAY */
let slideIndices = {};
let autoPlayIntervals = {}; // Para guardar os cronômetros

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicializa todos os carrosséis
    const carousels = document.querySelectorAll('.mini-carousel');
    carousels.forEach(carousel => {
        const id = carousel.id;
        slideIndices[id] = 1; 
        mostrarSlides(1, id); 
    });

    // 2. Inicia o Auto-Play especificamente para o carrossel da seca
    // Muda a cada 5000ms (5 segundos)
    iniciarAutoPlay('carousel-seca', 5000);
});

function iniciarAutoPlay(id, tempo) {
    // Limpa se já existir para não duplicar
    if (autoPlayIntervals[id]) clearInterval(autoPlayIntervals[id]);
    
    autoPlayIntervals[id] = setInterval(() => {
        mudarSlideMini(1, id);
    }, tempo);
}

// Função chamada pelos botões (prev/next)
function mudarSlideMini(n, carouselId) {
    mostrarSlides(slideIndices[carouselId] += n, carouselId);
    
    // Opcional: Se o usuário clicar, reinicia o cronômetro para não pular logo em seguida
    // Se quiser que ele continue rodando sem parar, pode remover a linha abaixo
    iniciarAutoPlay(carouselId, 5000); 
}

function mostrarSlides(n, carouselId) {
    let i;
    let container = document.getElementById(carouselId);
    if (!container) return;

    let slides = container.getElementsByClassName("slide");
    
    // Loop infinito
    if (n > slides.length) { slideIndices[carouselId] = 1 }
    if (n < 1) { slideIndices[carouselId] = slides.length }
    
    // Esconde todos
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    // Mostra o atual
    slides[slideIndices[carouselId] - 1].style.display = "block";
}

/* LÓGICA DO QUIZ (MANTIDA IGUAL) */
function verificarResposta(botao, isCorreto) {
    let divQuiz = botao.closest('.bloco-quiz');
    let todosBotoes = divQuiz.querySelectorAll('.btn-quiz');

    todosBotoes.forEach(btn => {
        btn.style.backgroundColor = 'white';
        btn.style.color = '#333';
        btn.style.borderColor = '#ccc';
    });

    if (isCorreto) {
        botao.style.backgroundColor = '#1E3A28'; 
        botao.style.color = 'white';
        botao.style.borderColor = '#1E3A28';
    } else {
        botao.style.backgroundColor = '#dc3545'; 
        botao.style.color = 'white';
        botao.style.borderColor = '#dc3545';
        alert("Resposta incorreta. Tente analisar sob a ótica da Educação Ambiental Crítica.");
    }
}

/* LÓGICA "LER MAIS" (MANTIDA IGUAL) */
function toggleLei() {
    const textoOculto = document.getElementById('texto-oculto');
    const btnLerMais = document.getElementById('btn-ler-mais');

    if (textoOculto.style.display === 'none' || textoOculto.style.display === '') {
        textoOculto.style.display = 'block';
        btnLerMais.innerHTML = 'Ler menos &uarr;';
    } else {
        textoOculto.style.display = 'none';
        btnLerMais.innerHTML = 'Ler mais &darr;';
        document.getElementById('lei').scrollIntoView({behavior: 'smooth'});
    }
}