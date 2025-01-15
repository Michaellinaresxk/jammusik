export interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  image?: string;
  preview_url?: string;
  release_date?: string;
  type?: string;
}

export interface SpotifyConfig {
  getTopTracks: () => Promise<Track[]>;
  getTrackDetails: (trackId: string) => Promise<Track>;
}

export type NewRelease = {
  id: string;
  name: string;
  artist: string;
  album: string;
  image?: string;
  release_date: string;
  external_url?: string;
};
