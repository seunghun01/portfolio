"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import type { Tag } from "@/types/blog";

interface TagFilterProps {
  tags: Tag[];
  selectedTag?: string;
}

export function TagFilter({ tags, selectedTag }: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTagClick = (tagName: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedTag === tagName) {
      // 이미 선택된 태그 클릭 시 필터 해제
      params.delete("tag");
    } else {
      // 새 태그 선택
      params.set("tag", tagName);
    }

    router.push(`/blog?${params.toString()}`);
  };

  const handleAllClick = () => {
    router.push("/blog");
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* 전체 버튼 */}
      <Badge
        variant={!selectedTag ? "default" : "outline"}
        className="cursor-pointer transition-colors hover:bg-primary/80"
        onClick={handleAllClick}
      >
        전체
      </Badge>

      {/* 태그 목록 */}
      {tags.map((tag) => (
        <Badge
          key={tag.name}
          variant={selectedTag === tag.name ? "default" : "outline"}
          className="cursor-pointer transition-colors hover:bg-primary/80"
          onClick={() => handleTagClick(tag.name)}
        >
          {tag.name}
          <span className="ml-1 text-xs opacity-70">({tag.count})</span>
        </Badge>
      ))}
    </div>
  );
}
