import ThemeToggle from "@/components/ui/ThemeToggle";
import { Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Radio } from "@/components/ui/Radio";
import { Badge } from "@/components/ui/Badge";
import { Tooltip } from "@/components/ui/Tooltip";
import { Tabs } from "@/components/ui/Tabs";
import OverlayDemo from "@/components/playground/OverlayDemo";
import FeedbackDemo from "@/components/playground/FeedbackDemo";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import DataStatesDemo from "@/components/playground/DataStatesDemo";
import BookDemo from "@/components/playground/BookDemo";
import BookLayoutsDemo from "@/components/playground/BookLayoutsDemo";

function NavDemo() {
  return (
    <nav aria-label="Example navigation" className="flex flex-wrap gap-4">
      <a className="type-body text-primary underline" href="/">
        Home
      </a>
      <a className="type-body text-primary underline" href="/books">
        Browse books
      </a>
      <a className="type-body text-primary underline" href="/sell">
        Sell a book
      </a>
    </nav>
  );
}

const colors = [
  "background",
  "surface",
  "surface-soft",
  "foreground",
  "muted",
  "border",
  "primary",
  "accent",
  "accent-soft",
  "success",
  "warning",
  "danger",
];

export default function Playground() {
  return (
    <main className="mx-auto max-w-5xl space-y-16 px-6 py-16">
      <header className="flex items-center justify-between">
        <h1 className="type-h2">Design playground</h1>
        <ThemeToggle />
      </header>

      <section className="space-y-6">
        <h2 className="type-h4">Colors</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {colors.map((c) => (
            <div key={c} className="space-y-2">
              <div
                className="h-16 rounded-md border border-border"
                style={{ background: `var(--${c})` }}
              />
              <p className="type-caption">{c}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="type-h4">Typography</h2>
        <p className="type-display">Display</p>
        <p className="type-h1">Heading 1</p>
        <p className="type-h2">Heading 2</p>
        <p className="type-h3">Heading 3</p>
        <p className="type-h4">Heading 4</p>
        <p className="type-body-lg">
          Body large: discover stories worth keeping.
        </p>
        <p className="type-body">Body: discover stories worth keeping.</p>
        <p className="type-body-sm">
          Body small: discover stories worth keeping.
        </p>
        <p className="type-caption">Caption: 12–13px supporting text</p>
      </section>

      <section className="space-y-6">
        <h2 className="type-h4">Radius and shadow</h2>
        <div className="flex flex-wrap gap-6">
          {["sm", "md", "lg", "xl"].map((r) => (
            <div
              key={r}
              className={`flex h-24 w-24 items-center justify-center border border-border bg-surface shadow-card rounded-${r} type-caption`}
            >
              {r}
            </div>
          ))}
          <div className="flex h-32 w-24 items-center justify-center rounded-sm bg-primary text-primary-foreground shadow-cover type-caption">
            cover
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="type-h4">Buttons</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <IconButton label="Add to favorites">
            <Heart className="size-5" />
          </IconButton>
          <IconButton label="Search" variant="secondary">
            <Search className="size-5" />
          </IconButton>
          <IconButton label="Disabled icon button" disabled>
            <Heart className="size-5" />
          </IconButton>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="type-h4">Inputs</h2>
        <div className="grid max-w-md gap-6">
          <Input label="Book title" placeholder="The Future of Design" />
          <Input
            label="Email"
            type="email"
            hint="We'll only use this to sign you in."
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            defaultValue="123"
            error="Password must be at least 8 characters."
          />
          <Input label="Disabled" disabled placeholder="Can't edit this" />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="type-h4">Form controls</h2>
        <div className="grid max-w-md gap-6">
          <Textarea
            label="Description"
            hint="Tell readers what your book is about."
            placeholder="A short, honest summary..."
          />
          <Textarea
            label="Description (error)"
            error="Description is required."
          />
          <Select label="Category" defaultValue="">
            <option value="" disabled>
              Choose a category
            </option>
            <option>Fiction</option>
            <option>Technology</option>
            <option>Business</option>
          </Select>
          <Select label="Language (disabled)" disabled>
            <option>English</option>
          </Select>

          <div className="space-y-4">
            <Checkbox label="Remember me" />
            <Checkbox
              label="I confirm I have the legal right to distribute this book."
              description="Required before you can submit for review."
              defaultChecked
            />
            <Checkbox label="Disabled option" disabled />
          </div>

          <fieldset className="space-y-4">
            <legend className="type-label mb-3">Price</legend>
            <Radio name="price" label="Free" defaultChecked />
            <Radio
              name="price"
              label="Paid"
              description="Set your own price."
            />
            <Radio name="price" label="Disabled" disabled />
          </fieldset>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="type-h4">Badges</h2>
        <div className="flex flex-wrap gap-3">
          <Badge>Neutral</Badge>
          <Badge variant="draft" dot>
            Draft
          </Badge>
          <Badge variant="pending" dot>
            Pending Review
          </Badge>
          <Badge variant="published" dot>
            Published
          </Badge>
          <Badge variant="rejected" dot>
            Rejected
          </Badge>
          <Badge variant="archived" dot>
            Archived
          </Badge>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="type-h4">Tooltip, Tabs, Modal</h2>

        <div className="flex flex-wrap items-center gap-4">
          <Tooltip content="Add to favorites">
            <IconButton label="Add to favorites" variant="secondary">
              <Heart className="size-5" />
            </IconButton>
          </Tooltip>
          <OverlayDemo />
        </div>

        <Tabs
          items={[
            {
              value: "about",
              label: "About",
              content: <p className="type-body">About this book goes here.</p>,
            },
            {
              value: "preview",
              label: "Preview",
              content: <p className="type-body">Sample pages go here.</p>,
            },
            {
              value: "reviews",
              label: "Reviews",
              content: <p className="type-body">Reader reviews go here.</p>,
            },
          ]}
        />
      </section>

      <section className="space-y-6">
        <h2 className="type-h4">Dropdown, Drawer, Toast</h2>
        <FeedbackDemo />
      </section>

            <section className="space-y-6">
        <h2 className="type-h4">Avatar</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Avatar name="Sophea Chan" size="sm" />
          <Avatar name="Sophea Chan" size="md" />
          <Avatar name="Sophea Chan" size="lg" />
          <Avatar name="Sophea Chan" size="xl" />
          <Avatar name="Dara" />
          <Avatar name="Broken Image" src="https://invalid.example/nope.jpg" />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="type-h4">Skeleton</h2>
        <div className="flex max-w-lg gap-4">
          <Skeleton className="h-40 w-28 shrink-0 rounded-sm" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <SkeletonText lines={3} />
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="type-h4">Pagination, Empty, Error</h2>
        <DataStatesDemo />
      </section>

            <section className="space-y-6">
        <h2 className="type-h4">Book components</h2>
        <BookDemo />
      </section>  

      <section className="space-y-6">
        <h2 className="type-h4">Book layouts</h2>
        <BookLayoutsDemo />
      </section>

      <section className="space-y-6">
        <h2 className="type-h4">Navigation</h2>
        <NavDemo />
      </section>
    </main>
  );
}
