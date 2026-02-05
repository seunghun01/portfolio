import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="mb-4 text-4xl font-bold">404</h1>
      <h2 className="mb-4 text-2xl font-semibold">포스트를 찾을 수 없습니다</h2>
      <p className="mb-8 text-muted-foreground">
        요청하신 블로그 포스트가 존재하지 않거나 삭제되었습니다.
      </p>
      <Button asChild>
        <Link href="/blog">블로그 목록으로</Link>
      </Button>
    </main>
  );
}
