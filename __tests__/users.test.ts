import SpotifyClient from "src/Client";
import { describe, expect, it, beforeEach, vi, Mock, afterEach, SpyInstance } from "vitest";

describe("Users", () => {
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

    it("will fetch the logged in users profile from the correct endpoint", async () => {
        prepareFetchMock();
        await client.users.getCurrentUser();

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/me");
    });

    it("will fetch the logged in users top artists from the correct endpoint", async () => {
        prepareFetchMock();
        await client.users.getCurrentUsersTopTracks();

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/me/top/tracks");
    });

    it("will fetch the logged in users top albums from the correct endpoint", async () => {
        prepareFetchMock();
        await client.users.getCurrentUsersTopAlbums();

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/me/top/albums");
    });

    it("will fetch a users profile from the correct endpoint", async () => {
        prepareFetchMock();
        await client.users.getUserProfile("profileId");

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/users/profileId");
    });

    it("will fetch a users followed artists from the correct endpoint", async () => {
        prepareFetchMock();
        await client.users.getCurrentUserFollowedArtists();

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/me/following");
    });

    it("will follow an artist at the correct endpoint", async () => {
        prepareFetchMock();
        await client.users.followArtist("artistId");

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("PUT", "/me/following?ids=artistId&type=artist");
    });

    it("will follow multiple artists at the correct endpoint", async () => {
        prepareFetchMock();
        await client.users.followArtists(["artistId1", "artistId2"]);

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("PUT", "/me/following?ids=artistId1,artistId2&type=artist");
    });

    it("will follow a user at the correct endpoint", async () => {
        prepareFetchMock();
        await client.users.followUser("userId");

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("PUT", "/me/following?ids=userId&type=user");
    });

    it("will follow multiple users at the correct endpoint", async () => {
        prepareFetchMock();
        await client.users.followUsers(["userId1", "userId2"]);

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("PUT", "/me/following?ids=userId1,userId2&type=user");
    });

    it("will unfollow an artist at the correct endpoint", async () => {
        prepareFetchMock();
        await client.users.unfollowArtist("artistId");

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("DELETE", "/me/following?ids=artistId&type=artist");
    });

    it("will unfollow multiple artists at the correct endpoint", async () => {
        prepareFetchMock();
        await client.users.unfollowArtists(["artistId1", "artistId2"]);

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("DELETE", "/me/following?ids=artistId1,artistId2&type=artist");
    });

    it("will unfollow a user at the correct endpoint", async () => {
        prepareFetchMock();
        await client.users.unfollowUser("userId");

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("DELETE", "/me/following?ids=userId&type=user");
    });

    it("will unfollow multiple users at the correct endpoint", async () => {
        prepareFetchMock();
        await client.users.unfollowUsers(["userId1", "userId2"]);

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("DELETE", "/me/following?ids=userId1,userId2&type=user");
    });

    it("will check if the currently logged in user follows an artist at the correct endpoint", async () => {
        prepareFetchMock();
        await client.users.checkIfCurrentUserFollowsArtist("artistId");

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/me/following/contains?ids=artistId&type=artist");
    });

    it("will check if the currently logged in user follows multiple artists at the correct endpoint", async () => {
        prepareFetchMock();
        await client.users.checkIfCurrentUserFollowsArtists(["artistId1", "artistId2"]);

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/me/following/contains?ids=artistId1,artistId2&type=artist");
    });

    it("will check if the currently logged in user follows a user at the correct endpoint", async () => {
        prepareFetchMock();
        await client.users.checkIfCurrentUserFollowsUser("userId");

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/me/following/contains?ids=userId&type=user");
    });

    it("will check if the currently logged in user follows multiple users at the correct endpoint", async () => {
        prepareFetchMock();
        await client.users.checkIfCurrentUserFollowsUsers(["userId1", "userId2"]);

        expect(dispatchSpy).toHaveBeenCalledOnce();
        expect(dispatchSpy).toBeCalledWith("GET", "/me/following/contains?ids=userId1,userId2&type=user");
    });
});