import {
    getMetadata,
    setMetadata,
} from "./utils/metadata";
import { getParamNames } from "./utils/parameters";

export interface ParamTypeOptions {
    name?: string;
    optional?: boolean;
}

export interface ParamOptions extends ParamTypeOptions {
    type?: any;
    [key: string]: any;
}

export function param({ name, type, ...options }: ParamOptions): ParameterDecorator {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
        const desc = Object.getOwnPropertyDescriptor(target, propertyKey) || {};
        const actionParams = getMetadata(target, `${propertyKey}Params`) || {};
        let validation;

        let paramName: string;
        if (name) {
            paramName = name;
        } else {
            paramName = getParamNames(desc.value)[parameterIndex];
        }

        if (!paramName) {
            throw new ReferenceError("Parameter name not specified");
        }

        if (type && typeof type === "string") {
            validation = { type, ...options };
        } else {
            validation = type;
        }

        const params = {
            ...actionParams,
            [paramName]: validation,
        };

        setMetadata(target, `${propertyKey}Params`, params);
    };
}

export function context(): ParameterDecorator {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
        const desc = Object.getOwnPropertyDescriptor(target, propertyKey) || {};
        let paramName: string;

        if (name) {
            paramName = name;
        } else {
            paramName = getParamNames(desc.value)[parameterIndex];
        }

        if (!paramName) {
            throw new ReferenceError("Parameter name not specified");
        }

        setMetadata(target, `${propertyKey}Context`, { paramName, index: parameterIndex });
    };
}

export function meta(): ParameterDecorator {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
        const desc = Object.getOwnPropertyDescriptor(target, propertyKey) || {};
        let paramName: string;

        if (name) {
            paramName = name;
        } else {
            paramName = getParamNames(desc.value)[parameterIndex];
        }

        if (!paramName) {
            throw new ReferenceError("Parameter name not specified");
        }

        setMetadata(target, `${propertyKey}Meta`, { paramName, index: parameterIndex });
    };
}

/**
 * Fastest Validator implementation of the `any` type
 * @param options The name of the param and whether it is required
 */
export function any({ optional, name }: ParamTypeOptions) {
    return param({ type: "any", optional, name });
}

export interface ArrayParamOptions extends ParamTypeOptions {
    contains?: any;
    empty?: boolean;
    enum?: any[]; // Should this be limited to `string | number | boolean` primitives?
    length?: number;
    min?: number;
    max?: number;
    items?: ParamOptions | ParamOptions[];
}

/**
 * Fastest Validator implementation of the `array` type
 * @param options
 */
export function array(options?: ArrayParamOptions) {
    return param({ ...options, type: "array" });
}

export interface BooleanParamOptions extends ParamTypeOptions {
    convert?: boolean;
}

/**
 * Fastest Validator implementation of the `boolean` type
 * @param options
 */
export function boolean(options?: BooleanParamOptions) {
    return param({ ...options, type: "boolean" });
}

export interface DateParamOptions extends ParamTypeOptions {
    convert?: boolean;
}

/**
 * Fastest Validator implementation of the `date` type
 * @param options
 */
export function date(options?: DateParamOptions) {
    return param({ ...options, type: "date" });
}

export interface EmailParamOptions extends ParamTypeOptions {
    mode?: "quick" | "precise";
}

/**
 * Fastest Validator implementation of the `email` type
 * @param options
 */
export function email(options?: EmailParamOptions) {
    return param({ ...options, type: "email" });
}

export interface ForbiddenParamOptions {
    name?: string;
}

/**
 * Fastest Validator implementation of the `forbidden` type
 * @param options
 */
export function forbidden() {
    return param({ type: "forbidden" });
}

export interface NumberParamOptions extends ParamTypeOptions {
    min?: number;
    max?: number;
    equal?: number;
    notEqual?: number;
    integer?: boolean;
    positive?: boolean;
    negative?: boolean;
    convert?: boolean;
}

/**
 * Fastest Validator implementation of the `number` type
 * @param options
 */
export function number(options?: NumberParamOptions) {
    return param({ ...options, type: "number" });
}

/**
 * Fastest Validator implementation of the `object` type
 * @param options
 */
export function object({ optional, name }: ParamTypeOptions) {
    return param({ type: "object", optional, name });
}

export interface StringParamOptions extends ParamTypeOptions {
    contains?: string;
    enum?: number[];
    empty?: boolean;
    length?: number;
    pattern?: string | RegExp;
    min?: number;
    max?: number;
}

/**
 * Fastest Validator implementation of the `string` type
 * @param options
 */
export function string(options?: StringParamOptions) {
    return param({ ...options, type: "string" });
}

/**
 * Fastest Validator implementation of the `url` type
 * @param options
 */
export function url({ optional, name }: ParamTypeOptions) {
    return param({ type: "url", optional, name });
}
