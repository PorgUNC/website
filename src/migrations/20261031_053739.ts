import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "execTimes_people_times" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"timeanddate" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "execTimes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"people_user_id" integer NOT NULL
  );
  
  CREATE TABLE "regularTimes_people_times" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"timeanddate" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "regularTimes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"people_name" varchar NOT NULL,
  	"people_user_id" integer
  );
  
  CREATE TABLE "polltimes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"uuid" varchar,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone NOT NULL,
  	"additional_info" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "polltimes_id" integer;
  ALTER TABLE "execTimes_people_times" ADD CONSTRAINT "execTimes_people_times_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."execTimes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "execTimes" ADD CONSTRAINT "execTimes_people_user_id_users_id_fk" FOREIGN KEY ("people_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "execTimes" ADD CONSTRAINT "execTimes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polltimes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "regularTimes_people_times" ADD CONSTRAINT "regularTimes_people_times_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."regularTimes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "regularTimes" ADD CONSTRAINT "regularTimes_people_user_id_users_id_fk" FOREIGN KEY ("people_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "regularTimes" ADD CONSTRAINT "regularTimes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polltimes"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "execTimes_people_times_order_idx" ON "execTimes_people_times" USING btree ("_order");
  CREATE INDEX "execTimes_people_times_parent_id_idx" ON "execTimes_people_times" USING btree ("_parent_id");
  CREATE INDEX "execTimes_order_idx" ON "execTimes" USING btree ("_order");
  CREATE INDEX "execTimes_parent_id_idx" ON "execTimes" USING btree ("_parent_id");
  CREATE INDEX "execTimes_people_people_user_idx" ON "execTimes" USING btree ("people_user_id");
  CREATE INDEX "regularTimes_people_times_order_idx" ON "regularTimes_people_times" USING btree ("_order");
  CREATE INDEX "regularTimes_people_times_parent_id_idx" ON "regularTimes_people_times" USING btree ("_parent_id");
  CREATE INDEX "regularTimes_order_idx" ON "regularTimes" USING btree ("_order");
  CREATE INDEX "regularTimes_parent_id_idx" ON "regularTimes" USING btree ("_parent_id");
  CREATE INDEX "regularTimes_people_people_user_idx" ON "regularTimes" USING btree ("people_user_id");
  CREATE INDEX "polltimes_updated_at_idx" ON "polltimes" USING btree ("updated_at");
  CREATE INDEX "polltimes_created_at_idx" ON "polltimes" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_polltimes_fk" FOREIGN KEY ("polltimes_id") REFERENCES "public"."polltimes"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_polltimes_id_idx" ON "payload_locked_documents_rels" USING btree ("polltimes_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "execTimes_people_times" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "execTimes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "regularTimes_people_times" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "regularTimes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "polltimes" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "execTimes_people_times" CASCADE;
  DROP TABLE "execTimes" CASCADE;
  DROP TABLE "regularTimes_people_times" CASCADE;
  DROP TABLE "regularTimes" CASCADE;
  DROP TABLE "polltimes" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_polltimes_fk";
  
  DROP INDEX "payload_locked_documents_rels_polltimes_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "polltimes_id";`)
}
