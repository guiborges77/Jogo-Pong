// VARIÁVEIS DA BOLINHA
let xBolinha = 300;  
let yBolinha = 200;  
let diametro = 15;
let raio = diametro / 2;

// VELOCIDADES DA BOLINHA
let velocidadeXBolinha = 10;
let velocidadeYBolinha = 10;
let bolinhaNaoFicaPresa = 0;

// VARIÁVEIS DA RAQUETE
let xRaquete = 5;
let yRaquete = 150;
let raqueteComprimento = 10;
let raqueteAltura = 90;
let colidiu = false;

// VARIÁVEIS DO OPONENTE
let xRaqueteOponente = 585;
let yRaqueteOponente = 150;
let velocidadeYOponente;
let chanceDeErrar = 0;

// PLACAR DO JOGO
let meusPontos = 0;
let pontosDoOponente = 0;

// SONS DO JOGO
let raquetada;
let ponto;
let trilha;

function preload() {
  // Carrega os sons antes de iniciar o jogo
  trilha = loadSound("trilha.mp3");
  ponto = loadSound("ponto.mp3");
  raquetada = loadSound("raquetada.mp3");
}

function setup() {
  // Configura o tamanho do canvas e inicia a trilha sonora
  createCanvas(600, 400);
  trilha.loop();
}

function draw() {
  // FUNÇÃO PRINCIPAL - CHAMADA A CADA FRAME
  background(50);
  mostraBolinha();
  movimentaBolinha();
  verificaColisaoBorda();
  mostraRaquete(xRaquete, yRaquete);
  movimentaMinhaRaquete();
  limitaRaquete();
  verificaColisaoRaquete(xRaquete, yRaquete);
  mostraRaqueteOponente(xRaqueteOponente, yRaqueteOponente);
  movimentaRaqueteOponente();
  verificaColisaoRaqueteBiblioteca(xRaqueteOponente, yRaqueteOponente);
  incluiPlacar();
  marcaPonto();
  calculaChanceDeErrar();
}

function mostraBolinha() {
  // Desenha a bolinha na posição atual
  circle(xBolinha, yBolinha, diametro);
}

function movimentaBolinha() {
  // Move a bolinha de acordo com as velocidades
  xBolinha += velocidadeXBolinha;
  yBolinha += velocidadeYBolinha;
}

function verificaColisaoBorda() {
  // Verifica e trata as colisões com as bordas do canvas
  if (xBolinha + raio > width || xBolinha - raio < 0) {
    velocidadeXBolinha *= -1;
  } 
  if (yBolinha + raio > height || yBolinha - raio < 0) {
    velocidadeYBolinha *= -1;
  }
}

function mostraRaquete(x, y) {
  // Desenha a raquete na posição especificada
  rect(x, y, raqueteComprimento, raqueteAltura);
}

function mostraRaqueteOponente(x, y) {
  // Desenha a raquete do oponente na posição especificada
  rect(x, y, raqueteComprimento, raqueteAltura);
}

function movimentaMinhaRaquete() {
  // Move a raquete do jogador com base nas teclas pressionadas
  if (keyIsDown(UP_ARROW)) {
    yRaquete -= 10;
  }
  if (keyIsDown(DOWN_ARROW)) {
    yRaquete += 10;
  }
  // Trata colisão com a borda inferior
  if (yRaquete + raio > height) {
    yRaquete *= -1;
  }
}

function verificaColisaoRaquete(x, y) {
  // Verifica e trata a colisão da bolinha com a raquete do jogador
  if (xBolinha - raio < x + raqueteComprimento && yBolinha - raio < y + raqueteAltura && yBolinha + raio > y) {
    velocidadeXBolinha *= -1;
    raquetada.play();
  }
}

function verificaColisaoRaqueteBiblioteca(x, y) {
  // Verifica e trata a colisão da bolinha com a raquete do oponente usando a biblioteca p5.collide2D
  colidiu = collideRectCircle(x, y, raqueteComprimento, raqueteAltura, xBolinha, yBolinha, raio);
  if (colidiu) {
    velocidadeXBolinha *= -1;
    raquetada.play();
  }
}

function movimentaRaqueteOponente() {
  // Move a raquete do oponente em direção à posição da bolinha
  velocidadeYOponente = yBolinha - yRaqueteOponente - raqueteComprimento / 2 - 30;
  yRaqueteOponente += velocidadeYOponente + chanceDeErrar;
  calculaChanceDeErrar();
}

function incluiPlacar() {
  // Exibe o placar na tela
  stroke(255);
  textAlign(CENTER);
  textSize(16);
  fill(color(255, 140, 0));
  rect(150, 10, 40, 20);
  fill(255);
  text(meusPontos, 170, 26);
  fill(color(255, 140, 0));
  rect(450, 10, 40, 20);
  fill(255);
  text(pontosDoOponente, 470, 26);
}

function marcaPonto() {
  // Verifica se a bolinha ultrapassou as bordas laterais e marca pontos
  if (xBolinha > 590) {
    meusPontos += 1;
    ponto.play();
  }
  if (xBolinha < 10) {
    pontosDoOponente += 1;
    ponto.play();
  }
}

function calculaChanceDeErrar() {
  // Calcula a probabilidade do oponente errar ao se movimentar em direção à bolinha
  if (pontosDoOponente >= meusPontos) {
    chanceDeErrar += 1;
    if (chanceDeErrar >= 39) {
      chanceDeErrar = 40;
    }
  } else {
    chanceDeErrar -= 1;
    if (chanceDeErrar <= 35) {
      chanceDeErrar = 35;
    }
  }
}
function limitaRaquete() {
  // Garante que a raquete do jogador não ultrapasse as bordas do canvas
  yRaquete = constrain(yRaquete, 0, height - raqueteAltura);
}