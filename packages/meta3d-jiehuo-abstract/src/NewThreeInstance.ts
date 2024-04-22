import {BufferGeometry, BoxGeometry, CylinderGeometry, Group, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, Object3D, OrthographicCamera, PerspectiveCamera, PlaneGeometry, PointLight, SphereGeometry, Line, Scene } from "three"

export let createObject3D = () => {
    return new Object3D()
}

export let createScene = () => {
    return new Scene()
}

export let createMesh = (...args) => {
    return new Mesh(...args)
}

export let createGroup = () => {
    return new Group()
}

export let createMeshPhysicalMaterial = (config) => {
    return new MeshPhysicalMaterial(config)
}

export let createMeshBasicMaterial = (config) => {
    return new MeshBasicMaterial(config)
}

export let createBufferGeometry = () => {
    return new BufferGeometry()
}

export let createBoxGeometry = (...args) => {
    return new BoxGeometry(...args)
}

export let createSphereGeometry = (...args) => {
    return new SphereGeometry(...args)
}

export let createPlaneGeometry = (...args) => {
    return new PlaneGeometry(...args)
}

export let createCylinderGeometry = (...args) => {
    return new CylinderGeometry(...args)
}

export let createPointLight = (...args) => {
    return new PointLight(...args)
}

export let createPerspectiveCamera = (...args) => {
    return new PerspectiveCamera(...args)
}

export let createOrthographicCamera = (...args) => {
    return new OrthographicCamera(...args)
}

export let createLine = (...args) => {
    return new Line(...args)
}