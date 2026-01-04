ALTER TABLE "users" ADD COLUMN "number" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_address" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "username";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_number_unique" UNIQUE("number");