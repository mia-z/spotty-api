import { AcceptedMethods } from "index";

export function RequestConfig(token: string, method: AcceptedMethods, body?: BodyInit): RequestInit {
    if (body) {
        return {
            method: method,
            headers: {
                "Authorization": "Bearer " + token,
            },
            body: body
        }
    } else
        return {
        method: method,
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
    }
}