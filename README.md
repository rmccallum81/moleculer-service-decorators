![Moleculer logo](https://raw.githubusercontent.com/ice-services/moleculer/HEAD/docs/assets/logo.png)

# Moleculer Service Decorators
[![Powered by moleculer](https://img.shields.io/badge/Powered%20by-Moleculer-green.svg?colorB=0e83cd)](http://moleculer.services/)
[![npm](https://img.shields.io/npm/v/moleculer-service-decorators.svg)](https://www.npmjs.com/package/moleculer-service-decorators)

ES7/Typescript Decorators for [Moleculer](https://github.com/moleculerjs/moleculer)

Example
```ts
import { Service } from "moleculer";
import {
    action,
    event,
    param,
    service,
    string
} from "moleculer-service-decorators";

@service()
class Example extends Service {
    @action()
    public help(@param({ type: "string" }) text: string,
                @param({ type: "number", optional: true }) page: number) {}
    @action()
    public test(@string({ optional: true }) test: string) {}

    @event()
    public "test.started"(payload: any, sender: string, eventName: string) {}

    @event({ name: "test.ended", group: "test" })
    public testEnded(payload: any, sender: string, eventName: string) {}
}
```
## Service
The `Service` class must be used as the base of any decorated service. Most options can be added either by defining them in the class itself or by adding them to the decorator options.
```js
@service()
class Example extends Service {
    version = 1;
    settings = {};
    metadata = {
        test: "This is a test"
    };
    mixins = [];
}

class Base extends Service {}

@service({
    name: "Tester",
    version: 1,
    settings: {},
    metadata: {
        test: "This is a test"
    },
    mixins: []
})
class Example2 extends Base {
}
```

## Parameters
Param decorators for [Fastest Validator](https://github.com/icebob/fastest-validator) are provided and creating custom param decorators is easy.

> This example assumes using the [Joi Validator example](https://gist.github.com/icebob/07024c0ac22589a5496473c2a8a91146)
```ts
import * as Joi from "joi";
import { Service } from "moleculer";

import {
    action,
    param,
    service
} from "moleculer-service-decorators";

function joiString() {
    return param(Joi.string().max(255).required());
}

@service()
class Example extends Service {
    @action()
    public help(@joiString() text: string) {}
}
```

## Actions
Actions can have options set in the same format as the `ServiceSchema`. The handler can be defined with the parameters of the context or you can set the parameters in the action options and use a `Context` as the only parameter to the handler.
```ts
@service()
class Example extends Service {
    @action({
        name: "getHelp",
        cache: true,
        metrics: { params: false, meta: true }
    })
    public help(@string() text: string) {}
}

@service()
class Example2 extends Service {
    @action({
        name: "getHelp",
        cache: true,
        metrics: { params: false, meta: true },
        params: {
            text: "string"
        }
    })
    public help(ctx: Context) {}
}
```

## Events
Event handlers are added easily with options available to make it more flexible.
```ts
@service()
class Example extends Service {
    @event()
    public "test.started"(payload: any, sender: string, eventName: string) {}

    @event({ name: "test.ended", group: "test" })
    public testEnded(payload: any, sender: string, eventName: string) {}
}
```

# License
Moleculer Service Decorators is available under the [MIT license](https://tldrlegal.com/license/mit-license).
