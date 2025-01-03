import { Scene } from "phaser";
import { addImageToScene, getImage } from "/src/iconLoader.js";
import { HighScoreManager } from "/src/highscoreManager.js";

export class MenuScene extends Scene {
  avatarsImageMap = new Map();
  activeAvatar = null;
  alreadyLoaded = false;
  nicknameElem = undefined;
  nickname_msg = undefined;
  randomUserId = Math.floor(Math.random() * (99999999 - 10000000) + 10000000);

  constructor() {
    super("MenuScene");
  }

  async init() {
    this.cameras.main.fadeIn(1000, 0, 0, 0); //icon

    //let img = await loadSVG(this, "https://api.dicebear.com/9.x/lorelei/svg?seed=Riley");
    /*console.log(svgString);
        svgString = `
            <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="60" stroke="black" stroke-width="4" fill="red" />
                <text x="50%" y="50%" font-size="24" text-anchor="middle" fill="white" dy=".3em">SVG</text>
            </svg>
        `;
        console.log(svgString);*/
    let avatarNames = ["Riley", "Aiden", "Brian", "Eden", "Emery", "Jade"];
    let i = 0;
    const IMAGE_GAP = 100;
    const PARAMS = "&radius=20&backgroundType[]&backgroundColor=805050";

    for (const avatar of avatarNames) {
      let img;
      if (!this.alreadyLoaded) {
        img = await getImage(
          avatar,
          "https://api.dicebear.com/9.x/lorelei/svg?seed=" + avatar + PARAMS,
          this,
        );
      }
      if (img != null || this.alreadyLoaded) {
        let iconObject = addImageToScene(avatar, 80 + IMAGE_GAP * i, 80, this);
        this.avatarsImageMap.set(avatar, iconObject);
        i++;
      }
    }
    this.alreadyLoaded = true;

    let highScoreManager = new HighScoreManager();
    this.nicknameElem = highScoreManager.getNicknameElem();
    this.riley = await addImageToScene(
      "Riley",
      "https://api.dicebear.com/9.x/lorelei/svg?seed=Riley",
      80,
      80,
      this,
    );
    let nicknameContainerElem = document.querySelector("#nicknameContainer");
    nicknameContainerElem.style.display = "block";
  }

  update() {
    if (this.nickname_msg !== undefined && this.nicknameElem !== undefined) {
      let nickname = this.nicknameElem.value;
      if (nickname === "") {
        nickname = "User" + this.randomUserId;
      }
      this.nickname_msg.text = "Your nickname: " + nickname;
    }
  }

  create() {
    // Background rectangles
    this.add
      .rectangle(0, this.scale.height / 2 - 50, this.scale.width, 80, 0xffffff)
      .setAlpha(0.8)
      .setOrigin(0, 0.5);

    // Logo
    const logo_game = this.add.bitmapText(
      this.scale.width / 2,
      this.scale.height / 2 - 50,
      "knighthawks",
      "PONG",
      52,
      1,
    );
    logo_game.setOrigin(0.5, 0.5);
    logo_game.postFX.addShine();

    const start_msg = this.add
      .bitmapText(
        this.scale.width / 2,
        this.scale.height / 2 + 35,
        "pixelfont",
        "CLICK TO START!",
        24,
      )
      .setOrigin(0.5, 0.5);

    // avatar choice text
    const avatar_msg = this.add
      .bitmapText(150, 20, "pixelfont", "Choose your avatar:", 18)
      .setOrigin(0.5, 0.5);

    // Tween to blink the text
    this.tweens.add({
      targets: start_msg,
      alpha: 0,
      duration: 800,
      ease: (value) => Math.abs(Math.round(value)),
      yoyo: true,
      repeat: -1,
    });

    // Send start-game event when user clicks
    this.input.on("pointerdown", (pointer) => {
      if (pointer.y > 150) {
        this.scene.start("MainScene", {
          activeAvatar: this.activeAvatar,
        });
      }
    });

    // Show users nickname
    this.nickname_msg = this.add
      .bitmapText(this.scale.width, 20, "pixelfont", "Your nickname: ", 18)
      .setOrigin(1, 0.5);
  }

  resetAvatar() {
    this.activeAvatar = null;
  }

  onIconClick(unique_name) {
    //console.log('Button clicked!'+unique_name);

    this.avatarsImageMap.forEach((image) => {
      image.setScale(0.1);
    });
    const image = this.avatarsImageMap.get(unique_name);
    this.activeAvatar = unique_name;
    image.setScale(0.12);
  }
}
