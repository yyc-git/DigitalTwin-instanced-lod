import type { Vector3, Camera } from "three"
import { getHeight, getWidth } from "../View";

export let convertWorldCoordniateToScreenCoordniate = (worldCoordniate: Vector3, camera: Camera) => {
    let widthHalf = getWidth() / 2
    let heightHalf = getHeight() / 2;

    let pos = worldCoordniate.clone();

    pos.project(camera);
    pos.x = (pos.x * widthHalf) + widthHalf;
    pos.y = - (pos.y * heightHalf) + heightHalf;

    return pos
}