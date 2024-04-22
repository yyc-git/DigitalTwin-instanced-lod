import { Material, MeshStandardMaterial } from "three";

export let makeMaterialToAceeptAmbientLight = (material: MeshStandardMaterial) => {
    if (material.isMeshStandardMaterial && material.metalness == 1) {
        material.metalness = 0.0
    }

    return material
}