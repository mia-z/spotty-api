import { Track } from "index";
import SpotifyClient from "src/Client";
import { describe, expect, it, beforeEach, vi, Mock, afterEach, SpyInstance } from "vitest";

describe("Playlists", () => {
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

    it("will fetch a playlist from the correct endpoint", async () => {
        prepareFetchMock();
        await client.playlists.getPlaylist("playlistId");

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/playlists/playlistId");
    });

    it("will update a playlist details at the correct endpoint", async () => {
        prepareFetchMock();
        const updatedPlaylistDetails = { collaborative: true, description: "test", name: "test", public: true };

        await client.playlists.updatePlaylistDetails("playlistId", updatedPlaylistDetails);

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("PUT", "/playlists/playlistId", updatedPlaylistDetails);
    });

    it("will fetch a playlists tracks from correct endpoint", async () => {
        prepareFetchMock();
        await client.playlists.getPlaylistTracks("playlistId");

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/playlists/playlistId/tracks");
    });

    it("will add an item to a playlist at the correct endpoint", async () => {
        prepareFetchMock();
        await client.playlists.addTrackToPlaylist("playlistId", "trackId");

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("POST", "/playlists/playlistId/tracks?uris=trackId");
    });

    it("will add multiple items to a playlist at the correct endpoint", async () => {
        prepareFetchMock();
        await client.playlists.addTracksToPlaylist("playlistId", ["trackId1", "trackId2"]);

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("POST", "/playlists/playlistId/tracks?uris=trackId1,trackId2");
    });

    it("will remove track from a playlist at the correct endpoint", async () => {
        prepareFetchMock();
        const tracksToDelete: { tracks: Pick<Track, "uri">[]; } = { tracks: [ { uri: "trackId" } ] }

        await client.playlists.removeTrackFromPlaylist("playlistId", "trackId");

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("DELETE", "/playlists/playlistId/tracks", tracksToDelete);
    });

    it("will remove track from a playlist at the correct endpoint", async () => {
        prepareFetchMock();
        const tracksToDelete: { tracks: Pick<Track, "uri">[]; } = { tracks: [ { uri: "trackId1" }, { uri: "trackId2" } ] }

        await client.playlists.removeTracksFromPlaylist("playlistId", ["trackId1", "trackId2"]);

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("DELETE", "/playlists/playlistId/tracks", tracksToDelete);
    });

    it("will fetch the current users playlists from the correct endpoint", async () => {
        prepareFetchMock();
        await client.playlists.getCurrentUserPlaylists();

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/me/playlists");
    });

    it("will fetch the playlists of a specified user from the correct endpoint", async () => {
        prepareFetchMock();
        await client.playlists.getUsersPlaylists("userId");

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/users/userId/playlists");
    });

    it("will create a playlist for a specified user at the correct endpoint", async () => {
        prepareFetchMock();
        const newPlaylistDetails = { collaborative: true, description: "test", name: "test", public: true };

        await client.playlists.createPlaylist("userId", newPlaylistDetails);

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("POST", "/users/userId/playlists", newPlaylistDetails);
    });

    it("will fetch featured playlists from the correct endpoint", async () => {
        prepareFetchMock();
        await client.playlists.getFeaturedPlaylists();

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/browse/featured-playlists");
    });

    it("will fetch a category's playlists from the correct endpoint", async () => {
        prepareFetchMock();
        await client.playlists.getCategorysPlaylists("categoryId");

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/browse/categories/categoryId/playlists");
    });
});