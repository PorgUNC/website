import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_personnel_collection" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_personnel_collection" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "avatars" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_square_url" varchar,
  	"sizes_square_width" numeric,
  	"sizes_square_height" numeric,
  	"sizes_square_mime_type" varchar,
  	"sizes_square_filesize" numeric,
  	"sizes_square_filename" varchar,
  	"sizes_small_url" varchar,
  	"sizes_small_width" numeric,
  	"sizes_small_height" numeric,
  	"sizes_small_mime_type" varchar,
  	"sizes_small_filesize" numeric,
  	"sizes_small_filename" varchar,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar,
  	"sizes_xlarge_url" varchar,
  	"sizes_xlarge_width" numeric,
  	"sizes_xlarge_height" numeric,
  	"sizes_xlarge_mime_type" varchar,
  	"sizes_xlarge_filesize" numeric,
  	"sizes_xlarge_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "pages_rels" ADD COLUMN "users_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "users_id" integer;
  ALTER TABLE "users" ADD COLUMN "avatar_id" integer;
  ALTER TABLE "users" ADD COLUMN "job_title" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "avatars_id" integer;
  ALTER TABLE "pages_blocks_personnel_collection" ADD CONSTRAINT "pages_blocks_personnel_collection_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_personnel_collection" ADD CONSTRAINT "_pages_v_blocks_personnel_collection_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_personnel_collection_order_idx" ON "pages_blocks_personnel_collection" USING btree ("_order");
  CREATE INDEX "pages_blocks_personnel_collection_parent_id_idx" ON "pages_blocks_personnel_collection" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_personnel_collection_path_idx" ON "pages_blocks_personnel_collection" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_personnel_collection_order_idx" ON "_pages_v_blocks_personnel_collection" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_personnel_collection_parent_id_idx" ON "_pages_v_blocks_personnel_collection" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_personnel_collection_path_idx" ON "_pages_v_blocks_personnel_collection" USING btree ("_path");
  CREATE INDEX "avatars_updated_at_idx" ON "avatars" USING btree ("updated_at");
  CREATE INDEX "avatars_created_at_idx" ON "avatars" USING btree ("created_at");
  CREATE UNIQUE INDEX "avatars_filename_idx" ON "avatars" USING btree ("filename");
  CREATE INDEX "avatars_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "avatars" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "avatars_sizes_square_sizes_square_filename_idx" ON "avatars" USING btree ("sizes_square_filename");
  CREATE INDEX "avatars_sizes_small_sizes_small_filename_idx" ON "avatars" USING btree ("sizes_small_filename");
  CREATE INDEX "avatars_sizes_medium_sizes_medium_filename_idx" ON "avatars" USING btree ("sizes_medium_filename");
  CREATE INDEX "avatars_sizes_large_sizes_large_filename_idx" ON "avatars" USING btree ("sizes_large_filename");
  CREATE INDEX "avatars_sizes_xlarge_sizes_xlarge_filename_idx" ON "avatars" USING btree ("sizes_xlarge_filename");
  CREATE INDEX "avatars_sizes_og_sizes_og_filename_idx" ON "avatars" USING btree ("sizes_og_filename");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_avatars_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."avatars"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_avatars_fk" FOREIGN KEY ("avatars_id") REFERENCES "public"."avatars"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_users_id_idx" ON "pages_rels" USING btree ("users_id");
  CREATE INDEX "_pages_v_rels_users_id_idx" ON "_pages_v_rels" USING btree ("users_id");
  CREATE INDEX "users_avatar_idx" ON "users" USING btree ("avatar_id");
  CREATE INDEX "payload_locked_documents_rels_avatars_id_idx" ON "payload_locked_documents_rels" USING btree ("avatars_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_personnel_collection" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_personnel_collection" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "avatars" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_personnel_collection" CASCADE;
  DROP TABLE "_pages_v_blocks_personnel_collection" CASCADE;
  DROP TABLE "avatars" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_users_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_users_fk";
  
  ALTER TABLE "users" DROP CONSTRAINT "users_avatar_id_avatars_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_avatars_fk";
  
  DROP INDEX "pages_rels_users_id_idx";
  DROP INDEX "_pages_v_rels_users_id_idx";
  DROP INDEX "users_avatar_idx";
  DROP INDEX "payload_locked_documents_rels_avatars_id_idx";
  ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "pages_rels" DROP COLUMN "users_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "users_id";
  ALTER TABLE "users" DROP COLUMN "avatar_id";
  ALTER TABLE "users" DROP COLUMN "job_title";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "avatars_id";`)
}
