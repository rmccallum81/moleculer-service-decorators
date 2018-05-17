import { ServiceEvent } from "moleculer";
import { isFunction } from "util";

import {
    getMetadata,
    setMetadata,
} from "./utils/metadata";

/**
 * Options for the event, based off ServiceEvent
 */
export type EventOptions = Partial<Pick<ServiceEvent,
                                Exclude<keyof ServiceEvent,
                                    "handler">>>;
/**
 * Add metod as a service event handler
 * @param {EventOptions} options
 */
export function event(options?: EventOptions): MethodDecorator {
    return <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => {
        const handler = descriptor.value;
        const eventName: string = (options || {}).name || propertyKey.toString();
        if (isFunction(handler)) {
            const opts: EventOptions = { name: propertyKey.toString(), ...options };
            const events = getMetadata(target, "events") || {};

            events[eventName] = {
                handler,
                ...opts,
            };
            setMetadata(target, "events", events);

            return descriptor;
        }
        throw new TypeError("An event handler must be a function/method");
    };
}

/**
 * Available lifecycle events
 */
export type LifeCycleEventNames = "created" | "started" | "stopped";

/**
 * Add method as a lifecycle event handler
 * @param name Name of the lifecycle event
 */
export function lifeCycleEvent(name: LifeCycleEventNames): MethodDecorator {
    if (!name) {
        throw new ReferenceError("Lifecycle event name required");
    }

    return <T>(target: Object, _propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => {
        const handler = descriptor.value;
        if (isFunction(handler)) {
            setMetadata(target, name, handler);

            return descriptor;
        }

        throw new TypeError("A lifecycle event handler must be a function/method");
    };
}

/**
 * Service created event
 */
export function serviceCreated(): MethodDecorator {
    return lifeCycleEvent("created");
}

/**
 * Service started event
 */
export function serviceStarted(): MethodDecorator {
    return lifeCycleEvent("started");
}

/**
 * Service stopped event
 */
export function serviceStopped(): MethodDecorator {
    return lifeCycleEvent("stopped");
}
