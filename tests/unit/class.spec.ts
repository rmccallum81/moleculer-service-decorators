import "jest";

import { Service, ServiceBroker, ServiceSchema } from "moleculer";

// import { action } from "../../src/action";
// import { event } from "../../src/event";
// import { param, string } from "../../src/param";
import { service } from "../../src/service";

// tslint:disable:max-classes-per-file
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
            }
            return new HelpTest(new ServiceBroker({logger: false}));
        };
        expect(defClass).not.toThrow(TypeError);
        const test = defClass();
        expect(test).toHaveProperty("name", "Tester");
    });
});
