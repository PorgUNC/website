import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_polls_blocks_banner_style" AS ENUM('info', 'warning', 'error', 'success');
  CREATE TYPE "public"."enum_polls_blocks_code_language" AS ENUM('typescript', 'javascript', 'css');
  CREATE TYPE "public"."enum_polls_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_polls_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_polls_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_polls_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_polls_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__polls_v_blocks_banner_style" AS ENUM('info', 'warning', 'error', 'success');
  CREATE TYPE "public"."enum__polls_v_blocks_code_language" AS ENUM('typescript', 'javascript', 'css');
  CREATE TYPE "public"."enum__polls_v_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__polls_v_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__polls_v_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum__polls_v_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__polls_v_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_posts_blocks_banner_style" AS ENUM('info', 'warning', 'error', 'success');
  CREATE TYPE "public"."enum_posts_blocks_code_language" AS ENUM('typescript', 'javascript', 'css');
  CREATE TYPE "public"."enum_posts_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_posts_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_posts_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_posts_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_posts_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__posts_v_blocks_banner_style" AS ENUM('info', 'warning', 'error', 'success');
  CREATE TYPE "public"."enum__posts_v_blocks_code_language" AS ENUM('typescript', 'javascript', 'css');
  CREATE TYPE "public"."enum__posts_v_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__posts_v_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__posts_v_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum__posts_v_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__posts_v_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TABLE "polls_blocks_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_polls_blocks_banner_style" DEFAULT 'info',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "polls_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"language" "enum_polls_blocks_code_language" DEFAULT 'typescript',
  	"code" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "polls_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "polls_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_polls_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_polls_blocks_cta_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "polls_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "polls_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_polls_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum_polls_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_polls_blocks_content_columns_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "polls_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "polls_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
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
  
  CREATE TABLE "_polls_v_blocks_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__polls_v_blocks_banner_style" DEFAULT 'info',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_polls_v_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"language" "enum__polls_v_blocks_code_language" DEFAULT 'typescript',
  	"code" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_polls_v_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_polls_v_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__polls_v_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__polls_v_blocks_cta_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_polls_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_polls_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__polls_v_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum__polls_v_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__polls_v_blocks_content_columns_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_polls_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_polls_v_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"_uuid" varchar,
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
  
  CREATE TABLE "posts_blocks_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_posts_blocks_banner_style" DEFAULT 'info',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"language" "enum_posts_blocks_code_language" DEFAULT 'typescript',
  	"code" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_posts_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_posts_blocks_cta_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "posts_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_posts_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum_posts_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_posts_blocks_content_columns_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "posts_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
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
  
  CREATE TABLE "_posts_v_blocks_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__posts_v_blocks_banner_style" DEFAULT 'info',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"language" "enum__posts_v_blocks_code_language" DEFAULT 'typescript',
  	"code" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__posts_v_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__posts_v_blocks_cta_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__posts_v_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum__posts_v_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__posts_v_blocks_content_columns_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"_uuid" varchar,
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
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  ALTER TABLE "polls" DROP CONSTRAINT "polls_pdf_id_pdfs_id_fk";
  
  ALTER TABLE "_polls_v" DROP CONSTRAINT "_polls_v_version_pdf_id_pdfs_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk";
  
  DROP INDEX "polls_pdf_idx";
  DROP INDEX "_polls_v_version_version_pdf_idx";
  DROP INDEX "payload_locked_documents_rels_payload_jobs_id_idx";
  ALTER TABLE "polls_populated_authors" ADD COLUMN "job_title" varchar;
  ALTER TABLE "polls_populated_authors" ADD COLUMN "author_page" numeric;
  ALTER TABLE "polls_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "polls_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "_polls_v_version_populated_authors" ADD COLUMN "job_title" varchar;
  ALTER TABLE "_polls_v_version_populated_authors" ADD COLUMN "author_page" numeric;
  ALTER TABLE "_polls_v_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "_polls_v_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "posts_populated_authors" ADD COLUMN "job_title" varchar;
  ALTER TABLE "posts_populated_authors" ADD COLUMN "author_page" numeric;
  ALTER TABLE "posts_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "_posts_v_version_populated_authors" ADD COLUMN "job_title" varchar;
  ALTER TABLE "_posts_v_version_populated_authors" ADD COLUMN "author_page" numeric;
  ALTER TABLE "_posts_v_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "polls_blocks_banner" ADD CONSTRAINT "polls_blocks_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "polls_blocks_code" ADD CONSTRAINT "polls_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "polls_blocks_media_block" ADD CONSTRAINT "polls_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "polls_blocks_media_block" ADD CONSTRAINT "polls_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "polls_blocks_cta_links" ADD CONSTRAINT "polls_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "polls_blocks_cta" ADD CONSTRAINT "polls_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "polls_blocks_content_columns" ADD CONSTRAINT "polls_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "polls_blocks_content" ADD CONSTRAINT "polls_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "polls_blocks_form_block" ADD CONSTRAINT "polls_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "polls_blocks_form_block" ADD CONSTRAINT "polls_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "polls_blocks_pdf_block" ADD CONSTRAINT "polls_blocks_pdf_block_pdf_id_pdfs_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."pdfs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "polls_blocks_pdf_block" ADD CONSTRAINT "polls_blocks_pdf_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_blocks_banner" ADD CONSTRAINT "_polls_v_blocks_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_blocks_code" ADD CONSTRAINT "_polls_v_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_blocks_media_block" ADD CONSTRAINT "_polls_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_polls_v_blocks_media_block" ADD CONSTRAINT "_polls_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_blocks_cta_links" ADD CONSTRAINT "_polls_v_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_blocks_cta" ADD CONSTRAINT "_polls_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_blocks_content_columns" ADD CONSTRAINT "_polls_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_blocks_content" ADD CONSTRAINT "_polls_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_blocks_form_block" ADD CONSTRAINT "_polls_v_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_polls_v_blocks_form_block" ADD CONSTRAINT "_polls_v_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_blocks_pdf_block" ADD CONSTRAINT "_polls_v_blocks_pdf_block_pdf_id_pdfs_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."pdfs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_polls_v_blocks_pdf_block" ADD CONSTRAINT "_polls_v_blocks_pdf_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_banner" ADD CONSTRAINT "posts_blocks_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_code" ADD CONSTRAINT "posts_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_media_block" ADD CONSTRAINT "posts_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_media_block" ADD CONSTRAINT "posts_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_cta_links" ADD CONSTRAINT "posts_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_cta" ADD CONSTRAINT "posts_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_content_columns" ADD CONSTRAINT "posts_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_content" ADD CONSTRAINT "posts_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_form_block" ADD CONSTRAINT "posts_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_form_block" ADD CONSTRAINT "posts_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_pdf_block" ADD CONSTRAINT "posts_blocks_pdf_block_pdf_id_pdfs_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."pdfs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_pdf_block" ADD CONSTRAINT "posts_blocks_pdf_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_banner" ADD CONSTRAINT "_posts_v_blocks_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_code" ADD CONSTRAINT "_posts_v_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_media_block" ADD CONSTRAINT "_posts_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_media_block" ADD CONSTRAINT "_posts_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_cta_links" ADD CONSTRAINT "_posts_v_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_cta" ADD CONSTRAINT "_posts_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_content_columns" ADD CONSTRAINT "_posts_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_content" ADD CONSTRAINT "_posts_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_form_block" ADD CONSTRAINT "_posts_v_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_form_block" ADD CONSTRAINT "_posts_v_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_pdf_block" ADD CONSTRAINT "_posts_v_blocks_pdf_block_pdf_id_pdfs_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."pdfs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_pdf_block" ADD CONSTRAINT "_posts_v_blocks_pdf_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "polls_blocks_banner_order_idx" ON "polls_blocks_banner" USING btree ("_order");
  CREATE INDEX "polls_blocks_banner_parent_id_idx" ON "polls_blocks_banner" USING btree ("_parent_id");
  CREATE INDEX "polls_blocks_banner_path_idx" ON "polls_blocks_banner" USING btree ("_path");
  CREATE INDEX "polls_blocks_code_order_idx" ON "polls_blocks_code" USING btree ("_order");
  CREATE INDEX "polls_blocks_code_parent_id_idx" ON "polls_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "polls_blocks_code_path_idx" ON "polls_blocks_code" USING btree ("_path");
  CREATE INDEX "polls_blocks_media_block_order_idx" ON "polls_blocks_media_block" USING btree ("_order");
  CREATE INDEX "polls_blocks_media_block_parent_id_idx" ON "polls_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "polls_blocks_media_block_path_idx" ON "polls_blocks_media_block" USING btree ("_path");
  CREATE INDEX "polls_blocks_media_block_media_idx" ON "polls_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "polls_blocks_cta_links_order_idx" ON "polls_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "polls_blocks_cta_links_parent_id_idx" ON "polls_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "polls_blocks_cta_order_idx" ON "polls_blocks_cta" USING btree ("_order");
  CREATE INDEX "polls_blocks_cta_parent_id_idx" ON "polls_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "polls_blocks_cta_path_idx" ON "polls_blocks_cta" USING btree ("_path");
  CREATE INDEX "polls_blocks_content_columns_order_idx" ON "polls_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "polls_blocks_content_columns_parent_id_idx" ON "polls_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "polls_blocks_content_order_idx" ON "polls_blocks_content" USING btree ("_order");
  CREATE INDEX "polls_blocks_content_parent_id_idx" ON "polls_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "polls_blocks_content_path_idx" ON "polls_blocks_content" USING btree ("_path");
  CREATE INDEX "polls_blocks_form_block_order_idx" ON "polls_blocks_form_block" USING btree ("_order");
  CREATE INDEX "polls_blocks_form_block_parent_id_idx" ON "polls_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "polls_blocks_form_block_path_idx" ON "polls_blocks_form_block" USING btree ("_path");
  CREATE INDEX "polls_blocks_form_block_form_idx" ON "polls_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "polls_blocks_pdf_block_order_idx" ON "polls_blocks_pdf_block" USING btree ("_order");
  CREATE INDEX "polls_blocks_pdf_block_parent_id_idx" ON "polls_blocks_pdf_block" USING btree ("_parent_id");
  CREATE INDEX "polls_blocks_pdf_block_path_idx" ON "polls_blocks_pdf_block" USING btree ("_path");
  CREATE INDEX "polls_blocks_pdf_block_pdf_idx" ON "polls_blocks_pdf_block" USING btree ("pdf_id");
  CREATE INDEX "_polls_v_blocks_banner_order_idx" ON "_polls_v_blocks_banner" USING btree ("_order");
  CREATE INDEX "_polls_v_blocks_banner_parent_id_idx" ON "_polls_v_blocks_banner" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_blocks_banner_path_idx" ON "_polls_v_blocks_banner" USING btree ("_path");
  CREATE INDEX "_polls_v_blocks_code_order_idx" ON "_polls_v_blocks_code" USING btree ("_order");
  CREATE INDEX "_polls_v_blocks_code_parent_id_idx" ON "_polls_v_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_blocks_code_path_idx" ON "_polls_v_blocks_code" USING btree ("_path");
  CREATE INDEX "_polls_v_blocks_media_block_order_idx" ON "_polls_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX "_polls_v_blocks_media_block_parent_id_idx" ON "_polls_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_blocks_media_block_path_idx" ON "_polls_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX "_polls_v_blocks_media_block_media_idx" ON "_polls_v_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "_polls_v_blocks_cta_links_order_idx" ON "_polls_v_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "_polls_v_blocks_cta_links_parent_id_idx" ON "_polls_v_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_blocks_cta_order_idx" ON "_polls_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_polls_v_blocks_cta_parent_id_idx" ON "_polls_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_blocks_cta_path_idx" ON "_polls_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_polls_v_blocks_content_columns_order_idx" ON "_polls_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_polls_v_blocks_content_columns_parent_id_idx" ON "_polls_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_blocks_content_order_idx" ON "_polls_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_polls_v_blocks_content_parent_id_idx" ON "_polls_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_blocks_content_path_idx" ON "_polls_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_polls_v_blocks_form_block_order_idx" ON "_polls_v_blocks_form_block" USING btree ("_order");
  CREATE INDEX "_polls_v_blocks_form_block_parent_id_idx" ON "_polls_v_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_blocks_form_block_path_idx" ON "_polls_v_blocks_form_block" USING btree ("_path");
  CREATE INDEX "_polls_v_blocks_form_block_form_idx" ON "_polls_v_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "_polls_v_blocks_pdf_block_order_idx" ON "_polls_v_blocks_pdf_block" USING btree ("_order");
  CREATE INDEX "_polls_v_blocks_pdf_block_parent_id_idx" ON "_polls_v_blocks_pdf_block" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_blocks_pdf_block_path_idx" ON "_polls_v_blocks_pdf_block" USING btree ("_path");
  CREATE INDEX "_polls_v_blocks_pdf_block_pdf_idx" ON "_polls_v_blocks_pdf_block" USING btree ("pdf_id");
  CREATE INDEX "posts_blocks_banner_order_idx" ON "posts_blocks_banner" USING btree ("_order");
  CREATE INDEX "posts_blocks_banner_parent_id_idx" ON "posts_blocks_banner" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_banner_path_idx" ON "posts_blocks_banner" USING btree ("_path");
  CREATE INDEX "posts_blocks_code_order_idx" ON "posts_blocks_code" USING btree ("_order");
  CREATE INDEX "posts_blocks_code_parent_id_idx" ON "posts_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_code_path_idx" ON "posts_blocks_code" USING btree ("_path");
  CREATE INDEX "posts_blocks_media_block_order_idx" ON "posts_blocks_media_block" USING btree ("_order");
  CREATE INDEX "posts_blocks_media_block_parent_id_idx" ON "posts_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_media_block_path_idx" ON "posts_blocks_media_block" USING btree ("_path");
  CREATE INDEX "posts_blocks_media_block_media_idx" ON "posts_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "posts_blocks_cta_links_order_idx" ON "posts_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "posts_blocks_cta_links_parent_id_idx" ON "posts_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_cta_order_idx" ON "posts_blocks_cta" USING btree ("_order");
  CREATE INDEX "posts_blocks_cta_parent_id_idx" ON "posts_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_cta_path_idx" ON "posts_blocks_cta" USING btree ("_path");
  CREATE INDEX "posts_blocks_content_columns_order_idx" ON "posts_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "posts_blocks_content_columns_parent_id_idx" ON "posts_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_content_order_idx" ON "posts_blocks_content" USING btree ("_order");
  CREATE INDEX "posts_blocks_content_parent_id_idx" ON "posts_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_content_path_idx" ON "posts_blocks_content" USING btree ("_path");
  CREATE INDEX "posts_blocks_form_block_order_idx" ON "posts_blocks_form_block" USING btree ("_order");
  CREATE INDEX "posts_blocks_form_block_parent_id_idx" ON "posts_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_form_block_path_idx" ON "posts_blocks_form_block" USING btree ("_path");
  CREATE INDEX "posts_blocks_form_block_form_idx" ON "posts_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "posts_blocks_pdf_block_order_idx" ON "posts_blocks_pdf_block" USING btree ("_order");
  CREATE INDEX "posts_blocks_pdf_block_parent_id_idx" ON "posts_blocks_pdf_block" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_pdf_block_path_idx" ON "posts_blocks_pdf_block" USING btree ("_path");
  CREATE INDEX "posts_blocks_pdf_block_pdf_idx" ON "posts_blocks_pdf_block" USING btree ("pdf_id");
  CREATE INDEX "_posts_v_blocks_banner_order_idx" ON "_posts_v_blocks_banner" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_banner_parent_id_idx" ON "_posts_v_blocks_banner" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_banner_path_idx" ON "_posts_v_blocks_banner" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_code_order_idx" ON "_posts_v_blocks_code" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_code_parent_id_idx" ON "_posts_v_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_code_path_idx" ON "_posts_v_blocks_code" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_media_block_order_idx" ON "_posts_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_media_block_parent_id_idx" ON "_posts_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_media_block_path_idx" ON "_posts_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_media_block_media_idx" ON "_posts_v_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "_posts_v_blocks_cta_links_order_idx" ON "_posts_v_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_cta_links_parent_id_idx" ON "_posts_v_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_cta_order_idx" ON "_posts_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_cta_parent_id_idx" ON "_posts_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_cta_path_idx" ON "_posts_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_content_columns_order_idx" ON "_posts_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_content_columns_parent_id_idx" ON "_posts_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_content_order_idx" ON "_posts_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_content_parent_id_idx" ON "_posts_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_content_path_idx" ON "_posts_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_form_block_order_idx" ON "_posts_v_blocks_form_block" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_form_block_parent_id_idx" ON "_posts_v_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_form_block_path_idx" ON "_posts_v_blocks_form_block" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_form_block_form_idx" ON "_posts_v_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "_posts_v_blocks_pdf_block_order_idx" ON "_posts_v_blocks_pdf_block" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_pdf_block_parent_id_idx" ON "_posts_v_blocks_pdf_block" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_pdf_block_path_idx" ON "_posts_v_blocks_pdf_block" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_pdf_block_pdf_idx" ON "_posts_v_blocks_pdf_block" USING btree ("pdf_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  ALTER TABLE "polls_rels" ADD CONSTRAINT "polls_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "polls_rels" ADD CONSTRAINT "polls_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_rels" ADD CONSTRAINT "_polls_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_rels" ADD CONSTRAINT "_polls_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "polls_rels_pages_id_idx" ON "polls_rels" USING btree ("pages_id");
  CREATE INDEX "polls_rels_posts_id_idx" ON "polls_rels" USING btree ("posts_id");
  CREATE INDEX "_polls_v_rels_pages_id_idx" ON "_polls_v_rels" USING btree ("pages_id");
  CREATE INDEX "_polls_v_rels_posts_id_idx" ON "_polls_v_rels" USING btree ("posts_id");
  CREATE INDEX "posts_rels_pages_id_idx" ON "posts_rels" USING btree ("pages_id");
  CREATE INDEX "_posts_v_rels_pages_id_idx" ON "_posts_v_rels" USING btree ("pages_id");
  ALTER TABLE "polls" DROP COLUMN "content";
  ALTER TABLE "polls" DROP COLUMN "pdf_id";
  ALTER TABLE "_polls_v" DROP COLUMN "version_content";
  ALTER TABLE "_polls_v" DROP COLUMN "version_pdf_id";
  ALTER TABLE "posts" DROP COLUMN "content";
  ALTER TABLE "_posts_v" DROP COLUMN "version_content";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_jobs_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "polls_blocks_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "polls_blocks_code" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "polls_blocks_media_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "polls_blocks_cta_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "polls_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "polls_blocks_content_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "polls_blocks_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "polls_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "polls_blocks_pdf_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_polls_v_blocks_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_polls_v_blocks_code" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_polls_v_blocks_media_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_polls_v_blocks_cta_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_polls_v_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_polls_v_blocks_content_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_polls_v_blocks_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_polls_v_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_polls_v_blocks_pdf_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_code" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_media_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_cta_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_content_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_pdf_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_code" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_media_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_cta_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_content_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_pdf_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_kv" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "polls_blocks_banner" CASCADE;
  DROP TABLE "polls_blocks_code" CASCADE;
  DROP TABLE "polls_blocks_media_block" CASCADE;
  DROP TABLE "polls_blocks_cta_links" CASCADE;
  DROP TABLE "polls_blocks_cta" CASCADE;
  DROP TABLE "polls_blocks_content_columns" CASCADE;
  DROP TABLE "polls_blocks_content" CASCADE;
  DROP TABLE "polls_blocks_form_block" CASCADE;
  DROP TABLE "polls_blocks_pdf_block" CASCADE;
  DROP TABLE "_polls_v_blocks_banner" CASCADE;
  DROP TABLE "_polls_v_blocks_code" CASCADE;
  DROP TABLE "_polls_v_blocks_media_block" CASCADE;
  DROP TABLE "_polls_v_blocks_cta_links" CASCADE;
  DROP TABLE "_polls_v_blocks_cta" CASCADE;
  DROP TABLE "_polls_v_blocks_content_columns" CASCADE;
  DROP TABLE "_polls_v_blocks_content" CASCADE;
  DROP TABLE "_polls_v_blocks_form_block" CASCADE;
  DROP TABLE "_polls_v_blocks_pdf_block" CASCADE;
  DROP TABLE "posts_blocks_banner" CASCADE;
  DROP TABLE "posts_blocks_code" CASCADE;
  DROP TABLE "posts_blocks_media_block" CASCADE;
  DROP TABLE "posts_blocks_cta_links" CASCADE;
  DROP TABLE "posts_blocks_cta" CASCADE;
  DROP TABLE "posts_blocks_content_columns" CASCADE;
  DROP TABLE "posts_blocks_content" CASCADE;
  DROP TABLE "posts_blocks_form_block" CASCADE;
  DROP TABLE "posts_blocks_pdf_block" CASCADE;
  DROP TABLE "_posts_v_blocks_banner" CASCADE;
  DROP TABLE "_posts_v_blocks_code" CASCADE;
  DROP TABLE "_posts_v_blocks_media_block" CASCADE;
  DROP TABLE "_posts_v_blocks_cta_links" CASCADE;
  DROP TABLE "_posts_v_blocks_cta" CASCADE;
  DROP TABLE "_posts_v_blocks_content_columns" CASCADE;
  DROP TABLE "_posts_v_blocks_content" CASCADE;
  DROP TABLE "_posts_v_blocks_form_block" CASCADE;
  DROP TABLE "_posts_v_blocks_pdf_block" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  ALTER TABLE "polls_rels" DROP CONSTRAINT "polls_rels_pages_fk";
  
  ALTER TABLE "polls_rels" DROP CONSTRAINT "polls_rels_posts_fk";
  
  ALTER TABLE "_polls_v_rels" DROP CONSTRAINT "_polls_v_rels_pages_fk";
  
  ALTER TABLE "_polls_v_rels" DROP CONSTRAINT "_polls_v_rels_posts_fk";
  
  ALTER TABLE "posts_rels" DROP CONSTRAINT "posts_rels_pages_fk";
  
  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT "_posts_v_rels_pages_fk";
  
  DROP INDEX "polls_rels_pages_id_idx";
  DROP INDEX "polls_rels_posts_id_idx";
  DROP INDEX "_polls_v_rels_pages_id_idx";
  DROP INDEX "_polls_v_rels_posts_id_idx";
  DROP INDEX "posts_rels_pages_id_idx";
  DROP INDEX "_posts_v_rels_pages_id_idx";
  ALTER TABLE "polls" ADD COLUMN "content" jsonb;
  ALTER TABLE "polls" ADD COLUMN "pdf_id" integer;
  ALTER TABLE "_polls_v" ADD COLUMN "version_content" jsonb;
  ALTER TABLE "_polls_v" ADD COLUMN "version_pdf_id" integer;
  ALTER TABLE "posts" ADD COLUMN "content" jsonb;
  ALTER TABLE "_posts_v" ADD COLUMN "version_content" jsonb;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_jobs_id" integer;
  ALTER TABLE "polls" ADD CONSTRAINT "polls_pdf_id_pdfs_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."pdfs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_polls_v" ADD CONSTRAINT "_polls_v_version_pdf_id_pdfs_id_fk" FOREIGN KEY ("version_pdf_id") REFERENCES "public"."pdfs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk" FOREIGN KEY ("payload_jobs_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "polls_pdf_idx" ON "polls" USING btree ("pdf_id");
  CREATE INDEX "_polls_v_version_version_pdf_idx" ON "_polls_v" USING btree ("version_pdf_id");
  CREATE INDEX "payload_locked_documents_rels_payload_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_jobs_id");
  ALTER TABLE "polls_populated_authors" DROP COLUMN "job_title";
  ALTER TABLE "polls_populated_authors" DROP COLUMN "author_page";
  ALTER TABLE "polls_rels" DROP COLUMN "pages_id";
  ALTER TABLE "polls_rels" DROP COLUMN "posts_id";
  ALTER TABLE "_polls_v_version_populated_authors" DROP COLUMN "job_title";
  ALTER TABLE "_polls_v_version_populated_authors" DROP COLUMN "author_page";
  ALTER TABLE "_polls_v_rels" DROP COLUMN "pages_id";
  ALTER TABLE "_polls_v_rels" DROP COLUMN "posts_id";
  ALTER TABLE "posts_populated_authors" DROP COLUMN "job_title";
  ALTER TABLE "posts_populated_authors" DROP COLUMN "author_page";
  ALTER TABLE "posts_rels" DROP COLUMN "pages_id";
  ALTER TABLE "_posts_v_version_populated_authors" DROP COLUMN "job_title";
  ALTER TABLE "_posts_v_version_populated_authors" DROP COLUMN "author_page";
  ALTER TABLE "_posts_v_rels" DROP COLUMN "pages_id";
  DROP TYPE "public"."enum_polls_blocks_banner_style";
  DROP TYPE "public"."enum_polls_blocks_code_language";
  DROP TYPE "public"."enum_polls_blocks_cta_links_link_type";
  DROP TYPE "public"."enum_polls_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum_polls_blocks_content_columns_size";
  DROP TYPE "public"."enum_polls_blocks_content_columns_link_type";
  DROP TYPE "public"."enum_polls_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum__polls_v_blocks_banner_style";
  DROP TYPE "public"."enum__polls_v_blocks_code_language";
  DROP TYPE "public"."enum__polls_v_blocks_cta_links_link_type";
  DROP TYPE "public"."enum__polls_v_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum__polls_v_blocks_content_columns_size";
  DROP TYPE "public"."enum__polls_v_blocks_content_columns_link_type";
  DROP TYPE "public"."enum__polls_v_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum_posts_blocks_banner_style";
  DROP TYPE "public"."enum_posts_blocks_code_language";
  DROP TYPE "public"."enum_posts_blocks_cta_links_link_type";
  DROP TYPE "public"."enum_posts_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum_posts_blocks_content_columns_size";
  DROP TYPE "public"."enum_posts_blocks_content_columns_link_type";
  DROP TYPE "public"."enum_posts_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum__posts_v_blocks_banner_style";
  DROP TYPE "public"."enum__posts_v_blocks_code_language";
  DROP TYPE "public"."enum__posts_v_blocks_cta_links_link_type";
  DROP TYPE "public"."enum__posts_v_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum__posts_v_blocks_content_columns_size";
  DROP TYPE "public"."enum__posts_v_blocks_content_columns_link_type";
  DROP TYPE "public"."enum__posts_v_blocks_content_columns_link_appearance";`)
}
