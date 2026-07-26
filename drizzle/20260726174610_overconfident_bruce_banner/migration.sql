CREATE TYPE "status" AS ENUM('OPEN', 'CLOSE');--> statement-breakpoint
CREATE TYPE "type" AS ENUM('LOST', 'FOUND');--> statement-breakpoint
CREATE TABLE "notice" (
	"user_id" uuid PRIMARY KEY,
	"type" "type" NOT NULL,
	"description" text NOT NULL,
	"location" text NOT NULL,
	"evenDate" date NOT NULL,
	"status" "status" NOT NULL,
	"imageUrl" text,
	"owner" text NOT NULL,
	"createAt" date DEFAULT now() NOT NULL,
	"updateAt" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"userName" varchar(255) NOT NULL UNIQUE,
	"passwordHash" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notice" ADD CONSTRAINT "notice_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");