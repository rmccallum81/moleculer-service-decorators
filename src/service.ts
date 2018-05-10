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

        // tslint:disable:no-console

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
    const schemaKeys: Partial<ServiceSchema> = {};

    keys.forEach((key) => {
        if (typeof key === "string" && key.startsWith(META_PREFIX)) {
            const desc = getMetadata(constructor, key);
            schemaKeys[key.replace(new RegExp(`^${META_PREFIX}`), "")] = desc;
            removeMetadata(constructor, key);
        }
    });

    return schemaKeys;
}

export interface ServiceOptions {
    name?: ServiceSchema["name"];
    version?: ServiceSchema["version"];
    settings?: ServiceSchema["settings"];
    metadata?: ServiceSchema["metadata"];
    dependencies?: ServiceSchema["dependencies"];
    mixins?: ServiceSchema["mixins"];
}

export interface ServiceConstructor { new(...args: any[]): Service; }

export type ServiceDecorator = <T extends ServiceConstructor>(constructor: T) => T;

export function service(options: ServiceOptions = {}): ServiceDecorator {
    return <T extends ServiceConstructor>(constructor: T) => {
        if (isServiceClass(constructor)) {
            const schema: ServiceSchema = {
                name: options.name || constructor.name,
            };

            if (options.settings) {
                schema.settings = options.settings;
            }

            try {
                const keys = getClassMetadata(constructor.prototype);
                Object.assign(schema, keys);
            } catch (ex) {
                throw new DecoratorError("An arror occured creating the service schema", ex);
            }

            // console.log("schema", schema);

            return class extends constructor {
                constructor(...args: any[]) {
                    super(...args);
                    this.parseServiceSchema(schema);
                    // console.log(this.name);
                }
            };
        }
        throw TypeError("Class must extend Service");
    };
}
