class Pacman extends Phaser.Scene {
  constructor() {
    super();
    this.pacman = null;
    this.direction = null;
    this.previousDirection = null;
    this.blockSize = 16;
    this.board = [];
    this.speed = 170;
    this.intersections = [];
    this.nextIntersection = null;
    
    this.PINKY_SCATTER_TARGET = {x:432,y:80};

  }

  preload() {
    this.load.image("pacman tileset", "pacman_tiles/tileset.png");
    this.load.tilemapTiledJSON("map", "pacman-map.json");
    this.load.spritesheet("pacman", "pacman_characters/pacman/pacman0.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("pacman1", "pacman_characters/pacman/pacman1.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("pacman2", "pacman_characters/pacman/pacman2.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("pacman3", "pacman_characters/pacman/pacman3.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("pacman4", "pacman_characters/pacman/pacman4.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.image("dot", "pacman_items/dot.png");

    this.load.spritesheet("pinkGhost", "ghost/pink ghost/spr_ghost_pink_0.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    this.map = this.make.tilemap({ key: "map" });
    const tileset = this.map.addTilesetImage("pacman tileset");
    const layer = this.map.createLayer("Tile Layer 1", [tileset]);
    layer.setCollisionByExclusion(-1, true);

    this.pacman = this.physics.add.sprite(230, 432, "pacman");

    this.anims.create({
      key: "pacmanAnim",
      frames: [
        { key: "pacman" },
        { key: "pacman1" },
        { key: "pacman2" },
        { key: "pacman3" },
        { key: "pacman4" },
      ],
      frameRate: 10,
      repeat: -1,
    });

    this.pacman.play("pacmanAnim");
    this.physics.add.collider(this.pacman, layer);
    this.dots = this.physics.add.group();
    this.populateBoardAndTrackEmptyTiles(layer);
    this.physics.add.overlap(this.pacman, this.dots, this.eatDot, null, this);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.detectIntersections();
    this.inicializeGhosts(layer);
    let startPoint = {x:232,y:240};
    this.pinkGhost.path = this.aStartAlgorithm(startPoint,this.PINKY_SCATTER_TARGET);
    this.pinkGhost.nextIntersection = this.pinkGhost.path.shift();
  }

  update() {
    this.handleDirectionInput();
    this.handlePacmanMovement();
    this.teleportPacmanAcrossWorldBounds();
    if(this.pinkGhost.enteredMaze) {
      this.handleGhostDirection(this.pinkGhost);
      this.handleGhostMovement(this.pinkGhost);
    }
  }

  enterMaze(ghost) {
    ghost.setPosition(232,280);
    ghost.enteredMaze = true;
  }

  initializeGhost(x,y,spriteKey,layer) {
    const ghost = this.physics.add.sprite(x,y,spriteKey);
    this.physics.add.collider(ghost,layer);
    ghost.direction = "right";
    ghost.previousDirection = "right";
    ghost.nextIntersection = null;
    ghost.enteredMaze = false;
    return ghost;
  }

  isInghostHouse(x,y) {
    if((x<=262 && x>=208) && (y<=288 && y>240))
      return true;
    else return false;
  }

  aStarAlgorithm(start,target) {
    function findNearestIntersection(point,intersections) {
      let nearest = null;
      let minDist = Infinity;
      for(const intersection of intersections) {
        const dist = Math.abs(intersection.x-point.x)+Math.abs(intersection.y-point.y);
        if(dist<minDist) {
          minDist = dist;
          nearest = intersection;
        }
      }
      return nearest;
    }
    const startIntersection = findNearestIntersection(start,this.intersections);
    if(!startIntersection) {
      return[];
    }
    const openList = [];
    const closedList = new Set();
    const cameFrom = new Map();
    const gScore = new Map();
    openList.push({node:startIntersection,g:0,f:heuristic(startIntersection,target)});
    gScore.set(JSON.stringify(startIntersection),0);
    function heuristic(node,target) {
      return Math.abs(node.x - target.x)+Math.abs(node.y-target.y);
    }
    while(openList.length>0) {
      openList.sort((a,b)=>a.f-b.f);
      const current = openList.shift().node;
      if(current.x === target.x && current.y === target.y) {
        const path = [];
        let currentNode = current;
        while(cameFrom.has(JSON.stringify(currentNode))) {
          path.push(currentNode);
          currentNode = cameFrom.get(JSON.stringify(currentNode));
        }
        path.push(startIntersection);
        return path.reverse();
      }
      closedList.add(JSON.stringify(current));
      const currentIntersection = this.intersections.find(i=>i.x ===current.x && i.y === current.y);
      if(currentIntersection) {
        for(const direction of currentIntersection.openPaths) {
          const neighbor = this.getNextIntersection(current.x,current.y,direction);
          if(neighbor && !closedList.has(JSON.stringify(neighbor))) {
            const  tentativeGScore = gScore.get(JSON.stringify(current))+1;
            if(!gScore.has(JSON.stringify(neighbor)) || tentativeGScore<gScore.get(JSON.stringify(neighbor))) {
              gScore.set(JSON.stringify(neighbor),tentativeGScore);
              const fScore = tentativeGScore+heuristic(neighbor,target);
              openList.push({node:neighbor,g:tentativeGScore,f: fScore});
              cameFrom.set(JSON.stringify(neighbor),current);
            }
          }
        }
      }
    }
    return [];
  }

  getNextIntersection(currentX,currentY,previousDirection) {
    let filteredIntersections;
    const isUp = previousDirection === "up";
    const isDown = previousDirection === "down";
    const isLeft = previousDirection === "left";
    const isRight = previousDirection === "right";
    filteredIntersections = this.intersections.filter((intersection)=>{
      return(
        ((isUp && intersection.x === currentX && intersection.y<currentY)||
        (isDown && intersection.x === currentX && intersection.y>currentY) ||
        (isLeft && intersection.y === currentY && intersection.x<currentX) ||
        (isRight && intersection.y === currentY && intersection.x>currentX))
      );
    })
    .sort((a,b)=>{
      if(isUp || isDown) {
        return isUp ? b.y-a.y:a.y-b.y;
      } else {
        return isLeft ? b.x-a.x:a.x-b.x;
      }
    });
    return filteredIntersections ? filteredIntersections[0]:null;
  }

  handleGhostDirection(ghost) {
    if(this.isInghostHouse(ghost.x,ghost.y)){
      this.changeGhostDirection(ghost,0,-this.speed*0.8);
    }
    if(ghost.body.velocity.x==0 && ghost.body.velocity.y == 0)
      this.adjustGhostPosition(ghost);
    let isAtIntersection = this.isGhostAtIntersection(ghost.nextIntersection,ghost.x,ghost.y,ghost.direction);
    if(isAtIntersection) {
      if((this.PINKY_SCATTER_TARGET.x === ghost.nextIntersection.x) && (this.PINKY_SCATTER_TARGET.y === ghost.nextIntersection.y) && this.currentMode === "scatter")
        return;
      if((this.BLINKY_SCATTER_TARGET.x === ghost.nextIntersection.x) && (this.BLINKY_SCATTER_TARGET.y === ghost.nextIntersection.y) && this.currentMode === "scatter")
        return;
      if((this.INKY_SCATTER_TARGET.x === ghost.nextIntersection.x) && (this.INKY_SCATTER_TARGET.y === ghost.nextIntersection.y) && this.currentMode === "scatter")
        return;
      if((this.CLYDE_SCATTER_TARGET.x === ghost.nextIntersection.x) && (this.CLYDE_SCATTER_TARGET.y === ghost.nextIntersection.y) && this.currentMode === "scatter")
        return;

      if(ghost.texture.key==="redGhost" && this.currentMode == "chase") {
        let chaseTarget = {x:this.pacman.x,y:this.pacman.y};
        this.updateGhostPath(ghost,chaseTarget);      
      }

      if(ghost.path.length>0)
        ghost.nextIntersection = ghost.path.shift();
      let newDirection = this.getGhostNextDirection(ghost,ghost.nextIntersection);
      ghost.previousDirection = ghost.direction;
      ghost.direction = newDirection;
    }
  }

  populateBoardAndTrackEmptyTiles(layer) {
    layer.forEachTile((tile) => {
      if (!this.board[tile.y]) {
        this.board[tile.y] = [];
      }
      this.board[tile.y][tile.x] = tile.index;
      if (
        tile.y < 4 ||
        (tile.y > 11 && tile.y < 23 && tile.x > 6 && tile.x < 21) ||
        (tile.y === 17 && tile.x !== 6 && tile.x !== 21)
      )
        return;
      let rightTile = this.map.getTileAt(tile.x + 1, tile.y, true, "Tile Layer 1");
      let bottomTile = this.map.getTileAt(tile.x, tile.y + 1, true, "Tile Layer 1");
      let rightBottomTile = this.map.getTileAt(tile.x + 1, tile.y + 1, true, "Tile Layer 1");

      if (
        tile.index === -1 &&
        rightTile && rightTile.index === -1 &&
        bottomTile && bottomTile.index === -1 &&
        rightBottomTile.index === -1
      ) {
        const x = tile.x * tile.width;
        const y = tile.y * tile.height;
        this.dots.create(x + tile.width, y + tile.height, "dot").setOrigin(0);
      }
    });
  }

  eatDot(pacman, dot) {
    dot.disableBody(true, true);
  }

  handleDirectionInput() {
    const arrowKeys = ["left", "right", "up", "down"];
    for (const key of arrowKeys) {
      if (this.cursors[key].isDown && this.direction !== key) {
        this.previousDirection = this.direction;
        this.direction = key;
        this.nextIntersection = this.getNextIntersectionInNextDirection(
          this.pacman.x,
          this.pacman.y,
          this.previousDirection,
          key
        );
        break;
      }
    }
  }

  handlePacmanMovement() {
    let nextIntersectionx = null;
    let nextIntersectiony = null;
    if (this.nextIntersection) {
      nextIntersectionx = this.nextIntersection.x;
      nextIntersectiony = this.nextIntersection.y;
    }

    switch (this.direction) {
      case "left":
        this.handleMovementInDirection(
          "left", "right",
          this.pacman.y, nextIntersectiony, this.pacman.x,
          true, false, 0,
          -this.speed, 0,
          this.pacman.body.velocity.y
        );
        break;
      case "right":
        this.handleMovementInDirection(
          "right", "left",
          this.pacman.y, nextIntersectiony, this.pacman.x,
          true, false, 180,
          this.speed, 0,
          this.pacman.body.velocity.y
        );
        break;
      case "up":
        this.handleMovementInDirection(
          "up", "down",
          this.pacman.x, nextIntersectionx, this.pacman.y,
          false, true, -90,
          0, -this.speed,
          this.pacman.body.velocity.x
        );
        break;
      case "down":
        this.handleMovementInDirection(
          "down", "up",
          this.pacman.x, nextIntersectionx, this.pacman.y,
          false, true, 90,
          0, this.speed,
          this.pacman.body.velocity.x
        );
        break;
      default:
        this.pacman.setVelocityX(0);
        this.pacman.setVelocityY(0);
    }
  }

  handleMovementInDirection(
    currentDirection, oppositeDirection,
    pacmanPosition, intersectionPosition,
    pacmanPerpendicularPosition,
    flipX, flipY, angle,
    velocityX, velocityY, currentVelocity
  ) {
    const otherDirections = ["left", "right"].includes(currentDirection)
      ? ["up", "down"] : ["left", "right"];

    let condition = false;
    if (this.nextIntersection)
      condition =
        (this.previousDirection == otherDirections[0] && pacmanPosition <= intersectionPosition) ||
        (this.previousDirection == otherDirections[1] && pacmanPosition >= intersectionPosition) ||
        this.previousDirection === oppositeDirection;

    if (condition) {
      const newPosition = intersectionPosition;
      if (this.previousDirection !== oppositeDirection && newPosition !== pacmanPosition) {
        if (["left", "right"].includes(currentDirection))
          this.pacman.body.reset(pacmanPerpendicularPosition, newPosition);
        else
          this.pacman.body.reset(newPosition, pacmanPerpendicularPosition);
      }
      this.changeDirection(flipX, flipY, angle, velocityX, velocityY);
      this.adjustPacmanPosition(velocityX, velocityY);
    } else if (currentVelocity === 0) {
      this.changeDirection(flipX, flipY, angle, velocityX, velocityY);
      this.adjustPacmanPosition(velocityX, velocityY);
    }
  }

  detectIntersections() {
    const directions = [
      { x: -this.blockSize, y: 0, name: "left" },
      { x: this.blockSize, y: 0, name: "right" },
      { x: 0, y: -this.blockSize, name: "up" },
      { x: 0, y: this.blockSize, name: "down" },
    ];

    for (let y = 0; y < this.map.heightInPixels; y += this.blockSize) {
      for (let x = 0; x < this.map.widthInPixels; x += this.blockSize) {
        if (!this.isPointClear(x, y)) continue;

        const openPaths = directions.filter(dir =>
          this.isPathOpenAroundPoint(x + dir.x, y + dir.y)
        ).map(dir => dir.name);

        if (
          (openPaths.length > 2 || (
            openPaths.length === 2 &&
            ((["left", "right"].includes(openPaths[0]) && ["up", "down"].includes(openPaths[1])) ||
             (["up", "down"].includes(openPaths[0]) && ["left", "right"].includes(openPaths[1])))
          )) && y > 64 && y < 530
        ) {
          this.intersections.push({ x, y, openPaths });
        }
      }
    }
  }

  isPathOpenAroundPoint(pixelX, pixelY) {
    const corners = [
      { x: pixelX - 1, y: pixelY - 1 },
      { x: pixelX + 1, y: pixelY - 1 },
      { x: pixelX - 1, y: pixelY + 1 },
      { x: pixelX + 1, y: pixelY + 1 },
    ];

    return corners.every(corner => {
      const tileX = Math.floor(corner.x / this.blockSize);
      const tileY = Math.floor(corner.y / this.blockSize);
      return this.board[tileY] && this.board[tileY][tileX] === -1;
    });
  }

  isPointClear(x, y) {
    return this.isPathOpenAroundPoint(x, y);
  }

  teleportPacmanAcrossWorldBounds() {
    const worldBounds = this.physics.world.bounds;
    if (this.pacman.x <= worldBounds.x) {
      this.pacman.body.reset(worldBounds.right - this.blockSize, this.pacman.y);
      this.nextIntersection = this.getNextIntersectionInNextDirection(
        this.pacman.x,
        this.pacman.y,
        "left",
        this.direction
      );
      this.pacman.setVelocityX(-1*this.speed);
    }
    if (this.pacman.x >= worldBounds.right) {
      this.pacman.body.reset(worldBounds.x + this.blockSize, this.pacman.y);
      this.nextIntersection = this.getNextIntersectionInNextDirection(
        this.pacman.x,
        this.pacman.y,
        "right",
        this.direction
      );
      this.pacman.setVelocityX(this.speed);
    }
  }

  getNextIntersectionInNextDirection(currentX, currentY, currentDirection, nextDirection) {
    const isUp = currentDirection === "up";
    const isDown = currentDirection === "down";
    const isLeft = currentDirection === "left";
    const isRight = currentDirection === "right";

    const filtered = this.intersections
      .filter(i => (
        ((isUp && i.x === currentX && i.y < currentY) ||
         (isDown && i.x === currentX && i.y > currentY) ||
         (isLeft && i.y === currentY && i.x < currentX) ||
         (isRight && i.y === currentY && i.x > currentX)) &&
        this.isIntersectionInDirection(i, nextDirection)
      ))
      .sort((a, b) => {
        if (isUp || isDown) return isUp ? b.y - a.y : a.y - b.y;
        else return isLeft ? b.x - a.x : a.x - b.x;
      });

    return filtered[0] || null;
  }

  isIntersectionInDirection(intersection, direction) {
    return intersection.openPaths.includes(direction);
  }

  adjustPacmanPosition(velocityX, velocityY) {
    if (this.pacman.x % this.blockSize !== 0 && velocityY !== 0) {
      const nearestX = Math.round(this.pacman.x / this.blockSize) * this.blockSize;
      this.pacman.body.reset(nearestX, this.pacman.y);
    }
    if (this.pacman.y % this.blockSize !== 0 && velocityX !== 0) {
      const nearestY = Math.round(this.pacman.y / this.blockSize) * this.blockSize;
      this.pacman.body.reset(this.pacman.x, nearestY);
    }
  }

  changeDirection(flipX, flipY, angle, velocityX, velocityY) {
    this.pacman.setFlipX(flipX);
    this.pacman.setFlipY(flipY);
    this.pacman.setAngle(angle);
    this.pacman.setVelocityX(velocityX);
    this.pacman.setVelocityY(velocityY);
  }
}

const config = {
  type: Phaser.AUTO,
  width: 464,
  height: 560,
  parent: "container",
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: Pacman,
};

const game = new Phaser.Game(config);
