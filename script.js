// Lógica do carrossel
let slideIndices = {};
let autoPlayIntervals = {}; 
document.addEventListener("DOMContentLoaded", () => {
    const carousels = document.querySelectorAll('.mini-carousel');
    carousels.forEach(carousel => {
        const id = carousel.id;
        slideIndices[id] = 1; 
        mostrarSlides(1, id); 
    });

    iniciarAutoPlay('carousel-seca', 5000);
});

function iniciarAutoPlay(id, tempo) {

    if (autoPlayIntervals[id]) clearInterval(autoPlayIntervals[id]);
    
    autoPlayIntervals[id] = setInterval(() => {
        mudarSlideMini(1, id);
    }, tempo);
}

function mudarSlideMini(n, carouselId) {
    mostrarSlides(slideIndices[carouselId] += n, carouselId);

    iniciarAutoPlay(carouselId, 5000); 
}

function mostrarSlides(n, carouselId) {
    let i;
    let container = document.getElementById(carouselId);
    if (!container) return;

    let slides = container.getElementsByClassName("slide");

    if (n > slides.length) { slideIndices[carouselId] = 1 }
    if (n < 1) { slideIndices[carouselId] = slides.length }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slides[slideIndices[carouselId] - 1].style.display = "block";
}

// Lógica do Quiz
function selecionarOpcao(botao) {
    const blocoQuiz = botao.closest('.bloco-quiz');
    const botoes = blocoQuiz.querySelectorAll('.btn-quiz');
    const msgDiv = document.getElementById('feedback-msg');

    const jaEstavaSelecionado = botao.classList.contains('selected');

    botoes.forEach(btn => {
        btn.classList.remove('selected', 'correct', 'wrong');
    });

    if (msgDiv) {
        msgDiv.style.display = 'none';
        msgDiv.className = 'feedback-msg';
        msgDiv.innerHTML = '';
    }

    if (!jaEstavaSelecionado) {
        botao.classList.add('selected');
    }
}

function enviarRespostaQuiz() {
    const blocoQuiz = document.getElementById('quiz-seca');
    const selecionado = blocoQuiz.querySelector('.btn-quiz.selected');
    const feedbackMsg = document.getElementById('feedback-msg');

    feedbackMsg.className = 'feedback-msg'; 

    if (!selecionado) {
        feedbackMsg.innerHTML = "Por favor, selecione uma alternativa antes de enviar.";
        feedbackMsg.classList.add('atencao');
        feedbackMsg.style.display = 'block';
        return;
    }

    const isCorreto = selecionado.getAttribute('data-correct') === 'true';

    if (isCorreto) {
        // Acertou
        selecionado.classList.remove('selected');
        selecionado.classList.add('correct');
        
        feedbackMsg.innerHTML = "Parabéns! Você marcou a resposta correta!";
        feedbackMsg.classList.add('sucesso');
        feedbackMsg.style.display = 'block';
    } else {
        // Errou
        selecionado.classList.remove('selected');
        selecionado.classList.add('wrong');
        
        feedbackMsg.innerHTML = "Resposta errada! Tente novamente.";
        feedbackMsg.classList.add('erro');
        feedbackMsg.style.display = 'block';
    }
}

// Lógica Ler mais - Seção Lei
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

// Animação Particulas Neural Canvas
document.addEventListener("DOMContentLoaded", () => {
    initNeuralCanvas();
});

function initNeuralCanvas() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;
    
    const parentSection = canvas.parentElement; 
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    let mouse = {
        x: null,
        y: null,
        radius: 150 
    };

    const properties = {
        rgbBase: '30, 58, 40', 
        lineColor: 'rgba(30, 58, 40, 0.4)',   
        particleRadius: 3,  
        particleCount: 200, 
        lineLength: 120,    
        velocity: 0.6       
    };

    function resize() {
        width = canvas.width = parentSection.offsetWidth;
        height = canvas.height = parentSection.offsetHeight;
    }

    parentSection.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });

    parentSection.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.velocityX = (Math.random() - 0.5) * properties.velocity;
            this.velocityY = (Math.random() - 0.5) * properties.velocity;

            this.radius = Math.random() * (properties.particleRadius - 1) + 1;

            this.opacity = Math.random() * (1 - 0.2) + 0.2;
        }

        position() {
            this.x += this.velocityX;
            this.y += this.velocityY;

            if (this.x > width || this.x < 0) this.velocityX *= -1;
            if (this.y > height || this.y < 0) this.velocityY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

            ctx.fillStyle = `rgba(${properties.rgbBase}, ${this.opacity})`;
            
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

            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                const distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

                if (distance < properties.lineLength) {
                    ctx.beginPath();
                    ctx.strokeStyle = properties.lineColor;
                    ctx.lineWidth = 0.5; 
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                    ctx.closePath();
                }
            }

            if (mouse.x != null) {
                const distanceMouse = Math.sqrt(Math.pow(particles[i].x - mouse.x, 2) + Math.pow(particles[i].y - mouse.y, 2));

                if (distanceMouse < mouse.radius) {
                    ctx.beginPath();
                    ctx.strokeStyle = properties.lineColor; 
                    ctx.lineWidth = 1; 
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