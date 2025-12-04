/* LÓGICA DE MÚLTIPLOS CARROSSÉIS */
let slideIndices = {};

document.addEventListener("DOMContentLoaded", () => {
    // Inicializa todos os carrosséis encontrados na página
    const carousels = document.querySelectorAll('.mini-carousel');
    carousels.forEach(carousel => {
        const id = carousel.id;
        slideIndices[id] = 1; // Começa no slide 1
        mostrarSlides(1, id); 
    });
});

function mudarSlideMini(n, carouselId) {
    mostrarSlides(slideIndices[carouselId] += n, carouselId);
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

/* LÓGICA DO QUIZ (APENAS CORES) */
function verificarResposta(botao, isCorreto) {
    let divQuiz = botao.closest('.bloco-quiz');
    let todosBotoes = divQuiz.querySelectorAll('.btn-quiz');

    // Reseta as cores
    todosBotoes.forEach(btn => {
        btn.style.backgroundColor = 'white';
        btn.style.color = '#333';
        btn.style.borderColor = '#ccc';
    });

    if (isCorreto) {
        // Verde
        botao.style.backgroundColor = '#1E3A28'; 
        botao.style.color = 'white';
        botao.style.borderColor = '#1E3A28';
    } else {
        // Vermelho + Alerta
        botao.style.backgroundColor = '#dc3545'; 
        botao.style.color = 'white';
        botao.style.borderColor = '#dc3545';
        alert("Resposta incorreta. Tente analisar sob a ótica da Educação Ambiental Crítica.");
    }
}