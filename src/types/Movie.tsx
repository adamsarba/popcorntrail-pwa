export type Movie = {
  id: string;
  title?: string;
  original_title?: string
  poster_path?: string;
  release_date?: string;
  watched: boolean;
  favourite: boolean;
  on_list?: { listName: string }[];
  tags?: string[];
};
