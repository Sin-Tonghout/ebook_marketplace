import Link from "next/link";

import {
  RevealOnScroll,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion";
import { popularAuthors } from "@/lib/mock/authors";

const tones = [
  { bg: "#1F2A24", fg: "#F4F1EA" },
  { bg: "#C98B5B", fg: "#1B1D1B" },
  { bg: "#557A61", fg: "#F7F5F0" },
  { bg: "#493A2F", fg: "#E9D8C8" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function PopularAuthors() {
  return (
    <section
      aria-labelledby="authors-heading"
      className="mx-auto max-w-7xl px-6 py-12 md:px-10"
    >
      <RevealOnScroll className="mb-10">
        <h2 id="authors-heading" className="type-h3">
          Popular authors
        </h2>
        <p className="mt-2 type-body text-muted">
          Voices our readers keep coming back to.
        </p>
      </RevealOnScroll>

      <StaggerChildren className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
        {popularAuthors.map((author, i) => {
          const tone = tones[i % tones.length];
          return (
            <StaggerItem key={author.id}>
              <Link
                href={`/authors/${author.id}`}
                className="group flex flex-col items-center text-center"
              >
                {author.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={author.avatarUrl}
                    alt=""
                    className="aspect-square w-full max-w-40 rounded-full object-cover transition duration-200 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div
                    aria-hidden
                    style={{ background: tone.bg, color: tone.fg }}
                    className="flex aspect-square w-full max-w-40 items-center justify-center rounded-full font-serif text-4xl transition duration-200 group-hover:scale-[1.03]"
                  >
                    {initials(author.name)}
                  </div>
                )}

                <h3 className="mt-4 type-label text-base group-hover:underline">
                  {author.name}
                </h3>
                <p className="mt-1 type-caption">
                  {author.bookCount} {author.bookCount === 1 ? "book" : "books"}
                </p>
              </Link>
            </StaggerItem>
          );
        })}
      </StaggerChildren>
    </section>
  );
}