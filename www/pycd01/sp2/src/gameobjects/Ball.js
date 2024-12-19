import { GameObjects, Physics } from "phaser";

export class Ball extends Physics.Arcade.Image {

    state;
    scene = null;
    ver_dir = 1;
    hor_dir = 1;
    speed = 10;

    constructor(scene) {
        super(scene, scene.scale.width/2, scene.scale.height/2, "ball");
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
    }

    reset(width, height) {
        this.x = width;
        this.y = height;
        this.speed = 15;
        this.ver_dir = 1;
        this.hor_dir = 1;
    }

    start() {
        this.state = "pause";
    }

    update() {
        if (this.state === "play") {
            this.x += this.hor_dir * this.speed/10;
            this.y += this.ver_dir * this.speed/10;
        }

        if (this.y > this.scene.scale.height - 30) {
            this.ver_dir = -1;
        }

        if (this.y < 50 ) {
            this.ver_dir = 1;
        }
    }

    hit() {
        this.speed += 2;
        this.speed = Math.floor(this.speed);
        this.hor_dir *= -1;
    }
}
