// import { Box3, Camera, Matrix4, OrthographicCamera, PerspectiveCamera, Vector3 } from 'three';
// import { InstancedEntity } from './InstancedEntity';
// import { InstancedMesh2 } from './InstancedMesh2';
// import { Frustum } from './Frustum';
// import { state } from '../type/StateType';
// import { InstancedMesh2LOD } from '../lod/InstancedMesh2LOD';
// import { findSource } from './Instance';

// /** @internal */
// export interface Node {
//   bbox: Float32Array;
//   visibilityMask: number; // -1 = OUT, 0 = IN, > 0 = INTERSECT.
//   left?: Node;
//   right?: Node;
//   leaves?: InstancedEntity[];
// }

// /** @internal */
// export enum SplitType {
//   center,
//   average,
//   SAH,
// }

// /** @internal */
// export class InstancedMeshBVH {
//   public root: Node;
//   protected _target: InstancedMesh2;
//   protected _maxLeaves: number;
//   protected _maxDepth: number;
//   protected _indexes: Uint32Array;
//   protected _bboxData: Float32Array;
//   protected _frustum = new Frustum();
//   protected _show: InstancedEntity[];
//   protected _hide: InstancedEntity[];
//   protected _projScreenMatrixCache = new Matrix4();

//   constructor(instancedMesh: InstancedMesh2) {
//     this._target = instancedMesh;
//   }

//   // public build(state, strategy = SplitType.center, maxLeaves = 10, maxDepth = 40): this {
//   public build(state, instancedMesh2LOD: InstancedMesh2LOD, strategy = SplitType.center, maxLeaves = 10, maxDepth = 40): this {
//     this._maxLeaves = maxLeaves;
//     this._maxDepth = maxDepth;

//     InstancedMesh2.verbose && console.time("setup...");
//     const bbox = this.setup(state, instancedMesh2LOD);
//     InstancedMesh2.verbose && console.timeEnd("setup...");

//     this.root = { bbox, visibilityMask: 0 }; // 0 = in

//     InstancedMesh2.verbose && console.time("bvh...");
//     this.buildNode(this.root, 0, this._target.instances.length, 0);
//     InstancedMesh2.verbose && console.timeEnd("bvh...");

//     delete this._bboxData;
//     delete this._indexes;

//     return this;
//   }

//   private setup(state: state, instancedMesh2LOD): Float32Array {
//     const instances = this._target.instances;
//     const count = instances.length;
//     const indexes = new Uint32Array(count);
//     const bboxData = new Float32Array(count * 6);

//     if (!this._target.boundingBox) this._target.computeBoundingBox();
//     const bboxGeometry = this._target.geometry.boundingBox;

//     let xMinBBox = Infinity;
//     let yMinBBox = Infinity;
//     let zMinBBox = Infinity;
//     let xMaxBBox = -Infinity;
//     let yMaxBBox = -Infinity;
//     let zMaxBBox = -Infinity;

//     for (let i = 0; i < count; i++) {
//       indexes[i] = i;


//       /*! edit by meta3d */
//       // const bbox = _box.copy(bboxGeometry).applyMatrix4(instances[i].matrix);
//       // const bbox = _box.copy(bboxGeometry).applyMatrix4(findSource(state, this._target.id, i).matrixWorld)
//       const bbox = _box.copy(bboxGeometry).applyMatrix4(findSource(state, instancedMesh2LOD.id, i).matrixWorld)





//       const min = bbox.min;
//       const max = bbox.max;

//       const i6 = i * 6;
//       const xMin = min.x;
//       const yMin = min.y;
//       const zMin = min.z;
//       const xMax = max.x;
//       const yMax = max.y;
//       const zMax = max.z;

//       bboxData[i6] = (xMax + xMin) / 2; // center
//       bboxData[i6 + 1] = (xMax - xMin) / 2; // size
//       bboxData[i6 + 2] = (yMax + yMin) / 2;
//       bboxData[i6 + 3] = (yMax - yMin) / 2;
//       bboxData[i6 + 4] = (zMax + zMin) / 2;
//       bboxData[i6 + 5] = (zMax - zMin) / 2;

//       if (xMinBBox > xMin) xMinBBox = xMin;
//       if (yMinBBox > yMin) yMinBBox = yMin;
//       if (zMinBBox > zMin) zMinBBox = zMin;
//       if (xMaxBBox < xMax) xMaxBBox = xMax;
//       if (yMaxBBox < yMax) yMaxBBox = yMax;
//       if (zMaxBBox < zMax) zMaxBBox = zMax;
//     }

//     this._bboxData = bboxData;
//     this._indexes = indexes;

//     return new Float32Array([xMinBBox, yMinBBox, zMinBBox, xMaxBBox, yMaxBBox, zMaxBBox]);
//   }

//   private buildNode(node: Node, offset: number, count: number, depth: number): void {
//     if (depth++ >= this._maxDepth || count <= this._maxLeaves) {
//       node.leaves = this.getLeaves(offset, count);
//       return;
//     }

//     const bbox = node.bbox;
//     const axis = this.getLongestAxis(bbox);
//     const bboxLeft = new Float32Array(6);
//     const bboxRight = new Float32Array(6);
//     const center = (bbox[axis] + bbox[axis + 3]) / 2;

//     this.createNodes(bboxLeft, bboxRight);

//     const leftEndOffset = this.split(axis, offset, count, center, bboxLeft, bboxRight);

//     if (leftEndOffset === offset || leftEndOffset === offset + count) {
//       node.leaves = this.getLeaves(offset, count);
//       return;
//     }

//     node.left = { bbox: bboxLeft, visibilityMask: 0 }; // 0 = in
//     node.right = { bbox: bboxRight, visibilityMask: 0 }; // 0 = in

//     this.buildNode(node.left, offset, leftEndOffset - offset, depth);
//     this.buildNode(node.right, leftEndOffset, count - leftEndOffset + offset, depth);
//   }

//   private getLeaves(offset: number, count: number): InstancedEntity[] {
//     const array = new Array(count);
//     const instances = this._target.instances;

//     for (let i = 0; i < count; i++) {
//       array[i] = instances[this._indexes[offset + i]];
//     }

//     return array;
//   }

//   private getLongestAxis(bbox: Float32Array): number {
//     const xSize = bbox[3] - bbox[0]; //todo set min and max near
//     const ySize = bbox[4] - bbox[1];
//     const zSize = bbox[5] - bbox[2];
//     if (xSize > ySize) return xSize > zSize ? 0 : 2;
//     return ySize > zSize ? 1 : 2;
//   }

//   private createNodes(bboxLeft: Float32Array, bboxRight: Float32Array): void {
//     bboxLeft[0] = Infinity;
//     bboxLeft[1] = Infinity;
//     bboxLeft[2] = Infinity;
//     bboxLeft[3] = -Infinity;
//     bboxLeft[4] = -Infinity;
//     bboxLeft[5] = -Infinity;

//     bboxRight[0] = Infinity;
//     bboxRight[1] = Infinity;
//     bboxRight[2] = Infinity;
//     bboxRight[3] = -Infinity;
//     bboxRight[4] = -Infinity;
//     bboxRight[5] = -Infinity;
//   }

//   private split(axis: number, offset: number, count: number, center: number, bboxLeft: Float32Array, bboxRight: Float32Array) {
//     const bboxData = this._bboxData;
//     const axis2 = axis * 2;
//     let left = offset;
//     let right = offset + count - 1;

//     while (left <= right) {
//       if (bboxData[left * 6 + axis2] > center) {
//         while (true) {
//           if (bboxData[right * 6 + axis2] < center) {
//             this.swap(left, right);
//             this.unionBBox(right, bboxRight);
//             right--;
//             break;
//           }
//           this.unionBBox(right, bboxRight);
//           right--;
//           if (right < left) return left;
//         }
//       }
//       this.unionBBox(left, bboxLeft);
//       left++;
//     }

//     return left;
//   }

//   private swap(left: number, right: number): void {
//     const bboxData = this._bboxData;
//     const index = this._indexes;

//     let temp = index[left];
//     index[left] = index[right];
//     index[right] = temp;

//     const left6 = left * 6;
//     const right6 = right * 6;

//     for (let i = 0; i < 6; i++) {
//       temp = bboxData[left6 + i];
//       bboxData[left6 + i] = bboxData[right6 + i];
//       bboxData[right6 + i] = temp;
//     }
//   }

//   private unionBBox(index: number, bboxSide: Float32Array): void {
//     const bbox = this._bboxData;
//     const index6 = index * 6;

//     const xMin = bbox[index6] - bbox[index6 + 1];
//     const xMax = bbox[index6] + bbox[index6 + 1];
//     const yMin = bbox[index6 + 2] - bbox[index6 + 3];
//     const yMax = bbox[index6 + 2] + bbox[index6 + 3];
//     const zMin = bbox[index6 + 4] - bbox[index6 + 5];
//     const zMax = bbox[index6 + 4] + bbox[index6 + 5];

//     if (bboxSide[0] > xMin) bboxSide[0] = xMin;
//     if (bboxSide[1] > yMin) bboxSide[1] = yMin;
//     if (bboxSide[2] > zMin) bboxSide[2] = zMin;
//     if (bboxSide[3] < xMax) bboxSide[3] = xMax;
//     if (bboxSide[4] < yMax) bboxSide[4] = yMax;
//     if (bboxSide[5] < zMax) bboxSide[5] = zMax;
//   }

//   private _computeDistance(cameraPosition, nodePosition, cameraZoom) {
//     return cameraPosition.distanceTo(nodePosition) / cameraZoom
//   }

//   // public updateCulling(camera: Camera, show: InstancedEntity[], hide: InstancedEntity[]): void {
//   public updateCulling(camera: PerspectiveCamera | OrthographicCamera, levelsData): void {
//     _projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);

//     if (this._projScreenMatrixCache.equals(_projScreenMatrix)) return;
//     this._projScreenMatrixCache.copy(_projScreenMatrix);
//     InstancedMesh2.verbose && console.time("culling");




//     let cameraPosition = new Vector3().setFromMatrixPosition(camera.matrixWorld)
//     // let v2 = new Vector3().setFromMatrixPosition(this.matrixWorld)

//     // const distance = v1.distanceTo(v2) / camera.zoom;

//     // this._show = show;
//     // this._hide = hide;

//     this._frustum.setFromProjectionMatrix(_projScreenMatrix);
//     this.traverseVisibility(this.root, 0b111111, levelsData, cameraPosition, camera.zoom)

//     // this._show = undefined;
//     // this._hide = undefined;
//     InstancedMesh2.verbose && console.timeEnd("culling");
//   }

//   private traverseVisibility(node: Node, mask: number, levelsData, cameraPosition, cameraZoom): void {
//     mask = this._frustum.intesectsBoxMask(node.bbox, mask);

//     if (mask >= 1) { // 1+ = intersect
//       if (node.leaves === undefined) {
//         node.visibilityMask = 1;
//         this.traverseVisibility(node.left, mask, levelsData, cameraPosition, cameraZoom);
//         this.traverseVisibility(node.right, mask, levelsData, cameraPosition, cameraZoom);
//       } else {
//         this.setIntersectionVisibility(node, levelsData, cameraPosition, cameraZoom);
//       }
//     } else if (mask === 0) { // 0 = in
//       this.showAll(node, levelsData, cameraPosition, cameraZoom);
//     } else { // -1 = out
//       this.hideAll(node, levelsData, cameraPosition, cameraZoom);
//     }
//   }

//   private _getNodeCenter(node: Node) {
//     let bbox = node.bbox;

//     return new Vector3(
//       (bbox[0] + bbox[3]) / 2,
//       (bbox[1] + bbox[4]) / 2,
//       (bbox[2] + bbox[5]) / 2,
//     )
//   }

//   private _getShowAndHide(node: Node, levelsData, cameraPosition, cameraZoom) {
//     let distance_ = this._computeDistance(cameraPosition, this._getNodeCenter(node), cameraZoom)

//     return levelsData.filter(([
//       show,
//       hide,
//       distance,
//       hysteresis
//     ]) => {
//       return distance_ < distance
//     }).reduce(([showArrs, hideArrs], data, index) => {
//       if (index == 0) {
//         return [
//           showArrs.push(data[0]),
//           hideArrs.push(data[1])
//         ]
//       }

//       return [
//         showArrs.push(data[1]),
//         hideArrs.push(data[1])
//       ]
//     }, [[], []])
//   }

//   private _addToShow(showArrs, instance: InstancedEntity) {
//     showArrs.forEach(show => {
//       show.push(instance)
//     })

//     return showArrs
//   }

//   private _addToHide(hideArrs, instance: InstancedEntity) {
//     hideArrs.forEach(hide => {
//       hide.push(instance)
//     })

//     return hideArrs
//   }

//   private setIntersectionVisibility(node: Node, levelsData, cameraPosition, cameraZoom): void {
//     if (node.visibilityMask === -1) { // -1 = out
//       let [showArrs, _] = this._getShowAndHide(node, levelsData, cameraPosition, cameraZoom)

//       const leaves = node.leaves;
//       for (let i = 0, l = leaves.length; i < l; i++) {
//         if (leaves[i]._visible) this._addToShow(showArrs, leaves[i])
//       }

//       node.visibilityMask = 0; // 0 = in
//     }
//   }

//   private showAll(node: Node, levelsData, cameraPosition, cameraZoom): void {
//     if (node.visibilityMask === 0) return; // 0 = in

//     if (node.leaves !== undefined) {
//       let [showArrs, _] = this._getShowAndHide(node, levelsData, cameraPosition, cameraZoom)

//       const leaves = node.leaves;
//       for (let i = 0, l = leaves.length; i < l; i++) {
//         if (leaves[i]._visible) this._addToShow(showArrs, leaves[i]);
//       }
//     } else {
//       this.showAll(node.left, levelsData, cameraPosition, cameraZoom);
//       this.showAll(node.right, levelsData, cameraPosition, cameraZoom);
//     }

//     node.visibilityMask = 0; // 0 = in
//   }

//   private hideAll(node: Node, levelsData, cameraPosition, cameraZoom): void {
//     if (node.visibilityMask === -1) return; // -1 = out

//     if (node.leaves !== undefined) {
//       let [_, hideArrs] = this._getShowAndHide(node, levelsData, cameraPosition, cameraZoom)

//       const leaves = node.leaves;
//       for (let i = 0, l = leaves.length; i < l; i++) {
//         if (leaves[i]._visible) this._addToHide(hideArrs, leaves[i])
//       }
//     } else {
//       this.hideAll(node.left, levelsData, cameraPosition, cameraZoom);
//       this.hideAll(node.right, levelsData, cameraPosition, cameraZoom);
//     }

//     node.visibilityMask = -1; // -1 = out
//   }
// }

// const _box = new Box3();
// const _projScreenMatrix = new Matrix4();
