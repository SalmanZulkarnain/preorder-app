/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `WhatsappSubscriber` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WhatsappSubscriber_phone_key" ON "WhatsappSubscriber"("phone");
