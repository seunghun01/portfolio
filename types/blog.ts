// 블로그 포스트 기본 타입
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  tags: string[];
  published: boolean;
  coverImage?: string;
}

// 콘텐츠를 포함한 블로그 포스트 타입
export interface BlogPostWithContent extends BlogPost {
  content: string; // 마크다운 콘텐츠
}

// 태그 정보 타입
export interface Tag {
  name: string;
  count: number;
}
