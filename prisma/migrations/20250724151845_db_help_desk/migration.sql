-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'customer',
    "avatar" TEXT NOT NULL DEFAULT 'default.svg',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "user_hours" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fk_user_technical" TEXT NOT NULL,
    "start_time" DATETIME NOT NULL,
    "end_time" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    CONSTRAINT "user_hours_fk_user_technical_fkey" FOREIGN KEY ("fk_user_technical") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "called" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fk_user_customer" TEXT NOT NULL,
    "fk_user_technical" TEXT,
    "title_called" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "basePrice" DECIMAL NOT NULL,
    "call_status" TEXT NOT NULL DEFAULT 'open',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    CONSTRAINT "called_fk_user_customer_fkey" FOREIGN KEY ("fk_user_customer") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "called_fk_user_technical_fkey" FOREIGN KEY ("fk_user_technical") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title_service" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "service_status" TEXT NOT NULL DEFAULT 'active',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "called_services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fk_called" INTEGER NOT NULL,
    "fk_services" TEXT NOT NULL,
    "title_service" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    CONSTRAINT "called_services_fk_called_fkey" FOREIGN KEY ("fk_called") REFERENCES "called" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "called_services_fk_services_fkey" FOREIGN KEY ("fk_services") REFERENCES "services" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
