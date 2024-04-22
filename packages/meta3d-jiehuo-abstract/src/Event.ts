import { getEventState, setEventState } from "./state/State"
import { customEvent, event, eventName, handler, state } from "./type/StateType"
import { Map, List } from "immutable"
import { getExn, getWithDefault, isNullable, map } from "./utils/NullableUtils"
import { reducePromise } from "./utils/ArrayUtils"
import { getCanvas } from "./Render"
import { nullable } from "./utils/nullable"
import { isMobile } from "./Device"
import { fromEvent, fromPromise, of, since, tap } from "most"

export let createState = (): event => {
    return {
        handlers: Map()
    }
}

export let on = <specficState>(state: state, name: eventName, handler: handler<specficState>) => {
    return setEventState(state, {
        ...getEventState(state),
        handlers: getEventState(state).handlers.set(name,
            getWithDefault(
                map(
                    handlers => {
                        return handlers.push(handler)
                    },
                    getEventState(state).handlers.get(name)
                ),
                List([handler])
            )
        )
    })
}

export let off = <specficState>(state: state, name: eventName, handler: handler<specficState>) => {
    return setEventState(state, {
        ...getEventState(state),
        handlers: getEventState(state).handlers.set(name,
            getWithDefault(
                map(
                    handlers => {
                        return handlers.filter(value => value !== handler)
                    },
                    getEventState(state).handlers.get(name)
                ),
                List()
            )
        )
    })
}

export let trigger = <specificState>(state: specificState, getAbstractStateFunc, name: eventName, userData): Promise<specificState> => {
    return getWithDefault(
        map(
            handlers => {
                return reducePromise<specificState, handler<specificState>>(handlers.toArray(), (state, handler) => {
                    return handler(state, {
                        name,
                        userData
                    })
                }, state)
            },
            getEventState(getAbstractStateFunc(state)).handlers.get(name)
        ),
        new Promise<specificState>((resolve, reject) => {
            resolve(state)
        })
    )
}

export let getPointerDownEventName = () => "meta3d_pointerdown"

export let getPointerTapEventName = () => "meta3d_pointertap"

export let getKeyDownEventName = () => "meta3d_keydown"

export let getKeyUpEventName = () => "meta3d_keyup"

export let getSingleClickEventName = () => "meta3d_singleclick"

export let getDoubleClickEventName = () => "meta3d_doubleclick"

let _onPointerDown = (event) => {
    globalThis[getPointerDownEventName()] = event
}

let _onPointerTap = (event) => {
    globalThis[getPointerTapEventName()] = event
}

// let _onDoubleClick = (event) => {
//     globalThis[getDoubleClickEventName()] = event
// }

let _onSingleClick = (event) => {
    globalThis[getSingleClickEventName()] = event
}

let _onKeyDown = (event) => {
    globalThis[getKeyDownEventName()] = event
}

let _onKeyUp = (event) => {
    globalThis[getKeyUpEventName()] = event
}

let _buildEventStream = (eventName: string, target: Document | HTMLElement) => {
    if (isMobile()) {
        return fromEvent(eventName, target, { "passive": false } as any)
    }

    return fromEvent(eventName, target, false)
}

let _buildClickStream = (canvas) => {
    if (isMobile()) {
        return since(_buildEventStream("touchstart", canvas), _buildEventStream("touchend", canvas))
    }
    else {
        return _buildEventStream("click", canvas)
    }
}

let _bindAllDomEventsForConvertDomEventToCustomEvent = (canvas) => {
    let stream = _buildEventStream("pointerdown", canvas).tap(_onPointerDown)

    if (isMobile()) {
        stream = stream.merge(
            _buildClickStream(canvas).tap(_onPointerTap)
        )
    }
    else {
        stream = stream.merge(
            _buildClickStream(canvas).tap(_onPointerTap),
            _buildEventStream("keydown", document).tap(_onKeyDown),
            _buildEventStream("keyup", document).tap(_onKeyUp),
        )
    }



    // // stream = stream.merge(
    // //     // clickStream.during(clickStream.debounce(250)).filter()
    // //     // fromPromise(clickStream.until(clickStream.delay(250)).reduce((count, _) => {
    // //     fromPromise(_buildEventStream("click", canvas).until(_buildEventStream("click", canvas).delay(250)).reduce((count, _) => {
    // //         return count += 1
    // //     }, 0)).tap((clickCount: number) => {
    // //         if (clickCount == 2) {
    // //             _onDoubleClick(new Event(null))
    // //         }
    // //     }).map(_ => {
    // //         return new Event(null)
    // //     })
    // // )

    // // After the first click, log mouse move events for 1 second.
    // // Note that DOM event handlers will automatically be unregistered.
    // const start = _buildClickStream(canvas)
    // const end = of(null).delay(250);

    // // Map the first click to a stream containing a 1 second delay
    // // The click represents the window start time, after which
    // // the window will be open for 1 second.
    // const timeWindow = start.constant(end);
    // // const timeWindow = _buildClickStream(canvas).debounce(250)

    // // fromEvent('mousemove', document)
    // //     .during(timeWindow)
    // //     .forEach(mouseEvent => console.log(mouseEvent));

    // stream = stream.merge(
    //     // clickStream.during(clickStream.debounce(250)).filter()
    //     // fromPromise(clickStream.until(clickStream.delay(250))


    //     fromPromise(_buildClickStream(canvas).during(timeWindow)
    //         .reduce((count, _) => {
    //             return count += 1
    //         }, 0)).tap((clickCount: number) => {
    //             if (clickCount == 2) {
    //                 _onDoubleClick(new Event(null))
    //             }
    //         }).map(_ => {
    //             return new Event(null)
    //         })
    // )


    let _ = stream.drain()
}

let _trigger = (state, getAbstractStateFunc, eventName) => {
    if (!isNullable(globalThis[eventName])) {
        return trigger(state, getAbstractStateFunc, eventName, globalThis[eventName]).then(state => {
            globalThis[eventName] = null

            return state
        })
    }

    return Promise.resolve(state)
}

let _triggerForConvertDomEventToCustomEvent = (state, getAbstractStateFunc) => {
    return _trigger(state, getAbstractStateFunc, getPointerDownEventName()).then(state => {
        return _trigger(state, getAbstractStateFunc, getPointerTapEventName())
    }).then(state => {
        return _trigger(state, getAbstractStateFunc, getSingleClickEventName())
    }).then(state => {
        return _trigger(state, getAbstractStateFunc, getKeyDownEventName())
    }).then(state => {
        return _trigger(state, getAbstractStateFunc, getKeyUpEventName())
    })
}

let _bindDoubleClickEvent = (state, getAbstractStateFunc) => {
    let clickid = 1;
    let timer, startTime

    return on(state, getPointerTapEventName(), (specficState, customEvent) => {
        let event = getExn(customEvent.userData)

        if (clickid == 1) {
            startTime = new Date().getTime();
            clickid++;
            timer = setTimeout(function () {
                // 单击事件触发

                clickid = 1;

                // return trigger(specficState, getAbstractStateFunc, getSingleClickEventName(), getExn(customEvent.userData))

                _onSingleClick(event)
            }, 200)
        }

        if (clickid == 2) {
            clickid++;
        } else {
            let endTime = new Date().getTime();
            // if ((endTime - startTime) < 300) {
            //     clickid = 1;
            //     clearTimeout(timer);


            //     return trigger(specficState, getAbstractStateFunc, getDoubleClickEventName(), customEvent)
            // }
            clickid = 1;
            clearTimeout(timer);


            return trigger(specficState, getAbstractStateFunc, getDoubleClickEventName(), event)
        }

        return Promise.resolve(specficState)
    })
}

export let init = (state: state, getAbstractStateFunc) => {
    _bindAllDomEventsForConvertDomEventToCustomEvent(getCanvas(state))

    state = _bindDoubleClickEvent(state, getAbstractStateFunc)

    return Promise.resolve(state)
}

export let update = <specificState>(state: specificState, getAbstractStateFunc) => {
    return _triggerForConvertDomEventToCustomEvent(state, getAbstractStateFunc)
}

export let getPageData = (event: Event) => {
    if (event instanceof PointerEvent) {
        return [event.pageX, event.pageY]
    }
    else if (event instanceof TouchEvent) {
        return [event.changedTouches[0].pageX, event.changedTouches[0].pageY]
    }

    let mouseEvent = event as MouseEvent

    return [mouseEvent.pageX, mouseEvent.pageY]
}