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

/* =========================================
   LÓGICA DO QUIZ (CORRIGIDA)
   ========================================= */

function selecionarOpcao(botao) {
    const blocoQuiz = botao.closest('.bloco-quiz');
    const botoes = blocoQuiz.querySelectorAll('.btn-quiz');
    const msgDiv = document.getElementById('feedback-msg');

    // 1. Limpa visual dos botões
    botoes.forEach(btn => {
        btn.classList.remove('selected', 'correct', 'wrong');
    });

    // 2. Esconde a mensagem ao tentar de novo
    if(msgDiv) {
        msgDiv.style.display = 'none';
        msgDiv.className = 'feedback-msg'; // Reseta as cores
        msgDiv.innerHTML = '';
    }

    // 3. Marca o novo botão
    botao.classList.add('selected');
}

function enviarRespostaQuiz() {
    const blocoQuiz = document.getElementById('quiz-seca');
    const selecionado = blocoQuiz.querySelector('.btn-quiz.selected');
    const feedbackMsg = document.getElementById('feedback-msg');

    // Remove classes de cor anteriores
    feedbackMsg.className = 'feedback-msg'; 

    // Validação: Nada selecionado
    if (!selecionado) {
        feedbackMsg.innerHTML = "Por favor, selecione uma alternativa antes de enviar.";
        feedbackMsg.classList.add('atencao');
        feedbackMsg.style.display = 'block'; // Força aparecer
        return;
    }

    const isCorreto = selecionado.getAttribute('data-correct') === 'true';

    if (isCorreto) {
        // --- ACERTOU ---
        selecionado.classList.remove('selected');
        selecionado.classList.add('correct');
        
        feedbackMsg.innerHTML = "Parabéns! Você marcou a resposta correta!";
        feedbackMsg.classList.add('sucesso');
        feedbackMsg.style.display = 'block'; // Força aparecer
    } else {
        // --- ERROU ---
        selecionado.classList.remove('selected');
        selecionado.classList.add('wrong');
        
        feedbackMsg.innerHTML = "Resposta errada! Tente novamente.";
        feedbackMsg.classList.add('erro');
        feedbackMsg.style.display = 'block'; // Força aparecer
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

/* =========================================
   NEURAL CANVAS ANIMATION (COM MOUSE E MAIS PARTÍCULAS)
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
    initNeuralCanvas();
});

function initNeuralCanvas() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    // Objeto para rastrear o mouse
    let mouse = {
        x: null,
        y: null,
        radius: 150 // Raio de alcance do mouse
    };

    // CONFIGURAÇÕES
    const properties = {
        bgColor: 'rgba(255, 255, 255, 0)',
        
        // Verde escuro sólido para as bolinhas
        particleColor: 'rgba(30, 58, 40, 1)', 
        
        // Verde com transparência para as linhas (antes era dourado)
        lineColor: 'rgba(30, 58, 40, 0.4)',   
        
        particleRadius: 3,
        particleCount: 130, 
        lineLength: 120,    
        velocity: 0.6       
    };

    // Ajusta o tamanho
    function resize() {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
    }

    // Rastreia o movimento do mouse
    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });

    // Remove o mouse da equação quando ele sai da seção
    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.velocityX = (Math.random() - 0.5) * properties.velocity;
            this.velocityY = (Math.random() - 0.5) * properties.velocity;
        }

        position() {
            this.x += this.velocityX;
            this.y += this.velocityY;

            // Rebater nas paredes
            if (this.x > width || this.x < 0) this.velocityX *= -1;
            if (this.y > height || this.y < 0) this.velocityY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, properties.particleRadius, 0, Math.PI * 2);
            ctx.fillStyle = properties.particleColor;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < properties.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function loop() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].position();
            particles[i].draw();

            // 1. CONEXÃO ENTRE PARTÍCULAS
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                const distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

                if (distance < properties.lineLength) {
                    ctx.beginPath();
                    ctx.strokeStyle = properties.lineColor;
                    ctx.lineWidth = 0.5; // Linha fina entre elas
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                    ctx.closePath();
                }
            }

            // 2. CONEXÃO COM O MOUSE (NOVA LÓGICA)
            if (mouse.x != null) {
                const distanceMouse = Math.sqrt(Math.pow(particles[i].x - mouse.x, 2) + Math.pow(particles[i].y - mouse.y, 2));

                if (distanceMouse < mouse.radius) {
                    ctx.beginPath();
                    ctx.strokeStyle = properties.lineColor; // Usa a mesma cor dourada
                    ctx.lineWidth = 1; // Linha um pouco mais grossa para o mouse
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
        requestAnimationFrame(loop);
    }

    resize();
    initParticles();
    loop();

    window.addEventListener('resize', () => {
        resize();
        initParticles();
    });
}