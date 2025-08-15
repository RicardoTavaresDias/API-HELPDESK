-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('technical', 'customer', 'admin');

-- CreateEnum
CREATE TYPE "CalledStatus" AS ENUM ('open', 'close', 'in_progress');

-- CreateEnum
CREATE TYPE "ServicesStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "TypeComment" AS ENUM ('followUp', 'task');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'customer',
    "avatar" TEXT NOT NULL DEFAULT 'default.svg',
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_hours" (
    "id" TEXT NOT NULL,
    "fk_user_technical" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "user_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "called" (
    "id" SERIAL NOT NULL,
    "fk_user_customer" TEXT NOT NULL,
    "fk_user_technical" TEXT,
    "title_called" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "basePrice" DECIMAL(65,30) NOT NULL,
    "call_status" "CalledStatus" NOT NULL DEFAULT 'open',
    "appointment_Time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "called_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "title_service" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "service_status" "ServicesStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "called_services" (
    "id" TEXT NOT NULL,
    "fk_called" INTEGER NOT NULL,
    "fk_services" TEXT NOT NULL,
    "title_service" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "called_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "called_comments" (
    "id" TEXT NOT NULL,
    "fk_called" INTEGER NOT NULL,
    "fk_comments" TEXT NOT NULL,
    "fk_user" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "called_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "TypeComment" NOT NULL DEFAULT 'followUp',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "user"("phone");

-- AddForeignKey
ALTER TABLE "user_hours" ADD CONSTRAINT "user_hours_fk_user_technical_fkey" FOREIGN KEY ("fk_user_technical") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "called" ADD CONSTRAINT "called_fk_user_customer_fkey" FOREIGN KEY ("fk_user_customer") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "called" ADD CONSTRAINT "called_fk_user_technical_fkey" FOREIGN KEY ("fk_user_technical") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "called_services" ADD CONSTRAINT "called_services_fk_called_fkey" FOREIGN KEY ("fk_called") REFERENCES "called"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "called_services" ADD CONSTRAINT "called_services_fk_services_fkey" FOREIGN KEY ("fk_services") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "called_comments" ADD CONSTRAINT "called_comments_fk_called_fkey" FOREIGN KEY ("fk_called") REFERENCES "called"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "called_comments" ADD CONSTRAINT "called_comments_fk_comments_fkey" FOREIGN KEY ("fk_comments") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "called_comments" ADD CONSTRAINT "called_comments_fk_user_fkey" FOREIGN KEY ("fk_user") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
