import { GameObjects, Physics } from "phaser";
import { addImageToScene, getImage } from "../iconLoader.js";

export class Player extends Physics.Arcade.Image {
  state;
  avatarObject = null;
  scene = null;
  bullets = null;
  speed = 5;
  activeAvatarName = null;

  constructor({ scene }) {
    super(scene, 100, scene.scale.height / 2 - 100, "player");
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
  }

  async start() {
    this.state = "pause";
    if (this.activeAvatarName != null) {
      await getImage(
        this.activeAvatarName + "active",
        "https://api.dicebear.com/9.x/lorelei/svg?seed=" +
          this.activeAvatarName,
        this.scene,
      );
      this.avatarObject = this.scene.add.sprite(
        this.x - 64,
        this.y,
        this.activeAvatarName + "active",
      );
      this.avatarObject.setScale(0.1);
    }
  }

  move(direction) {
    if (this.state === "play") {
      if (direction === "up" && this.y > 100) {
        this.y -= this.speed;
        this.updateAvatarObject();
      } else if (
        direction === "down" &&
        this.y + 70 < this.scene.scale.height
      ) {
        this.y += this.speed;
        this.updateAvatarObject();
      }
    }
  }

  updateAvatarObject() {
    if (this.avatarObject !== null) {
      this.avatarObject.setPosition(this.x - 64, this.y);
    }
  }

  update() {}
}
