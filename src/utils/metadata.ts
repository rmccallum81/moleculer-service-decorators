/**
 * Abstract the calls incase the Reflect library changes or a different one is better
 */
import "reflect-metadata";

import { META_PREFIX } from "../constants";

function prefixKey(key: string) {
    if (typeof key === "string" && key.startsWith(META_PREFIX) === false) {
        return `${META_PREFIX}${key}`;
    }

    return key;
}

export function getMetadataKeys(target: any) {
    const keys = Reflect.getMetadataKeys(target) || [];
    return keys.filter((key: string) => key.toString().startsWith(META_PREFIX));
}

export function getMetadata(target: any, key: string) {
    const prefixedKey = prefixKey(key);
    const data = Reflect.getMetadata(prefixedKey, target);
    return data;
}

export function removeMetadata(target: any, key: string) {
    const prefixedKey = prefixKey(key);
    return Reflect.deleteMetadata(prefixedKey, target);
}

export function setMetadata(target: any, key: string, value: any) {
    const prefixedKey = prefixKey(key);
    Reflect.defineMetadata(prefixedKey, value, target);
}
