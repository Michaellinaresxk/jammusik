export interface SongProperties {
  id: string;
  title: string;
  artist: string;
  categoryId: string;
  isDone: boolean;
  playlistId?: string;
}

export interface SongDetailsProperties {
  userId: string;
  songId: string;
  key?: string;
  chordList?: string[];
  notes?: string;
  lyricLink?: string;
  tabLink?: string;
}

export type PlaylistProperties = {
  id: string;
  title: string;
};

export type CategoryProperties = {
  id: string;
  title: string;
  userId: string;
};

export type UserProperties = {
  id: string;
  name: string;
  email: string;
};
