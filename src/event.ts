import { ServiceEvent } from "moleculer";
import { isFunction } from "util";

import {
    getMetadata,
    setMetadata,
} from "./utils/metadata";

export interface EventOptions {
    name?: ServiceEvent["name"];
    group?: ServiceEvent["group"];
}

export function event(options?: EventOptions): MethodDecorator {
    return <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => {
        const handler = descriptor.value;
        const eventName: string = (options || {}).name || propertyKey.toString();
        if (handler && isFunction(handler)) {
            const opts: EventOptions = { name: propertyKey.toString(), ...options };
            const events = getMetadata(target, "events") || {};

            events[eventName] = {
                handler,
                ...opts,
            };
            setMetadata(target, "events", events);

            return descriptor;
        } else {
            throw new TypeError("An event handler must be a function/method");
        }
    };
}
