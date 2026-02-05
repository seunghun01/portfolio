import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { BlogPost, BlogPostWithContent, Tag } from "@/types/blog";

// Notion 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Notion to Markdown 변환기 초기화
const n2m = new NotionToMarkdown({ notionClient: notion });

// 커버 이미지 URL 추출
function getCoverImage(page: PageObjectResponse): string | undefined {
  const cover = page.cover;
  if (!cover) return undefined;

  if (cover.type === "external") {
    return cover.external.url;
  } else if (cover.type === "file") {
    return cover.file.url;
  }
  return undefined;
}

// Notion 페이지를 BlogPost 타입으로 변환
function pageToPost(page: PageObjectResponse): BlogPost {
  const properties = page.properties;

  // Title 속성 추출
  const titleProperty = properties.Title;
  const title =
    titleProperty.type === "title"
      ? titleProperty.title.map((t) => t.plain_text).join("")
      : "";

  // Slug 속성 추출
  const slugProperty = properties.Slug;
  const slug =
    slugProperty.type === "rich_text"
      ? slugProperty.rich_text.map((t) => t.plain_text).join("")
      : "";

  // Description 속성 추출
  const descriptionProperty = properties.Description;
  const description =
    descriptionProperty.type === "rich_text"
      ? descriptionProperty.rich_text.map((t) => t.plain_text).join("")
      : "";

  // Date 속성 추출
  const dateProperty = properties.Date;
  const date =
    dateProperty.type === "date" ? dateProperty.date?.start || "" : "";

  // Tags 속성 추출
  const tagsProperty = properties.Tags;
  const tags =
    tagsProperty.type === "multi_select"
      ? tagsProperty.multi_select.map((tag) => tag.name)
      : [];

  // Published 속성 추출
  const publishedProperty = properties.Published;
  const published =
    publishedProperty.type === "checkbox" ? publishedProperty.checkbox : false;

  // 커버 이미지 추출
  const coverImage = getCoverImage(page);

  return {
    id: page.id,
    title,
    slug,
    description,
    date,
    tags,
    published,
    coverImage,
  };
}

// 블로그 포스트 목록 조회 (공개된 글만)
export async function getBlogPosts(): Promise<BlogPost[]> {
  const databaseId = process.env.NOTION_BLOG_DATABASE_ID;

  if (!databaseId) {
    throw new Error("NOTION_BLOG_DATABASE_ID 환경 변수가 설정되지 않았습니다.");
  }

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "Published",
      checkbox: {
        equals: true,
      },
    },
    sorts: [
      {
        property: "Date",
        direction: "descending",
      },
    ],
  });

  return response.results
    .filter((page): page is PageObjectResponse => "properties" in page)
    .map(pageToPost);
}

// 특정 태그의 포스트 목록 조회
export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const databaseId = process.env.NOTION_BLOG_DATABASE_ID;

  if (!databaseId) {
    throw new Error("NOTION_BLOG_DATABASE_ID 환경 변수가 설정되지 않았습니다.");
  }

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        {
          property: "Published",
          checkbox: {
            equals: true,
          },
        },
        {
          property: "Tags",
          multi_select: {
            contains: tag,
          },
        },
      ],
    },
    sorts: [
      {
        property: "Date",
        direction: "descending",
      },
    ],
  });

  return response.results
    .filter((page): page is PageObjectResponse => "properties" in page)
    .map(pageToPost);
}

// Slug로 단일 포스트 조회
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const databaseId = process.env.NOTION_BLOG_DATABASE_ID;

  if (!databaseId) {
    throw new Error("NOTION_BLOG_DATABASE_ID 환경 변수가 설정되지 않았습니다.");
  }

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        {
          property: "Slug",
          rich_text: {
            equals: slug,
          },
        },
        {
          property: "Published",
          checkbox: {
            equals: true,
          },
        },
      ],
    },
  });

  const page = response.results[0];

  if (!page || !("properties" in page)) {
    return null;
  }

  return pageToPost(page as PageObjectResponse);
}

// Slug로 포스트와 콘텐츠 함께 조회
export async function getPostWithContent(
  slug: string
): Promise<BlogPostWithContent | null> {
  const post = await getPostBySlug(slug);

  if (!post) {
    return null;
  }

  const content = await getPostContent(post.id);

  return {
    ...post,
    content,
  };
}

// 포스트 콘텐츠를 마크다운으로 변환
export async function getPostContent(pageId: string): Promise<string> {
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  const mdString = n2m.toMarkdownString(mdBlocks);
  return mdString.parent;
}

// About 페이지 콘텐츠 조회
export async function getAboutPage(): Promise<string> {
  const pageId = process.env.NOTION_ABOUT_PAGE_ID;

  if (!pageId) {
    throw new Error("NOTION_ABOUT_PAGE_ID 환경 변수가 설정되지 않았습니다.");
  }

  const mdBlocks = await n2m.pageToMarkdown(pageId);
  const mdString = n2m.toMarkdownString(mdBlocks);
  return mdString.parent;
}

// 모든 태그 목록 조회 (카운트 포함)
export async function getAllTags(): Promise<Tag[]> {
  const posts = await getBlogPosts();
  const tagMap = new Map<string, number>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// 모든 슬러그 목록 조회 (정적 생성용)
export async function getAllSlugs(): Promise<string[]> {
  const posts = await getBlogPosts();
  return posts.map((post) => post.slug);
}

// 타입 re-export
export type { BlogPost, BlogPostWithContent, Tag };
