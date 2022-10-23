import { Album } from "index";
import SpotifyClient from "src/Client";
import { describe, expect, it, beforeEach, vi, Mock, afterEach, SpyInstance } from "vitest";
import { albums } from "./fixtures";

describe("Album", () => {
    const prepareFetchMockWithFixture = (fixture: string) => {
        global.fetch = vi.fn(() => 
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve(JSON.parse(fixture)),
            })
        ) as Mock;
    }

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

    it("will fetch an album from the correct endpoint", async () => {
        prepareFetchMock();
        await client.albums.getAlbum("albumId");

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/albums/albumId");
    });

    it("will fetch multiple albums from the correct endpoint", async () => {
        prepareFetchMock();
        
        await client.albums.getAlbums(["albumId1", "albumId2"]);

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/albums?ids=albumId1,albumId2");
    });


    it("will fetch album tracks from the correct endpoint", async () => {
        prepareFetchMock();
        
        await client.albums.getAlbumTracks("albumId");

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/albums/albumId/tracks");
    });

    it("will fetch users saved albums from the correct endpoint", async () => {
        prepareFetchMock();
        
        await client.albums.getMySavedAlbums();

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/me/albums");
    });

    it("will delete a saved album at the correct endpoint", async () => {
        prepareFetchMock();
        
        await client.albums.removeAlbumForUser("albumId");

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("DELETE", "/me/albums?ids=albumId");
    });

    it("will delete multiple saved albums at the correct endpoint", async () => {
        prepareFetchMock();
        
        await client.albums.removeAlbumsForUser(["albumId1", "albumId2"]);

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("DELETE", "/me/albums?ids=albumId1,albumId2");
    });

    it("will save an album at the correct endpoint", async () => {
        prepareFetchMock();
        
        await client.albums.saveAlbumForUser("albumId");

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("PUT", "/me/albums?ids=albumId");
    });

    it("will save multiple albums at the correct endpoint", async () => {
        prepareFetchMock();
        
        await client.albums.saveAlbumsForUser(["albumId1", "albumId2"]);

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("PUT", "/me/albums?ids=albumId1,albumId2");
    });

    it("will check if an album is saved for the current user at the correct endpoint", async () => {
        prepareFetchMock();
        
        await client.albums.albumIsSaved("albumId");

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/me/albums/contains?ids=albumId");
    });

    it("will check if multiple albums saved for the current user at the correct endpoint", async () => {
        prepareFetchMock();
        
        await client.albums.albumsAreSaved(["albumId1", "albumId2"]);

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/me/albums/contains?ids=albumId1,albumId2");
    });

    it("will fetch the current new album releases at the correct endpoint", async () => {
        prepareFetchMock();
        
        await client.albums.getNewReleases();

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/browse/new-releases");
    });
});