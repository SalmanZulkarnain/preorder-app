-- CreateTable
CREATE TABLE "WhatsappSubscriber" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhatsappSubscriber_pkey" PRIMARY KEY ("id")
);
