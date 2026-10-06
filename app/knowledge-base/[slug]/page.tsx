// NexaSupport Knowledge Base Article Page

"use client";

import { use } from "react";
import { ArrowLeft, Eye, ThumbsUp, ThumbsDown, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/data/articles";
import { agents } from "@/data/agents";
import { formatDate, getArticleStatusBadge, ARTICLE_STATUS_LABELS_FA } from "@/lib/utils";
import { Card, Badge, Avatar } from "@/components/ui";

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const author = agents.find((a) => a.id === article.authorId);

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <Link href="/knowledge-base" className="text-sm text-accent hover:underline flex items-center gap-1">
        <ArrowLeft className="size-4" /> بازگشت به دانش‌نامه
      </Link>

      <Card>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="primary">{article.category}</Badge>
          <Badge variant={getArticleStatusBadge(article.status)}>{ARTICLE_STATUS_LABELS_FA[article.status]}</Badge>
        </div>

        <h1 className="font-display text-xl sm:text-2xl font-bold text-ink mb-2">{article.title}</h1>
        <p className="text-ink-3 mb-5">{article.excerpt}</p>

        <div className="flex flex-wrap items-center gap-4 pb-5 mb-5 border-b border-edge text-sm text-ink-3">
          {author && (
            <span className="flex items-center gap-2">
              <Avatar name={author.name} color={author.avatarColor} size="xs" />
              {author.name}
            </span>
          )}
          <span className="flex items-center gap-1"><Eye className="size-4" /> {article.views.toLocaleString("fa-IR")} بازدید</span>
          <span>به‌روزرسانی: {formatDate(article.updatedAt)}</span>
        </div>

        <div className="text-ink-2 leading-8 whitespace-pre-wrap">{article.content}</div>

        {article.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-edge">
            <Tag className="size-4 text-ink-3" />
            {article.tags.map((tag) => (
              <Badge key={tag} variant="default" size="sm">{tag}</Badge>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h3 className="font-display text-base font-bold text-ink mb-3">آیا این مقاله مفید بود؟</h3>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 text-ok"><ThumbsUp className="size-4" /> {article.helpful.toLocaleString("fa-IR")}</span>
          <span className="flex items-center gap-1 text-danger"><ThumbsDown className="size-4" /> {article.notHelpful.toLocaleString("fa-IR")}</span>
        </div>
      </Card>
    </div>
  );
}
