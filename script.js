/* LÓGICA DO CARROSSEL ÚNICO */
let slideIndex = 1;

// Inicializa o carrossel mostrando o primeiro slide
document.addEventListener("DOMContentLoaded", () => {
    mostrarSlides(slideIndex);
});

// Função chamada pelos botões (setas)
function mudarSlide(n) {
    mostrarSlides(slideIndex += n);
}

// Função principal que exibe a imagem
function mostrarSlides(n) {
    let i;
    // Pega o container do carrossel único
    let container = document.getElementById("carousel-unico");
    if (!container) return; // Segurança

    let slides = container.getElementsByClassName("slide");
    
    // Loop infinito
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    
    // Esconde todos
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    // Mostra apenas o atual
    slides[slideIndex - 1].style.display = "block";
}


/* LÓGICA DO QUIZ */
function verificarResposta(botao, isCorreto) {
    // Seleciona a div pai que contém os botões e o feedback
    let parent = botao.closest('.bloco-quiz');
    let feedback = parent.querySelector('.feedback');
    let botoes = parent.querySelectorAll('.btn-quiz');
    
    // Reseta as cores de todos os botões para branco/padrão
    botoes.forEach(btn => {
        btn.style.backgroundColor = 'white';
        btn.style.color = '#333';
        btn.style.borderColor = '#ccc';
    });

    if (isCorreto) {
        // Acertou: Botão Verde
        botao.style.backgroundColor = '#1E3A28'; 
        botao.style.color = 'white';
        botao.style.borderColor = '#1E3A28';
        
        // Mostra o texto de reflexão
        if (feedback) feedback.style.display = 'block'; 
    } else {
        // Errou: Botão Vermelho
        botao.style.backgroundColor = '#dc3545'; 
        botao.style.color = 'white';
        botao.style.borderColor = '#dc3545';
        
        alert("Resposta incorreta. Tente analisar sob a ótica da Educação Ambiental Crítica.");
        
        // Esconde o feedback se estiver aberto
        if (feedback) feedback.style.display = 'none';
    }
}