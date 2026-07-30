CREATE TYPE "status" AS ENUM('OPEN', 'CLOSE');--> statement-breakpoint
CREATE TYPE "type" AS ENUM('LOST', 'FOUND');--> statement-breakpoint
CREATE TABLE "notice" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"userId" uuid NOT NULL,
	"title" text NOT NULL,
	"type" "type" NOT NULL,
	"description" text NOT NULL,
	"location" text NOT NULL,
	"evenDate" date NOT NULL,
	"status" "status" DEFAULT 'OPEN'::"status" NOT NULL,
	"imageUrl" text,
	"imageId" text,
	"owner" text NOT NULL,
	"createAt" timestamp DEFAULT now() NOT NULL,
	"updateAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"userName" varchar(255) NOT NULL UNIQUE,
	"passwordHash" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notice" ADD CONSTRAINT "notice_userId_users_id_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;