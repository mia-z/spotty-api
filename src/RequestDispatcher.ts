import { ErrorResponse, AcceptedMethods } from "index";
import { RequestConfig } from "./RequestConfig"; 
import camel from "camelcase-keys";

export class RequestDispatcher {
    token: string;
    //tokenEndpoint: string | null;
    refreshEndpoint: string | null = null;
    refreshToken: string | null = null;

    constructor(token: string, refreshToken?: string, refreshEndpoint?: string) {
        if (!token) {
            throw new Error("No token given to client");
        }

        if (!refreshToken) {
            console.warn("No refresh token given to client - if you attempt to refresh later, it will fail");
        } else {
            this.refreshToken = refreshToken as string;
        }

        if (!refreshEndpoint) {
            console.warn("No refresh endpoint given to client - if you attempt to refresh later, it will fail");
        } else {
            this.refreshEndpoint = refreshEndpoint as string;
        }

        this.token = token;
    }

    async setToken(token: string) {
        this.token = token;
    }

    async setRefreshToken(refreshToken: string) {
        if (!this.refreshToken) {
            throw new Error("No refresh token exists");
        }

        this.refreshToken = refreshToken;
    }

    async getNewToken() {
        if (!this.refreshToken) {
            throw new Error("No refresh token exists");
        }

        const newToken = await fetch(`${this.refreshEndpoint}${this.refreshToken}`);
        if (newToken.status === 200) {
            const { access_token } = await newToken.json();
            this.setToken(access_token);
        }
    }

    async dispatch<T>(method: AcceptedMethods, uri: string): Promise<T | ErrorResponse>;
    async dispatch<T>(method: AcceptedMethods, uri: string, body: any): Promise<T | ErrorResponse>;
    async dispatch<T>(method: AcceptedMethods, uri: string, body?: any): Promise<T | ErrorResponse> {
        try {
            switch (method) {
                case "POST":
                case "PUT": {
                    if (body !== undefined) {
                        const reqConfig = RequestConfig(this.token, method, JSON.stringify(body))
                        const res = await fetch(`https://api.spotify.com/v1${uri}`, reqConfig);
                        const parsed = camel(await res.json()) as T;
                        return parsed;
                    } else {
                        const reqConfig = RequestConfig(this.token, method);
                        const res = await fetch(`https://api.spotify.com/v1${uri}`, reqConfig);
                        const parsed = camel(await res.json()) as T;
                        return parsed;
                    }
                }
                case "GET":
                case "DELETE": {
                    const reqConfig = RequestConfig(this.token, method);
                    const res = await fetch(`https://api.spotify.com/v1${uri}`, reqConfig);
                    const parsed = camel(await res.json()) as T;
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
