import { describe, expect, it, beforeEach, vi, Mock } from "vitest";
import { RequestConfig } from "../src/RequestConfig"; 
import SpotifyClient from "../src/Client";
import { RequestDispatcher } from "../src/RequestDispatcher";

describe("Client", () => {
    const prepareNewTokenFetchMock = () => {
        global.fetch = vi.fn(() => 
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve({ access_token: "updated_token" }),
            })
        ) as Mock;
    }

    const prepareDispatchFetchMock = (status: number) => {
        global.fetch = vi.fn(() => 
            Promise.resolve({
                status: status,
                json: () => Promise.resolve({ key_name: "value" }),
            })
        ) as Mock;
    }

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("will successfully be instantiated when given a token", () => {
        const client = new SpotifyClient("test_token");
        expect(client.token).not.toBeNull();
        expect(client.token).toEqual("test_token");
    });

    it("will throw if a token is not given in the constructor", () => {
        expect(() => {
            const client = new SpotifyClient("");
        }).toThrow("No token given to client");
    });

    it("will update the token if given a new one", () => {
        const client = new SpotifyClient("test_token");
        expect(client.token).toEqual("test_token");

        client.setToken("new_token");
        expect(client.token).toEqual("new_token");
    });

    it("will fetch and apply a new token", async () => {
        prepareNewTokenFetchMock();
        const client = new SpotifyClient("test_token", "refresh_token", "mock_endpoint");
        expect(client.token).toEqual("test_token");
        await client.getNewToken();
        expect(client.token).toEqual("updated_token");
    });

    it("will throw if trying to get a new token if a refresh token wasnt given", () => {
        prepareNewTokenFetchMock();

        const client = new SpotifyClient("test_token");
        expect(async () => {
            await client.getNewToken();
        }).rejects.toThrow("No refresh token exist");
    });

    it("will add bearer token to the Authorization header to GET endpoints", () => {
        const config = RequestConfig("new_token", "GET");
        const headers = config.headers as Record<string, string>;
        expect(headers).toHaveProperty("Authorization", "Bearer new_token");
    });

    it("will add bearer token to the Authorization header to POST endpoints", () => {
        const config = RequestConfig("new_token", "POST", "body");
        const headers = config.headers as Record<string, string>;
        expect(headers).toHaveProperty("Authorization", "Bearer new_token");
    });

    it("will add bearer token to the Authorization header to PUT endpoints", () => {
        const config = RequestConfig("new_token", "PUT", "body");
        const headers = config.headers as Record<string, string>;
        expect(headers).toHaveProperty("Authorization", "Bearer new_token");
    });

    it("will add bearer token to the Authorization header to DELETE endpoints", () => {
        const config = RequestConfig("new_token", "DELETE");
        const headers = config.headers as Record<string, string>;
        expect(headers).toHaveProperty("Authorization", "Bearer new_token");
    });

    it("will add a body to the request if the method is POST and a body is provided", () => {
        const body = JSON.stringify({ key: "value" });
        const config = RequestConfig("new_token", "POST", body);
        expect(config.body).toEqual(body);
    });

    it("will add a body to the request if the method is PUT and a body is provided", () => {
        const body = JSON.stringify({ key: "value" });
        const config = RequestConfig("new_token", "PUT", body);
        expect(config.body).toEqual(body);
    });

    it("will return an error object if the response status is 500", async () => {
        global.fetch = vi.fn(() => 
            Promise.resolve({
                json: () => { throw new Error() },
            })
        ) as Mock;
        const dispatcher = new RequestDispatcher("new_token");
        let res = await dispatcher.dispatch<string>("GET", "endpoint");

        expect(res).toContain({ code: 500 });
        expect(res).toContain({ reason: "Error" });
    });
});