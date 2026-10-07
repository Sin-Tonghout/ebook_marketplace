# E-Book Marketplace — Design-First Full-Stack Blueprint

> **Project direction:** A premium, animated e-book marketplace where readers discover, preview, buy, read, collect, and review books while authors/users can publish and sell books they legally own or have permission to distribute.
>
> **Primary goal:** **UX/UI design quality and animation come first.** Backend functionality supports the experience; it does not define the product.

---

## 1. Product Vision

The product should feel like:

> **A beautiful digital library + modern bookstore + publishing platform.**

It should **not** feel like:

> A normal CRUD website that happens to contain PDF files.

The central experience is:

```text
DISCOVER
   ↓
EXPLORE
   ↓
PREVIEW
   ↓
BUY
   ↓
LIBRARY
   ↓
READ
   ↓
COLLECT
   ↓
PUBLISH YOUR OWN
```

The design should make books, typography, editorial composition, reading, and motion the visual focus.

---

# 2. Product Goals

## Primary goals

1. Build a premium, modern e-book marketplace.
2. Make UX/UI quality the highest priority.
3. Use animation to make interactions feel alive without slowing the interface.
4. Make book discovery fast and enjoyable.
5. Make the online reading experience feel calm and immersive.
6. Make publishing a book feel simple and rewarding.
7. Build a reusable design system instead of designing every page separately.
8. Keep the architecture clean enough to grow into a production application.

## Secondary goals

- User reviews and ratings
- Author profiles
- Personalized library
- Search and filtering
- Seller analytics
- Admin moderation
- Orders and payments
- Notifications
- Favorites and bookmarks

---

# 3. Important Publishing Rule

Users should only publish or sell books they:

- Own the copyright for, or
- Have explicit permission/licensing to distribute, or
- Are otherwise legally allowed to publish/distribute.

The publishing flow should include a rights confirmation step.

Example:

```text
[ ] I confirm that I have the legal right to distribute this book.
```

Admin moderation should be able to review reports and remove content when necessary.

---

# 4. Target Product Personality

## Keywords

- Premium
- Editorial
- Calm
- Modern
- Minimal
- Warm
- Intelligent
- Interactive
- Immersive
- Fast

## Avoid

- Blue/purple gradient-heavy UI
- Generic Bootstrap-looking pages
- Excessive glassmorphism
- Too many floating cards
- Excessive shadows
- Overly rounded everything
- Huge animation everywhere
- Cluttered dashboards
- Tiny text
- Too many colors

---

# 5. Design Direction

## Visual concept

**Modern editorial + digital library**

Think of the visual language as a combination of:

```text
Premium bookstore
        +
Editorial magazine
        +
Modern reading application
        +
Clean SaaS interaction design
```

The book cover should be the hero visual element.

---

# 6. Recommended Color System

Avoid the common blue/purple SaaS appearance.

## Light theme

```text
Background       #F7F5F0
Surface          #FFFFFF
Surface Soft     #F1EEE7
Text Primary     #1B1D1B
Text Secondary   #6F746F
Border           #E2DED5
Primary          #1F2A24
Accent           #C98B5B
Accent Soft      #E9D8C8
Success          #557A61
Warning          #B88948
Danger           #A85C54
```

## Dark theme

```text
Background       #111412
Surface          #181C19
Surface Soft     #202521
Text Primary     #F4F1EA
Text Secondary   #A9AEA9
Border           #303631
Primary          #F4F1EA
Accent           #C98B5B
Accent Soft      #493A2F
Success          #7FA487
Warning          #D0A15B
Danger           #C4776E
```

## Color ratio

Use a restrained ratio:

```text
60%  Background / large surfaces
30%  Content / secondary surfaces
10%  Accent / primary actions / highlights
```

Accent should guide attention, not dominate the screen.

---

# 7. Typography System

Typography is one of the most important design elements in this product.

## UI font

**Inter**

Use for:

- Navigation
- Buttons
- Inputs
- Filters
- Dashboard
- Labels
- Data

## Editorial font

Recommended:

- Playfair Display
- Cormorant Garamond
- DM Serif Display

Use selectively for:

- Hero headings
- Book titles
- Feature statements
- Author/editorial sections

## Suggested scale

```text
Display        64–88px
H1             48–64px
H2             36–48px
H3             28–36px
H4             22–28px
Body Large     18px
Body           16px
Body Small     14px
Caption        12–13px
```

Use responsive typography rather than fixed desktop sizes everywhere.

## Weight

```text
Regular        400
Medium         500
Semibold       600
Bold           700
```

Do not make every heading bold.

---

# 8. Spacing System

Use a consistent spacing scale.

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
80px
96px
128px
```

The interface should feel spacious rather than compressed.

---

# 9. Border Radius

Use a controlled radius system.

```text
Small       8px
Medium      12px
Large       16px
XL          24px
Pill        999px
```

Not every component needs a large radius.

Books and editorial cards can use more restrained geometry.

---

# 10. Shadows

Prefer soft, low-contrast elevation.

Avoid strong black shadows.

Example:

```text
Card shadow:
0 10px 30px rgba(... very low opacity ...)
```

Book covers can have slightly stronger shadows to create physical depth.

---

# 11. Animation Philosophy

Animation is a core part of the product, but the goal is:

> **Physical, smooth, purposeful motion — not flashy motion.**

Every animation should answer a question:

- What changed?
- Why did it change?
- Where did it come from?
- What can the user do next?

---

# 12. Animation Levels

## Level 1 — Micro interactions

Timing:

```text
150–200ms
```

Use for:

- Button hover
- Icon state
- Color transitions
- Small scale
- Focus states
- Book-card hover

## Level 2 — UI transitions

Timing:

```text
250–400ms
```

Use for:

- Modal
- Drawer
- Dropdown
- Tabs
- Filter panels
- Toast notifications
- Card state changes

## Level 3 — Showcase motion

Timing:

```text
500–800ms
```

Use selectively for:

- Hero entrance
- Major page transitions
- Publishing completion
- Featured book presentation
- Large editorial sections

The application must still feel fast.

---

# 13. Animation Rules

Use:

- Opacity
- Translate
- Scale
- Rotate
- Clip/reveal
- Layout movement
- Shared element transitions
- Scroll-linked motion

Avoid:

- Constant bouncing
- Large random rotations
- Excessive parallax
- Long blocking animations
- Animation on every element

Support:

```css
@media (prefers-reduced-motion: reduce) {
  /* Reduce or disable non-essential motion */
}
```

---

# 14. Recommended Animation Technologies

## Motion for React

Primary animation library.

Use for:

- Hover interactions
- Enter/exit animations
- Layout animation
- Page transitions
- Scroll reveal
- Gestures
- Drag interactions

## GSAP

Use only when advanced timeline or cinematic motion is genuinely needed.

Examples:

- Hero storytelling
- Complex scroll sequences
- Advanced product showcase

Do not use GSAP everywhere if Motion can handle the job.

---

# 15. Core Technology Stack

## Frontend

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
Motion for React
```

## Backend

```text
Node.js
Express.js
```

## Database

```text
MySQL
```

## Local development

```text
AMPPS
```

AMPPS is used primarily for the local MySQL database in this architecture.

## ORM

```text
Prisma
```

Use the stable Prisma path supported for the chosen environment rather than adopting experimental ORM releases in the middle of the project.

## Other tools

```text
Zod              Data validation
Lucide React     Icons
Recharts         Seller/admin charts
PDF.js           PDF reading/preview
EPUB reader      EPUB reading support
```

## Payments

```text
ABA PayWay
```

Use demo/testing integration first and connect production credentials only near the end.

---

# 16. Why Express Is Included

Express is the dedicated backend API.

Architecture:

```text
Browser
   ↓
Next.js
   ↓
REST API
   ↓
Express.js
   ↓
Services / Business Logic
   ↓
Prisma
   ↓
MySQL
```

This gives a clear separation between:

- Visual experience
- Frontend state
- API
- Business logic
- Database

It is also useful for learning proper full-stack architecture.

---

# 17. Local Development Architecture with AMPPS

```text
                         YOUR PC
                            │
             ┌──────────────┴──────────────┐
             │                             │
           AMPPS                         Node.js
             │                             │
          MySQL                         Express
             │                             │
             └──────────────┬──────────────┘
                            │
                         REST API
                            │
                         Next.js
                            │
                         Browser
```

Suggested local ports:

```text
Next.js       http://localhost:3000
Express       http://localhost:5000
MySQL         localhost:3306
```

Do not run Express through AMPPS Apache. Let Node.js run Express directly.

---

# 18. Local Database Configuration

Example `.env` for the backend:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=ebook_marketplace
DB_USER=root
DB_PASSWORD=mysql

DATABASE_URL="mysql://root:mysql@localhost:3306/ebook_marketplace"
```

Example frontend environment:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

> Replace credentials with the actual credentials configured in your AMPPS installation.

Never commit `.env` to Git.

---

# 19. High-Level Architecture

```text
                         E-BOOK MARKETPLACE
                                  │
                ┌─────────────────┴─────────────────┐
                │                                   │
             FRONTEND                            BACKEND
                │                                   │
        Next.js / React                        Express.js
                │                                   │
        Tailwind / shadcn                    Controllers
                │                                   │
             Motion                              Services
                │                                   │
             Reader                               Prisma
                │                                   │
                └─────────────────┬─────────────────┘
                                  │
                                MySQL
                                  │
                ┌─────────────────┼─────────────────┐
                │                 │                 │
              Users             Books             Orders
                │                 │                 │
             Library            Files            Payment
```

---

# 20. User Types

## Guest

Can:

- Browse books
- Search
- View authors
- Preview books
- View categories
- Register/login

## User / Reader

Can:

- Buy books
- Read purchased books
- Save favorites
- Create a library
- Review books
- Track reading progress
- Become a seller

## Seller / Author

Can:

- Create author profile
- Upload books
- Edit books
- Upload covers
- Add preview pages
- Set prices
- Submit books for review
- View sales
- View earnings
- Track downloads

## Admin

Can:

- Manage users
- Moderate books
- Manage categories
- Review reports
- Manage orders
- Feature books
- Manage platform settings

## Super Admin

Can manage the full platform and administrator permissions.

---

# 21. UX User Journey

## Reader journey

```text
Home
 ↓
Discover book
 ↓
Book detail
 ↓
Preview
 ↓
Buy
 ↓
Payment
 ↓
Library
 ↓
Read
 ↓
Bookmark / Review
```

## Seller journey

```text
Profile
 ↓
Become seller
 ↓
Create book
 ↓
Book information
 ↓
Upload file
 ↓
Upload cover
 ↓
Pricing
 ↓
Rights confirmation
 ↓
Preview
 ↓
Submit for review
 ↓
Admin approval
 ↓
Published
 ↓
Sales
```

---

# 22. Homepage UX

The homepage should be editorial and visually memorable.

## Hero

Example:

```text
Discover stories
worth keeping.

Read. Collect. Share.

[Explore Books]    [Publish Your Book]
```

Hero visual:

- Layered book covers
- Slight perspective
- Soft depth
- Mouse/gesture interaction
- Gentle motion

Do not overcrowd the hero with text.

---

# 23. Homepage Section Order

Recommended sequence:

```text
1. Hero
2. Featured Book
3. Trending Books
4. New Releases
5. Categories
6. Popular Authors
7. Continue Reading (for logged-in users)
8. Publishing CTA
9. Footer
```

---

# 24. Featured Book Section

Use an editorial composition instead of a normal card grid.

```text
┌────────────────────────────────────────────┐
│                                            │
│   BOOK COVER       Book Title              │
│                    Author                  │
│                    Description             │
│                    Rating                  │
│                    Price                   │
│                    [Buy Now]               │
│                                            │
└────────────────────────────────────────────┘
```

Animation:

- Cover gently floats into place
- Text reveals sequentially
- CTA follows after main content
- Background element moves subtly on scroll

---

# 25. Book Card Design

Book cards are one of the most important reusable components.

Default state:

```text
┌───────────────┐
│               │
│   BOOK COVER  │
│               │
└───────────────┘

Book Title
Author
$8.99
```

Hover state:

```text
        [♡]

     BOOK COVER

   [Quick Preview]

Book Title
Author
$8.99
```

Recommended motion:

```text
translateY(-6px)
small shadow increase
cover scale 1.01–1.03
quick action fade/slide in
```

Keep movement subtle.

---

# 26. Book Detail Page

This is a major conversion and discovery page.

## Hero area

```text
┌──────────────────────────────────────────────┐
│                                              │
│       BOOK COVER       BOOK TITLE             │
│                       Author                  │
│                       Rating                  │
│                       Category                │
│                       Description             │
│                                              │
│                       $12.00                 │
│                       [Buy Now]              │
│                       [Add to Library]       │
│                                              │
└──────────────────────────────────────────────┘
```

## Content sections

1. About this book
2. Preview
3. Table of contents
4. About the author
5. Reviews
6. Related books

---

# 27. Interactive Book Preview

The preview should feel like a real reading experience.

Possible interaction:

```text
< Previous       Page 2 / 8       Next >
```

Animate page changes with:

- Horizontal slide
- Fade
- Subtle page-turn effect

Do not make every page transition theatrical.

---

# 28. Online Reader

The reader can become the signature feature of the application.

```text
┌──────────────────────────────────────────────┐
│ ← Back       Book Title        42%       ⚙  │
├──────────────────────────────────────────────┤
│                                              │
│                 Chapter 4                    │
│                                              │
│         Lorem ipsum dolor sit amet...        │
│         Lorem ipsum dolor sit amet...        │
│         Lorem ipsum dolor sit amet...        │
│                                              │
│                                              │
├──────────────────────────────────────────────┤
│          ━━━━━━━━━━━━━                       │
│                42%                           │
└──────────────────────────────────────────────┘
```

## Reader controls

- Font size
- Font family
- Line spacing
- Reading width
- Light theme
- Dark theme
- Bookmark
- Search
- Table of contents
- Reading progress

## Reader UX principle

The reader should remove distractions.

Do not use noisy gradients, large cards, or unnecessary UI inside the reading area.

---

# 29. User Library

The library should feel like a personal collection.

```text
My Library

Continue Reading

[Book]   67% complete
[Book]   31% complete

My Books

Recently Added | Favorites | Downloaded | Completed
```

Each item should show meaningful progress where available.

Example:

```text
The Future of Design
━━━━━━━━━━━━━━ 67%
```

---

# 30. Search UX

Search should feel immediate.

Opening search:

```text
Search books, authors, topics...
```

As the user types:

```text
technology

Books
Technology for Beginners
Modern Technology

Authors
John Smith

Categories
Technology
```

Use a command-palette style interaction on desktop if appropriate.

---

# 31. Filtering

Suggested filters:

```text
Category
Language
Price
Rating
Format
Publication Date
Author
```

Desktop:

```text
Books
──────────────────────────────
[Filters]        248 Books

[Book] [Book] [Book] [Book]
[Book] [Book] [Book] [Book]
```

Mobile:

Use a filter drawer instead of a permanent sidebar.

---

# 32. Author Profile

Author page should feel like a personal publishing profile.

Include:

- Avatar/photo
- Name
- Biography
- Social/profile links
- Published books
- Rating
- Followers (optional)
- Featured book

Visual style should be editorial, not social-media clutter.

---

# 33. Publishing Experience

Publishing is one of the most important UX flows.

Do not make it one giant form.

Use a multi-step wizard.

---

# 34. Publishing Step 1 — Book Information

```text
Tell us about your book
```

Fields:

- Title
- Subtitle
- Description
- Category
- Language
- Tags

Use inline validation and clear help text.

---

# 35. Publishing Step 2 — Upload Book

```text
┌──────────────────────────────┐
│                              │
│   Drag & Drop your file      │
│                              │
│       PDF / EPUB             │
│                              │
└──────────────────────────────┘
```

Upload animation:

```text
Uploading
██████████████░░░ 82%
```

Show:

- File name
- File type
- File size
- Upload progress
- Processing status
- Error state

---

# 36. Publishing Step 3 — Cover

Allow:

- Upload cover
- Preview cover
- Replace cover
- Remove cover

Preview should show how the cover will look as a marketplace card.

---

# 37. Publishing Step 4 — Pricing

Example:

```text
Free
$2.99
$4.99
$9.99
Custom
```

Also consider:

- Currency
- Promotional price
- Free preview percentage

---

# 38. Publishing Step 5 — Rights

```text
Publishing rights

[ ] I confirm that I have the legal right to distribute this book.
```

Explain what the confirmation means.

---

# 39. Publishing Step 6 — Preview

Show the book exactly as a reader will see it.

Preview:

- Cover
- Metadata
- Price
- Description
- Sample pages
- Author information

---

# 40. Publishing Step 7 — Submit

Use a satisfying completion interaction.

```text
Your book is ready.

[Save Draft]        [Submit for Review]
```

After successful submission:

```text
✓ Submitted for review

We will notify you when the review is complete.
```

Use animation to communicate completion.

---

# 41. Seller Dashboard

Do not make this look like an old-fashioned administration panel.

Greeting:

```text
Good evening, Hout

Here's how your books are doing.
```

Statistics:

```text
Sales            $1,248
Downloads        3,824
Books            14
Rating            4.8
```

Then:

- Sales graph
- Recent sales
- My books
- Earnings
- Best-performing book

---

# 42. Seller Book Management

Each book should display:

```text
Cover
Title
Status
Sales
Revenue
Views
Rating
Last updated
```

Statuses:

```text
Draft
Pending Review
Published
Rejected
Archived
```

Use badges with clear accessible color and text.

---

# 43. Seller Analytics

Recommended charts:

- Revenue over time
- Units sold
- Downloads
- Views
- Conversion rate
- Top books
- Top categories

Use Recharts or another lightweight chart system.

Charts should tell a story, not become decoration.

---

# 44. Admin UX

Admin is for moderation, management, and platform operations.

Main dashboard:

```text
Users             12,483
Books              3,824
Pending Review        28
Orders              8,294
Revenue           $42,821
```

---

# 45. Admin Moderation Queue

This is especially important for user-uploaded books.

Example card:

```text
┌──────────────────────────────────────────┐
│ Book Cover                               │
│                                          │
│ Title                                    │
│ Author                                   │
│ Uploaded: 2 hours ago                    │
│                                          │
│ [Preview] [Approve] [Reject]             │
└──────────────────────────────────────────┘
```

Admin should be able to inspect:

- Book metadata
- File
- Cover
- Rights confirmation
- Author
- Reports
- Previous moderation history

---

# 46. Notifications

Notification types:

- Purchase successful
- Book added to library
- Book review received
- Book submitted
- Book approved
- Book rejected
- Payment completed
- Seller earnings updated

Use toast notifications for immediate feedback and an inbox/page for persistent notifications.

---

# 47. Empty States

Every important list needs a designed empty state.

Examples:

```text
Your library is empty.
Start discovering your next book.

[Explore Books]
```

For seller:

```text
You haven't published a book yet.

[Publish Your First Book]
```

Do not leave empty white space with no explanation.

---

# 48. Loading States

Use skeletons for content that is expected to appear.

Examples:

- Book cover skeleton
- Text skeleton
- Author skeleton
- Dashboard statistic skeleton
- Table skeleton

For uploads, use real progress rather than generic spinners whenever possible.

---

# 49. Error States

Errors should be clear and actionable.

Bad:

```text
Error 500
```

Better:

```text
We couldn't load this book.

Please try again.

[Retry]
```

For upload:

```text
Upload failed

The file could not be processed.

[Try Again]
```

---

# 50. Component Design System

Create these reusable components first:

```text
Button
Input
Select
Textarea
Checkbox
Radio
Switch
Search
BookCard
AuthorCard
Rating
Badge
Modal
Drawer
Dropdown
Toast
Tabs
Pagination
Progress
UploadBox
Price
Avatar
Navbar
Footer
Sidebar
EmptyState
LoadingState
Skeleton
```

Advanced components:

```text
BookPreview
BookReader
BookShelf
ReadingProgress
UploadWizard
AnalyticsCard
SalesChart
ReviewCard
```

Do not redesign the same component independently on every page.

---

# 51. Navigation Design

Desktop navigation concept:

```text
Logo

Books
Categories
Authors

        Search

              Library
              Sell
              Profile
```

Keep navigation visually quiet so the content remains dominant.

Mobile:

Use a clean menu/drawer with large touch targets.

---

# 52. Buttons

Primary:

- Dark/strong primary color
- Strong contrast
- Medium radius
- Clear hover state

Secondary:

- Outline or soft surface

Tertiary:

- Text action

Icon button:

- Always provide tooltip/accessible label when meaning is not obvious

Never use emoji as a substitute for UI icons.

Use Lucide icons or another coherent icon system.

---

# 53. Responsive Design

Design from mobile and desktop simultaneously.

Breakpoints should be treated as layout behavior, not just screen sizes.

## Mobile priorities

- One-column content
- Bottom-sheet filters
- Large touch targets
- Simple navigation
- Minimal reader chrome
- Horizontal book shelves

## Desktop priorities

- Multi-column grids
- Rich editorial compositions
- Side panels
- Hover interactions
- Command/search interaction
- Larger reading area

---

# 54. Accessibility

Include accessibility from the beginning.

Requirements:

- Proper semantic HTML
- Keyboard navigation
- Visible focus states
- Good contrast
- Alt text for book covers where appropriate
- Accessible form labels
- Error announcements
- Reduced-motion support
- Screen-reader-friendly controls
- Sufficient touch target sizes

Animation must never be necessary to understand information.

---

# 55. Data Model

Core entities:

```text
users
authors
books
book_files
book_previews
categories
tags
book_tags
orders
order_items
payments
libraries
favorites
reviews
reading_progress
downloads
reports
notifications
```

Relationship example:

```text
User
 │
 ├── Author Profile
 │       │
 │       └── Books
 │             │
 │             ├── Category
 │             ├── Tags
 │             ├── File
 │             ├── Reviews
 │             └── Sales
 │
 └── Library
       │
       └── Purchased Books
```

---

# 56. Core Database Concepts

## users

```text
id
name
email
password_hash
role
status
avatar_url
created_at
updated_at
```

## authors

```text
id
user_id
display_name
bio
avatar_url
website_url
created_at
updated_at
```

## books

```text
id
author_id
category_id
title
subtitle
description
cover_url
price
currency
language
format
status
published_at
created_at
updated_at
```

## orders

```text
id
user_id
status
total_amount
currency
payment_status
created_at
updated_at
```

## order_items

```text
id
order_id
book_id
price
created_at
```

## libraries

```text
id
user_id
book_id
purchased_at
created_at
```

## reading_progress

```text
id
user_id
book_id
progress_percent
last_page
last_position
updated_at
```

---

# 57. API Structure

Example REST API:

```text
/api/auth
/api/users
/api/books
/api/authors
/api/categories
/api/tags
/api/library
/api/favorites
/api/reviews
/api/orders
/api/payments
/api/uploads
/api/reader
/api/seller
/api/admin
/api/notifications
```

Example book endpoints:

```text
GET    /api/books
GET    /api/books/:id
POST   /api/books
PUT    /api/books/:id
DELETE /api/books/:id
POST   /api/books/:id/submit
```

Example library:

```text
GET    /api/library
POST   /api/library/:bookId
GET    /api/library/:bookId
```

---

# 58. Backend Folder Structure

```text
backend/
├── config/
│   ├── db.js
│   └── env.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── book.controller.js
│   ├── author.controller.js
│   ├── order.controller.js
│   ├── payment.controller.js
│   ├── seller.controller.js
│   └── admin.controller.js
│
├── middleware/
│   ├── auth.middleware.js
│   ├── role.middleware.js
│   ├── error.middleware.js
│   └── upload.middleware.js
│
├── routes/
│   ├── auth.routes.js
│   ├── book.routes.js
│   ├── library.routes.js
│   ├── order.routes.js
│   ├── payment.routes.js
│   ├── seller.routes.js
│   └── admin.routes.js
│
├── services/
│   ├── auth.service.js
│   ├── book.service.js
│   ├── order.service.js
│   ├── payment.service.js
│   └── upload.service.js
│
├── validators/
│   ├── auth.validator.js
│   ├── book.validator.js
│   └── order.validator.js
│
├── utils/
│   ├── logger.js
│   └── response.js
│
├── app.js
└── server.js
```

---

# 59. Frontend Folder Structure

```text
frontend/
└── next-app/
    ├── app/
    │   ├── page.tsx
    │   ├── books/
    │   ├── authors/
    │   ├── library/
    │   ├── read/
    │   ├── seller/
    │   ├── admin/
    │   ├── login/
    │   └── register/
    │
    ├── components/
    │   ├── ui/
    │   ├── books/
    │   ├── reader/
    │   ├── seller/
    │   └── layout/
    │
    ├── hooks/
    ├── lib/
    ├── services/
    ├── types/
    └── styles/
```

---

# 60. Animation Component Organization

Keep motion logic reusable.

```text
components/
└── motion/
    ├── FadeIn.tsx
    ├── SlideUp.tsx
    ├── ScaleIn.tsx
    ├── PageTransition.tsx
    ├── StaggerChildren.tsx
    ├── RevealOnScroll.tsx
    └── SharedLayout.tsx
```

Then pages can compose animation patterns rather than duplicating them.

---

# 61. Recommended Page List

## Public

```text
/
/books
/books/:id
/categories
/authors
/authors/:id
/search
/login
/register
```

## User

```text
/library
/favorites
/reading
/orders
/profile
/settings
```

## Reader

```text
/read/:id
```

## Seller

```text
/seller
/seller/books
/seller/books/create
/seller/books/:id/edit
/seller/orders
/seller/analytics
/seller/earnings
```

## Admin

```text
/admin
/admin/users
/admin/books
/admin/books/pending
/admin/orders
/admin/categories
/admin/reports
/admin/settings
```

---

# 62. UX State Checklist

Every important interaction should have these states:

```text
Default
Hover
Focus
Active
Disabled
Loading
Success
Error
Empty
```

For asynchronous actions also consider:

```text
Uploading
Processing
Saving
Submitted
Approved
Rejected
```

This is a critical part of making the UI feel like a real product.

---

# 63. Performance Rules

Because the project is design-heavy, animation cannot destroy performance.

Priorities:

1. Animate transform and opacity whenever possible.
2. Avoid huge DOM trees.
3. Lazy-load heavy book preview/readers.
4. Lazy-load images.
5. Use optimized image formats.
6. Avoid loading the full reader before it is needed.
7. Keep animations GPU-friendly.
8. Use skeletons rather than blocking spinners for longer content loads.
9. Measure performance instead of guessing.

---

# 64. Image / Book Cover Strategy

Book covers are the main visual asset.

Requirements:

- Consistent aspect ratio
- Responsive sizing
- Lazy loading
- Placeholder while loading
- Error fallback
- Optimized image formats

Never let inconsistent cover dimensions destroy the grid.

---

# 65. Book Grid Rules

Desktop examples:

```text
4 columns
5 columns
6 columns
```

depending on content width and card size.

Mobile:

```text
2 columns
```

or horizontally scrollable shelves for editorial sections.

Do not force every section into the same grid.

---

# 66. Editorial Shelf Pattern

Use horizontal book shelves for:

- Trending
- New releases
- Continue reading
- Recommended
- Similar books

Example:

```text
Trending Books                         See all →

[Book] [Book] [Book] [Book] [Book] →
```

This creates a stronger digital-library feeling.

---

# 67. Payment UX

Flow:

```text
Book Detail
 ↓
Buy Now
 ↓
Checkout
 ↓
Payment method
 ↓
ABA PayWay
 ↓
Payment confirmation
 ↓
Success
 ↓
Book automatically appears in Library
```

Important UX rule:

The user should never have to manually add a purchased book to the library.

---

# 68. Checkout Design

Keep checkout focused.

```text
Checkout

Book
Price
Subtotal
Payment method

[Pay Now]
```

Do not distract users with unnecessary navigation during payment.

---

# 69. Success Experience

A successful purchase should feel rewarding.

Example:

```text
Purchase complete

Your book is now in your library.

[Start Reading]
```

Animation can include:

- Checkmark reveal
- Book cover transition
- CTA entrance

Keep it elegant rather than celebratory overload.

---

# 70. Security Basics

Backend must include:

- Password hashing
- Secure authentication
- Authorization middleware
- Input validation
- Rate limiting where appropriate
- Secure cookies
- CORS configuration
- File type validation
- File size validation
- Upload path protection
- Parameterized queries/ORM
- Error handling without leaking secrets

For paid content, access to book files must be authorized rather than exposed as unrestricted public URLs.

---

# 71. File Upload Security

Validate:

- MIME type
- Extension
- File size
- Filename safety
- Storage path

Do not trust a filename or extension sent by the client.

Use generated storage names rather than arbitrary user filenames.

---

# 72. Book Rights / Moderation UX

Publishing states:

```text
Draft
 ↓
Submitted
 ↓
Under Review
 ↓
Approved → Published

or

Rejected → Edit → Resubmit
```

This should be visible to the seller.

---

# 73. Design Tokens

Create tokens before building pages.

Example:

```text
colors
spacing
radius
shadow
typography
motion
z-index
container widths
```

Example motion tokens:

```text
motion-fast       180ms
motion-normal     300ms
motion-slow       600ms
motion-ease       cubic-bezier(...)
```

Centralize these values so the product remains visually consistent.

---

# 74. Design System Build Order

Before building the complete homepage:

```text
1. Color tokens
2. Typography
3. Spacing
4. Buttons
5. Inputs
6. Cards
7. Navigation
8. Modal
9. Drawer
10. Toast
11. Book card
12. Author card
13. Loading/skeletons
14. Empty states
15. Animation primitives
```

Only after this should the full pages be composed.

---

# 75. UX/UI Development Strategy

The main development principle is:

> **Design the system, then compose the pages.**

Do not start by writing 30 pages one by one.

Instead:

```text
Design tokens
    ↓
Components
    ↓
Patterns
    ↓
Sections
    ↓
Pages
    ↓
Flows
    ↓
Backend integration
```

---

# 76. Development Method — Small Pieces Only

This project should be built in **small, testable pieces**.

Do not think:

```text
"Build the whole marketplace."
```

Think:

```text
One component
→ test
→ one interaction
→ test
→ one section
→ test
→ one page
→ test
→ connect data
→ test
```

Every phase below has:

- a clear goal
- small tasks
- a visible result
- a verification checklist
- a stopping point before moving on

The priority remains:

```text
UX/UI
  ↓
Visual quality
  ↓
Interaction
  ↓
Animation
  ↓
Responsive behavior
  ↓
Accessibility
  ↓
Backend integration
  ↓
Commerce
  ↓
Production
```

---

# 77. Master Phase Roadmap

The complete build is divided into **16 phases**.

```text
PHASE 00  Product + UX foundation
PHASE 01  Project setup
PHASE 02  Design system
PHASE 03  Animation system
PHASE 04  Homepage
PHASE 05  Discovery + search
PHASE 06  Book detail + preview
PHASE 07  Authentication + user profile
PHASE 08  Library + reading experience
PHASE 09  Publishing experience
PHASE 10  Seller dashboard
PHASE 11  Commerce with mock payment
PHASE 12  Admin + moderation
PHASE 13  Backend + database integration
PHASE 14  QA + security + performance
PHASE 15  Production deployment + storage + free domain + ABA PayWay
```

**Important:** Real ABA PayWay configuration is intentionally kept in the final phase. Earlier commerce uses a **mock payment adapter** so the UX can be completed without payment-provider complexity.

---

# 78. Phase 00 — Product + UX Foundation

## Goal

Decide exactly what the product is before writing application code.

## 00.1 Define the product

Write down:

```text
Product name
Product tagline
Target users
Main user problem
Main business model
Main book categories
Supported languages
Supported currencies
```

## 00.2 Define the user roles

```text
Guest
User / Reader
Author / Seller
Admin
Super Admin
```

## 00.3 Define the main user journeys

### Reader

```text
Home
→ Search
→ Book detail
→ Preview
→ Checkout
→ Library
→ Reader
```

### Seller

```text
Profile
→ Become seller
→ Create book
→ Upload
→ Preview
→ Set price
→ Rights confirmation
→ Submit
→ Track status
```

### Admin

```text
Login
→ Moderation queue
→ Review book
→ Approve / Reject
→ Manage users
→ Manage categories
→ Review reports
```

## 00.4 Define UX principles

Use these as permanent product rules:

```text
1. Show, don't explain.
2. Keep important actions obvious.
3. Never leave the user wondering what happened.
4. Animation should communicate, not decorate.
5. Empty states should teach the next action.
6. Error states should explain recovery.
7. Mobile is not a smaller desktop.
8. The reader should feel calm and focused.
```

## 00.5 Decide the MVP

### MVP reader features

```text
Browse
Search
Book details
Preview
Register / login
Library
Read online
Favorites
```

### MVP seller features

```text
Create seller profile
Upload book
Upload cover
Set price
Rights confirmation
Submit for review
Seller book list
```

### MVP admin features

```text
Admin login
Book moderation
User management
Category management
Reports
```

### MVP commerce

```text
Cart / Buy now
Mock checkout
Mock payment
Order creation
Library delivery
```

## Done when

You can explain the complete product in 30 seconds and draw the main flows on one page.

---

# 79. Phase 01 — Project Setup

## Goal

Create a clean development environment without building features yet.

## 01.1 Create repository

```text
ebook-marketplace/
```

Initialize Git and create:

```text
main
```

Use feature branches during development:

```text
feature/homepage
feature/book-detail
feature/reader
feature/seller-upload
```

## 01.2 Create frontend

Use:

```text
Next.js
React
TypeScript
Tailwind CSS
```

## 01.3 Create backend

Use:

```text
Node.js
Express.js
```

Recommended:

```text
backend/
├── config/
├── controllers/
├── middleware/
├── routes/
├── services/
├── validators/
├── utils/
├── app.js
└── server.js
```

## 01.4 Configure AMPPS

Use AMPPS locally for MySQL.

Create:

```text
Database: ebook_marketplace
```

Recommended local values:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ebook_marketplace
DB_USER=root
DB_PASSWORD=mysql
```

Do not place secrets inside Git.

## 01.5 Configure Prisma

Connect Prisma to the local MySQL database.

## 01.6 Add environment files

```text
frontend/.env.local
backend/.env
```

Never commit actual secrets.

## 01.7 Add basic health endpoint

```text
GET /api/health
```

Expected:

```json
{
  "success": true,
  "service": "ebook-api"
}
```

## Test

```text
Frontend opens locally
Backend starts
MySQL connects
Prisma connects
/api/health returns 200
```

## Done when

You can start the entire project locally from a clean machine setup without manually changing application code.

---

# 80. Phase 02 — Design System

## Goal

Create the visual language before building pages.

This is one of the **most important phases**.

## 02.1 Design tokens

Define:

```text
Colors
Typography
Spacing
Radius
Borders
Shadows
Z-index
Container widths
Breakpoints
Motion timings
```

## 02.2 Build typography

Create reusable styles for:

```text
Display
H1
H2
H3
H4
Body Large
Body
Body Small
Caption
Label
```

## 02.3 Build spacing scale

Example:

```text
4
8
12
16
20
24
32
40
48
64
80
96
120
```

## 02.4 Build core components

Do these one by one:

```text
Button
IconButton
Input
Textarea
Select
Checkbox
Radio
Badge
Avatar
Tooltip
Dropdown
Tabs
Modal
Drawer
Toast
Pagination
Skeleton
EmptyState
ErrorState
```

## 02.5 Build book components

```text
BookCard
BookCardCompact
BookCardFeatured
BookCover
BookMeta
BookPrice
Rating
AuthorCard
CategoryCard
```

## 02.6 Build navigation components

```text
DesktopNavbar
MobileNavbar
SearchBar
UserMenu
Breadcrumb
Sidebar
```

## Test

Create one playground page containing every component.

Check:

```text
Default
Hover
Focus
Active
Disabled
Loading
Error
Mobile
Dark mode
```

## Done when

You can create a new page using the design system without inventing a new button, card, spacing rule, or color every time.

---

# 81. Phase 03 — Animation System

## Goal

Create one coherent motion language for the entire app.

## 03.1 Define animation levels

```text
Micro        150–200ms
Interface    250–400ms
Showcase     500–800ms
```

## 03.2 Build reusable animation primitives

```text
FadeIn
FadeUp
ScaleIn
SlideIn
StaggerChildren
HoverLift
PressScale
PageTransition
ModalTransition
DrawerTransition
ToastTransition
```

## 03.3 Book hover system

Normal:

```text
translateY(0)
```

Hover:

```text
translateY(-4px to -8px)
```

Add only subtle cover rotation or depth.

## 03.4 Scroll reveal

Use it for:

```text
Featured section
Category section
Author section
Publishing CTA
```

Do not animate every line of text.

## 03.5 Loading animation

Build:

```text
Skeleton
Shimmer
Progress bar
Upload progress
Reader loading
```

## 03.6 Reduced motion

Respect:

```text
prefers-reduced-motion
```

## Test

Ask:

```text
Does the animation explain a state change?
Does it make the interaction clearer?
Is it fast?
Does it remain usable on mobile?
Can it be reduced?
```

## Done when

Two unrelated pages still feel like they belong to the same product because the motion language is consistent.

---

# 82. Phase 04 — Homepage

## Goal

Make the first 10 seconds feel premium.

## 04.1 Build page shell

```text
Navbar
Main
Footer
```

## 04.2 Build hero

Include:

```text
Editorial headline
Short value proposition
Explore Books CTA
Publish Your Book CTA
Book-cover composition
```

## 04.3 Animate book stack

On page load:

```text
Cover 1 → fade + rise
Cover 2 → fade + rotate
Cover 3 → fade + rise
```

On hover:

```text
pointer movement
→ small parallax
→ depth shift
```

Keep this subtle.

## 04.4 Build featured book

Include:

```text
Large cover
Title
Author
Description
Rating
Price
CTA
```

## 04.5 Build trending shelf

Horizontal scroll on mobile.

## 04.6 Build new releases

Use a responsive book grid.

## 04.7 Build categories

Use editorial category blocks rather than plain buttons.

## 04.8 Build author section

Show selected authors with profile images and book count.

## 04.9 Build publishing CTA

```text
Have a story to share?
Publish your book.
```

## 04.10 Add footer

Include:

```text
Explore
Publish
Help
Terms
Privacy
Contact
```

## Test

Check the home page at:

```text
360px
768px
1024px
1440px+
```

## Done when

The homepage looks polished using only mock data.

---

# 83. Phase 05 — Discovery + Search

## Goal

Make finding a book feel effortless.

## 05.1 Books page

Build:

```text
Page heading
Search
Filters
Sort
Book count
Book grid
Pagination / infinite loading
```

## 05.2 Search overlay

Desktop and mobile should support a fast search experience.

Show:

```text
Recent searches
Books
Authors
Categories
```

## 05.3 Filter drawer

Filters:

```text
Category
Language
Price
Rating
Format
Publication date
Author
```

## 05.4 Filter chips

Example:

```text
Technology ×
Free ×
English ×
```

## 05.5 Sort

```text
Newest
Most popular
Highest rated
Price: low → high
Price: high → low
```

## 05.6 Empty search

Instead of:

```text
No results
```

Show:

```text
We couldn't find that book.
Try another title, author, or topic.

[Browse Popular Books]
```

## 05.7 Loading

Use skeleton book cards instead of a generic spinner.

## Test

Test:

```text
search
clear search
apply filter
remove filter
sort
mobile drawer
empty result
slow loading
```

## Done when

A user can discover a relevant book without understanding the internal database or category structure.

---

# 84. Phase 06 — Book Detail + Preview

## Goal

Make the book detail page feel like a premium product page.

## 06.1 Build hero

```text
Cover
Title
Subtitle
Author
Rating
Price
Format
Buy Now
Add to Library / Favorite
```

## 06.2 Build description

Use readable editorial typography.

## 06.3 Build book metadata

```text
Pages
Language
Published date
File format
Category
```

## 06.4 Build interactive preview

Show selected pages or excerpts.

Possible UI:

```text
Previous
Page
Next
```

## 06.5 Build author section

```text
Author photo
Bio
Books
Follow
```

## 06.6 Build reviews

```text
Average rating
Rating distribution
Review list
Write review
```

## 06.7 Build related books

Use recommendation logic later; mock data first.

## 06.8 Build purchase feedback

After a successful mock purchase:

```text
Book added to your library
[Read now]
```

## Test

Test the entire flow using only fake data.

## Done when

The page answers all important questions before checkout:

```text
What is it?
Who wrote it?
What does it contain?
Can I preview it?
How much does it cost?
What do I get after buying?
```

---

# 85. Phase 07 — Authentication + User Profile

## Goal

Create a calm authentication experience.

## 07.1 Login

Fields:

```text
Email
Password
```

## 07.2 Register

Fields:

```text
Name
Email
Password
Confirm password
```

## 07.3 Password recovery

Build the complete UI even before email delivery is connected.

## 07.4 Session states

Support:

```text
Guest
Authenticated
Seller
Admin
Suspended
```

## 07.5 User profile

```text
Avatar
Name
Email
Bio
Favorite categories
Reading stats
```

## 07.6 Become seller

Create a clear conversion flow:

```text
Why publish?
→ Seller information
→ Rights confirmation
→ Create seller profile
```

## Test

Check:

```text
login
logout
invalid password
validation
session persistence
redirects
role restrictions
```

## Done when

Users understand whether they are logged in and what their current role allows.

---

# 86. Phase 08 — Library + Reading Experience

## Goal

Make the reading experience the calmest part of the product.

## 08.1 Library home

Sections:

```text
Continue Reading
My Books
Favorites
Downloaded / Offline
Completed
```

## 08.2 Continue reading card

Show:

```text
Book cover
Title
Current chapter
Reading percentage
Continue button
```

## 08.3 Reader shell

```text
Top toolbar
Book title
Progress
Reader content
Bottom / side controls
```

## 08.4 Reader controls

```text
Font size
Font family
Line height
Theme
Reading width
Bookmarks
Search
Table of contents
```

## 08.5 Light / dark / sepia

Reading themes:

```text
Light
Dark
Sepia
```

## 08.6 Reading progress

Store:

```text
book_id
user_id
page / position
percentage
last_read_at
```

## 08.7 Bookmark interaction

User can:

```text
bookmark page
view bookmarks
remove bookmark
```

## 08.8 Page transitions

Keep reader transitions minimal.

Reader motion should never feel like a game.

## 08.9 Reader loading

Use:

```text
cover placeholder
text skeleton
progress indicator
```

## Test

```text
Open book
Change font size
Change theme
Jump chapter
Bookmark
Leave
Return
Continue from saved position
```

## Done when

Reading feels more focused than browsing.

---

# 87. Phase 09 — Publishing Experience

## Goal

Make publishing a book feel simple even though the underlying workflow is complex.

Build the publishing flow as a wizard.

```text
STEP 1 → Information
STEP 2 → File
STEP 3 → Cover
STEP 4 → Pricing
STEP 5 → Rights
STEP 6 → Preview
STEP 7 → Submit
```

## 09.1 Step 1 — Book information

```text
Title
Subtitle
Description
Category
Language
Tags
```

## 09.2 Step 2 — Upload book

Accept the formats you choose to support.

Show:

```text
Drag & drop
Browse files
Upload progress
Validation
File size
File type
```

## 09.3 Step 3 — Cover

Support:

```text
Upload image
Preview
Replace
Remove
```

## 09.4 Step 4 — Pricing

```text
Free
Custom price
Currency
```

## 09.5 Step 5 — Rights

Require explicit confirmation that the user has the right to publish/distribute the book.

## 09.6 Step 6 — Preview

Show exactly how the public book page will look.

## 09.7 Step 7 — Submit

Statuses:

```text
Draft
Submitted
Under review
Approved
Rejected
Published
Unpublished
```

## 09.8 Seller feedback

After submit:

```text
Your book has been submitted.
We'll let you know when review is complete.
```

## Test

Try intentionally invalid situations:

```text
No title
No cover
Unsupported file
Too-large file
No price
Rights checkbox missing
```

## Done when

A first-time seller can complete the process without external instructions.

---

# 88. Phase 10 — Seller Dashboard

## Goal

Make the seller dashboard feel like a publishing studio, not an accounting spreadsheet.

## 10.1 Dashboard home

Show:

```text
Books
Sales
Downloads
Revenue
Rating
```

## 10.2 My books

Book cards with:

```text
Cover
Title
Status
Price
Sales
Revenue
Actions
```

## 10.3 Book editor

Allow:

```text
Edit metadata
Replace cover
Replace file
Change price
Save draft
Submit changes
Unpublish
```

## 10.4 Analytics

Charts:

```text
Sales over time
Revenue over time
Downloads
Top books
```

## 10.5 Orders

Show:

```text
Order ID
Book
Date
Amount
Status
```

## 10.6 Seller profile

```text
Avatar
Display name
Bio
Social links
Published books
Rating
```

## Test

Use mock seller data and verify that every state has:

```text
Data
Loading
Empty
Error
Success
```

---

# 89. Phase 11 — Commerce With Mock Payment

## Goal

Finish the complete buying experience **without integrating ABA PayWay yet**.

This keeps the project focused on UX/UI first.

## 11.1 Buy now

Build:

```text
Product summary
Price
Quantity if applicable
Total
```

For single e-books, quantity can remain `1`.

## 11.2 Checkout

```text
Account
Order summary
Price
Discount / promo placeholder
Payment placeholder
Confirm purchase
```

## 11.3 Mock payment adapter

Create a fake service:

```text
MockPaymentService
```

Possible states:

```text
pending
success
failed
cancelled
```

## 11.4 Order creation

When mock payment succeeds:

```text
Create order
→ mark payment paid
→ add book to library
→ generate receipt
→ show success
```

## 11.5 Purchase success

Make the success state memorable but restrained.

```text
Purchase complete
Your book is ready.

[Read now]
[Go to library]
```

## 11.6 Purchase failure

Show recovery:

```text
Payment didn't complete.
Your order was not charged.

[Try again]
[Back to checkout]
```

## Test

Test all mock states before moving to real payment.

## Done when

A complete user can buy a book, receive it in the library, and read it without ABA PayWay being connected.

---

# 90. Phase 12 — Admin + Moderation

## Goal

Give administrators the tools to protect the marketplace and maintain quality.

## 12.1 Admin login

Use role-based access.

## 12.2 Dashboard

Show:

```text
Users
Books
Pending reviews
Orders
Revenue
Reports
```

## 12.3 Moderation queue

For each book:

```text
Cover
Title
Author
Uploader
Description
Rights declaration
Preview
Reports
```

Actions:

```text
Approve
Reject
Request changes
Unpublish
```

## 12.4 User management

```text
Search
Filter
View profile
Suspend
Reactivate
Change role
```

## 12.5 Category management

```text
Create
Edit
Delete
Reorder
```

## 12.6 Reports

Users can report:

```text
Copyright concern
Inappropriate content
Spam
Misleading information
Other
```

## 12.7 Admin audit trail

Record important actions:

```text
Who
What
When
Target
```

## Test

Confirm a normal user cannot access admin routes.

Confirm every moderation action leaves the expected status change.

---

# 91. Phase 13 — Backend + Database Integration

## Goal

Connect the polished UX to real data only after the main interface is stable.

## 13.1 Build database schema

Core tables:

```text
users
auth_sessions
authors
books
book_files
book_previews
categories
tags
book_tags
orders
order_items
payments
libraries
favorites
reviews
reading_progress
bookmarks
notifications
reports
audit_logs
```

## 13.2 Add relationships

Example:

```text
User
 ├── Author profile
 ├── Orders
 ├── Library
 ├── Favorites
 ├── Reviews
 ├── Reading progress
 └── Notifications

Author
 └── Books

Book
 ├── Author
 ├── Category
 ├── Tags
 ├── File
 ├── Preview
 ├── Reviews
 ├── Orders
 └── Library entries
```

## 13.3 Build API one feature at a time

Recommended order:

```text
1. Auth
2. Users
3. Categories
4. Authors
5. Books
6. Book files
7. Search/filter
8. Library
9. Reading progress
10. Favorites
11. Reviews
12. Orders
13. Payments
14. Seller analytics
15. Admin moderation
```

## 13.4 API example

```text
GET    /api/books
GET    /api/books/:id
POST   /api/books
PATCH  /api/books/:id
DELETE /api/books/:id
```

## 13.5 Middleware

Build reusable middleware for:

```text
Authentication
Authorization
Validation
Rate limiting
Error handling
Logging
Upload checks
```

## 13.6 Validators

Use Zod or equivalent validation for:

```text
Register
Login
Book metadata
Pricing
Reviews
Orders
```

## 13.7 Error format

Use a consistent API response structure.

Example:

```json
{
  "success": false,
  "message": "Book not found",
  "code": "BOOK_NOT_FOUND"
}
```

## Test

Connect one page at a time:

```text
Books page
→ real API
→ real database

Book detail
→ real API

Library
→ real API
```

Do not connect the entire frontend in one giant step.

---

# 92. Phase 14 — QA + Security + Performance

## Goal

Make the system reliable before production deployment.

## 14.1 Functional testing

Test:

```text
Register
Login
Logout
Search
Filter
View book
Favorite
Buy mock book
Library
Read
Publish
Moderation
```

## 14.2 Permission testing

Test every protected route as:

```text
Guest
User
Seller
Admin
Suspended user
```

## 14.3 File upload security

Validate:

```text
Extension
MIME type
Size
Filename
Storage path
Permissions
```

Never trust the browser-provided file extension alone.

## 14.4 Paid-content protection

Do not expose original book files through an unrestricted public folder.

Use controlled download/read access.

## 14.5 Password security

Use a modern password hashing algorithm and secure session cookies.

## 14.6 Environment security

Never commit:

```text
Database password
JWT/session secrets
RSA private key
Payment API secrets
Storage credentials
```

## 14.7 Rate limiting

Protect at minimum:

```text
Login
Register
Password recovery
Search API
Reviews
Upload API
Payment API
```

## 14.8 Performance

Optimize:

```text
Book cover sizes
Image formats
Lazy loading
Code splitting
API pagination
Database indexes
Caching
Reader loading
```

## 14.9 Accessibility

Check:

```text
Keyboard navigation
Visible focus
Contrast
Labels
Alt text
ARIA where needed
Reduced motion
```

## 14.10 Final responsive pass

Test:

```text
360px
390px
768px
1024px
1280px
1440px+
```

## Done when

No critical user flow depends on a happy-path assumption.

---

# 93. Phase 15 — Production Deployment + Free Domain + Storage + Final ABA PayWay

This is the **final phase**.

Do not start this phase until:

```text
UX is finished
Frontend is stable
Backend is stable
Database migrations work
Mock checkout works
Security checks are done
Responsive QA is done
```

---

## 93.1 Production architecture

Recommended low-cost learning deployment:

```text
                    INTERNET
                       │
              ┌────────┴────────┐
              │                 │
           Frontend           Backend
           Vercel             Render
              │                 │
          Next.js             Express
                                │
                              Prisma
                                │
                         Production DB
                                │
                         Object Storage
                           Cloudflare R2
                                │
                           E-book files
```

### Why this setup?

Vercel's free Hobby plan is intended for personal projects/small-scale applications and automatically provides a `.vercel.app` deployment URL. citeturn916363search1turn916363search0

Render supports Node.js/Express web services and gives each web service an `onrender.com` subdomain. Its free web services are useful for testing/hobby deployments, but free services spin down when idle and local filesystem changes are lost, so do **not** store e-books on the Render filesystem. citeturn463215search3turn463215search0

Cloudflare R2 provides an included monthly free tier of 10 GB-month of Standard storage, 1 million Class A operations, 10 million Class B operations, and free egress. Usage above those limits can incur charges, so it is a free-tier object-storage option, not unlimited free storage. citeturn877555search0

---

## 93.2 Important meaning of "free domain"

For this project, start with a **free platform subdomain**, not a paid custom domain.

Examples:

```text
Frontend:
https://ebook-marketplace.vercel.app

Backend:
https://ebook-marketplace-api.onrender.com
```

A true custom domain such as:

```text
ebookmarketplace.com
```

normally requires registering/buying the domain.

Do not design the deployment plan around unreliable free-domain providers.

---

## 93.3 Step A — Prepare GitHub

Push:

```text
frontend
backend
prisma
package.json
README
```

Do not push:

```text
.env
.env.local
private keys
uploaded books
node_modules
```

Create a production branch if desired:

```text
main
```

---

## 93.4 Step B — Deploy frontend

Use Vercel for the Next.js application.

Tasks:

```text
1. Import GitHub repository
2. Select frontend directory
3. Configure build settings
4. Add environment variables
5. Deploy
6. Open the generated .vercel.app URL
```

Frontend environment example:

```env
NEXT_PUBLIC_API_URL=https://ebook-marketplace-api.onrender.com/api
```

---

## 93.5 Step C — Deploy Express backend

Use Render for the Express API.

Tasks:

```text
1. Create Web Service
2. Connect GitHub
3. Select backend project
4. Add environment variables
5. Configure build command
6. Configure start command
7. Deploy
8. Test /api/health
```

The Express process must listen on:

```text
0.0.0.0
```

rather than only `localhost`. Render documents this requirement for public web services. citeturn463215search3

Example:

```js
const port = process.env.PORT || 5000;

app.listen(port, '0.0.0.0', () => {
  console.log(`API running on ${port}`);
});
```

---

## 93.6 Step D — Production database

Your local database remains:

```text
AMPPS → MySQL
```

For production, choose a managed database that fits the hosting architecture and budget.

Important:

```text
Local AMPPS MySQL
≠
Production database
```

Do not try to expose your local AMPPS MySQL server to the public internet.

The first production deployment can use a separate managed database, then update the Prisma `DATABASE_URL` in the backend environment.

---

## 93.7 Step E — Configure Cloudflare R2 storage

Create buckets for:

```text
book-files
book-covers
book-previews
avatars
```

Recommended object metadata:

```text
object key
mime type
size
uploaded_at
book_id
owner_id
```

Do not store:

```text
book.pdf
cover.jpg
```

inside the Express application directory for production.

Use R2 instead.

---

## 93.8 Step F — Storage access pattern

The recommended flow is:

```text
User uploads book
        ↓
Express validates file
        ↓
Express stores object in R2
        ↓
Database stores object key
        ↓
User receives success
```

For reading/downloading protected books:

```text
User requests book
        ↓
Express checks purchase/library rights
        ↓
Express authorizes access
        ↓
Generate controlled object access
        ↓
Reader receives book data
```

The exact signed-URL implementation depends on the final reader architecture.

---

## 93.9 Step G — Final production environment variables

### Backend

```env
NODE_ENV=production
PORT=10000

DB_HOST=
DB_PORT=3306
DB_NAME=
DB_USER=
DB_PASSWORD=
DATABASE_URL=

SESSION_SECRET=

FRONTEND_URL=https://ebook-marketplace.vercel.app

R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_BOOKS=book-files
R2_BUCKET_COVERS=book-covers
R2_BUCKET_PREVIEWS=book-previews
```

### Frontend

```env
NEXT_PUBLIC_API_URL=https://ebook-marketplace-api.onrender.com/api
```

Do not expose:

```text
R2 secret key
Database password
Session secret
ABA private key
```

in frontend environment variables.

---

# 94. Final ABA PayWay Integration — Do This Last

ABA PayWay should be the **last major feature to connect**.

The official PayWay developer documentation provides a sandbox specifically for testing before replacing sandbox credentials with production credentials. citeturn363916search0

The Purchase API starts a payment transaction and supports hosted checkout / other checkout integration options; PayWay also provides a transaction-check API for reconciliation. citeturn363916search13turn363916search3

PayWay's current API documentation also notes that the calling domain/IP must be whitelisted, so doing this after the backend has a stable deployed URL is important. citeturn363916search1

---

## 94.1 What should already work before PayWay

```text
Book page
Buy button
Checkout UI
Order creation
Mock payment
Order status
Library delivery
Success screen
Failure screen
Receipt
```

Only replace the payment adapter.

Do not redesign checkout during PayWay integration unless a real gateway constraint requires it.

---

## 94.2 Payment architecture

Use a payment service abstraction:

```text
PaymentService
    │
    ├── MockPaymentService
    │
    └── AbaPayWayService
```

Your checkout code should call:

```text
PaymentService.createPayment()
```

instead of directly calling ABA everywhere.

This allows:

```text
Mock → development
ABA Sandbox → testing
ABA Production → live
```

without rewriting the checkout UX.

---

## 94.3 ABA PayWay environment model

```text
PAYWAY_ENV=sandbox
```

Later:

```text
PAYWAY_ENV=production
```

Keep sandbox and production credentials completely separate.

PayWay documents separate sandbox and production endpoints. citeturn363916search1turn363916search3

---

## 94.4 PayWay environment variables

Use your actual PayWay credential names from the PayWay account/documentation.

Suggested application-level names:

```env
PAYWAY_ENV=sandbox
PAYWAY_MERCHANT_ID=
PAYWAY_API_KEY=
PAYWAY_PUBLIC_KEY=
PAYWAY_RSA_PUBLIC_KEY=
PAYWAY_RSA_PRIVATE_KEY=
PAYWAY_API_BASE_URL=https://checkout-sandbox.payway.com.kh

PAYWAY_RETURN_URL=https://ebook-marketplace-api.onrender.com/api/payments/payway/return
PAYWAY_CALLBACK_URL=https://ebook-marketplace-api.onrender.com/api/payments/payway/callback
```

### Important credential note

PayWay's current developer material uses an API key/HMAC-style signing value for some APIs and RSA keys for endpoints that require RSA operations. Do not assume that a field named `Public Key` in your account maps to every API's signing requirement; map each credential to the exact PayWay endpoint documentation used by the integration. citeturn363916search3turn363916search6

### Never expose this in the browser

```env
PAYWAY_RSA_PRIVATE_KEY=
```

The private key belongs only on the backend.

---

## 94.5 Sandbox integration steps

### Step 1

Create/use the PayWay sandbox account.

### Step 2

Store sandbox credentials only in backend environment variables.

### Step 3

Implement:

```text
POST /api/payments/payway/create
```

### Step 4

Create a unique transaction ID for every order.

Example concept:

```text
EB-2026-000001
```

Do not use a random transaction ID that cannot be reconciled with your internal order.

### Step 5

Generate the required PayWay signature/hash according to the exact API request specification.

PayWay documents parameter hashing requirements for its APIs. citeturn363916search1turn363916search3

### Step 6

Send the purchase request from **Express**, never directly from the browser using private credentials.

### Step 7

Redirect or open the configured PayWay checkout experience.

### Step 8

Handle the return/callback.

### Step 9

Do not mark the order paid merely because the browser returned successfully.

Verify the transaction with PayWay's transaction-check mechanism and reconcile the result with your own order record. PayWay recommends its check-transaction API for reconciliation after receiving a response. citeturn363916search3

### Step 10

Only after verified payment success:

```text
payment.status = paid
order.status = completed
library entry = created
receipt = generated
```

---

# 95. ABA PayWay Test Matrix

Before production, test every important payment state.

```text
SUCCESS
FAILED
CANCELLED
TIMEOUT
RETURNED WITHOUT PAYMENT
DUPLICATE CALLBACK
DUPLICATE TRANSACTION ID
INVALID HASH
INVALID ORDER
ALREADY PAID ORDER
```

Also verify:

```text
User closes browser
User returns later
Callback arrives twice
Frontend shows stale state
Payment succeeds but frontend times out
```

The database, not the frontend screen, must be the final source of order status.

---

# 96. Move ABA PayWay From Sandbox to Production

Only do this after all sandbox tests pass.

## Step 1

Request/obtain production PayWay credentials through the official PayWay onboarding process. PayWay's developer portal states that production credentials are provided through its merchant onboarding process. citeturn363916search0

## Step 2

Keep sandbox credentials unchanged for testing.

## Step 3

Add production credentials to the production backend only.

```env
PAYWAY_ENV=production
PAYWAY_MERCHANT_ID=<production>
PAYWAY_API_KEY=<production>
PAYWAY_PUBLIC_KEY=<production>
PAYWAY_RSA_PUBLIC_KEY=<production>
PAYWAY_RSA_PRIVATE_KEY=<production>
PAYWAY_API_BASE_URL=https://checkout.payway.com.kh
```

Use the exact production endpoint and credentials supplied for your merchant account.

## Step 4

Ask PayWay to whitelist the deployed production domain/IP required by the integration. Their current documentation explicitly calls out domain/IP whitelisting. citeturn363916search1

## Step 5

Make one controlled real transaction.

## Step 6

Verify:

```text
Payment
Order
Payment record
Library
Receipt
```

## Step 7

Keep detailed logs without logging secrets.

Never log:

```text
RSA private key
API secrets
Full credential values
```

---

# 97. Production Deployment Checklist

## Frontend

```text
[ ] Production build succeeds
[ ] HTTPS works
[ ] API URL points to production
[ ] No localhost references
[ ] Images load correctly
[ ] Book covers load
[ ] Reader loads
[ ] Mobile works
```

## Backend

```text
[ ] NODE_ENV=production
[ ] Health endpoint works
[ ] CORS configured
[ ] Error handling configured
[ ] Rate limiting enabled
[ ] Upload validation enabled
[ ] Logs enabled
[ ] Secrets stored in host environment
```

## Database

```text
[ ] Production DATABASE_URL configured
[ ] Migrations applied
[ ] Indexes checked
[ ] Backups considered
```

## Storage

```text
[ ] R2 buckets configured
[ ] Upload works
[ ] Cover upload works
[ ] Private book access works
[ ] Public cover access works where intended
[ ] Signed/protected access tested
```

## PayWay

```text
[ ] Sandbox tested
[ ] Callback tested
[ ] Transaction verification tested
[ ] Production credentials stored securely
[ ] Production domain/IP whitelisted
[ ] One real transaction verified
```

---

# 98. Free / Low-Cost Deployment Reality Check

The project can be **developed and demonstrated at very low cost**, but do not interpret "free" as unlimited.

### Practical free/low-cost starting setup

```text
Frontend
Vercel Hobby
→ free project URL: *.vercel.app

Backend
Render Free
→ free URL: *.onrender.com
→ may sleep when idle

Book storage
Cloudflare R2
→ monthly free allowance
→ usage above allowance can cost money

Local database
AMPPS MySQL
→ development only

Production database
Managed provider
→ choose based on current availability/budget

Custom domain
Optional paid domain later
```

Vercel documents a free Hobby plan and automatic `.vercel.app` URLs; Render documents free Express/Node web services but warns that free services have limitations and are not intended for production workloads; Cloudflare documents the current R2 free monthly allowances. citeturn916363search1turn916363search0turn463215search0turn877555search0

For an actual commercial marketplace with real paying users, plan to move away from free-tier limitations once usage or reliability requirements grow.

---

# 99. Post-Deployment UX Validation

Even after deployment, test the product as a real user.

## Reader

```text
Open site
→ browse
→ search
→ open book
→ preview
→ purchase
→ open library
→ read
```

## Seller

```text
Login
→ seller dashboard
→ upload
→ preview
→ submit
→ wait for moderation
→ see published status
```

## Admin

```text
Login
→ moderation
→ review
→ approve
→ verify book appears publicly
```

## Payment

```text
Checkout
→ PayWay
→ return/callback
→ verify status
→ library access
```

If any of these flows feel confusing, fix the UX before adding more features.

---

# 100. Design Review Checklist

For every page, review:

### Visual

```text
[ ] Clear hierarchy
[ ] Strong typography
[ ] Consistent spacing
[ ] Controlled accent color
[ ] Book covers look premium
[ ] No unnecessary visual noise
```

### Interaction

```text
[ ] Hover states
[ ] Focus states
[ ] Active states
[ ] Disabled states
[ ] Loading states
[ ] Success states
[ ] Error states
[ ] Empty states
```

### Motion

```text
[ ] Motion has a purpose
[ ] Motion is fast
[ ] Motion is consistent
[ ] Motion does not block interaction
[ ] Reduced motion is respected
```

### Responsive

```text
[ ] Mobile
[ ] Tablet
[ ] Desktop
[ ] Large desktop
```

### Accessibility

```text
[ ] Keyboard navigation
[ ] Focus visibility
[ ] Contrast
[ ] Labels
[ ] Alt text
[ ] Screen-reader semantics
```

---

# 101. UX Testing Scenarios

## Scenario A — Discover and buy

```text
Homepage
→ search
→ filter
→ book detail
→ preview
→ checkout
→ payment
→ library
→ reader
```

## Scenario B — Publish

```text
Login
→ become seller
→ create book
→ upload
→ cover
→ price
→ rights
→ preview
→ submit
```

## Scenario C — Read

```text
Library
→ continue reading
→ change theme
→ change font size
→ bookmark
→ exit
→ return
→ continue
```

## Scenario D — Moderate

```text
Admin
→ pending book
→ preview
→ inspect rights
→ approve
→ verify public listing
```

## Scenario E — Payment recovery

```text
Checkout
→ payment interrupted
→ return
→ order still pending
→ verify payment
→ retry or complete
```

---

# 102. Project Success Criteria

The project is successful when:

## Design

```text
The product does not look like a generic e-commerce template.
Book covers are the visual focus.
Typography feels editorial.
Motion feels intentional.
Dark/light themes feel equally polished.
```

## UX

```text
A new user understands the homepage immediately.
Search is easy.
Book details answer key questions.
Buying is understandable.
The library is obvious.
Reading feels calm.
Publishing feels simple.
Admin moderation feels controlled.
```

## Technical

```text
Frontend and backend are separated.
Express owns business logic/API.
AMPPS is used for local MySQL development.
Prisma owns database access.
Book files use object storage in production.
Protected content is not publicly exposed.
Payment status is verified server-side.
Secrets never reach the browser.
```

---

# 103. Final Recommended Stack

```text
Frontend
├── Next.js
├── React
├── TypeScript
├── Tailwind CSS
├── shadcn/ui
└── Motion for React

Backend
├── Node.js
└── Express.js

Database
├── MySQL
├── AMPPS (local)
└── Prisma

Reader
├── PDF.js
└── EPUB reader

Supporting
├── Zod
├── Lucide React
└── Recharts

Storage
└── Cloudflare R2

Payments
└── ABA PayWay

Deployment
├── Vercel (frontend)
└── Render (Express API)
```

---

# 104. Final Build Order

When working session-by-session, use exactly this sequence:

```text
01. Product definition
02. User flows
03. Design tokens
04. Core UI components
05. Book cards
06. Navigation
07. Animation primitives
08. Homepage
09. Search + filters
10. Book detail
11. Preview
12. Authentication UI
13. Library
14. Reader
15. Publishing wizard
16. Seller dashboard
17. Mock checkout
18. Admin dashboard
19. Database schema
20. Express API
21. Connect frontend to API
22. File upload
23. Object storage
24. Security
25. QA
26. Production deployment
27. Free platform subdomains
28. Cloud storage
29. ABA PayWay sandbox
30. Payment verification
31. PayWay production credentials
32. Real payment test
33. Final UX polish
```

This order deliberately makes the **design visible early** and moves payment integration to the end.

---

# 105. The Most Important Rule

> **Build the product as a beautiful reading experience first, a marketplace second, and a payment system last.**

The final product should feel like:

```text
Beautiful bookstore
        +
Immersive reading app
        +
Simple publishing studio
        +
Trustworthy marketplace
```

Not:

```text
CRUD dashboard
+
PDF upload
+
checkout page
```

The visual language, component system, motion system, reader experience, and publishing wizard are the heart of this project.

---

# 106. North Star

> **Build a bookstore that feels like a beautiful reading product, not a website that sells files.**

Every feature should be judged against that sentence.

If a feature makes the product more functional but significantly less clear, calm, or beautiful, redesign the experience before adding more complexity.
