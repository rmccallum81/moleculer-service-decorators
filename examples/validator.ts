import * as Joi from "joi";
import { Service } from "moleculer";

import {
    service,
    param,
    action,
} from "../src/index";

function joiString() {
    return param({ type: Joi.string().max(255).required() });
}

@service()
class Example extends Service {
    @action()
    public help(@joiString() text: string) {}
}
