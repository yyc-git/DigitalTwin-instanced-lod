import { Color, PMREMGenerator, Scene, Texture, WebGLRenderTarget } from "three";
import { RoomEnvironment } from "../three/RoomEnvironment"
import { state } from "../type/StateType";
import { getRenderer } from "../Render";

// export let generateAndSetRoomEnvironment = (scene: Scene, state: state, intensity: number = 1, background = new Color(0xbbbbbb)) => {
//     let renderer = getRenderer(state)

//     const environment = new RoomEnvironment(renderer, intensity);
//     const pmremGenerator = new PMREMGenerator(renderer)

//     scene.background = background;
//     scene.environment = pmremGenerator.fromScene(environment).texture;

//     return scene
// }

export let generateRoomEnvironment = ( state: state, intensity: number = 1) => {
    let renderer = getRenderer(state)

    const environment = new RoomEnvironment(renderer, intensity);
    const pmremGenerator = new PMREMGenerator(renderer)

    return pmremGenerator.fromScene(environment).texture
}

export let setRoomEnvironment = (scene: Scene, environment: Texture, background = new Color(0xbbbbbb)) => {
    scene.background = background;
    scene.environment = environment

    return scene
}