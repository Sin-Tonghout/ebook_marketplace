import { mockPaymentService } from "@/lib/mock/payment";
import type { PaymentService } from "@/types/commerce";

// Phase 15: switch on process.env.NEXT_PUBLIC_PAYMENT_PROVIDER and return the ABA PayWay service.
export const paymentService: PaymentService = mockPaymentService;