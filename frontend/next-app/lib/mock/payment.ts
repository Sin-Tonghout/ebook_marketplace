import type {
  CreatePaymentInput,
  Payment,
  PaymentResult,
  PaymentService,
} from "@/types/commerce";

const KEY = "folio.payments.v1";
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function readAll(): Record<string, Payment> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, Payment>) : {};
  } catch {
    return {};
  }
}

function writeAll(all: Record<string, Payment>) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* storage full or blocked: fail silently */
  }
}

const toResult = (p: Payment): PaymentResult => ({
  paymentId: p.id,
  status: p.status,
  failureReason: p.failureReason,
});

export const mockPaymentService: PaymentService = {
  async createPayment({ orderId, amount, currency, scenario = "success" }: CreatePaymentInput) {
    await wait(1200); // feels like a real gateway round trip
    const now = new Date().toISOString();
    const payment: Payment = {
      id: `pay_${crypto.randomUUID().slice(0, 8)}`,
      orderId,
      amount,
      currency,
      status: scenario, // "success" | "failed" | "cancelled" are all valid PaymentStatus values
      method: "mock",
      failureReason:
        scenario === "failed"
          ? "Your card was declined."
          : scenario === "cancelled"
            ? "The payment was cancelled."
            : undefined,
      createdAt: now,
      updatedAt: now,
    };
    writeAll({ ...readAll(), [payment.id]: payment });
    return toResult(payment);
  },

  async verifyPayment(paymentId: string) {
    await wait(200);
    const payment = readAll()[paymentId];
    return payment ? toResult(payment) : null;
  },
};