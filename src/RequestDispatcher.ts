import axios, { AxiosInstance } from "axios";
import { ErrorResponse, AcceptedMethods } from "index";
import camel from "camelcase-keys";

export class RequestDispatcher {
    token: string;
    //tokenEndpoint: string | null;
    refreshEndpoint: string | null = null;
    refreshToken: string | null = null;

    private instance: AxiosInstance;

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
        this.instance = axios.create({
            baseURL: "https://api.spotify.com/v1",
            headers: {
                "Authorization": `Bearer ${this.token}`
            }
        });
    }

    async setToken(token: string) {
        this.token = token;
        this.instance = axios.create({
            headers: {
                "Authorization": `Bearer ${this.token}`
            }
        });
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
                    const post = await this.instance.post<T>(`https://api.spotify.com/v1${uri}`, JSON.stringify(body));
                    return post.data;
                case "PUT": 
                    const put = await this.instance.put<T>(`https://api.spotify.com/v1${uri}`, JSON.stringify(body));
                    return put.data;
                case "GET":
                    const get = await this.instance.get<T>(`https://api.spotify.com/v1${uri}`);
                    return get.data;
                case "DELETE": 
                    const del = await this.instance.delete<T>(`https://api.spotify.com/v1${uri}`);
                    return del.data;
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
