CREATE TABLE "audit_log" (
	"id" text PRIMARY KEY NOT NULL,
	"actor_id" text,
	"actor_name" text NOT NULL,
	"action" text NOT NULL,
	"target_id" text,
	"target_label" text,
	"meta" jsonb,
	"ip" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_id_user_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_log_created_at_index" ON "audit_log" USING btree ("created_at");
--> statement-breakpoint
-- The new "owner" role: if a site has no owner yet, its longest-standing admin becomes one,
-- so someone can still manage admin rights after this upgrade.
UPDATE "user" SET "role" = 'owner'
WHERE "id" = (SELECT "id" FROM "user" WHERE "role" = 'admin' ORDER BY "created_at" LIMIT 1)
  AND NOT EXISTS (SELECT 1 FROM "user" WHERE "role" = 'owner');
