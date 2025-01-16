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

export interface Preview {
  id: string;
  preview_url: string | null;
  duration_ms: number;
  popularity: number;
}

export interface NewRelease {
  id: string;
  name: string;
  artist: string;
  album: string;
  image: string | null;
  release_date: string;
  external_url: string;
  duration_ms: number;
  popularity: number;
}
