interface Props {
  name: string;
  src?: string;
  size?: number;
}

export function UserAvatar({ name, src, size = 96 }: Props) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={`${name}'s avatar`}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      aria-label={`${name}'s avatar`}
      role="img"
      className="flex items-center justify-center rounded-full bg-[var(--accent-soft)] font-serif text-[var(--primary)]"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
}