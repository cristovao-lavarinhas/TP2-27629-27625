class Pacman extends Phaser.Scene {
    constructor(){
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
    preload(){
        this.load.image("pacman tileset","pac man tiles/tileset.png");
        this.load.tilemapTiledJSON("map","pacman-map.json");
        this.load.spritesheet("pacman","pacman characters/pacman/pacman0.png",{
            frameWidth:32,frameHeight:32
        });
        this.load.spritesheet("pacman1","pacman characters/pacman/pacman1.png",{
            frameWidth:32,frameHeight:32
        });
        this.load.spritesheet("pacman2","pacman characters/pacman/pacman2.png",{
            frameWidth:32,frameHeight:32
        });
        this.load.spritesheet("pacman3","pacman characters/pacman/pacman3.png",{
            frameWidth:32,frameHeight:32
        });
        this.load.spritesheet("pacman4","pacman characters/pacman/pacman4.png",{
            frameWidth:32,frameHeight:32
        });
        this.load.image("dot","pacman items/dot.png");
    }
}