import SpotifyClient from "src/Client";
import { describe, expect, it, beforeEach, vi, Mock, afterEach, SpyInstance } from "vitest";

describe("Artists", () => {
    const prepareFetchMock = () => global.fetch = vi.fn() as Mock;

    let client: SpotifyClient;
    let dispatchSpy: SpyInstance;

    beforeEach(() => {
        client = new SpotifyClient("token");
        //@ts-ignore
        dispatchSpy = vi.spyOn(client, "dispatchRequest");
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it("will fetch an artist from the correct endpoint", async () => {
        prepareFetchMock();
        await client.artists.getArtist("artistId");

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/artists/artistId");
    });

    it("will fetch multiple artists from the correct endpoint", async () => {
        prepareFetchMock();
        await client.artists.getArtists(["artistId1", "artistId2"]);

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/artists?ids=artistId1,artistId2");
    });

    it("will fetch an artists albums from the correct endpoint", async () => {
        prepareFetchMock();
        await client.artists.getArtistAlbums("artistId");

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/artists/artistId/albums");
    });

    it("will fetch an artists top tracks from the correct endpoint", async () => {
        prepareFetchMock();
        await client.artists.getArtistTopTracks("artistId");

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/artists/artistId/top-tracks");
    });

    it("will fetch an artists related artists from the correct endpoint", async () => {
        prepareFetchMock();
        await client.artists.getArtistsRelatedArtists("artistId");

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/artists/artistId/related-artists");
    });
});