import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import type { Author } from "@/types/book";

export function AuthorCard({ author }: { author: Author }) {
  return (
    <Link
      href={`/authors/${author.id}`}
      className="group flex items-start gap-4 rounded-lg border border-border bg-surface p-5 transition duration-(--duration-fast) ease-(--ease-folio) hover:-translate-y-1 hover:shadow-card"
    >
      <Avatar name={author.name} src={author.avatarUrl} size="lg" />
      <div className="min-w-0 space-y-1">
        <h3 className="type-h4 group-hover:underline">{author.name}</h3>
        <p className="type-caption">
          {author.bookCount} {author.bookCount === 1 ? "book" : "books"}
        </p>
        <p className="line-clamp-2 type-body-sm text-muted">{author.bio}</p>
      </div>
    </Link>
  );
}