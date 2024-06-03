import SongWithOutPlaylistRepository from "../../domain/song/SongWithOutPlaylistRepository";
import { SongWithOutPlaylistCaller } from "./SongWithOutPlaylistCaller";
import SongWithOutPlaylist from "../../domain/song/SongWithOutPlaylist";

export class SongWithOutPlaylistResource
  implements SongWithOutPlaylistRepository
{
  constructor(
    public readonly songWithOutPlaylistCaller: SongWithOutPlaylistCaller,
  ) {}

  async createSongWithOutPlaylist(
    userId: string,
    categoryId: string,
    title: string,
    artist: string,
  ): Promise<SongWithOutPlaylist> {
    const apiSong =
      await this.songWithOutPlaylistCaller.createSongWithOutPlaylist(
        userId,
        categoryId,
        title,
        artist,
      );
    return new SongWithOutPlaylist(
      apiSong.id,
      apiSong.userId,
      apiSong.categoryId,
      apiSong.title,
      apiSong.artist,
    );
  }

  async getSongsWithOutPlaylist(
    userId: string,
    categoryId: string,
  ): Promise<SongWithOutPlaylist[]> {
    if (!categoryId) {
      throw new Error("categoryId is undefined or empty!");
    }

    const apiSongList =
      await this.songWithOutPlaylistCaller.getSongsWithOutPlaylist(
        userId,
        categoryId,
      );

    return apiSongList.map(
      apiSong =>
        new SongWithOutPlaylist(
          apiSong.id,
          apiSong.userId,
          apiSong.categoryId,
          apiSong.title,
          apiSong.artist,
        ),
    );
  }

  async deleteSong(userId: string, songId: string) {
    return await this.songWithOutPlaylistCaller.deleteSong(userId, songId);
  }
}
