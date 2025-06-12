class Pacman extends Phaser.Scene {
  constructor() {
    super();
    this.Pacman = null;
    this.direction = null;
    this.previousDirection = null;
    this.blockSize = 16;
    this.board = [];
    this.speed = 170;
    this.intersections = [];
    this.nextIntersection = null;
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
  }
  create() {
    this.map = this.make.tilemap({ key: "map" });
    const tileset = this.map.addTilesetImage("pacman tileset");
    const layer = this.map.createLayer("Tile Layer 1", [tileset]);
    layer.setCollisionByExclusion(-1, true);
    this.Pacman = this.physics.add.sprite(230, 432, "pacman");
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
    this.Pacman.play("pacmanAnim");
    this.physics.add.collider(this.Pacman, layer);
    this.dots = this.physics.add.group();
    this.populateBoardAndTrackEmptyTiles(layer);
    this.physics.add.overlap(this.Pacman, this.dots, this.eatDot, null, this);
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
      let rightTile = this.map.getTileAt(
        tile.x + 1,
        tile.y,
        true,
        "Tile Layer 1"
      );
      let bottomTile = this.map.getTileAt(
        tile.x,
        tile.y + 1,
        true,
        "Tile Layer 1"
      );
      let rightBottomTile = this.map.getTileAt(
        tile.x + 1,
        tile.y + 1,
        true,
        "Tile Layer 1"
      );
      if (
        tile.index === -1 &&
        rightTile &&
        rightTile.index === -1 &&
        bottomTile &&
        bottomTile.index === -1 &&
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

  update() {}
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
