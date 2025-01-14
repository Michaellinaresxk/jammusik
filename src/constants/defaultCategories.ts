export const DEFAULT_CATEGORIES = [
  {label: 'Rock', value: 'rock'},
  {label: 'Pop', value: 'pop'},
  {label: 'Jazz', value: 'jazz'},
  {label: 'Classical', value: 'classical'},
  {label: 'Electronic', value: 'electronic'},
  {label: 'Hip Hop', value: 'hiphop'},
  {label: 'R&B', value: 'rnb'},
] as const;

export type DefaultCategory = (typeof DEFAULT_CATEGORIES)[number];
