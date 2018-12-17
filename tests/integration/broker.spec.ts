import { Cachers, Context, Errors, ServiceBroker } from "moleculer";

import GreeterService from "../services/greeter.service";
import MathService from "../services/math.service";

describe("Test load services", () => {
    let broker: ServiceBroker;

    beforeAll(async (done) => {
        broker = new ServiceBroker({ cacher: "Memory", logger: true });
        broker.createService(GreeterService);

        await broker.start();
        done();
    });

    afterAll(async () => {
        await broker.stop();
    });

    it("should create service from class", async () => {
        expect(broker.getLocalService("greeter", 2)).toBeDefined();
        expect(broker.registry.actions.isAvailable("v2.greeter.hello")).toBe(true);
        const res = await broker.call("v2.greeter.hello");
        expect(res).toEqual("Hello Moleculer");
    });

    it("should give error when param is invalid", async () => {
        const err = broker.call("v2.greeter.welcome", { name: 1 });
        await expect(err).rejects.toBeInstanceOf(Errors.ValidationError);
    });

    it("should give result when param is valid", async () => {
        const err = broker.call("v2.greeter.welcome", { name: "Tests" });
        await expect(err).resolves.toEqual("Welcome, TESTS");
    });

    it("should give result when param is valid", async () => {
        const err = broker.call("v2.greeter.goodbye", { name: "Tests" });
        await expect(err).resolves.toEqual("Goodbye, TESTS");
    });
});

describe.skip("Test local call", () => {

    const broker = new ServiceBroker({ metrics: true });

    const actionHandler = jest.fn((ctx) => ctx);

    broker.createService(MathService);

    it("should return context & call the action handler", () => {
        return broker.call("math.add", {a: 1, b: 1}).then((ctx: Context) => {
            expect(ctx).toBeDefined();
            expect(ctx.broker).toBe(broker);
            expect(ctx.action.name).toBe("posts.find");
            expect(ctx.nodeID).toBe(broker.nodeID);
            expect(ctx.params).toBeDefined();
            expect(actionHandler).toHaveBeenCalledTimes(1);
            expect(actionHandler).toHaveBeenCalledWith(ctx);
        });
    });

    it("should set params to context", () => {
        const params = { a: 1 };
        return broker.call("posts.find", params).then((ctx: Context) => {
            expect(ctx.params).toEqual({ a: 1});
        });
    });
});

describe.skip("Test versioned action registration", () => {

    const broker = new ServiceBroker();

    const findV1 = jest.fn((ctx: Context) => ctx);
    const findV2 = jest.fn((ctx: Context) => ctx);

    broker.createService({
        name: "posts",
        version: 1,

        actions: {
            find: findV1,
        },
    });

    broker.createService({
        name: "posts",
        version: 2,

        actions: {
            find: findV2,
        },
    });

    it("should call the v1 handler", () => {
        return broker.call("v1.posts.find").then(() => {
            expect(findV1).toHaveBeenCalledTimes(1);
        });
    });

    it("should call the v2 handler", () => {
        return broker.call("v2.posts.find").then(() => {
            expect(findV2).toHaveBeenCalledTimes(1);
        });
    });

});

describe.skip("Test cachers", () => {

    const broker = new ServiceBroker({
        cacher: Cachers.Memory,
    });

    const handler = jest.fn(() => "Action result");

    broker.createService({
        actions: {
            get: {
                cache: true,
                handler,
            },

            save(ctx: Context) {
                ctx.emit("cache.clean", {});
            },
        },
        name: "user",
    });

    it("should call action handler because the cache is empty", () => {
        return broker.call("user.get").then((res) => {
            expect(res).toBe("Action result");
            expect(handler).toHaveBeenCalledTimes(1);
        });
    });

    it("should NOT call action handler because the cache is loaded", () => {
        handler.mockClear();

        return broker.call("user.get").then((res) => {
            expect(res).toBe("Action result");
            expect(handler).toHaveBeenCalledTimes(0);
        });
    });

    it("clear the cache with `save` action", () => {
        handler.mockClear();

        return broker.call("user.save").then(() => {
            expect(handler).toHaveBeenCalledTimes(0);
        });
    });

    it("should NOT call action handler because the cache is loaded", () => {
        handler.mockClear();

        return broker.call("user.get").then((res) => {
            expect(res).toBe("Action result");
            expect(handler).toHaveBeenCalledTimes(0);
        });
    });

});
