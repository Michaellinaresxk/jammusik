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
    title: string,
    artist: string,
    categoryId: string,
  ): Promise<SongWithOutPlaylist> {
    const apiSong =
      await this.songWithOutPlaylistCaller.createSongWithOutPlaylist(
        title,
        artist,
        categoryId,
      );
    return new SongWithOutPlaylist(
      apiSong.id,
      apiSong.title,
      apiSong.artist,
      apiSong.categoryId,
    );
  }
}
