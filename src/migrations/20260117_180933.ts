import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_pdf_block" CASCADE;
  DROP TABLE "_pages_v_blocks_pdf_block" CASCADE;
  DROP TABLE "polls_blocks_pdf_block" CASCADE;
  DROP TABLE "_polls_v_blocks_pdf_block" CASCADE;
  DROP TABLE "posts_blocks_pdf_block" CASCADE;
  DROP TABLE "_posts_v_blocks_pdf_block" CASCADE;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_pdf_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"pdf_id" integer,
  	"caption" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pdf_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"pdf_id" integer,
  	"caption" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "polls_blocks_pdf_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"pdf_id" integer,
  	"caption" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "_polls_v_blocks_pdf_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"pdf_id" integer,
  	"caption" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_pdf_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"pdf_id" integer,
  	"caption" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_pdf_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"pdf_id" integer,
  	"caption" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_pdf_block" ADD CONSTRAINT "pages_blocks_pdf_block_pdf_id_files_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_pdf_block" ADD CONSTRAINT "pages_blocks_pdf_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pdf_block" ADD CONSTRAINT "_pages_v_blocks_pdf_block_pdf_id_files_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pdf_block" ADD CONSTRAINT "_pages_v_blocks_pdf_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "polls_blocks_pdf_block" ADD CONSTRAINT "polls_blocks_pdf_block_pdf_id_files_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "polls_blocks_pdf_block" ADD CONSTRAINT "polls_blocks_pdf_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_blocks_pdf_block" ADD CONSTRAINT "_polls_v_blocks_pdf_block_pdf_id_files_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_polls_v_blocks_pdf_block" ADD CONSTRAINT "_polls_v_blocks_pdf_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_pdf_block" ADD CONSTRAINT "posts_blocks_pdf_block_pdf_id_files_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_pdf_block" ADD CONSTRAINT "posts_blocks_pdf_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_pdf_block" ADD CONSTRAINT "_posts_v_blocks_pdf_block_pdf_id_files_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_pdf_block" ADD CONSTRAINT "_posts_v_blocks_pdf_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_pdf_block_order_idx" ON "pages_blocks_pdf_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_pdf_block_parent_id_idx" ON "pages_blocks_pdf_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pdf_block_path_idx" ON "pages_blocks_pdf_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_pdf_block_pdf_idx" ON "pages_blocks_pdf_block" USING btree ("pdf_id");
  CREATE INDEX "_pages_v_blocks_pdf_block_order_idx" ON "_pages_v_blocks_pdf_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pdf_block_parent_id_idx" ON "_pages_v_blocks_pdf_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pdf_block_path_idx" ON "_pages_v_blocks_pdf_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_pdf_block_pdf_idx" ON "_pages_v_blocks_pdf_block" USING btree ("pdf_id");
  CREATE INDEX "polls_blocks_pdf_block_order_idx" ON "polls_blocks_pdf_block" USING btree ("_order");
  CREATE INDEX "polls_blocks_pdf_block_parent_id_idx" ON "polls_blocks_pdf_block" USING btree ("_parent_id");
  CREATE INDEX "polls_blocks_pdf_block_path_idx" ON "polls_blocks_pdf_block" USING btree ("_path");
  CREATE INDEX "polls_blocks_pdf_block_pdf_idx" ON "polls_blocks_pdf_block" USING btree ("pdf_id");
  CREATE INDEX "_polls_v_blocks_pdf_block_order_idx" ON "_polls_v_blocks_pdf_block" USING btree ("_order");
  CREATE INDEX "_polls_v_blocks_pdf_block_parent_id_idx" ON "_polls_v_blocks_pdf_block" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_blocks_pdf_block_path_idx" ON "_polls_v_blocks_pdf_block" USING btree ("_path");
  CREATE INDEX "_polls_v_blocks_pdf_block_pdf_idx" ON "_polls_v_blocks_pdf_block" USING btree ("pdf_id");
  CREATE INDEX "posts_blocks_pdf_block_order_idx" ON "posts_blocks_pdf_block" USING btree ("_order");
  CREATE INDEX "posts_blocks_pdf_block_parent_id_idx" ON "posts_blocks_pdf_block" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_pdf_block_path_idx" ON "posts_blocks_pdf_block" USING btree ("_path");
  CREATE INDEX "posts_blocks_pdf_block_pdf_idx" ON "posts_blocks_pdf_block" USING btree ("pdf_id");
  CREATE INDEX "_posts_v_blocks_pdf_block_order_idx" ON "_posts_v_blocks_pdf_block" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_pdf_block_parent_id_idx" ON "_posts_v_blocks_pdf_block" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_pdf_block_path_idx" ON "_posts_v_blocks_pdf_block" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_pdf_block_pdf_idx" ON "_posts_v_blocks_pdf_block" USING btree ("pdf_id");`)
}
