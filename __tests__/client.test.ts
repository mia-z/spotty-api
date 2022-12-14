import { describe, expect, it, beforeEach, afterEach, vi, Mock } from "vitest";
import { RequestConfig } from "../src/RequestConfig"; 
import SpotifyClient from "../src/Client";
import { RequestDispatcher } from "../src/RequestDispatcher";
import checkCamelcase from "check-camelcase";
import camelcaseKeys from "camelcase-keys";

describe("Client", () => {
    const prepareNewTokenFetchMock = () => {
        global.fetch = vi.fn(() => 
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve({ access_token: "updated_token" }),
            })
        ) as Mock;
    }

    let client: SpotifyClient;

    beforeEach(() => {
        client = new SpotifyClient("test_token");
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it("will successfully be instantiated when given a token", () => {
        expect(client.token).not.toBeNull();
        expect(client.token).toEqual("test_token");
    });

    it("will throw if a token is not given in the constructor", () => {
        expect(() => {
            new SpotifyClient("");
        }).toThrow("No token given to client");
    });

    it("will update the token if given a new one", () => {
        expect(client.token).toEqual("test_token");

        client.setToken("new_token");
        expect(client.token).toEqual("new_token");
    });

    it("will fetch and apply a new token", async () => {
        prepareNewTokenFetchMock();
        const innerClient = new SpotifyClient("test_token", "refresh_token", "mock_endpoint");
        expect(innerClient.token).toEqual("test_token");
        await innerClient.getNewToken();
        expect(innerClient.token).toEqual("updated_token");
    });

    it("will throw if trying to get a new token if a refresh token wasnt given", () => {
        prepareNewTokenFetchMock();

        expect(async () => {
            await client.getNewToken();
        }).rejects.toThrow("No refresh token exist");
    });

    it("will add correct headers to GET endpoints", () => {
        const config = RequestConfig("new_token", "GET");
        const headers = config.headers as Record<string, string>;
        expect(headers).toHaveProperty("Authorization", "Bearer new_token");
        expect(headers).toHaveProperty("Content-Type", "application/json");
    });

    it("will add correct headers to POST endpoints", () => {
        const config = RequestConfig("new_token", "POST", "body");
        const headers = config.headers as Record<string, string>;
        expect(headers).toHaveProperty("Authorization", "Bearer new_token");
        expect(headers).toHaveProperty("Content-Type", "application/json");
    });

    it("will add correct headers to PUT endpoints", () => {
        const config = RequestConfig("new_token", "PUT", "body");
        const headers = config.headers as Record<string, string>;
        expect(headers).toHaveProperty("Authorization", "Bearer new_token");
        expect(headers).toHaveProperty("Content-Type", "application/json");
    });

    it("will add correct headers to DELETE endpoints", () => {
        const config = RequestConfig("new_token", "DELETE");
        const headers = config.headers as Record<string, string>;
        expect(headers).toHaveProperty("Authorization", "Bearer new_token");
        expect(headers).toHaveProperty("Content-Type", "application/json");
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

    it("will transform the keys of the response object to camel-case for GET requests", async () => {
        global.fetch = vi.fn(() => 
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve({ snake_case_key: "a value" }),
            })
        ) as Mock;

        const dispatcher = new RequestDispatcher("new_token");
        let res = await dispatcher.dispatch<string>("GET", "endpoint");

        for (let key of Object.keys(res)) {
            expect(checkCamelcase(key)).toBeTruthy();
        }
    });

    it("will transform the keys of the response object to camel-case for PUT requests without a body", async () => {
        global.fetch = vi.fn(() => 
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve({ snake_case_key: "a value" }),
            })
        ) as Mock;

        const dispatcher = new RequestDispatcher("new_token");
        let res = await dispatcher.dispatch<string>("PUT", "endpoint");

        for (let key of Object.keys(res)) {
            expect(checkCamelcase(key)).toBeTruthy();
        }
    });

    it("will transform the keys of the response object to camel-case for POST requests without a body", async () => {
        global.fetch = vi.fn(() => 
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve({ snake_case_key: "a value" }),
            })
        ) as Mock;

        const dispatcher = new RequestDispatcher("new_token");
        let res = await dispatcher.dispatch<string>("POST", "endpoint");

        for (let key of Object.keys(res)) {
            expect(checkCamelcase(key)).toBeTruthy();
        }
    });

    it("will transform the keys of the response object to camel-case for PUT requests with a body", async () => {
        global.fetch = vi.fn(() => 
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve({ snake_case_key: "a value" }),
            })
        ) as Mock;

        const dispatcher = new RequestDispatcher("new_token");
        let res = await dispatcher.dispatch<string>("PUT", "endpoint", { key: "value" });

        for (let key of Object.keys(res)) {
            expect(checkCamelcase(key)).toBeTruthy();
        }
    });

    it("will transform the keys of the response object to camel-case for POST requests with a body", async () => {
        global.fetch = vi.fn(() => 
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve({ snake_case_key: "a value" }),
            })
        ) as Mock;

        const dispatcher = new RequestDispatcher("new_token");
        let res = await dispatcher.dispatch<string>("POST", "endpoint", { key: "value" });

        for (let key of Object.keys(res)) {
            expect(checkCamelcase(key)).toBeTruthy();
        }
    });
});