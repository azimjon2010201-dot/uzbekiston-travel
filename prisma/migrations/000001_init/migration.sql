CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'OWNER');

CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "first_name" VARCHAR(80) NOT NULL,
  "last_name" VARCHAR(80) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(32) NOT NULL,
  "password_hash" VARCHAR(255) NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'USER',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
