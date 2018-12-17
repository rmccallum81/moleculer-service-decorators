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
            const keyName: string = propertyKey.toString();
            const opts: ActionOptions = { name: keyName, ...options };
            const actions = getMetadata(target, "actions") || {};
            const params = getMetadata(target, `${keyName}Params`);
            const contextParam = getMetadata(target, `${keyName}Context`);
            const metaParam = getMetadata(target, `${keyName}Meta`);
            if (!(opts.params || !params)) {
                descriptor.value = ((ctx: Context) => {
                    const args = getParamNames(func).map((param) => {
                        return ctx.params[param];
                    });

                    if (contextParam) {
                        args.splice(contextParam.index, 0, ctx);
                    }

                    if (metaParam) {
                        args.splice(metaParam.index, 0, ctx.meta);
                    }

                    return (func as Function).call(ctx.service, ...args);
                }) as any;
            }
            const handler = descriptor.value;

            if (params) {
                opts.params = params;
            }

            actions[propertyKey] = {
                handler,
                ...opts,
            };
            setMetadata(target, "actions", actions);
            removeMetadata(target, `${keyName}Params`);

            return descriptor;
        } else {
            throw new TypeError("An action must be a function/method");
        }
    };
}
