import * as THREE from "three"

let _makeLabelCanvas = (text, { baseWidth, size, backgroundColor, textColor }) => {
    let borderSize = 2;
    let ctx = document.createElement('canvas').getContext('2d');
    let font = `${size}px bold sans-serif`;
    ctx.font = font;
    // measure how long the text will be
    let textWidth = ctx.measureText(text).width;

    let doubleBorderSize = borderSize * 2;
    let width = baseWidth + doubleBorderSize;
    let height = size + doubleBorderSize;
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    // need to set font again after resizing canvas
    ctx.font = font;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height);

    // scale to fit but don't stretch
    // if (isScale) {
    ctx.translate(width / 2, height / 2);
    let scaleFactor = Math.min(1, baseWidth / textWidth);
    ctx.scale(scaleFactor, 1);
    // }

    ctx.fillStyle = textColor
    ctx.fillText(text, 0, 0);

    return ctx.canvas;
}

export let setIsAlwaysShow = (label: THREE.Sprite, isAlwaysShow: boolean) => {
    label.material.depthTest = !isAlwaysShow

    return label
}

export let createLabal = (text, position, {
    isSizeAttenuation = true,
    isAlwaysShow = false,
    width,
    size,
    backgroundColor,
    textColor
}) => {
    let canvas = _makeLabelCanvas(text, { baseWidth: width, size, backgroundColor, textColor });
    let texture = new THREE.CanvasTexture(canvas);
    // because our canvas is likely not a power of 2
    // in both dimensions set the filtering appropriately.
    texture.minFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    let labelMaterial = new THREE.SpriteMaterial({
        map: texture,
        sizeAttenuation: isSizeAttenuation
    });
    // labelMaterial.depthTest = !isAlwaysShow


    let label = new THREE.Sprite(labelMaterial);
    label.position.copy(position)

    // if units are meters then 0.01 here makes size
    // of the label into centimeters.
    let labelBaseScale = 0.01;
    // let labelBaseScale = 1
    label.scale.x = canvas.width * labelBaseScale;
    label.scale.y = canvas.height * labelBaseScale;

    label = setIsAlwaysShow(label, isAlwaysShow)

    return label
}