import { Scene } from "phaser";

// The HUD scene is the scene that shows the points and the remaining time.
export class HudScene extends Scene {
    

    remaining_time_text;
    points_text;
    center_text;

    constructor() {
        super("HudScene");
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }

    create() {
        this.points_text = this.add.bitmapText(10, 10, "pixelfont", "POINTS:0000", 24);
        this.remaining_time_text = this.add.bitmapText(this.scale.width - 10, 10, "pixelfont", `SCORE: 0-0`, 24)
            .setOrigin(1, 0);
        this.center_text = this.add.bitmapText(this.scale.width/2, this.scale.height/2+80, "pixelfont", "CLICK TO CONTINUE", 24).setOrigin(0.5, 0.5);
    }

    update_points(points) {
        this.points_text.setText(`POINTS:${points.toString().padStart(4, "0")}`);
    }

    update_score(player_score, enemy_score) {
        this.remaining_time_text.setText(`SCORE:${player_score.toString()}-${enemy_score.toString()}`);
    }

    update_center_text(text) {
        this.center_text.setText(text);
    }
}