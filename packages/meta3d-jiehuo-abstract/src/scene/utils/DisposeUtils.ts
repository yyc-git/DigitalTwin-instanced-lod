import { Object3D, BufferGeometry, Material, Texture, ShaderMaterial } from "three"

/**
 * Dispose of all Object3D`s nested Geometries, Materials and Textures
 *
 * @param object  Object3D, BufferGeometry, Material or Texture
 * @param disposeMedia If set to true will dispose of the texture image or video element, default false
 */
export let deepDispose = (
    object: Object3D | BufferGeometry | Material | Texture
) => {
    const dispose = (object: BufferGeometry | Material | Texture) =>
        object.dispose();
    ;
    const disposeObject = (object: any) => {
        if (object.geometry) dispose(object.geometry);
        if (object.material)
            _traverseMaterialsTextures(object.material, dispose, dispose);
    };

    if (object instanceof BufferGeometry || object instanceof Texture)
        return dispose(object);

    if (object instanceof Material)
        return _traverseMaterialsTextures(object, dispose, dispose);

    disposeObject(object);

    if (object.traverse) object.traverse((obj) => disposeObject(obj));
}

/**
 * Traverse material or array of materials and all nested textures
 * executing there respective callback
 *
 * @param material          Three js Material or array of material
 * @param materialCallback  Material callback
 * @param textureCallback   Texture callback
 */
let _traverseMaterialsTextures = (
    material: Material | Material[],
    materialCallback?: (material: any) => void,
    textureCallback?: (texture: any) => void
) => {
    const traverseMaterial = (mat: Material) => {
        if (materialCallback) materialCallback(mat);

        if (!textureCallback) return;

        Object.values(mat)
            .filter((value) => value instanceof Texture)
            .forEach((texture) => textureCallback(texture)
            );

        if ((mat as ShaderMaterial).uniforms)
            Object.values((mat as ShaderMaterial).uniforms)
                .filter(({ value }) => value instanceof Texture)
                .forEach(({ value }) => textureCallback(value))
    };

    if (Array.isArray(material)) {
        material.forEach((mat) => traverseMaterial(mat));
    } else traverseMaterial(material);
}