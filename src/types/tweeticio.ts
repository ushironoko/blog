export type TweeticParams = {
  layout: '' | 'supabase';
  url: string;
};

export type TweeticResponse = {
  html: string;
  meta: {
    user_id: string;
    name: string;
    screen_name: string;
    verified: boolean;
    profile_image_url_https: string;
    url: string;
    profile_url: string;
    created_at: string;
    favorite_count: number;
    conversation_count: number;
  };
};
