import { ErrorResponse, AcceptedMethods } from "index";
import { RequestConfig } from "./RequestConfig"; 
import camelcaseKeys from "camelcase-keys";

export class RequestDispatcher {
    token: string;
    //tokenEndpoint: string | null;
    refreshEndpoint: string | null;
    refreshToken: string | null;

    constructor(token: string, refreshToken?: string, refreshEndpoint?: string) {
        if (!token) {
            throw new Error("No token given to client");
        }
        this.token = token;

        this.refreshToken = refreshToken || null;
        this.refreshEndpoint = refreshEndpoint || null;
    }

    setToken(token: string) {
        this.token = token;
    }

    async getNewToken() {
        if (this.refreshToken === null) {
            throw new Error("No refresh token exists");
        }

        const newToken = await fetch(`${this.refreshEndpoint}${this.refreshToken}`);
        if (newToken.status === 200) {
            const { access_token } = await newToken.json();
            this.token = access_token;
        }
    }

    // async dispatch<T>(method: AcceptedMethods, uri: string): Promise<T | ErrorResponse>;
    // async dispatch<T>(method: AcceptedMethods, uri: string, body: any): Promise<T | ErrorResponse>;
    async dispatch<T>(method: AcceptedMethods, uri: string, body?: any): Promise<T | ErrorResponse> {
        try {
            switch (method) {
                case "POST":
                case "PUT": {
                    if (body !== undefined) {
                        const reqConfig = RequestConfig(this.token, method, JSON.stringify(body))
                        const res = await fetch(`https://api.spotify.com/v1${uri}`, reqConfig);
                        const json = await res.json();
                        const parsed = camelcaseKeys(json, { deep: true }) as T;
                        return parsed;
                    } else {
                        const reqConfig = RequestConfig(this.token, method);
                        const res = await fetch(`https://api.spotify.com/v1${uri}`, reqConfig);
                        const json = await res.json();
                        const parsed = camelcaseKeys(json, { deep: true }) as T;
                        return parsed;
                    }
                }
                case "GET":
                case "DELETE": {
                    const reqConfig = RequestConfig(this.token, method);
                    const res = await fetch(`https://api.spotify.com/v1${uri}`, reqConfig);
                    const json = await res.json();
                    const parsed = camelcaseKeys(json, { deep: true }) as T;
                    return parsed;
                }
            }
        } catch (e) {
            return {
                code: 500,
                reason: "Error",
                extra: e
            }
        }
    }
}
