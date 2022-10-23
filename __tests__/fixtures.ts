import { readFileSync } from "fs";
import { join } from "path";

const loadFixtureData = (filename: string): string => {
	const path = join(__dirname, "./fixtures/", filename + ".json");
	return readFileSync(path, "utf-8");
}

export const album = loadFixtureData("album");
export const albums = loadFixtureData("albums");
export const album_tracks = loadFixtureData("album_tracks");
export const saved_albums = loadFixtureData("saved_albums");
export const save_album = loadFixtureData("save_album");
export const remove_albums = loadFixtureData("remove_albums");
export const check_saved_albums = loadFixtureData("check_saved_albums");
export const get_new_releases = loadFixtureData("get_new_releases");