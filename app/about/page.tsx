import { Metadata } from "next";
import Link from "next/link";
import { NotionRenderer } from "@/components/blog/NotionRenderer";
import { getAboutPage } from "@/lib/notion";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

// ISR: 1시간마다 재검증
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About | 개발자 포트폴리오",
  description: "풀스택 개발자 소개 및 이력",
};

// 소셜 링크 설정 (실제 사용 시 본인 정보로 변경)
const socialLinks = [
  {
    icon: Github,
    href: "https://github.com/username",
    label: "GitHub",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com/in/username",
    label: "LinkedIn",
  },
  {
    icon: Twitter,
    href: "https://twitter.com/username",
    label: "Twitter",
  },
  {
    icon: Mail,
    href: "mailto:email@example.com",
    label: "Email",
  },
];

export default async function AboutPage() {
  const content = await getAboutPage();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        {/* 페이지 헤더 */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            About Me
          </h1>
          <p className="mt-2 text-muted-foreground">
            풀스택 개발자로서의 여정과 경험을 소개합니다.
          </p>
        </header>

        {/* 소셜 링크 */}
        <div className="mb-8 flex flex-wrap gap-2">
          {socialLinks.map((social) => (
            <Button
              key={social.label}
              variant="outline"
              size="sm"
              asChild
            >
              <Link
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon className="mr-2 h-4 w-4" />
                {social.label}
              </Link>
            </Button>
          ))}
        </div>

        {/* Notion 콘텐츠 */}
        <div className="rounded-lg border bg-card p-6 md:p-8">
          <NotionRenderer content={content} />
        </div>
      </div>
    </main>
  );
}
