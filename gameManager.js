let game; // Referência ao Phaser.Game
let selectedDifficulty = "normal";

function startGame(difficulty) {
  document.getElementById("difficulty-container").classList.add("hidden");
  document.getElementById("game-container").classList.remove("hidden");

  selectedDifficulty = difficulty;

  if (!game) {
    const config = {
      type: Phaser.AUTO,
      width: 464,
      height: 560,
      parent: "game-container",
      scene: Pacman,
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },
    };
    game = new Phaser.Game(config);
  } else {
    game.scene.stop("default");
    game.scene.start("default", { difficulty: selectedDifficulty });
  }
}

window.showGameOver = function (win = false) {
  const modal = document.getElementById("game-over-container");
  const title = document.getElementById("game-over-title");
  title.textContent = win ? "YOU WIN!" : "GAME OVER";
  modal.classList.remove("hidden");
};

function restartGame() {
  document.getElementById("game-over-container").classList.add("hidden");

  if (game && game.scene && game.scene.isActive("default")) {
    game.scene.stop("default");
    game.scene.start("default", { difficulty: selectedDifficulty });
  } else if (game) {
    game.scene.start("default", { difficulty: selectedDifficulty });
  } else {
    console.warn("Jogo não iniciado corretamente.");
  }
}

// Vai para o menu inicial e destrói o jogo
function goToMenu() {
  // Esconder todas as modais visíveis (incluindo pausa e vitória)
  document.getElementById("pause-modal")?.classList.add("hidden");
  document.getElementById("game-over-container")?.classList.add("hidden");

  // Esconder jogo e mostrar menu
  document.getElementById("game-container").classList.add("hidden");
  document.getElementById("menu-container").classList.remove("hidden");

  // Destruir jogo ativo
  if (game) {
    game.destroy(true);
    game = null;
  }
}

// Esconde todos os elementos visuais
function hideAll() {
  document.getElementById("menu-container").classList.add("hidden");
  document.getElementById("difficulty-container").classList.add("hidden");
  document.getElementById("game-container").classList.add("hidden");
  document.getElementById("game-over-container").classList.add("hidden");
}

document.addEventListener("keydown", (event) => {
  if (
    event.key.toLowerCase() === "p" &&
    typeof game !== "undefined" &&
    game.scene.isActive("default")
  ) {
    const scene = game.scene.getScene("default");

    if (!scene.isPaused) {
      scene.isPaused = true;
      scene.physics.pause();

      // Guarda velocidade do Pac-Man
      scene.pacmanVelocity = {
        x: scene.pacman.body.velocity.x,
        y: scene.pacman.body.velocity.y,
      };

      // Guarda velocidade e direção dos fantasmas
      scene.ghosts.forEach((ghost) => {
        ghost.storedDirection = ghost.direction;
        ghost.storedVelocity = {
          x: ghost.body.velocity.x,
          y: ghost.body.velocity.y,
        };
      });

      // Mostra o modal de pausa
      document.getElementById("pause-modal").classList.remove("hidden");
    }
  }
});

function resumeGame() {
  document.getElementById("pause-modal").classList.add("hidden");

  if (game && game.scene.isActive("default")) {
    const scene = game.scene.getScene("default");

    if (scene.resumeGameFromPause) {
      scene.resumeGameFromPause();
    } else {
    }
  }
}
