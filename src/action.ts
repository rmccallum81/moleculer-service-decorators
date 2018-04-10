import { Action, Context } from "moleculer";
import { isFunction } from "util";

import {
    getMetadata,
    removeMetadata,
    setMetadata,
} from "./utils/metadata";
import { getParamNames } from "./utils/parameters";

export interface ActionOptions {
    name?: Action["name"];
    cache?: Action["cache"];
    metrics?: Action["metrics"];
    params?: Action["params"];
}

export function action(options?: ActionOptions): MethodDecorator {
    return <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => {
        const func: any = descriptor.value;
        if (func && isFunction(func)) {
            const opts: ActionOptions = { name: propertyKey.toString(), ...options };
            const actions = getMetadata(target, "actions") || {};
            const params = getMetadata(target, `${propertyKey}Params`);
            const contextParam = getMetadata(target, `${propertyKey}Context`);
            const handler = opts.params || !params ? func : (ctx: Context) => {
                const args = getParamNames(func).map((param) => {
                    return ctx.params[param];
                });

                if (contextParam) {
                    args.splice(contextParam.index, 0, [ctx]);
                }

                return (func as Function).call(target, ...args);
            };

            actions[propertyKey] = {
                handler,
                ...opts,
                params,
            };
            setMetadata(target, "actions", actions);
            removeMetadata(target, `${propertyKey}Params`);

            return descriptor;
        } else {
            throw new TypeError("An action must be a function/method");
        }
    };
}
