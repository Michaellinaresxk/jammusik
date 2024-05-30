import type { SongResource } from "../../../infra/song/SongResource";
import { CreateSongUseCase } from "./CreateSongUseCase";
import { GetSongListUseCase } from "./GetSongListUseCase";
import type { SongView } from "../../../views/SongView";
import { DeleteSongUseCase } from "./DeleteSongUseCase";

export class SongService {
  private songCreateUseCase: CreateSongUseCase;
  private getSongListUseCase: GetSongListUseCase;
  private deleteSongUseCase: DeleteSongUseCase;

  constructor(private readonly songResource: SongResource) {
    this.songCreateUseCase = new CreateSongUseCase(songResource);
    this.getSongListUseCase = new GetSongListUseCase(songResource);
    this.deleteSongUseCase = new DeleteSongUseCase(songResource);
  }

  async createSong(
    title: string,
    artist: string,
    categoryId: string,
    playlistId: string,
  ) {
    return await this.songCreateUseCase.execute(
      title,
      artist,
      categoryId,
      playlistId,
    );
  }

  async getSongs(playlistId: string): Promise<SongView[]> {
    return this.getSongListUseCase.execute(playlistId);
  }
  async deleteSong(userId: string, songId: string): Promise<void> {
    return await this.deleteSongUseCase.execute(userId, songId);
  }
}
