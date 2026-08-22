export type Post = {
  id: number,
  user_id: number | null,
  title: string,
  content: string,
  is_public: boolean,
  published_date: string,
  last_updated_date: string
}
