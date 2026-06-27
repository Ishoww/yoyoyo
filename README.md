# 🚀 Rocket League 3D - AI Challenge

Um jogo de futebol 3D no navegador com IA inteligente.

## ✨ Recursos

✅ Gráficos 3D (Three.js)
✅ Física customizada (otimizada para baixo desempenho)
✅ IA Inteligente (Você vs IA Red)
✅ Gameplay smooth (60 FPS mesmo em PC antigo)
✅ Mecânicas realistas (boost, salto, colisão)

## 🎮 Controles

- **W/A/S/D** - Mover o carro
- **SPACE** - Pular
- **SHIFT** - Turbo (boost com limite de energia)
- **R** - Resetar bola

## 🤖 Sistema de IA

A IA Red joga contra você:
- **Goleiro**: Defende o gol, intercepta chutes
- **Logística inteligente**: Move para a bola quando próxima
- **Boost estratégico**: Usa boost nos momentos certos
- **Posicionamento**: Mantém-se perto do gol quando defende

## 📊 Gameplay

- **Duração**: 5 minutos
- **Objetivo**: Marque mais gols que a IA
- **Placar em tempo real**: Acompanhe o jogo
- **Modo**: 1v1 (Você vs IA)

## 🛠️ Tecnologias

- **Three.js** - Renderização 3D
- **Physics Customizada** - Sem dependências externas
- **Vanilla JavaScript** - Puro e simples

## 📁 Estrutura

```
├── index.html          # HTML principal
├── src/
│   ├── game.js        # Game manager e loop principal
│   ├── renderer.js    # Three.js rendering
│   ├── physics.js     # Motor físico customizado
│   ├── entities.js    # Classes Player e Ball
│   └── ai.js          # Controle da IA
└── README.md          # Este arquivo
```

## 🚀 Como Jogar

1. Abre o arquivo `index.html` no navegador
2. Controla o carro azul com WASD
3. Marca gols chutando a bola para o gol vermelho
4. Defenda contra a IA
5. Vence quem tiver mais gols em 5 minutos

## ⚙️ Performance

Otimizado para PCs antigos:
- ✅ Sem shadows
- ✅ Low-poly meshes
- ✅ Física simplificada
- ✅ Renderização eficiente

**Testado em I5-2400** ✅

---

**Feito para desafio de IA - Vamos ver qual IA faz melhor! 🎮**
