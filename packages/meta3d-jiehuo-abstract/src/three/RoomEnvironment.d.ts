import { Scene, WebGLRenderer } from 'three';

export class RoomEnvironment extends Scene {
    // constructor(renderer?: WebGLRenderer);

    /*! edit by meta3d */
    constructor(renderer: WebGLRenderer, intensity: number);

    dispose(): void;
}
