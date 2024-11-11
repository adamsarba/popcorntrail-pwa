export type Movie = {
  id: string;
  title?: string;
  poster_path?: string;
  release_date?: string;
  watched: boolean;
  favourite: boolean;
  onList?: { listName: string }[];
  tags?: string[];
}