import SpotifyClient from "src/Client";
import { describe, expect, it, beforeEach, vi, Mock, afterEach, SpyInstance } from "vitest";

describe("Tracks", () => {
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

    it("will fetch a track from the correct endpoint", async () => {
        prepareFetchMock();
        await client.tracks.getTrack("trackId");

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/tracks/trackId");
    });

    it("will fetch several tracks from the correct endpoint", async () => {
        prepareFetchMock();
        await client.tracks.getTracks(["trackId1", "trackId2"]);

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/tracks?ids=trackId1,trackId2");
    });

    it("will fetch the logged in users saved tracks from the correct endpoint", async () => {
        prepareFetchMock();
        await client.tracks.getMySavedTracks();

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/me/tracks");
    });

    it("will save a track for the logged in user at the correct endpoint", async () => {
        prepareFetchMock();
        await client.tracks.saveTrackForUser("trackId");

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("PUT", "/me/tracks?ids=trackId");
    });

    it("will save multiple tracks for the logged in user at the correct endpoint", async () => {
        prepareFetchMock();
        await client.tracks.saveTracksForUser(["trackId1", "trackId2"]);

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("PUT", "/me/tracks?ids=trackId1,trackId2");
    });

    it("will check if a track is saved for the logged in user at the correct endpoint", async () => {
        prepareFetchMock();
        await client.tracks.trackIsSaved("trackId");

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/me/tracks/contains?ids=trackId");
    });

    it("will check if multiple tracks are saved for the logged in user at the correct endpoint", async () => {
        prepareFetchMock();
        await client.tracks.tracksAreSaved(["trackId1", "trackId2"]);

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/me/tracks/contains?ids=trackId1,trackId2");
    });

    it("will remove a saved track for the logged in user at the correct endpoint", async () => {
        prepareFetchMock();
        await client.tracks.removeTrackForUser("trackId");

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("DELETE", "/me/tracks?ids=trackId");
    });

    it("will remove multiple saved tracks for the logged in user at the correct endpoint", async () => {
        prepareFetchMock();
        await client.tracks.removeTracksForUser(["trackId1", "trackId2"]);

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("DELETE", "/me/tracks?ids=trackId1,trackId2");
    });
});