/*! edit by meta3d 

changed from Lod.js
*/

import { Box3, Euler, Mesh, Object3D, Vector3 } from "three";
import { assertFalse, requireCheck, test } from "../utils/Contract";
import { pushArrs } from "../utils/ArrayUtils";
import { getExn } from "../utils/NullableUtils";
import { getIsDebug } from "../state/State";

export type level = {
	/** The Object3D to display at this level. */
	object: Object3D;
	// object: Mesh;
	/** The distance at which to display this level of detail. Expects a `Float`. */
	distance: number;
	/** Threshold used to avoid flickering at LOD boundaries, as a fraction of distance. Expects a `Float`. */
	hysteresis: number;
}

const _v1 = /*@__PURE__*/ new Vector3();
const _v2 = /*@__PURE__*/ new Vector3();

export class InstanceSourceLOD extends Object3D {
	private _currentLevel: number

	// public worldBoundingBox: Box3 = null

	public type: string
	public levels: Array<level>

	constructor() {

		super();

		this._currentLevel = 0;

		this.type = 'InstanceSourceLOD';

		Object.defineProperties(this, {
			levels: {
				enumerable: true,
				value: []
			},
			isLOD: {
				value: true,
			}
		});

		// this.autoUpdate = true;


	}

	copy(source) {

		// super.copy(source, false);
		super.copy(source, true);

		const levels = source.levels;

		for (let i = 0, l = levels.length; i < l; i++) {

			const level = levels[i];

			this.addLevel(level.object.clone(), level.distance, level.hysteresis, false);

		}

		// this.autoUpdate = source.autoUpdate;

		return this;

	}

	addLevel(object: Object3D, distance = 0, hysteresis = 0, isDebug) {
		requireCheck(() => {
			test("meshs should be first level children", () => {
				return object.children.reduce((result, child: Mesh) => {
					if (!result) {
						return result
					}

					return child.isMesh && child.children.length == 0
				}, true)
			})
			test("transform should be default", () => {
				return object.children.reduce((result, child: Mesh) => {
					if (!result) {
						return result
					}

					return child.position.equals(new Vector3(0, 0, 0)) && child.rotation.equals(new Euler(0, 0, 0)) && child.scale.equals(new Vector3(1, 1, 1))
				}, true)
			})
			test("shouldn't auto update matrix", () => {
				return assertFalse(object.matrixAutoUpdate)
			})
		}, isDebug)



		distance = Math.abs(distance);

		const levels = this.levels;

		let l;

		for (l = 0; l < levels.length; l++) {

			if (distance < levels[l].distance) {

				break;

			}

		}

		levels.splice(l, 0, { distance: distance, hysteresis: hysteresis, object: object });

		// this.add( object );

		return this;

	}

	getCurrentLevel() {

		return this._currentLevel;

	}

	// traverse(func) {
	// 	super.traverse(func)

	// 	this.levels.forEach(level => {
	// 		level.object.traverse(func)
	// 	})
	// }



	getObjectForDistance(distance) {

		const levels = this.levels;

		if (levels.length > 0) {

			let i, l;

			for (i = 1, l = levels.length; i < l; i++) {

				let levelDistance = levels[i].distance;

				if (levels[i].object.visible) {

					levelDistance -= levelDistance * levels[i].hysteresis;

				}

				if (distance < levelDistance) {

					break;

				}

			}

			return levels[i - 1].object;

		}

		return null;

	}

	private _replaceLevelObjectToLODObject(intersects) {
		// let levelObjectIds = this.levels.map((level => {
		// 	return level.object.id
		// }))

		let self = this

		intersects.forEach(intersect => {
			// if (levelObjectIds.includes(intersect.object.id)) {
			intersect.object = self
			// }
		})
	}

	raycast(raycaster, intersects) {

		const levels = this.levels;

		if (levels.length > 0) {

			_v1.setFromMatrixPosition(this.matrixWorld);

			const distance = raycaster.ray.origin.distanceTo(_v1);

			let intersects_ = []

			this.getObjectForDistance(distance).raycast(raycaster, intersects_);

			this._replaceLevelObjectToLODObject(intersects_)


			pushArrs(intersects, intersects_)
		}

	}

	private _addLevelObjects() {
		let self = this

		this.levels.forEach(level => {
			self.add(level.object)
		})
	}

	private _removeLevelObjects() {
		let self = this

		this.levels.forEach(level => {
			self.remove(level.object)
		})
	}

	updateMatrixWorld(force) {
		// this._addLevelObjects()

		// super.updateMatrixWorld(force)

		// this._removeLevelObjects()
	}

	updateWorldMatrix(updateParents, updateChildren) {
		// this._addLevelObjects()

		// this.matrixAutoUpdate = true

		// super.updateWorldMatrix(updateParents, updateChildren)

		// this.matrixAutoUpdate = false

		// this._removeLevelObjects()
	}

	updateWorldMatrix2(updateParents, updateChildren) {
		this._addLevelObjects()

		this.matrixAutoUpdate = true

		super.updateWorldMatrix(updateParents, updateChildren)

		this.matrixAutoUpdate = false

		this._removeLevelObjects()
	}

	private _getDefaultMesh(isDebug) {
		requireCheck(() => {
			test("last level should only has one mesh", () => {
				return this.levels[this.levels.length - 1].object.children.length == 1
			})
			test("last level's distance should be +InFinity", () => {
				return this.levels[this.levels.length - 1].distance == +Infinity
			})
		}, isDebug)

		return this.levels[this.levels.length - 1].object.children[0] as Mesh
	}

	getBoundingBox(state) {
		let geometry = this._getDefaultMesh(getIsDebug(state)).geometry

		if (geometry.boundingBox == null) {
			geometry.computeBoundingBox()
		}

		return getExn(geometry.boundingBox)
	}

	// updateBoundingBox(state) {
	// 	this.worldBoundingBox = this.getBoundingBox(state).clone().applyMatrix4(this.matrixWorld)
	// }

	getLevelMeshs(level: level) {
		return level.object.children
	}

	// update( camera ) {

	// 	const levels = this.levels;

	// 	if ( levels.length > 1 ) {

	// 		_v1.setFromMatrixPosition( camera.matrixWorld );
	// 		_v2.setFromMatrixPosition( this.matrixWorld );

	// 		const distance = _v1.distanceTo( _v2 ) / camera.zoom;

	// 		levels[ 0 ].object.visible = true;

	// 		let i, l;

	// 		for ( i = 1, l = levels.length; i < l; i ++ ) {

	// 			let levelDistance = levels[ i ].distance;

	// 			if ( levels[ i ].object.visible ) {

	// 				levelDistance -= levelDistance * levels[ i ].hysteresis;

	// 			}

	// 			if ( distance >= levelDistance ) {

	// 				levels[ i - 1 ].object.visible = false;
	// 				levels[ i ].object.visible = true;

	// 			} else {

	// 				break;

	// 			}

	// 		}

	// 		this._currentLevel = i - 1;

	// 		for ( ; i < l; i ++ ) {

	// 			levels[ i ].object.visible = false;

	// 		}

	// 	}

	// }

	// toJSON( meta ) {

	// 	const data = super.toJSON( meta );

	// 	if ( this.autoUpdate === false ) data.object.autoUpdate = false;

	// 	data.object.levels = [];

	// 	const levels = this.levels;

	// 	for ( let i = 0, l = levels.length; i < l; i ++ ) {

	// 		const level = levels[ i ];

	// 		data.object.levels.push( {
	// 			object: level.object.uuid,
	// 			distance: level.distance,
	// 			hysteresis: level.hysteresis
	// 		} );

	// 	}

	// 	return data;

	// }

}

export let getLevelMeshs = (level: level) => {
	return level.object.children as Array<Mesh>
}
