import { Service, ServiceBroker } from "moleculer";
import ApiGateway from "moleculer-web";

import {
    action,
    service,
} from "../src/index";

@service({
    mixins: [ApiGateway],
    settings: {
        port: "3000",
        routes: [
            {
                aliases: {
                    "GET test": "Example.test",
                },
            },
        ],
    },
})
class Example extends Service {
    @action()
    public test() {
        return "Hello world!";
    }
}

const broker = new ServiceBroker();
broker.createService(Example);
broker.start();
