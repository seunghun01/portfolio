import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeShiki from "@shikijs/rehype";

interface NotionRendererProps {
  content: string; // 마크다운 문자열
}

// 마크다운을 HTML로 변환하는 함수
async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeShiki, {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return String(result);
}

export async function NotionRenderer({ content }: NotionRendererProps) {
  const html = await markdownToHtml(content);

  return (
    <article
      className="prose prose-neutral dark:prose-invert max-w-none
        prose-headings:scroll-mt-20
        prose-h1:text-3xl prose-h1:font-bold
        prose-h2:text-2xl prose-h2:font-semibold prose-h2:border-b prose-h2:pb-2
        prose-h3:text-xl prose-h3:font-semibold
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-code:before:content-none prose-code:after:content-none
        prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
        prose-pre:bg-transparent prose-pre:p-0
        prose-img:rounded-lg prose-img:shadow-md
        prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:px-4
        [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:p-4
        [&_.shiki]:overflow-x-auto [&_.shiki]:rounded-lg [&_.shiki]:p-4
        [&_.shiki.github-light]:bg-[#f6f8fa] [&_.shiki.github-dark]:bg-[#24292e]
        dark:[&_.shiki.github-light]:hidden [&_.shiki.github-dark]:hidden dark:[&_.shiki.github-dark]:block"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
