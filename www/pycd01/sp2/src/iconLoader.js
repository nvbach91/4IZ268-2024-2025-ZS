async function returnSvgUrl(url) {
    return new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    const svgBlob = new Blob([this.responseText], {type: 'image/svg+xml'});
                    const svgUrl = URL.createObjectURL(svgBlob);
                    resolve(svgUrl);
                } else {
                    reject(`Failed to load SVG. Status: ${this.status}`);
                }
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    });
}

export async function getImage(unique_name, url, scene) {
    return new Promise(async (resolve, reject) => {
        let img = new Image(800, 800);

        const svgUrl = await returnSvgUrl(url)
        img.src = svgUrl;

        img.onload = () => {
            scene.textures.addImage(unique_name, img);
            URL.revokeObjectURL(svgUrl);

            resolve(img)
        };
        img.onerror = () => {
            reject(null);
        }
    });
}

export function addImageToScene(unique_name, pos_x, pos_y, scene) {
    let iconObject = scene.add.image(pos_x, pos_y, unique_name).setInteractive()
        .on('pointerdown', () => scene.onIconClick(unique_name), scene);
    iconObject.setScale(0.1);
    return iconObject
}
