import { GridHelper, Vector2 } from "three"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { getHeight, getWidth } from "./BuildCabinetBody"

export let getConfig = () => {
    return {
        width: getWidth() - 1,
        height: getHeight() - 3,
    }
}

// export let build = (widthSegment: number = 10, heightSegment: number = 10, materialParams = {}) => {
//     let { width, height } = getConfig()

//     // adjust segments when they are not integer
//     widthSegment = width / Math.floor(width / widthSegment)
//     heightSegment = height / Math.floor(height / heightSegment)
//     let DELTA = 0.000001 // used to ignore digital error
//     let points = []
//     let halfWidth = width / 2
//     let halfHeight = height / 2
//     let i = 0
//     // draw horizontal lines first, from bottom to top
//     for (let h = -halfHeight; h <= halfHeight + DELTA; h += heightSegment, i++) {
//         let endWidth = (i % 2 === 0) ? halfWidth : -halfWidth
//         if (i === 0) {
//             points.push(new Vector2(-halfWidth, h))
//         }
//         points.push(new Vector2(endWidth, h))
//         if (h < halfHeight) {
//             points.push(new Vector2(endWidth, h + heightSegment))
//         }
//     }
//     let startFromLeft = !!(i % 2 === 0) // check if the last point is in right or left
//     // then, draw vertical lines, from left or right, depends on where the last point is
//     if (startFromLeft) {
//         for (let w = -halfWidth, i = 0; w <= halfWidth + DELTA; w += widthSegment, i++) {
//             let endHeight = (i % 2 === 0) ? -halfHeight : halfHeight
//             points.push(new Vector2(w, endHeight))
//             if (w < halfWidth) {
//                 points.push(new Vector2(w + widthSegment, endHeight))
//             }
//         }
//     } else {
//         for (let w2 = halfWidth, j = 0; w2 + DELTA >= -halfWidth; w2 -= widthSegment, j++) {
//             let endHeight2 = (j % 2 === 0) ? -halfHeight : halfHeight
//             points.push(new Vector2(w2, endHeight2))
//             if (w2 > -halfWidth) {
//                 points.push(new Vector2(w2 - widthSegment, endHeight2))
//             }
//         }
//     }

//     // let DEFAULT_PARAMS = { color: 0xccffcc, transparent: true, wireframeLinewidth: 0.5 }
//     let DEFAULT_PARAMS = { color: 0xffffff, transparent: false, wireframeLinewidth: 0.5 }
//     let params = { ...DEFAULT_PARAMS, ...materialParams }
//     let mat = NewThreeInstance.createMeshBasicMaterial(params)
//     mat.wireframe = false

//     let geometry = NewThreeInstance.createBufferGeometry()
//     geometry.setFromPoints(points)
//     let line = NewThreeInstance.createLine(geometry, mat)
//     line.rotation.x = -0.5 * Math.PI // make the panel horizontal
//     return line

//     // var config = opts || {
//     //     height: 500,
//     //     width: 500,
//     //     linesHeight: 10,
//     //     linesWidth: 10,
//     //     color: 0xDD006C
//     //   };

//     //   var material = new LineBasicMaterial({
//     //     color: config.color,
//     //     opacity: 0.2
//     //   });

//     //   var gridObject = new Object3D(),
//     //     gridGeo = new Geometry(),
//     //     stepw = 2 * config.width / config.linesWidth,
//     //     steph = 2 * config.height / config.linesHeight;

//     //   //width
//     //   for (var i = -config.width; i <= config.width; i += stepw) {
//     //     gridGeo.vertices.push(new Vector3(-config.height, i, 0));
//     //     gridGeo.vertices.push(new Vector3(config.height, i, 0));

//     //   }
//     //   //height
//     //   for (var i = -config.height; i <= config.height; i += steph) {
//     //     gridGeo.vertices.push(new Vector3(i, -config.width, 0));
//     //     gridGeo.vertices.push(new Vector3(i, config.width, 0));
//     //   }

//     //   var line = new Line(gridGeo, material, LinePieces);
//     //   gridObject.add(line);

//     //   return gridObject;
// }

export let build = () => {
    let { width, height } = getConfig()

    let defaultSize = height

    let gridHelper = new GridHelper(defaultSize, 20, 0xffffff, 0xffffff)
    gridHelper.scale.setX(width / defaultSize)

    return gridHelper  
}