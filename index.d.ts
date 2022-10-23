export declare class RequestDispatcher {
    public constructor(token: string, refreshToken?: string, refreshEndpoint?: string);
    
    token: string;
    refreshToken: string | null;
    refreshEndpoint: string | null;

    dispatch<T>(method: AcceptedMethods, uri: string, body?: any): Promise<T | ErrorResponse>;
    setToken(token: string): void;
    setRefreshToken(refreshToken: string): void;
    getNewToken(): Promise<void>;
}

export declare function RequestConfig(token: string, method: AcceptedMethods): RequestInit;
export declare function RequestConfig(token: string, method: AcceptedMethods, body: BodyInit): RequestInit;

export declare class SpotifyClient {
    public constructor(token: string, refreshToken?: string, refreshEndpoint?: string);

    setToken: (token: string) => void;
    getNewToken: () => Promise<void>;

    private dispatcher: RequestDispatcher;
    private dispatchRequest;

    token: string;

    albums: IAlbumEndpoints;
    artists: IArtistEndpoints;
    tracks: ITrackEndpoints;
    playlists: IPlaylistEndpoints;
    users: IUserEndpoints;
    player: IDeviceEndpoints;
    
}

export interface IAlbumEndpoints {
    getAlbum(id: string): SpotifyResponse<Album>; 
    getAlbums (ids: Array<string>): SpotifyResponse<Array<Album>>;
    getAlbumTracks (id: string):SpotifyResponse<ResultSet<Track>>;
    getMySavedAlbums(): SpotifyResponse<ResultSet<Album>>;
    saveAlbumForUser(id: string): SpotifyResponse<SaveResponse>;
    saveAlbumsForUser(ids: Array<string>): SpotifyResponse<SaveResponse>;
    removeAlbumForUser(id: string): SpotifyResponse<DeleteResponse>;
    removeAlbumsForUser(ids: Array<string>): SpotifyResponse<DeleteResponse>;
    albumIsSaved(ids: string): SpotifyResponse<CheckResponse>;
    albumsAreSaved(ids: Array<string>): SpotifyResponse<CheckResponse>;
    getNewReleases(): SpotifyResponse<ResultSet<Album>>;
}

export interface IArtistEndpoints {
    getArtist(id: string): SpotifyResponse<Artist>;
    getArtists(ids: Array<string>): SpotifyResponse<Array<Artist>>;
    getArtistAlbums(id: string): SpotifyResponse<ResultSet<Album>>;
    getArtistTopTracks(id: string): SpotifyResponse<Track>;
    getArtistsRelatedArtists(id: string): SpotifyResponse<Array<Artist>>;
}

export interface ITrackEndpoints {
    getTrack(id: string): SpotifyResponse<Track>;
    getTracks(ids: Array<string>): SpotifyResponse<Array<Track>>;
    getMySavedTracks(): SpotifyResponse<ResultSet<Track>>;
    saveTrackForUser(id: string): SpotifyResponse<SaveResponse>;
    saveTracksForUser(id: Array<string>): SpotifyResponse<SaveResponse>;
    removeTrackForUser(ids: string): SpotifyResponse<DeleteResponse>;
    removeTracksForUser(ids: Array<string>): SpotifyResponse<DeleteResponse>;
    trackIsSaved(ids: string): SpotifyResponse<CheckResponse>;
    tracksAreSaved(ids: Array<string>): SpotifyResponse<CheckResponse>;
}

export interface IUserEndpoints {
    getCurrentUser(): SpotifyResponse<User>;
    getCurrentUsersTopTracks(): SpotifyResponse<ResultSet<Track>>;
    getCurrentUsersTopAlbums(): SpotifyResponse<ResultSet<Album>>;
    getUserProfile(id: string): SpotifyResponse<User>;
    getCurrentUserFollowedArtists(): SpotifyResponse<ResultSet<Artist>>;
    followArtist(ids: string): SpotifyResponse<FollowResponse>;
    followArtists(ids: Array<string>): SpotifyResponse<FollowResponse>;
    unfollowArtist(ids: string): SpotifyResponse<FollowResponse>;
    unfollowArtists(ids: Array<string>): SpotifyResponse<FollowResponse>;
    followUser(ids: string): SpotifyResponse<FollowResponse>;
    followUsers(ids: Array<string>): SpotifyResponse<FollowResponse>;
    unfollowUser(ids: string): SpotifyResponse<FollowResponse>;
    unfollowUsers(ids: Array<string>): SpotifyResponse<FollowResponse>;
    checkIfCurrentUserFollowsArtist(ids: string):SpotifyResponse<CheckResponse>;
    checkIfCurrentUserFollowsArtists(ids: Array<string>):SpotifyResponse<CheckResponse>;
    checkIfCurrentUserFollowsUser(ids: string):SpotifyResponse<CheckResponse>;
    checkIfCurrentUserFollowsUsers(ids: Array<string>):SpotifyResponse<CheckResponse>;
}

export interface IPlaylistEndpoints {
    getPlaylist(id: string): SpotifyResponse<Playlist>;
    updatePlaylistDetails(id: string, UpdatedPlaylistDetails: Pick<Playlist, "name" | "public" | "collaborative" | "description">): SpotifyResponse<Playlist>;
    getPlaylistTracks(id: string): SpotifyResponse<ResultSet<Track>>;
    addTrackToPlaylist(id: string, TrackId: string): SpotifyResponse<SnapshotResponse>;
    addTracksToPlaylist(id: string, TrackIds: Array<string>): SpotifyResponse<SnapshotResponse>;
    removeTrackFromPlaylist(id: string, TrackId: string): SpotifyResponse<SnapshotResponse>;
    removeTracksFromPlaylist(id: string, TrackIds: Array<string>): SpotifyResponse<SnapshotResponse>;
    getCurrentUserPlaylists(): SpotifyResponse<ResultSet<Playlist>>;
    getUsersPlaylists(id: string): SpotifyResponse<ResultSet<Playlist>>;
    createPlaylist(id: string, NewPlaylist: Pick<Playlist, "name" | "public" | "collaborative" | "description">): SpotifyResponse<Playlist>;
    getFeaturedPlaylists(): SpotifyResponse<FeaturedPlaylistsResponse<Album>>;
    getCategorysPlaylists(id: string): SpotifyResponse<FeaturedPlaylistsResponse<Playlist>>;
    getPlaylistImage(id: string): SpotifyResponse<Array<Image>>;
    addPlaylistCoverImage(id: string, CustomImage: string): SpotifyResponse<string>;
    checkIfUsersFollowPlaylist(id: string, ids: Array<string>): SpotifyResponse<CheckResponse>;
}

export interface IDeviceEndpoints {
    getPlaybackState(): SpotifyResponse<SpotifyDevice>;
    transferPlayback(deviceIds: Array<string>): SpotifyResponse<string>;
    getAvailableDevices(): SpotifyResponse<Array<SpotifyDevice>>;
    getCurrentlyPlayingTrack(): SpotifyResponse<SpotifyPlayer>;
    startPlayback(deviceId: string): SpotifyResponse<string>;
    pausePlayback(deviceId: string): SpotifyResponse<string>;
    skipToNext(deviceId: string): SpotifyResponse<string>;
    skipToPrevious(deviceId: string): SpotifyResponse<string>;
    seekToPosition(Position: number): SpotifyResponse<string>;
    setRepeatTrack(): SpotifyResponse<string>;
    setRepeatContext(): SpotifyResponse<string>;
    setRepeatOff(): SpotifyResponse<string>;
    setPlaybackVolume(volumePercent: number): SpotifyResponse<string>;
    setShuffle(shuffleState: boolean): SpotifyResponse<string>;
    getRecentlyPlayed(): SpotifyResponse<ResultSet<Track>>;
    getPlaybackQueue(): SpotifyResponse<UserPlaybackQueueResponse>;
    addItemToQueue(id: string): SpotifyResponse<string>;
}

export type AcceptedMethods = "GET" | "POST" | "PUT" | "DELETE";

export type SpotifyResponse<T> = Promise<T | ErrorResponse>;

export type ErrorResponse = {
    code: number,
    reason: string,
    extra?: any
}

export type SaveResponse = {

}

export type DeleteResponse = {

}

export type SnapshotResponse = {
    snapShotid: string
}

export type FollowResponse = Array<string>

export type CheckResponse = boolean | Array<boolean>

export type FeaturedPlaylistsResponse<T = Album | Playlist> = {
    albums: ResultSet<T>,
    message: string
}

export type UserPlaybackQueueResponse = {
    currentlyPlaying: Track,
    queue: Array<Track>
}

export type ExternalUrl = {
    spotify: string
}

export type AlbumType = "album" | "single" | "compilation";

export type ReleaseDatePrecision = "year" | "month" | "day";

export type Image = {
    url: string,
    height: number,
    width: number
}

export type Restriction = "market" | "product" | "explicit";

export type Followers = {
    href: null, //This is always null as of now, see remark on Spotify REST Docs https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-artist
    total: number
}

export type Externalids = {
    isrc: string,
    ean: string,
    upc: string
}

export type LinkedFrom = Track;

export type ResultSet<T> = {
    href: string,
    items: Array<T>,
    limit: number,
    next: string,
    offset: number,
    previous: string,
    total: number
}

export type Album = {
    albumType: AlbumType,
    totalTracks: number,
    availableMarkets: Array<string>,
    externalUrls: ExternalUrl,
    href: string,
    id: string,
    images: Array<Image>,
    name: string,
    releasedDate: string,
    relaseDatePrecision: ReleaseDatePrecision,
    restrictions?: Restriction,
    type: "album",
    uri: string,
    artists: Array<Artist>
    tracks: ResultSet<Track>
}

export type Artist = {
   externalUrls?: ExternalUrl,
   followers?: Followers,
   genres?: Array<string>,
   href?: string,
   id: string,
   images?: Array<Image>,
   name?: string,
   popularity?: number,
   type?: "artist",
   uri?: string
}

export type Track = {
    album?: Album & {
        albumGroup: string,
        artists: Array<Artist>
    },
    artists?: Array<Artist>
    availableMarkets?: Array<string>,
    discNumber?: number,
    durationMs?: number,
    explicit?: boolean,
    externalids?: Externalids
    externalUrls?: ExternalUrl,
    href?: string,
    id?: string,
    isPlayable?: boolean,
    linkedFrom?: LinkedFrom,
    restrictions?: Restriction,
    name?: string,
    popularity?: number,
    previewUrl?: string,
    trackNumber?: number,
    type?: "track",
    uri?: string,
    isLocal?: boolean
}

export type SearchResult = {
    tracks: ResultSet<Track>,
    artists: ResultSet<Artist>,
    albums: ResultSet<Album>
}

export type ExplicitContent = {
    filterEnabled: boolean,
    filterLocked: boolean
}

export type User = {
    country?: string,
    displayName?: string,
    email?: string,
    explicitContent?: ExplicitContent,
    externalUrls?: ExternalUrl,
    followers?: Followers,
    href?: string,
    id?: string,
    images?: Array<Image>,
    product?: string,
    type?: "user",
    uri?: string
}

export type Playlist = {
    collaborative?: boolean,
    description?: string,
    externalUrls?: ExternalUrl,
    followers?: Followers,
    href?: string,
    id?: string,
    images?: Array<Image>,
    name?: string,
    owner?: Omit<ResultSet<User>, "Items"> & {
        displayName: string
    },
    public?: boolean,
    snapshotId?: string,
    tracks?: ResultSet<Track>,
    type?: "playlist",
    uri?: string
}

export type Category = {
    href: string,
    icons: Array<Image>,
    id: string,
    name: string
}

export type RepeatState = "off" | "track" | "context";

export type SpotifyPlayer = {
    device: SpotifyDevice,
    repeatState?: RepeatState,
    shuffleState?: "on" | "off",
    context?: SpotifyContext,
    timestamp: number,
    progressMs: number,
    isPlaying?: boolean,
    item?: Track,
    currentlyPlayingType?: "ad" | "episode" | "track" | "unknown",
}

export type DeviceType = "computer" | "smartphone" | "speaker";

export type SpotifyDevice = {
    id?: string,
    isActive?: boolean,
    isPrivateSession?: boolean,
    isRestricted?: boolean,
    name?: string,
    type?: DeviceType,
    volumePercent?: number
}

export type SpotifyContext = {
    type?: "artist" | "playlist" | "album" | "show",
    href?: string,
    externalUrls: ExternalUrl,
    uri: string
}