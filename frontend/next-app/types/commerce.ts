export type CommerceCurrency = "USD" | "KHR";

export type PaymentStatus = "pending" | "success" | "failed" | "cancelled";
export type OrderStatus = "pending" | "completed" | "failed" | "cancelled";

/** Outcome the mock gateway should simulate (dev only). */
export type MockScenario = "success" | "failed" | "cancelled";

export interface OrderItem {
  bookId: string;
  title: string;
  authorName: string;
  coverUrl?: string;
  price: number; // price actually charged
  compareAtPrice?: number; // original price when discounted
  currency: CommerceCurrency;
}

export interface Order {
  id: string;
  number: string; // e.g. FO-2026-000001
  userId: string;
  items: OrderItem[];
  subtotal: number; // sum of original prices
  discount: number;
  total: number;
  currency: CommerceCurrency;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  failureReason?: string;
  createdAt: string;
  paidAt?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: CommerceCurrency;
  status: PaymentStatus;
  method: "mock";
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentInput {
  orderId: string;
  amount: number;
  currency: CommerceCurrency;
  scenario?: MockScenario;
}

export interface PaymentResult {
  paymentId: string;
  status: PaymentStatus;
  failureReason?: string;
}

/** Checkout talks only to this interface. Phase 15 adds AbaPayWayService. */
export interface PaymentService {
  createPayment(input: CreatePaymentInput): Promise<PaymentResult>;
  verifyPayment(paymentId: string): Promise<PaymentResult | null>;
}