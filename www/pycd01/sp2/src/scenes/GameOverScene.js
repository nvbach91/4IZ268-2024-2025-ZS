import { Scene } from "phaser";

export class GameOverScene extends Scene {
    message = ""
    end_points = 0;
    score = 0;

    constructor() {
        super("GameOverScene");
    }

    init(data) {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.message = data.message;
        this.end_points = data.end_points;
        this.score = data.score;
    }

    create() {

        // Background rectangles
        this.add.rectangle(
            this.scale.width/2,
            this.scale.height/2,
            this.scale.width*2,
            this.scale.height*2,
            0x000000,
            1
        )

        this.add.rectangle(
            0,
            this.scale.height / 2,
            this.scale.width,
            120,
            0xffffff
        ).setAlpha(1).setOrigin(0, 0.5);

        console.log(this.message)
        const gameover_text = this.add.bitmapText(
            this.scale.width / 2,
            this.scale.height / 2,
            "knighthawks",
            `${this.message}`,
            62,
            1
        )
        gameover_text.setOrigin(0.5, 0.5);
        gameover_text.postFX.addShine();

        this.add.bitmapText(
            this.scale.width / 2,
            this.scale.height / 2 + 95,
            "pixelfont",
            `YOUR POINTS: ${this.end_points}`,
            24
        ).setOrigin(0.5, 0.5);

        this.add.bitmapText(
            this.scale.width / 2,
            this.scale.height / 2 + 125,
            "pixelfont",
            `${this.score}`,
            24
        ).setOrigin(0.5, 0.5);

        this.add.bitmapText(
            this.scale.width / 2,
            this.scale.height / 2 + 180,
            "pixelfont",
            "CLICK TO RESTART",
            24
        ).setOrigin(0.5, 0.5);

        // Click to restart
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.input.on("pointerdown", () => {
                    this.scene.start("MenuScene");
                });
            }
        
        })
    }
}