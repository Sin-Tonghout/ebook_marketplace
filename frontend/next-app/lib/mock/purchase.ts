// Temporary stand-in for the real order + payment flow (Phase 11).
// Flip SIMULATE_FAILURE to true to test the error state.
const SIMULATE_FAILURE = false;

export async function mockPurchase(bookId: string): Promise<{ bookId: string; orderId: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  if (SIMULATE_FAILURE) {
    throw new Error("Payment didn't complete.");
  }
  return { bookId, orderId: `EB-${Date.now()}` };
}