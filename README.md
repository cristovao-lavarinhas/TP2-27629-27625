# Pacman - Phaser Game

## Resumo

Este código implementa o jogo **Pacman** utilizando o framework **Phaser**. O objetivo é controlar o Pacman, coletando pontos (dots) enquanto é perseguido por fantasmas. O jogo utiliza o algoritmo **A* (A-star)** para calcular os caminhos dos fantasmas e inclui modos como **scatter** e **chase**, nos quais os fantasmas alteram suas estratégias de perseguição com base no modo ativo.

---

## Funções e Métodos

### 1. **`constructor()`**
   - **Descrição**: Inicializa a cena do jogo, define variáveis de controle como direção do Pacman, velocidade dos fantasmas, alvos dos fantasmas (como **Pinky**, **Blinky**, etc.), e tempos para os modos de jogo (**scatter** e **chase**).
   - **Objetivo**: Configura as variáveis iniciais e chama o método `initModeTimers()` para configurar o cronômetro de mudança de modo.

### 2. **`initModeTimers()`**
   - **Descrição**: Inicializa o cronômetro para o modo **scatter**.
   - **Objetivo**: Define o tempo de duração do modo **scatter**.

### 3. **`setModeTimer(duration)`**
   - **Descrição**: Configura o temporizador para alternar entre os modos de jogo (**scatter** e **chase**).
   - **Objetivo**: Atualiza o temporizador e chama a função `switchMode()` quando o tempo expirar.

### 4. **`switchMode()`**
   - **Descrição**: Altera entre os modos **scatter** e **chase** dos fantasmas.
   - **Objetivo**: Dependendo do modo, ajusta a estratégia de perseguição dos fantasmas (os fantasmas podem seguir o Pacman ou se mover para pontos fixos dependendo do modo).

### 5. **`getChaseTarget(ghost)`**
   - **Descrição**: Calcula o destino do fantasma com base em seu tipo (ex: **redGhost**, **pinkGhost**, etc.) e o modo atual.
   - **Objetivo**: Define o destino que o fantasma deve seguir. Os fantasmas têm estratégias diferentes, como seguir o Pacman ou se mover para uma posição fixa dependendo do seu tipo.

### 6. **`updateGhostPath(ghost, chaseTarget)`**
   - **Descrição**: Atualiza o caminho do fantasma com base no destino calculado.
   - **Objetivo**: Usa o algoritmo A* para determinar o caminho do fantasma até seu objetivo (seja o Pacman ou um alvo fixo).

### 7. **`preload()`**
   - **Descrição**: Carrega os assets (imagens e sprites) necessários para o jogo, incluindo os sprites dos fantasmas e o mapa.
   - **Objetivo**: Carrega os recursos gráficos que serão usados na cena.

### 8. **`create()`**
   - **Descrição**: Configura a cena do jogo, incluindo a criação do mapa, do Pacman, dos fantasmas e inicializa a física do jogo.
   - **Objetivo**: Inicializa os elementos do jogo e chama a função `initializeGhosts()` para configurar os fantasmas.

### 9. **`initializeGhosts(layer)`**
   - **Descrição**: Cria os fantasmas (Pink, Orange, Blue, Red) e os inicializa dentro da cena.
   - **Objetivo**: Configura as posições iniciais dos fantasmas e inicia a entrada deles no labirinto.

### 10. **`startGhostEntries()`**
   - **Descrição**: Inicia a entrada dos fantasmas no labirinto com um pequeno atraso.
   - **Objetivo**: Faz com que cada fantasma entre no labirinto em momentos diferentes (controlados pela variável `entryDelay`).

### 11. **`enterMaze(ghost)`**
   - **Descrição**: Move um fantasma para sua posição inicial no labirinto.
   - **Objetivo**: Posiciona o fantasma no centro do labirinto quando ele entra.

### 12. **`isInghostHouse(x, y)`**
   - **Descrição**: Verifica se as coordenadas de um fantasma estão dentro da "casa dos fantasmas".
   - **Objetivo**: Usado para determinar se um fantasma deve voltar para a casa ou se pode começar a perseguir o Pacman.

### 13. **`aStarAlgorithm(start, target)`**
   - **Descrição**: Implementa o algoritmo A* para calcular o caminho mais curto entre dois pontos.
   - **Objetivo**: Determina o melhor caminho para os fantasmas seguir até seu objetivo, seja o Pacman ou um ponto fixo.

### 14. **`getNextIntersection(currentX, currentY, previousDirection)`**
   - **Descrição**: Determina a próxima interseção que o fantasma deve seguir com base em sua posição e direção anterior.
   - **Objetivo**: Auxilia na navegação do fantasma pelas interseções do mapa.

### 15. **`populateBoardAndTrackEmptyTiles(layer)`**
   - **Descrição**: Preenche o tabuleiro com as posições dos pontos que o Pacman pode comer.
   - **Objetivo**: Preenche a matriz `board` com os pontos (dots) que o Pacman deve coletar.

### 16. **`eatDot(pacman, dot)`**
   - **Descrição**: Desativa um ponto quando o Pacman o coleta.
   - **Objetivo**: Quando o Pacman colide com um ponto, ele é removido do jogo.

### 17. **`detectIntersections()`**
   - **Descrição**: Detecta as interseções no mapa, onde o Pacman ou os fantasmas podem mudar de direção.
   - **Objetivo**: Identifica pontos críticos no mapa onde os fantasmas ou o Pacman podem tomar decisões de movimento.

### 18. **`isPathOpenAroundPoint(pixelX, pixelY)`**
   - **Descrição**: Verifica se um ponto no mapa está livre para o movimento (não bloqueado por paredes).
   - **Objetivo**: Usado para determinar se o Pacman ou os fantasmas podem passar por um ponto no mapa.

### 19. **`handleDirectionInput()`**
   - **Descrição**: Lê os comandos de direção do teclado e altera a direção do Pacman.
   - **Objetivo**: Permite ao jogador controlar a direção do Pacman através das setas do teclado.

### 20. **`handlePacmanMovement()`**
   - **Descrição**: Atualiza a posição do Pacman com base na direção escolhida.
   - **Objetivo**: Move o Pacman no labirinto, ajustando sua posição conforme a direção atual.

### 21. **`handleGhostDirection(ghost)`**
   - **Descrição**: Atualiza a direção do fantasma com base na sua posição e no modo de jogo (chase ou scatter).
   - **Objetivo**: Altera a direção dos fantasmas dependendo do modo atual (scatter ou chase).

### 22. **`handleGhostMovement(ghost)`**
   - **Descrição**: Move o fantasma em direção à próxima interseção.
   - **Objetivo**: Faz o fantasma seguir o caminho calculado pelo algoritmo A* até alcançar a próxima interseção.

### 23. **`changeGhostDirection(ghost, velocityX, velocityY)`**
   - **Descrição**: Altera a velocidade e a direção do fantasma.
   - **Objetivo**: Atualiza a direção do fantasma ao longo do caminho.

### 24. **`getOppositeDirection(direction)`**
   - **Descrição**: Retorna a direção oposta da direção dada.
   - **Objetivo**: Auxilia na navegação do fantasma ao determinar a direção oposta (usado para evitar que os fantasmas sigam para a direção errada).

### 25. **`getPerpendicularDirection(direction)`**
   - **Descrição**: Retorna a direção perpendicular à direção dada.
   - **Objetivo**: Ajuda a calcular as direções de movimento dos fantasmas nas interseções.

### 26. **`isMovingInxDirection(direction)`**
   - **Descrição**: Verifica se o movimento é na direção horizontal (esquerda/direita).
   - **Objetivo**: Verifica a direção do movimento do fantasma para ajustes no código.

---

## Considerações Finais

O jogo **Pacman** aqui descrito utiliza o **Phaser**, um framework de jogos 2D, para criar uma simulação divertida e interativa. O comportamento dos fantasmas é controlado com uma lógica de movimento baseada em algoritmos de busca (A*), permitindo que eles sigam o Pacman de forma dinâmica. O código também inclui a lógica de modos de perseguição (**chase**) e dispersão (**scatter**), que alteram o comportamento dos fantasmas com base no tempo.

Este projeto pode ser expandido e modificado para incluir mais níveis, melhores gráficos ou outros recursos interativos.

---

## Como Jogar

1. Use as setas do teclado para mover o Pacman.
2. Coma todos os pontos espalhados pelo mapa.
3. Evite os fantasmas enquanto os coleta.
