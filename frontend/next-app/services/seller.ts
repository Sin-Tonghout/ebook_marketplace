import type {
  SellerBook,
  SellerOverview,
  SellerPublicProfile,
} from "@/types/seller";
import { seedBooks, seedOrders, seedSeries } from "@/lib/mock/seller";

const SUBMITTED_KEY = "folio.seller.submitted.v1";
const EDITS_KEY = "folio.seller.edits.v1";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function readSubmitted(): SellerBook[] {
  return readJson<SellerBook[]>(SUBMITTED_KEY, []);
}

function readEdits(): Record<string, SellerBook> {
  return readJson<Record<string, SellerBook>>(EDITS_KEY, {});
}

/**
 * Saves a book submitted from the wizard. Covers are data URLs and can be
 * large, so if storage is full we retry without the cover.
 */
export function addSubmittedBook(book: SellerBook): boolean {
  if (typeof window === "undefined") return false;
  const others = readSubmitted().filter((b) => b.id !== book.id);
  const attempts: SellerBook[] = [book, { ...book, coverUrl: undefined }];
  for (const candidate of attempts) {
    try {
      window.localStorage.setItem(
        SUBMITTED_KEY,
        JSON.stringify([candidate, ...others])
      );
      return true;
    } catch {
      /* try the next attempt */
    }
  }
  return false;
}

/**
 * Saves an edited book on top of the original (works for seed books and
 * wizard-submitted books). Same storage fallback as above.
 */
export function updateSellerBook(book: SellerBook): boolean {
  if (typeof window === "undefined") return false;
  const edits = readEdits();
  const attempts: SellerBook[] = [book, { ...book, coverUrl: undefined }];
  for (const candidate of attempts) {
    try {
      window.localStorage.setItem(
        EDITS_KEY,
        JSON.stringify({ ...edits, [book.id]: candidate })
      );
      return true;
    } catch {
      /* try the next attempt */
    }
  }
  return false;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function devFlag(name: string): boolean {
  return (
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get(name) === "1"
  );
}

export async function fetchSellerOverview(): Promise<SellerOverview> {
  await delay(600);

  // Dev switches (add to any seller page URL):
  //   ?sellerError=1  -> error state
  //   ?sellerEmpty=1  -> empty state
  if (devFlag("sellerError")) throw new Error("Simulated seller data failure");
  if (devFlag("sellerEmpty")) return { books: [], orders: [], series: [] };

  const edits = readEdits();
  const books = [...readSubmitted(), ...seedBooks()].map(
    (b) => edits[b.id] ?? b
  );

  return { books, orders: seedOrders(), series: seedSeries() };
}

const profileKey = (userId: string) => `folio.seller.profile.v1.${userId}`;

export function readSellerProfile(userId: string): SellerPublicProfile | null {
  return readJson<SellerPublicProfile | null>(profileKey(userId), null);
}

export function saveSellerProfile(
  userId: string,
  profile: SellerPublicProfile
): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(profileKey(userId), JSON.stringify(profile));
    return true;
  } catch {
    return false;
  }
}