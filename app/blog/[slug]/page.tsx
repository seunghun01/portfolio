import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { NotionRenderer } from "@/components/blog/NotionRenderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPostBySlug, getPostContent, getBlogPosts } from "@/lib/notion";
import { formatDate } from "@/lib/utils";

// ISR: 1시간마다 재검증
export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

// 정적 경로 생성
export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "포스트를 찾을 수 없습니다",
    };
  }

  return {
    title: `${post.title} | 블로그`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const content = await getPostContent(post.id);

  return (
    <main className="container mx-auto px-4 py-8">
      <article className="mx-auto max-w-3xl">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/blog">← 블로그 목록</Link>
          </Button>
        </div>

        {/* 커버 이미지 */}
        {post.coverImage && (
          <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg md:h-96">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {/* 포스트 헤더 */}
        <header className="mb-8 border-b pb-8">
          {/* 태그 */}
          {post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* 제목 */}
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            {post.title}
          </h1>

          {/* 날짜 */}
          <time className="text-muted-foreground">{formatDate(post.date)}</time>
        </header>

        {/* 콘텐츠 */}
        <NotionRenderer content={content} />

        {/* 하단 네비게이션 */}
        <div className="mt-12 border-t pt-8">
          <Button variant="outline" asChild>
            <Link href="/blog">← 블로그 목록으로 돌아가기</Link>
          </Button>
        </div>
      </article>
    </main>
  );
}
