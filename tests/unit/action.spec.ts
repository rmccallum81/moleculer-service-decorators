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
        };
        expect(defClass).not.toThrow(TypeError);
        expect(defClass()).toHaveProperty("name", "Test");
    });

    it("should not allow non-sevice classes", () => {
        const defClass = () => {
            class BaseTest {}

            @service()
            class ErrorTest extends BaseTest { }
        };
        expect(defClass).toThrow(TypeError);
    });

    it.only("should allow options", () => {
        const defClass = () => {
            class Base extends Service {}

            @service({name: "Tester"})
            class HelpTest extends Base {
                constructor(broker: ServiceBroker, schema?: ServiceSchema) {
                    super(broker, schema);
                }
                @action()
                public help(@param({ type: "string", min: 2 }) text: string,
                            @param({type: "number", optional: true}) page: number) {}
                @action()
                public test(@string({optional: true}) testParam: string) {}

                @event()
                public "test.started"(payload: any, sender: string, eventName: string) {}

                @event({name: "test.ended", group: "test"})
                public testEnded(payload: any, sender: string, eventName: string) {}
            }
            return new HelpTest(new ServiceBroker());
        };
        expect(defClass).not.toThrow(TypeError);
        const test = defClass();
        expect(test).toHaveProperty("name", "Tester");
        expect(test).toHaveProperty("schema");
        expect(test.schema).toHaveProperty("actions");
    });
});
