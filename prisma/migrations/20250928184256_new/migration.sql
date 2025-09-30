-- CreateIndex
CREATE INDEX "Cart_productId_idx" ON "public"."Cart"("productId");

-- CreateIndex
CREATE INDEX "Order_customerId_idx" ON "public"."Order"("customerId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "public"."Order"("status");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "public"."OrderItem"("productId");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "public"."OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "Payment_paymentType_idx" ON "public"."Payment"("paymentType");

-- CreateIndex
CREATE INDEX "Payment_transactionTime_idx" ON "public"."Payment"("transactionTime");

-- CreateIndex
CREATE INDEX "Payment_transactionId_idx" ON "public"."Payment"("transactionId");
