import {
    Album,
    Artist,
    CheckResponse,
    DeleteResponse,
    FeaturedPlaylistsResponse,
    FollowResponse,
    IAlbumEndpoints,
    IArtistEndpoints,
    IDeviceEndpoints,
    Image,
    IPlaylistEndpoints,
    ITrackEndpoints,
    IUserEndpoints,
    Playlist,
    ResultSet,
    SaveResponse,
    SnapshotResponse,
    SpotifyDevice,
    SpotifyPlayer,
    SpotifyResponse,
    Track,
    User,
    UserPlaybackQueueResponse
} from "spotify";
import { RequestDispatcher } from "./RequestDispatcher";

const BASE_URL = "https://api.spotify.com/v1";

export class SpotifyClient {
    private dispatcher: RequestDispatcher;
    private dispatchRequest;

    constructor(token: string, refreshToken?: string, refreshEndpoint?: string) {
        this.dispatcher = new RequestDispatcher(token, refreshToken, refreshEndpoint);
        this.dispatchRequest = this.dispatcher.dispatch;
    }

    get token() {
        return this.dispatcher.token;
    }

    setToken(token: string): void {
        this.dispatcher.setToken(token);
    }

    async getNewToken(): Promise<void> {
        await this.dispatcher.getNewToken();
    }

    artists: IArtistEndpoints = {
        getArtist: async (id: string): SpotifyResponse<Artist> => {
            return await this.dispatchRequest("GET", "/artists/" + id);
        },
        getArtists: async (ids: string[]): SpotifyResponse<Artist[]> => {
            return await this.dispatchRequest("GET", "/artists?ids=" + ids.join(","));
        },
        getArtistAlbums: async (id: string): SpotifyResponse<ResultSet<Album>> => {
            return await this.dispatchRequest("GET", "/artists/" + id + "/albums");
        },
        getArtistTopTracks: async (id: string): SpotifyResponse<Track> => {
            return await this.dispatchRequest("GET", "/artists/" + id + "/top-tracks");
        },
        getArtistsRelatedArtists: async (id: string): SpotifyResponse<Artist[]> => {
            return await this.dispatchRequest("GET", "/artists/" + id + "/related-artists");
        }
    }

    albums: IAlbumEndpoints = {
        getAlbum: async (id: string): SpotifyResponse<Album> => {
            return await this.dispatchRequest("GET", "/albums/" + id);
        },
        getAlbums: async (ids: string[]): SpotifyResponse<Album[]> => {
            return await this.dispatchRequest("GET", "/albums?ids=" + ids.join(","));
        },
        getAlbumTracks: async (id: string): SpotifyResponse<ResultSet<Track>> => {
            return await this.dispatchRequest("GET", "/albums/" + id + "/tracks");
        },
        getMySavedAlbums: async (): SpotifyResponse<ResultSet<Album>> => {
            return await this.dispatchRequest("GET", "/me/albums");
        },
        saveAlbumForUser: async (id: string): SpotifyResponse<SaveResponse> => {
            return await this.dispatchRequest("PUT", "/me/albums?ids=" + id);
        },
        saveAlbumsForUser: async (ids: string[]): SpotifyResponse<SaveResponse> => {
            return await this.dispatchRequest("PUT", "/me/albums?ids=" + ids.join(","));
        },
        removeAlbumForUser: async (id: string): SpotifyResponse<DeleteResponse> => {
            return await this.dispatchRequest("DELETE", "/me/albums?ids=" + id);
        },
        removeAlbumsForUser: async (ids: string[]): SpotifyResponse<DeleteResponse> => {
            return await this.dispatchRequest("DELETE", "/me/albums?ids=" + ids.join(","));
        },
        albumIsSaved: async (id: string): SpotifyResponse<CheckResponse> => {
            return await this.dispatchRequest("GET", "/me/albums/contains?ids=" + id);
        },
        albumsAreSaved: async (ids: string[]): SpotifyResponse<CheckResponse> => {
            return await this.dispatchRequest("GET", "/me/albums/contains?ids=" + ids.join(","));
        },
        getNewReleases: async (): SpotifyResponse<ResultSet<Album>> => {
            return await this.dispatchRequest("GET", "/browse/new-releases");
        }
    }

    tracks: ITrackEndpoints = {
        getTrack: async (id: string): SpotifyResponse<Track> => {
            return await this.dispatchRequest("GET", "/tracks/" + id);
        },
        getTracks: async (ids: string[]): SpotifyResponse<Track[]> => {
            return await this.dispatchRequest("GET", "/tracks?ids=" + ids.join(","));
        },
        getMySavedTracks: async (): SpotifyResponse<ResultSet<Track>> => {
            return await this.dispatchRequest("GET", "/me/tracks");
        },
        saveTrackForUser: async (id: string): SpotifyResponse<SaveResponse> => {
            return await this.dispatchRequest("PUT", "/me/tracks?ids=" + id);
        },
        saveTracksForUser: async (ids: string[]): SpotifyResponse<SaveResponse> => {
            return await this.dispatchRequest("PUT", "/me/tracks?ids=" + ids.join(","));
        },
        removeTrackForUser: async (id: string): SpotifyResponse<DeleteResponse> => {
            return await this.dispatchRequest("DELETE", "/me/tracks?ids=" + id);
        },
        removeTracksForUser: async (ids: string[]): SpotifyResponse<DeleteResponse> => {
            return await this.dispatchRequest("DELETE", "/me/tracks?ids=" + ids.join(","));
        },
        trackIsSaved: async (id: string): SpotifyResponse<CheckResponse> => {
            return await this.dispatchRequest("GET", "/me/tracks/contains?ids=" + id);
        },
        tracksAreSaved: async (ids: string[]): SpotifyResponse<CheckResponse> => {
            return await this.dispatchRequest("GET", "/me/tracks/contains?ids=" + ids.join(","));
        },
    }

    playlists: IPlaylistEndpoints  = {
        getPlaylist: async (id: string): SpotifyResponse<Playlist> => {
            return await this.dispatchRequest("GET", "/playlists/" + id);
        },
        updatePlaylistDetails: async (id: string, updatedPlaylistDetails: Pick<Playlist, "name" | "public" | "collaborative" | "description">): SpotifyResponse<Playlist> => {
            return await this.dispatchRequest("PUT", "/playlists/" + id, updatedPlaylistDetails);
        },
        getPlaylistTracks: async (id: string): SpotifyResponse<ResultSet<Track>> => {
            return await this.dispatchRequest("GET", "/playlists/" + id + "/tracks");
        },
        addTrackToPlaylist: async (id: string, trackId: string): SpotifyResponse<SnapshotResponse> => {
            return await this.dispatchRequest("POST", "/playlists/" + id + "/tracks?uris=" + trackId);
        },
        addTracksToPlaylist: async (id: string, trackIds: string[]): SpotifyResponse<SnapshotResponse> => {
            return await this.dispatchRequest("POST", "/playlists/" + id + "/tracks?uris=" + trackIds.join(","));
        },
        removeTrackFromPlaylist: async (id: string, trackId: string): SpotifyResponse<SnapshotResponse> => {
            let trackIdSet: { tracks: Pick<Track, "uri">[]; } = { tracks: [ { uri: trackId } ] }
            return await this.dispatchRequest("DELETE", "/playlists/" + id + "/tracks", trackIdSet);
        },
        removeTracksFromPlaylist: async (id: string, trackIds: Array<string>): SpotifyResponse<SnapshotResponse> => {
            let trackIdSet: { tracks: Pick<Track, "uri">[]; } = { tracks: trackIds.map(item => { return { uri: item } }) };
            return await this.dispatchRequest("DELETE", "/playlists/" + id + "/tracks", trackIdSet);
        },
        getCurrentUserPlaylists: async (): SpotifyResponse<ResultSet<Playlist>> => {
            return await this.dispatchRequest("GET", "/me/playlists");
        },
        getUsersPlaylists: async (id: string): SpotifyResponse<ResultSet<Playlist>> => {
            return await this.dispatchRequest("GET", "/users/" + id + "/playlists");
        },
        createPlaylist: async (id: string, newPlaylist: Pick<Playlist, "name" | "public" | "collaborative" | "description">): SpotifyResponse<Playlist> => {
            return await this.dispatchRequest("POST", "/users/" + id + "/playlists", newPlaylist);
        },
        getFeaturedPlaylists: async (): SpotifyResponse<FeaturedPlaylistsResponse<Album>> => {
            return await this.dispatchRequest("GET", "/browse/featured-playlists");
        },
        getCategorysPlaylists: async (id: string): SpotifyResponse<FeaturedPlaylistsResponse<Playlist>> => {
            return await this.dispatchRequest("GET", "/browse/categories/" + id + "/playlists");
        },
        getPlaylistImage: async (id: string): SpotifyResponse<Image[]> => {
            return await this.dispatchRequest("GET", "/playlists/" + id + "/images");
        },
        addPlaylistCoverImage: async (id: string, CustomImage: string): SpotifyResponse<string> => {
            //TODO: implement this
            throw new Error("need logged in user.");
        },
        checkIfUsersFollowPlaylist: async (id: string, ids: string[]): SpotifyResponse<CheckResponse> => {
            return await this.dispatchRequest("GET", "/playlists/" + id + "/followers/contains?ids=" + ids.join(","));
        }
    }

    users: IUserEndpoints  = {
        getCurrentUser: async (): SpotifyResponse<User> => {
            return await this.dispatchRequest("GET", "/me");
        },
        getCurrentUsersTopTracks: async (): SpotifyResponse<ResultSet<Track>> => {
            return await this.dispatchRequest("GET", "/me/top/tracks");
        },
        getCurrentUsersTopAlbums: async (): SpotifyResponse<ResultSet<Album>> => {
            return await this.dispatchRequest("GET", "/me/top/albums");
        },
        getUserProfile: async (id: string): SpotifyResponse<User> => {
            return await this.dispatchRequest("GET", "/users/" + id);
        },
        getCurrentUserFollowedArtists: async (): SpotifyResponse<ResultSet<Artist>> => {
            return await this.dispatchRequest("GET", "/me/following");
        },
        followArtist: async (id: string): SpotifyResponse<FollowResponse> => {
            return await this.dispatchRequest("PUT", "/me/following?ids=" + id + "&type=artist");
        },
        followArtists: async (ids: string[]): SpotifyResponse<FollowResponse> => {
            return await this.dispatchRequest("PUT", "/me/following?ids=" + ids.join(",") + "&type=artist");
        },
        unfollowArtist: async (id: string): SpotifyResponse<FollowResponse> => {
            return await this.dispatchRequest("DELETE", "/me/following?ids=" + id + "&type=artist");
        },
        unfollowArtists: async (ids: string[]): SpotifyResponse<FollowResponse> => {
            return await this.dispatchRequest("DELETE", "/me/following?ids=" + ids.join(",") + "&type=artist");
        },
        followUser: async (id: string): SpotifyResponse<FollowResponse> => {
            return await this.dispatchRequest("PUT", "/me/following?ids=" + id + "&type=user");
        },
        followUsers: async (ids: string[]): SpotifyResponse<FollowResponse> => {
            return await this.dispatchRequest("PUT", "/me/following?ids=" + ids.join(",") + "&type=user");
        },
        unfollowUser: async (id: string): SpotifyResponse<FollowResponse> => {
            return await this.dispatchRequest("DELETE", "/me/following?ids=" + id + "&type=user");
        },
        unfollowUsers: async (ids: string[]): SpotifyResponse<FollowResponse> => {
            return await this.dispatchRequest("DELETE", "/me/following?ids=" + ids.join(",") + "&type=user");
        },
        checkIfCurrentUserFollowsArtist: async (id: string): SpotifyResponse<CheckResponse> => {
            return await this.dispatchRequest("GET", "/me/following/contains?ids=" + id + "&type=artist");
        },
        checkIfCurrentUserFollowsArtists: async (ids: string[]): SpotifyResponse<CheckResponse> => {
            return await this.dispatchRequest("GET", "/me/following/contains?ids=" + ids.join(",") + "&type=artist");
        },
        checkIfCurrentUserFollowsUser: async (id: string): SpotifyResponse<CheckResponse> => {
            return await this.dispatchRequest("GET", "/me/following/contains?ids=" + id + "&type=user");
        },
        checkIfCurrentUserFollowsUsers: async (ids: string[]): SpotifyResponse<CheckResponse> => {
            return await this.dispatchRequest("GET", "/me/following/contains?ids=" + ids.join(",") + "&type=user");
        }
    }

    player: IDeviceEndpoints = {
        getPlaybackState: async (): SpotifyResponse<SpotifyDevice> => {
            return await this.dispatchRequest("GET", "/me/player");
        },
        transferPlayback: async (deviceIds: string[]): SpotifyResponse<string> => {
            return await this.dispatchRequest("PUT", "/me/player", JSON.stringify({ device_ids: deviceIds }));
        },
        getAvailableDevices: async (): SpotifyResponse<SpotifyDevice[]> => {
            return await this.dispatchRequest("GET", "/me/player/devices");
        },
        getCurrentlyPlayingTrack: async (): SpotifyResponse<SpotifyPlayer> => {
            return await this.dispatchRequest("GET", "/me/player/currently-playing");
        },
        startPlayback: async (deviceId: string): SpotifyResponse<string> => {
            return await this.dispatchRequest("PUT", "/me/player/play?device_id=" + deviceId);
        },
        pausePlayback: async (deviceId: string): SpotifyResponse<string> => {
            return await this.dispatchRequest("PUT", "/me/player/pause?device_id=" + deviceId);
        },
        skipToNext: async (deviceId: string): SpotifyResponse<string> => {
            return await this.dispatchRequest("POST", "/me/player/next?device_id=" + deviceId);
        },
        skipToPrevious: async (deviceId: string): SpotifyResponse<string> => {
            return await this.dispatchRequest("POST", "/me/player/previous?device_id=" + deviceId);
        },
        seekToPosition: async (position: number): SpotifyResponse<string> => {
            return await this.dispatchRequest("PUT", "/me/player/seek?position_ms=" + position);
        },
        setRepeatTrack: async (): SpotifyResponse<string> => {
            return await this.dispatchRequest("PUT", "/me/player/repeat?state=track");
        },
        setRepeatContext: async (): SpotifyResponse<string> => {
            return await this.dispatchRequest("PUT", "/me/player/repeat?state=context");
        },
        setRepeatOff: async (): SpotifyResponse<string> => {
            return await this.dispatchRequest("PUT", "/me/player/repeat?state=off");
        },
        setPlaybackVolume: async (volumePercent: number): SpotifyResponse<string> => {
            return await this.dispatchRequest("PUT", "/me/player/volume?volume_percent=" + volumePercent);
        },
        setShuffle: async (shuffleState: boolean): SpotifyResponse<string> => {
            return await this.dispatchRequest("PUT", "/me/player/shuffle?state=" + shuffleState);
        },
        getRecentlyPlayed: async (): SpotifyResponse<ResultSet<Track>> => {
            return await this.dispatchRequest("GET", "/me/player/recently-played");
        },
        getPlaybackQueue: async (): SpotifyResponse<UserPlaybackQueueResponse> => {
            return await this.dispatchRequest("GET", "/me/player/queue");
        },
        addItemToQueue: async (id: string): SpotifyResponse<string> => {
            return await this.dispatchRequest("POST", "/me/player/queue?uri=" + id);
        }
    }

}

export default SpotifyClient;