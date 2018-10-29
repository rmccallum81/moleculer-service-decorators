import "jest";

import { Service, ServiceBroker, ServiceSchema } from "moleculer";

import { action } from "../../src/action";
import { event } from "../../src/event";
import { param, string } from "../../src/param";
import { service } from "../../src/service";

// tslint:disable:max-classes-per-file
// tslint:disable:no-empty
describe("Class decorator", () => {
    it("should pass", () => {
        const defClass = () => {
            @service()
            class Test extends Service { }
            return Test;
        };
        expect(defClass).not.toThrow(TypeError);
    });

    it("should not allow non-sevice classes", () => {
        const defClass = () => {
            class BaseTest {}

            // @ts-ignore
            @service()
            class ErrorTest extends BaseTest { }

            return ErrorTest;
        };
        expect(defClass).toThrow(TypeError);
    });

    it("should allow options", () => {
        const defClass = () => {
            class Base extends Service {}

            @service({name: "Tester"})
            class HelpTest extends Base {
                constructor(broker: ServiceBroker, schema?: ServiceSchema) {
                    super(broker, schema);
                }
                @action()
                public help(@param({ type: "string", min: 2 }) _text: string,
                            @param({type: "number", optional: true}) _page: number) {}
                @action()
                public test(@string({optional: true}) _testParam: string) {}

                @event()
                public "test.started"(_payload: any, _sender: string, _eventName: string) {}

                @event({name: "test.ended", group: "test"})
                public testEnded(_payload: any, _sender: string, _eventName: string) {}
            }
            return new HelpTest(new ServiceBroker({logger: false}));
        };
        expect(defClass).not.toThrow(TypeError);
        const test = defClass();
        expect(test).toHaveProperty("name", "Tester");
        expect(test).toHaveProperty("schema");
        expect(test.schema).toHaveProperty("actions");
    });
});
