import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_publishedat_tz" AS ENUM('America/New_York');
  CREATE TYPE "public"."enum__pages_v_version_publishedat_tz" AS ENUM('America/New_York');
  CREATE TYPE "public"."enum_polls_publishedat_tz" AS ENUM('America/New_York');
  CREATE TYPE "public"."enum__polls_v_version_publishedat_tz" AS ENUM('America/New_York');
  CREATE TYPE "public"."enum_posts_publishedat_tz" AS ENUM('America/New_York');
  CREATE TYPE "public"."enum__posts_v_version_publishedat_tz" AS ENUM('America/New_York');
  CREATE TYPE "public"."enum_files_publisheddate_tz" AS ENUM('America/New_York');
  CREATE TABLE "forms_tokens" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_token" varchar
  );
  
  CREATE TABLE "forms_blocks_radio_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_radio" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_programs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean DEFAULT false,
  	"default_value" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "forms_blocks_email" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "forms_blocks_email" CASCADE;
  ALTER TABLE "forms" ALTER COLUMN "submit_button_label" SET DEFAULT 'Submit';
  ALTER TABLE "pages" ADD COLUMN "publishedat_tz" "enum_pages_publishedat_tz" DEFAULT 'America/New_York';
  ALTER TABLE "_pages_v" ADD COLUMN "version_publishedat_tz" "enum__pages_v_version_publishedat_tz" DEFAULT 'America/New_York';
  ALTER TABLE "polls" ADD COLUMN "publishedat_tz" "enum_polls_publishedat_tz" DEFAULT 'America/New_York';
  ALTER TABLE "_polls_v" ADD COLUMN "version_publishedat_tz" "enum__polls_v_version_publishedat_tz" DEFAULT 'America/New_York';
  ALTER TABLE "posts" ADD COLUMN "publishedat_tz" "enum_posts_publishedat_tz" DEFAULT 'America/New_York';
  ALTER TABLE "_posts_v" ADD COLUMN "version_publishedat_tz" "enum__posts_v_version_publishedat_tz" DEFAULT 'America/New_York';
  ALTER TABLE "files" ADD COLUMN "publisheddate_tz" "enum_files_publisheddate_tz" DEFAULT 'America/New_York';
  ALTER TABLE "forms_blocks_select" ADD COLUMN "allow_multiple" boolean DEFAULT false;
  ALTER TABLE "forms_blocks_select" ADD COLUMN "allow_searching" boolean DEFAULT false;
  ALTER TABLE "forms" ADD COLUMN "is_poll" boolean DEFAULT true;
  ALTER TABLE "forms" ADD COLUMN "enabled" boolean DEFAULT true;
  ALTER TABLE "forms" ADD COLUMN "valid_duration" numeric DEFAULT 5;
  ALTER TABLE "forms" ADD COLUMN "auth_key" varchar;
  ALTER TABLE "forms_tokens" ADD CONSTRAINT "forms_tokens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_radio_options" ADD CONSTRAINT "forms_blocks_radio_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_radio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_radio" ADD CONSTRAINT "forms_blocks_radio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_programs" ADD CONSTRAINT "forms_blocks_programs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "forms_tokens_order_idx" ON "forms_tokens" USING btree ("_order");
  CREATE INDEX "forms_tokens_parent_id_idx" ON "forms_tokens" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_radio_options_order_idx" ON "forms_blocks_radio_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_radio_options_parent_id_idx" ON "forms_blocks_radio_options" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_radio_order_idx" ON "forms_blocks_radio" USING btree ("_order");
  CREATE INDEX "forms_blocks_radio_parent_id_idx" ON "forms_blocks_radio" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_radio_path_idx" ON "forms_blocks_radio" USING btree ("_path");
  CREATE INDEX "forms_blocks_programs_order_idx" ON "forms_blocks_programs" USING btree ("_order");
  CREATE INDEX "forms_blocks_programs_parent_id_idx" ON "forms_blocks_programs" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_programs_path_idx" ON "forms_blocks_programs" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  ALTER TABLE "forms_tokens" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_radio_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_radio" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_programs" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "forms_tokens" CASCADE;
  DROP TABLE "forms_blocks_radio_options" CASCADE;
  DROP TABLE "forms_blocks_radio" CASCADE;
  DROP TABLE "forms_blocks_programs" CASCADE;
  ALTER TABLE "forms" ALTER COLUMN "submit_button_label" DROP DEFAULT;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  ALTER TABLE "pages" DROP COLUMN "publishedat_tz";
  ALTER TABLE "_pages_v" DROP COLUMN "version_publishedat_tz";
  ALTER TABLE "polls" DROP COLUMN "publishedat_tz";
  ALTER TABLE "_polls_v" DROP COLUMN "version_publishedat_tz";
  ALTER TABLE "posts" DROP COLUMN "publishedat_tz";
  ALTER TABLE "_posts_v" DROP COLUMN "version_publishedat_tz";
  ALTER TABLE "files" DROP COLUMN "publisheddate_tz";
  ALTER TABLE "forms_blocks_select" DROP COLUMN "allow_multiple";
  ALTER TABLE "forms_blocks_select" DROP COLUMN "allow_searching";
  ALTER TABLE "forms" DROP COLUMN "is_poll";
  ALTER TABLE "forms" DROP COLUMN "enabled";
  ALTER TABLE "forms" DROP COLUMN "valid_duration";
  ALTER TABLE "forms" DROP COLUMN "auth_key";
  DROP TYPE "public"."enum_pages_publishedat_tz";
  DROP TYPE "public"."enum__pages_v_version_publishedat_tz";
  DROP TYPE "public"."enum_polls_publishedat_tz";
  DROP TYPE "public"."enum__polls_v_version_publishedat_tz";
  DROP TYPE "public"."enum_posts_publishedat_tz";
  DROP TYPE "public"."enum__posts_v_version_publishedat_tz";
  DROP TYPE "public"."enum_files_publisheddate_tz";`)
}
