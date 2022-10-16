import { AcceptedMethods } from "index";

export function RequestConfig(token: string, method: AcceptedMethods): RequestInit;
export function RequestConfig(token: string, method: AcceptedMethods, body: BodyInit): RequestInit;
export function RequestConfig(token: string, method: AcceptedMethods, body?: BodyInit): RequestInit {
    if (body) {
        return {
            method: method,
            headers: new Headers({
                "Authorization": token,
            }),
            body: body
        }
    } else
        return {
        method: method,
            headers: new Headers({
                "Authorization": token,
            })
    }
}