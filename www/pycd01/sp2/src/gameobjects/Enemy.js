import { Physics, Math } from "phaser";
import { Bullet } from "./Bullet";
import {getImage} from "../iconLoader.js";

export class Enemy extends Physics.Arcade.Sprite {
    state ;
    scene = null;
    max_speed = 3;
    MIN_DEADZONE = 25;
    MAX_DEADZONE = 60;
    deadzone = 0;
    avatarObject = null;
    activePlayerAvatarName = null;

    constructor(scene) {
        super(scene, scene.scale.width-100, scene.scale.height/2+100, "player");
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

    }



    async start() {
        this.state = "pause"
        this.deadzone = Phaser.Math.Between(this.MIN_DEADZONE, this.MAX_DEADZONE);

        await getImage( "EnemyAvatar", "https://api.dicebear.com/9.x/lorelei/svg?flip=true", this.scene)
        if (this.activePlayerAvatarName !== null) {
            this.avatarObject = this.scene.add.sprite(this.x + 64, this.y, "EnemyAvatar");
            this.avatarObject.setScale(0.1);
        }
    }

    reset() {
        this.deadzone = Phaser.Math.Between(this.MIN_DEADZONE, this.MAX_DEADZONE);
    }

    update() {

    }

    updateAvatarObject() {
        if(this.avatarObject !== null) {
            this.avatarObject.setPosition(this.x + 64, this.y);
        }
    }

    move(ballHeight, ballSpeed) {
        let speed = 1;
        if (ballSpeed + 1 < this.max_speed) {
            speed = ballSpeed + 1
        } else {
            speed = this.max_speed;
        }

        if(this.state === "pause") {
            speed = 0;
        }

       if (ballHeight < this.y - this.deadzone && this.y > 100) {
            this.y -= speed;
            this.updateAvatarObject();
        } else if (ballHeight > this.y + this.deadzone && this.y + 70 < this.scene.scale.height) {
            this.y += speed;
            this.updateAvatarObject();
        }
    }
}