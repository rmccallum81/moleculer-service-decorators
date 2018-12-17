import { Context, Service } from "moleculer";

import {
    action,
    event,
    service,
    serviceCreated,
    serviceStarted,
    serviceStopped,
    string,
} from "../../src/index";

@service({
    meta: {
        scalable: true,
    },

    name: "greeter",
    settings: {
        upperCase: true,
    },
    version: 2,
})
class GreeterService extends Service {
    // Action handler
    @action()
    public hello() {
        return "Hello Moleculer";
    }

    // Action handler
    @action({
        cache: {
            keys: ["name"],
        },
        params: {
            name: "string",
        },
    })
    public welcome(ctx: Context) {
        return this.sayWelcome(ctx.params.name);
    }

    // Action handler
    @action({
        cache: {
            keys: ["name"],
        },
        params: {
            name: { type: "string" },
            type: { type: "enum", values: ["test", "value"]},
        },
    })
    public goodday(ctx: Context) {
        return this.sayWelcome(ctx.params.name);
    }

    @action()
    public goodbye(@string() name: string) {
        return `Goodbye, ${this.settings.upperCase ? name.toUpperCase() : name}`;
    }

    // Event handler
    @event({name: "user.created"})
    public userCreated(user: object) {
        this.broker.call("mail.send", { user });
    }

    @serviceCreated()
    public serviceCreated() {
        this.logger.info("ES6 Service created.");
    }

    @serviceStarted()
    public serviceStarted() {
        this.logger.info("ES6 Service started.");
    }

    @serviceStopped()
    public serviceStopped() {
        this.logger.info("ES6 Service stopped.");
    }

    // Private method
    private sayWelcome(name: string) {
        this.logger.info("Say hello to", name);
        return `Welcome, ${this.settings.upperCase ? name.toUpperCase() : name}`;
    }
}

export default GreeterService;
