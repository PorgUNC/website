import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_polls_files_icon" AS ENUM('file', 'file-code', 'file-text');
  CREATE TYPE "public"."enum__polls_v_version_files_icon" AS ENUM('file', 'file-code', 'file-text');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'user');
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pollarchive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" numeric DEFAULT 1,
  	"full_width" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_featuredchart" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"featuredpoll_id" integer,
  	"full_width" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pollarchive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" numeric DEFAULT 1,
  	"full_width" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_featuredchart" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"featuredpoll_id" integer,
  	"full_width" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "polls_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "polls_blocks_line_chart" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"chart_index" numeric,
  	"show_legend" boolean DEFAULT true,
  	"show_dots" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "polls_blocks_pie_chart" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"chart_index" numeric,
  	"show_legend" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "polls_statistics_pie_charts_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"value" numeric,
  	"color" varchar
  );
  
  CREATE TABLE "polls_statistics_pie_charts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"hide" boolean DEFAULT false
  );
  
  CREATE TABLE "polls_statistics_line_charts_series_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"x" varchar,
  	"y" numeric
  );
  
  CREATE TABLE "polls_statistics_line_charts_series" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"color" varchar
  );
  
  CREATE TABLE "polls_statistics_line_charts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "polls_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"title" varchar,
  	"icon" "enum_polls_files_icon"
  );
  
  CREATE TABLE "_polls_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_polls_v_blocks_line_chart" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"chart_index" numeric,
  	"show_legend" boolean DEFAULT true,
  	"show_dots" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_polls_v_blocks_pie_chart" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"chart_index" numeric,
  	"show_legend" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_polls_v_version_statistics_pie_charts_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"value" numeric,
  	"color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_polls_v_version_statistics_pie_charts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"hide" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_polls_v_version_statistics_line_charts_series_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"x" varchar,
  	"y" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_polls_v_version_statistics_line_charts_series" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_polls_v_version_statistics_line_charts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_polls_v_version_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"title" varchar,
  	"icon" "enum__polls_v_version_files_icon",
  	"_uuid" varchar
  );
  
  CREATE TABLE "posts_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt_text" jsonb,
  	"published_date" timestamp(3) with time zone,
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
  	"focal_y" numeric
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "invitations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"token" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "featured_poll" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"poll_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pdfs" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pdfs" CASCADE;
  ALTER TABLE "pages_blocks_pdf_block" DROP CONSTRAINT "pages_blocks_pdf_block_pdf_id_pdfs_id_fk";
  
  ALTER TABLE "_pages_v_blocks_pdf_block" DROP CONSTRAINT "_pages_v_blocks_pdf_block_pdf_id_pdfs_id_fk";
  
  ALTER TABLE "polls_blocks_pdf_block" DROP CONSTRAINT "polls_blocks_pdf_block_pdf_id_pdfs_id_fk";
  
  ALTER TABLE "_polls_v_blocks_pdf_block" DROP CONSTRAINT "_polls_v_blocks_pdf_block_pdf_id_pdfs_id_fk";
  
  ALTER TABLE "posts_blocks_pdf_block" DROP CONSTRAINT "posts_blocks_pdf_block_pdf_id_pdfs_id_fk";
  
  ALTER TABLE "_posts_v_blocks_pdf_block" DROP CONSTRAINT "_posts_v_blocks_pdf_block_pdf_id_pdfs_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pdfs_fk";
  
  DROP INDEX "payload_locked_documents_rels_pdfs_id_idx";
  ALTER TABLE "pages_blocks_archive" ADD COLUMN "full_width" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "full_width" boolean DEFAULT true;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "files_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "invitations_id" integer;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pollarchive" ADD CONSTRAINT "pages_blocks_pollarchive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_featuredchart" ADD CONSTRAINT "pages_blocks_featuredchart_featuredpoll_id_polls_id_fk" FOREIGN KEY ("featuredpoll_id") REFERENCES "public"."polls"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_featuredchart" ADD CONSTRAINT "pages_blocks_featuredchart_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pollarchive" ADD CONSTRAINT "_pages_v_blocks_pollarchive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featuredchart" ADD CONSTRAINT "_pages_v_blocks_featuredchart_featuredpoll_id_polls_id_fk" FOREIGN KEY ("featuredpoll_id") REFERENCES "public"."polls"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featuredchart" ADD CONSTRAINT "_pages_v_blocks_featuredchart_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "polls_blocks_rich_text" ADD CONSTRAINT "polls_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "polls_blocks_line_chart" ADD CONSTRAINT "polls_blocks_line_chart_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "polls_blocks_pie_chart" ADD CONSTRAINT "polls_blocks_pie_chart_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "polls_statistics_pie_charts_data" ADD CONSTRAINT "polls_statistics_pie_charts_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls_statistics_pie_charts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "polls_statistics_pie_charts" ADD CONSTRAINT "polls_statistics_pie_charts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "polls_statistics_line_charts_series_data" ADD CONSTRAINT "polls_statistics_line_charts_series_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls_statistics_line_charts_series"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "polls_statistics_line_charts_series" ADD CONSTRAINT "polls_statistics_line_charts_series_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls_statistics_line_charts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "polls_statistics_line_charts" ADD CONSTRAINT "polls_statistics_line_charts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "polls_files" ADD CONSTRAINT "polls_files_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "polls_files" ADD CONSTRAINT "polls_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_blocks_rich_text" ADD CONSTRAINT "_polls_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_blocks_line_chart" ADD CONSTRAINT "_polls_v_blocks_line_chart_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_blocks_pie_chart" ADD CONSTRAINT "_polls_v_blocks_pie_chart_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_version_statistics_pie_charts_data" ADD CONSTRAINT "_polls_v_version_statistics_pie_charts_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v_version_statistics_pie_charts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_version_statistics_pie_charts" ADD CONSTRAINT "_polls_v_version_statistics_pie_charts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_version_statistics_line_charts_series_data" ADD CONSTRAINT "_polls_v_version_statistics_line_charts_series_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v_version_statistics_line_charts_series"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_version_statistics_line_charts_series" ADD CONSTRAINT "_polls_v_version_statistics_line_charts_series_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v_version_statistics_line_charts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_version_statistics_line_charts" ADD CONSTRAINT "_polls_v_version_statistics_line_charts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_version_files" ADD CONSTRAINT "_polls_v_version_files_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_polls_v_version_files" ADD CONSTRAINT "_polls_v_version_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_rich_text" ADD CONSTRAINT "posts_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_rich_text" ADD CONSTRAINT "_posts_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "featured_poll" ADD CONSTRAINT "featured_poll_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_pollarchive_order_idx" ON "pages_blocks_pollarchive" USING btree ("_order");
  CREATE INDEX "pages_blocks_pollarchive_parent_id_idx" ON "pages_blocks_pollarchive" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pollarchive_path_idx" ON "pages_blocks_pollarchive" USING btree ("_path");
  CREATE INDEX "pages_blocks_featuredchart_order_idx" ON "pages_blocks_featuredchart" USING btree ("_order");
  CREATE INDEX "pages_blocks_featuredchart_parent_id_idx" ON "pages_blocks_featuredchart" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_featuredchart_path_idx" ON "pages_blocks_featuredchart" USING btree ("_path");
  CREATE INDEX "pages_blocks_featuredchart_featuredpoll_idx" ON "pages_blocks_featuredchart" USING btree ("featuredpoll_id");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_pollarchive_order_idx" ON "_pages_v_blocks_pollarchive" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pollarchive_parent_id_idx" ON "_pages_v_blocks_pollarchive" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pollarchive_path_idx" ON "_pages_v_blocks_pollarchive" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_featuredchart_order_idx" ON "_pages_v_blocks_featuredchart" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_featuredchart_parent_id_idx" ON "_pages_v_blocks_featuredchart" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_featuredchart_path_idx" ON "_pages_v_blocks_featuredchart" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_featuredchart_featuredpoll_idx" ON "_pages_v_blocks_featuredchart" USING btree ("featuredpoll_id");
  CREATE INDEX "polls_blocks_rich_text_order_idx" ON "polls_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "polls_blocks_rich_text_parent_id_idx" ON "polls_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "polls_blocks_rich_text_path_idx" ON "polls_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "polls_blocks_line_chart_order_idx" ON "polls_blocks_line_chart" USING btree ("_order");
  CREATE INDEX "polls_blocks_line_chart_parent_id_idx" ON "polls_blocks_line_chart" USING btree ("_parent_id");
  CREATE INDEX "polls_blocks_line_chart_path_idx" ON "polls_blocks_line_chart" USING btree ("_path");
  CREATE INDEX "polls_blocks_pie_chart_order_idx" ON "polls_blocks_pie_chart" USING btree ("_order");
  CREATE INDEX "polls_blocks_pie_chart_parent_id_idx" ON "polls_blocks_pie_chart" USING btree ("_parent_id");
  CREATE INDEX "polls_blocks_pie_chart_path_idx" ON "polls_blocks_pie_chart" USING btree ("_path");
  CREATE INDEX "polls_statistics_pie_charts_data_order_idx" ON "polls_statistics_pie_charts_data" USING btree ("_order");
  CREATE INDEX "polls_statistics_pie_charts_data_parent_id_idx" ON "polls_statistics_pie_charts_data" USING btree ("_parent_id");
  CREATE INDEX "polls_statistics_pie_charts_order_idx" ON "polls_statistics_pie_charts" USING btree ("_order");
  CREATE INDEX "polls_statistics_pie_charts_parent_id_idx" ON "polls_statistics_pie_charts" USING btree ("_parent_id");
  CREATE INDEX "polls_statistics_line_charts_series_data_order_idx" ON "polls_statistics_line_charts_series_data" USING btree ("_order");
  CREATE INDEX "polls_statistics_line_charts_series_data_parent_id_idx" ON "polls_statistics_line_charts_series_data" USING btree ("_parent_id");
  CREATE INDEX "polls_statistics_line_charts_series_order_idx" ON "polls_statistics_line_charts_series" USING btree ("_order");
  CREATE INDEX "polls_statistics_line_charts_series_parent_id_idx" ON "polls_statistics_line_charts_series" USING btree ("_parent_id");
  CREATE INDEX "polls_statistics_line_charts_order_idx" ON "polls_statistics_line_charts" USING btree ("_order");
  CREATE INDEX "polls_statistics_line_charts_parent_id_idx" ON "polls_statistics_line_charts" USING btree ("_parent_id");
  CREATE INDEX "polls_files_order_idx" ON "polls_files" USING btree ("_order");
  CREATE INDEX "polls_files_parent_id_idx" ON "polls_files" USING btree ("_parent_id");
  CREATE INDEX "polls_files_file_idx" ON "polls_files" USING btree ("file_id");
  CREATE INDEX "_polls_v_blocks_rich_text_order_idx" ON "_polls_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_polls_v_blocks_rich_text_parent_id_idx" ON "_polls_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_blocks_rich_text_path_idx" ON "_polls_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_polls_v_blocks_line_chart_order_idx" ON "_polls_v_blocks_line_chart" USING btree ("_order");
  CREATE INDEX "_polls_v_blocks_line_chart_parent_id_idx" ON "_polls_v_blocks_line_chart" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_blocks_line_chart_path_idx" ON "_polls_v_blocks_line_chart" USING btree ("_path");
  CREATE INDEX "_polls_v_blocks_pie_chart_order_idx" ON "_polls_v_blocks_pie_chart" USING btree ("_order");
  CREATE INDEX "_polls_v_blocks_pie_chart_parent_id_idx" ON "_polls_v_blocks_pie_chart" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_blocks_pie_chart_path_idx" ON "_polls_v_blocks_pie_chart" USING btree ("_path");
  CREATE INDEX "_polls_v_version_statistics_pie_charts_data_order_idx" ON "_polls_v_version_statistics_pie_charts_data" USING btree ("_order");
  CREATE INDEX "_polls_v_version_statistics_pie_charts_data_parent_id_idx" ON "_polls_v_version_statistics_pie_charts_data" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_version_statistics_pie_charts_order_idx" ON "_polls_v_version_statistics_pie_charts" USING btree ("_order");
  CREATE INDEX "_polls_v_version_statistics_pie_charts_parent_id_idx" ON "_polls_v_version_statistics_pie_charts" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_version_statistics_line_charts_series_data_order_idx" ON "_polls_v_version_statistics_line_charts_series_data" USING btree ("_order");
  CREATE INDEX "_polls_v_version_statistics_line_charts_series_data_parent_id_idx" ON "_polls_v_version_statistics_line_charts_series_data" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_version_statistics_line_charts_series_order_idx" ON "_polls_v_version_statistics_line_charts_series" USING btree ("_order");
  CREATE INDEX "_polls_v_version_statistics_line_charts_series_parent_id_idx" ON "_polls_v_version_statistics_line_charts_series" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_version_statistics_line_charts_order_idx" ON "_polls_v_version_statistics_line_charts" USING btree ("_order");
  CREATE INDEX "_polls_v_version_statistics_line_charts_parent_id_idx" ON "_polls_v_version_statistics_line_charts" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_version_files_order_idx" ON "_polls_v_version_files" USING btree ("_order");
  CREATE INDEX "_polls_v_version_files_parent_id_idx" ON "_polls_v_version_files" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_version_files_file_idx" ON "_polls_v_version_files" USING btree ("file_id");
  CREATE INDEX "posts_blocks_rich_text_order_idx" ON "posts_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "posts_blocks_rich_text_parent_id_idx" ON "posts_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_rich_text_path_idx" ON "posts_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_rich_text_order_idx" ON "_posts_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_rich_text_parent_id_idx" ON "_posts_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_rich_text_path_idx" ON "_posts_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "files_updated_at_idx" ON "files" USING btree ("updated_at");
  CREATE INDEX "files_created_at_idx" ON "files" USING btree ("created_at");
  CREATE UNIQUE INDEX "files_filename_idx" ON "files" USING btree ("filename");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "invitations_updated_at_idx" ON "invitations" USING btree ("updated_at");
  CREATE INDEX "invitations_created_at_idx" ON "invitations" USING btree ("created_at");
  CREATE INDEX "featured_poll_poll_idx" ON "featured_poll" USING btree ("poll_id");
  ALTER TABLE "pages_blocks_pdf_block" ADD CONSTRAINT "pages_blocks_pdf_block_pdf_id_files_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pdf_block" ADD CONSTRAINT "_pages_v_blocks_pdf_block_pdf_id_files_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "polls_blocks_pdf_block" ADD CONSTRAINT "polls_blocks_pdf_block_pdf_id_files_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_polls_v_blocks_pdf_block" ADD CONSTRAINT "_polls_v_blocks_pdf_block_pdf_id_files_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_pdf_block" ADD CONSTRAINT "posts_blocks_pdf_block_pdf_id_files_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_pdf_block" ADD CONSTRAINT "_posts_v_blocks_pdf_block_pdf_id_files_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_files_fk" FOREIGN KEY ("files_id") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_invitations_fk" FOREIGN KEY ("invitations_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_files_id_idx" ON "payload_locked_documents_rels" USING btree ("files_id");
  CREATE INDEX "payload_locked_documents_rels_invitations_id_idx" ON "payload_locked_documents_rels" USING btree ("invitations_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pdfs_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pdfs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"caption" jsonb,
  	"published_date" timestamp(3) with time zone,
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
  	"focal_y" numeric
  );
  
  ALTER TABLE "pages_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_pollarchive" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_featuredchart" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_pollarchive" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_featuredchart" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "polls_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "polls_blocks_line_chart" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "polls_blocks_pie_chart" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "polls_statistics_pie_charts_data" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "polls_statistics_pie_charts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "polls_statistics_line_charts_series_data" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "polls_statistics_line_charts_series" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "polls_statistics_line_charts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "polls_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_polls_v_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_polls_v_blocks_line_chart" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_polls_v_blocks_pie_chart" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_polls_v_version_statistics_pie_charts_data" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_polls_v_version_statistics_pie_charts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_polls_v_version_statistics_line_charts_series_data" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_polls_v_version_statistics_line_charts_series" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_polls_v_version_statistics_line_charts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_polls_v_version_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "users_roles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "invitations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "featured_poll" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_pollarchive" CASCADE;
  DROP TABLE "pages_blocks_featuredchart" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_pollarchive" CASCADE;
  DROP TABLE "_pages_v_blocks_featuredchart" CASCADE;
  DROP TABLE "polls_blocks_rich_text" CASCADE;
  DROP TABLE "polls_blocks_line_chart" CASCADE;
  DROP TABLE "polls_blocks_pie_chart" CASCADE;
  DROP TABLE "polls_statistics_pie_charts_data" CASCADE;
  DROP TABLE "polls_statistics_pie_charts" CASCADE;
  DROP TABLE "polls_statistics_line_charts_series_data" CASCADE;
  DROP TABLE "polls_statistics_line_charts_series" CASCADE;
  DROP TABLE "polls_statistics_line_charts" CASCADE;
  DROP TABLE "polls_files" CASCADE;
  DROP TABLE "_polls_v_blocks_rich_text" CASCADE;
  DROP TABLE "_polls_v_blocks_line_chart" CASCADE;
  DROP TABLE "_polls_v_blocks_pie_chart" CASCADE;
  DROP TABLE "_polls_v_version_statistics_pie_charts_data" CASCADE;
  DROP TABLE "_polls_v_version_statistics_pie_charts" CASCADE;
  DROP TABLE "_polls_v_version_statistics_line_charts_series_data" CASCADE;
  DROP TABLE "_polls_v_version_statistics_line_charts_series" CASCADE;
  DROP TABLE "_polls_v_version_statistics_line_charts" CASCADE;
  DROP TABLE "_polls_v_version_files" CASCADE;
  DROP TABLE "posts_blocks_rich_text" CASCADE;
  DROP TABLE "_posts_v_blocks_rich_text" CASCADE;
  DROP TABLE "files" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "invitations" CASCADE;
  DROP TABLE "featured_poll" CASCADE;
  ALTER TABLE "pages_blocks_pdf_block" DROP CONSTRAINT "pages_blocks_pdf_block_pdf_id_files_id_fk";
  
  ALTER TABLE "_pages_v_blocks_pdf_block" DROP CONSTRAINT "_pages_v_blocks_pdf_block_pdf_id_files_id_fk";
  
  ALTER TABLE "polls_blocks_pdf_block" DROP CONSTRAINT "polls_blocks_pdf_block_pdf_id_files_id_fk";
  
  ALTER TABLE "_polls_v_blocks_pdf_block" DROP CONSTRAINT "_polls_v_blocks_pdf_block_pdf_id_files_id_fk";
  
  ALTER TABLE "posts_blocks_pdf_block" DROP CONSTRAINT "posts_blocks_pdf_block_pdf_id_files_id_fk";
  
  ALTER TABLE "_posts_v_blocks_pdf_block" DROP CONSTRAINT "_posts_v_blocks_pdf_block_pdf_id_files_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_files_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_invitations_fk";
  
  DROP INDEX "payload_locked_documents_rels_files_id_idx";
  DROP INDEX "payload_locked_documents_rels_invitations_id_idx";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pdfs_id" integer;
  CREATE INDEX "pdfs_updated_at_idx" ON "pdfs" USING btree ("updated_at");
  CREATE INDEX "pdfs_created_at_idx" ON "pdfs" USING btree ("created_at");
  CREATE UNIQUE INDEX "pdfs_filename_idx" ON "pdfs" USING btree ("filename");
  ALTER TABLE "pages_blocks_pdf_block" ADD CONSTRAINT "pages_blocks_pdf_block_pdf_id_pdfs_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."pdfs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pdf_block" ADD CONSTRAINT "_pages_v_blocks_pdf_block_pdf_id_pdfs_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."pdfs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "polls_blocks_pdf_block" ADD CONSTRAINT "polls_blocks_pdf_block_pdf_id_pdfs_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."pdfs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_polls_v_blocks_pdf_block" ADD CONSTRAINT "_polls_v_blocks_pdf_block_pdf_id_pdfs_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."pdfs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_pdf_block" ADD CONSTRAINT "posts_blocks_pdf_block_pdf_id_pdfs_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."pdfs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_pdf_block" ADD CONSTRAINT "_posts_v_blocks_pdf_block_pdf_id_pdfs_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."pdfs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pdfs_fk" FOREIGN KEY ("pdfs_id") REFERENCES "public"."pdfs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_pdfs_id_idx" ON "payload_locked_documents_rels" USING btree ("pdfs_id");
  ALTER TABLE "pages_blocks_archive" DROP COLUMN "full_width";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "full_width";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "files_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "invitations_id";
  DROP TYPE "public"."enum_polls_files_icon";
  DROP TYPE "public"."enum__polls_v_version_files_icon";
  DROP TYPE "public"."enum_users_roles";`)
}
