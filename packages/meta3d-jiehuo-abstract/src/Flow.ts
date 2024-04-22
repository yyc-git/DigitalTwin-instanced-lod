import { List } from "immutable";
import { getFlowState, setFlowState } from "./state/State";
import { deferExecFuncData, flow, state } from "./type/StateType";
import { reducePromise } from "./utils/ArrayUtils";

export let createState = (): flow => {
	return {
		isStopLoop: false,
		// loopIndex: 0,
		deferExecFuncs: List()
	}
}

export let update = <specificState>(specificState: specificState, [getAbstractStateFunc, setAbstractStateFunc]) => {
	let state = getAbstractStateFunc(specificState)

	return reducePromise<[specificState, List<deferExecFuncData<specificState>>], deferExecFuncData<specificState>>(
		getFlowState(state).deferExecFuncs.toArray(),
		([specificState, result], { func, loopCount }, _) => {
			if (loopCount == 0) {
				return func(specificState).then(specificState => {
					return [specificState, result]
				})
			}

			return new Promise((resolve, reject) => {
				resolve([specificState, result.push({
					func,
					loopCount: loopCount - 1
				})])
			})
		}, [specificState, List()]
	).then(([specificState, deferExecFuncs]) => {
		let state = getAbstractStateFunc(specificState)

		return setAbstractStateFunc(specificState, setFlowState(state, {
			...getFlowState(state),
			deferExecFuncs,
			// loopIndex: getFlowState(state).loopIndex + 1
		}))
	})
}

export let isLoopStart = (state: state) => {
	return !getFlowState(state).isStopLoop
}

export let stopLoop = (state: state) => {
	return setFlowState(state, {
		...getFlowState(state),
		isStopLoop: true
	})
}

export let startLoop = (state: state) => {
	return setFlowState(state, {
		...getFlowState(state),
		isStopLoop: false
	})
}

export let addDeferExecFuncData = (state: state, func, loopCount) => {
	return setFlowState(state, {
		...getFlowState(state),
		deferExecFuncs: getFlowState(state).deferExecFuncs.push({
			func,
			loopCount
		})
	})
}