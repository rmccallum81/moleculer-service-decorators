import {
    Service,
    ServiceSchema,
} from "moleculer";

import { META_PREFIX } from "./constants";

import { DecoratorError } from "./error";
import {
    getMetadata,
    getMetadataKeys,
    removeMetadata,
} from "./utils/metadata";

/**
 * Type guard to ensure a constructor is an extended Moleculer Service
 * @param constructor The constructor to check
 */
export function isServiceClass(constructor: any): constructor is ServiceConstructor {
    return typeof constructor === "function" && Service.isPrototypeOf(constructor);
}

/**
 * Get all the metadata from the class and add it to a schema ouput
 * @param constructor The class constructor on which to find the metadata
 */
export function getClassMetadata(constructor: ServiceConstructor): Partial<ServiceSchema> {
    const keys = getMetadataKeys(constructor);
    const schemaKeys: Partial<ServiceSchema & {[k: string]: any}> = {};

    keys.forEach((key) => {
        if (typeof key === "string" && key.startsWith(META_PREFIX)) {
            const desc = getMetadata(constructor, key);
            schemaKeys[key.replace(new RegExp(`^${META_PREFIX}`), "")] = desc;
            removeMetadata(constructor, key);
        }
    });

    return schemaKeys;
}

/**
 * These options should be set in the class itself instead of the options
 */
export type ServiceOptionsToExclude = "actions" |
                                      "events" |
                                      "methods" |
                                      "created" |
                                      "started" |
                                      "stopped";

export type ServiceOptions = Partial<Pick<ServiceSchema,
                                  Exclude<keyof ServiceSchema,
                                        ServiceOptionsToExclude>>>;

export interface ServiceConstructor { new(...args: any[]): Service; }

export type ServiceDecorator = <T extends ServiceConstructor>(constructor: T) => T;

/**
 * Add all handlers to the schema for the service
 * @param options
 */
export function service(options: ServiceOptions = {}): ServiceDecorator {
    return <T extends ServiceConstructor>(constructor: T) => {
        if (isServiceClass(constructor)) {
            let schema: ServiceSchema = {
                name: options.name || constructor.name,
            };

            if (options.settings) {
                schema.settings = options.settings;
            }

            try {
                const keys = getClassMetadata(constructor.prototype);
                schema = { ...schema, ...keys };
            } catch (ex) {
                throw new DecoratorError("An error occured creating the service schema", ex);
            }

            return class extends constructor {
                constructor(...args: any[]) {
                    super(...args);
                    this.parseServiceSchema(schema);
                }
            };
        }
        throw TypeError("Class must extend Service");
    };
}
