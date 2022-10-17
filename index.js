import { SpotifyClient } from "./src/Client";

export { SpotifyClient };
export default (token, refresh, endpoint) => new SpotifyClient(token, refresh, endpoint);