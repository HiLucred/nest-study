-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "receipt_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_receipt_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
