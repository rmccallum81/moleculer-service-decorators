import { Context, Service } from "moleculer";

import { action, number, service } from "../../src";

@service({ name: "math" })
export class MathService extends Service {
    @action()
    public add(@number() a: number, @number() b: number) {
        return Number(a) + Number(b);
    }

    @action()
    public sub(@number() a: number, @number() b: number) {
        return Number(a) - Number(b);
    }

    @action({
        params: {
            a: { type: "number" },
            b: { type: "number" },
        },
    })
    public mult(ctx: Context) {
        return Number(ctx.params.a) * Number(ctx.params.b);
    }

    @action()
    public div(@number() a: number, @number() b: number) {
        const c = Number(a);
        const d = Number(b);
        if (d !== 0) {
            return c / d;
        } else {
            throw new Error("Divide by zero!");
        }
    }
}

export default MathService;
