import { describe, expect, it, beforeEach, vi } from "vitest";
import { Album, IAlbumEndpoints, SpotifyResponse } from 'index';
import SpotifyClient from "../src/Client";

describe("Client", () => {
    beforeEach(() => {
        global.fetch = vi.fn(() => 
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve({ access_token: "updated_token" }),
            })
        ) as jest.Mock;
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
        const client = new SpotifyClient("test_token", "refresh_token", "mock_endpoint");
        expect(client.token).toEqual("test_token");

        await client.getNewToken();
        expect(client.token).toEqual("updated_token");
    });

    it("will throw if trying to get a new token if a refresh token wasnt given", () => {
        const client = new SpotifyClient("test_token");
        expect(async () => {
            await client.getNewToken();
        }).rejects.toThrow("No refresh token exist");
    });
});