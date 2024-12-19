import { Scene } from "phaser";
import { Player } from "../gameobjects/Player";
import { Enemy } from "../gameobjects/Enemy";
import { Ball } from "../gameobjects/Ball";

export class MainScene extends Scene {
    player = null;
    enemy= null;
    ball = null;
    cursors = null;
    hittable_player = null;
    activeAvatarName = null;

    points = 0;
    player_score = 0;
    enemy_score = 0;

    W_pressed = false;
    S_pressed = false;
    heightText;
    constructor() {
        super("MainScene");
    }

    init(data) {
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        // Reset points
        this.points = 0;
        this.game_over_timeout = 20;

        this.activeAvatarName = data.activeAvatar;
    }

    create() {
        // Player
        this.player = new Player({ scene: this });
        this.player.activeAvatarName = this.activeAvatarName;
        //this.heightText = this.add.text(200, 20, "", { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });

        // Enemy
        this.enemy = new Enemy(this);
        this.enemy.activePlayerAvatarName = this.activeAvatarName;

        // Ball
        this.ball = new Ball(this);

        // Cursor keys
        this.cursors = this.input.keyboard.createCursorKeys();
        /*this.cursors.space.on("down", () => {
            //this.player.fire();
        });*/
        this.input.on("pointerdown", (pointer) => {
            //this.player.fire(pointer.x, pointer.y);
            this.changeState("play");
            this.scene.get("HudScene")
                .update_center_text("");
        });

        this.input.keyboard.on('keydown-W',() => this.W_pressed = true);
        this.input.keyboard.on('keydown-S',() => this.S_pressed = true);
        this.input.keyboard.on('keyup-W',() => this.W_pressed = false);
        this.input.keyboard.on('keyup-S',() => this.S_pressed = false);

        // Enable Colliders
        this.bindPhysics()

        // This event comes from MenuScene
            this.scene.launch("HudScene");

        // Start
            this.player.start();
            this.enemy.start();
            this.ball.start();

        // Exit
        this.input.keyboard.on('keydown-ESC',() => this.ExitToMenu());
    }
    //Collision of ball and players.
    bindPhysics() {
        this.physics.add.overlap(this.ball, this.enemy, (enemy, bullet) => {
            if (this.hittable_player === this.enemy || this.hittable_player === null) {
                this.hittable_player = this.player;
                this.ball.hit();
            }
        });

        this.physics.add.overlap(this.ball, this.player, (player, bullet) => {
            if (this.hittable_player === this.player || this.hittable_player === null) {
                this.hittable_player = this.enemy;
                this.ball.hit();
                this.points += 50 + 100 * this.ball.speed;
                this.scene.get("HudScene")
                    .update_points(this.points);

            }
        });
    }

    update() {
        this.player.update();
        this.enemy.update();
        this.ball.update();
        //this.heightText.setText(`Player Y: ${this.player.y.toFixed(2)}`);

        // Player movement entries
        if (this.cursors.up.isDown || this.W_pressed) {
            this.player.move("up");
        }
        if (this.cursors.down.isDown || this.S_pressed) {
            this.player.move("down");
        }

        // Enemy movement
        this.enemy.move(this.ball.y, this.ball.speed);

        // Enemy score
        if(this.ball.x < 0) {
            console.log("enemy score")
            this.changeState("pause");
            this.ball.reset(this.scale.width/2, this.scale.height/2);
            this.enemy.reset();
            this.hittable_player = null;

            this.enemy_score += 1;
            this.scene.get("HudScene")
                .update_score(this.player_score, this.enemy_score);
        } // Player score
        else if (this.ball.x > this.scale.width) {
            console.log("player score")
            this.changeState("pause");
            this.ball.reset(this.scale.width/2, this.scale.height/2);
            this.enemy.reset();
            this.hittable_player = null;

            this.player_score += 1;
            this.scene.get("HudScene")
                .update_score(this.player_score, this.enemy_score);
        }
    }

    changeState(state) {
        this.player.state = state;
        this.enemy.state = state;
        this.ball.state = state;

        if(state === "pause") {
            this.scene.get("HudScene")
                .update_center_text("CLICK TO CONTINUE");
        }
    }

    ExitToMenu() {
        this.scene.stop("HudScene");
        this.scene.start("MenuScene");
    }
}