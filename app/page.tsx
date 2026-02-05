import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/blog";
import { getBlogPosts } from "@/lib/notion";

// ISR: 1시간마다 재검증
export const revalidate = 3600;

export default async function Home() {
  const recentPosts = (await getBlogPosts()).slice(0, 3);

  return (
    <main>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            안녕하세요,
            <br />
            <span className="text-primary">풀스택 개발자</span>입니다
          </h1>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            문제 해결을 좋아하는 개발자입니다.
            <br />
            웹 기술과 새로운 기술 트렌드에 관심이 많습니다.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/about">About Me</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/blog">
                블로그 보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 최근 포스트 섹션 */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          {/* 섹션 헤더 */}
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              최근 글
            </h2>
            <Button variant="ghost" asChild>
              <Link href="/blog">
                전체 보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* 포스트 그리드 */}
          {recentPosts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg text-muted-foreground">
                아직 작성된 글이 없습니다.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Notion에서 첫 번째 글을 작성해보세요!
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
