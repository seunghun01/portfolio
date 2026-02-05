import { Suspense } from "react";
import { Metadata } from "next";
import { BlogCard, TagFilter } from "@/components/blog";
import { getBlogPosts, getBlogPostsByTag, getAllTags } from "@/lib/notion";
import { Skeleton } from "@/components/ui/skeleton";

// ISR: 1시간마다 재검증
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "블로그 | 개발자 포트폴리오",
  description: "기술 블로그 포스트 목록",
};

interface Props {
  searchParams: Promise<{ tag?: string }>;
}

// 블로그 목록 컴포넌트
async function BlogList({ tag }: { tag?: string }) {
  const posts = tag ? await getBlogPostsByTag(tag) : await getBlogPosts();

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg text-muted-foreground">
          {tag
            ? `"${tag}" 태그의 글이 없습니다.`
            : "아직 작성된 글이 없습니다."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// 태그 필터 래퍼 (서버 컴포넌트)
async function TagFilterWrapper({ selectedTag }: { selectedTag?: string }) {
  const tags = await getAllTags();

  if (tags.length === 0) {
    return null;
  }

  return <TagFilter tags={tags} selectedTag={selectedTag} />;
}

// 로딩 스켈레톤
function BlogListSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-48 w-full rounded-t-lg" />
          <div className="space-y-2 p-4">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// 태그 필터 스켈레톤
function TagFilterSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-6 w-16 rounded-full" />
      ))}
    </div>
  );
}

export default async function BlogPage({ searchParams }: Props) {
  const { tag } = await searchParams;

  return (
    <main className="container mx-auto px-4 py-8">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">블로그</h1>
        <p className="mt-2 text-muted-foreground">
          개발 경험과 학습 내용을 기록합니다.
        </p>
      </div>

      {/* 태그 필터 */}
      <div className="mb-8">
        <Suspense fallback={<TagFilterSkeleton />}>
          <TagFilterWrapper selectedTag={tag} />
        </Suspense>
      </div>

      {/* 블로그 목록 */}
      <Suspense fallback={<BlogListSkeleton />}>
        <BlogList tag={tag} />
      </Suspense>
    </main>
  );
}
