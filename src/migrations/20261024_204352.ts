import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "homeftChrt" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"chart_id" integer,
  	"full_width" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homeftChrt_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"chart_id" integer,
  	"full_width" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "graphsCol_chart_series_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" numeric NOT NULL,
  	"month" numeric NOT NULL,
  	"day" numeric NOT NULL,
  	"y" numeric NOT NULL,
  	"error" numeric NOT NULL,
  	"report_id" integer
  );
  
  CREATE TABLE "graphsCol_chart_series" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"color" varchar
  );
  
  CREATE TABLE "graphsCol_windows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"start_date_year" numeric NOT NULL,
  	"start_date_month" numeric NOT NULL,
  	"start_date_day" numeric NOT NULL,
  	"end_date_year" numeric NOT NULL,
  	"end_date_month" numeric NOT NULL,
  	"end_date_day" numeric NOT NULL
  );
  
  CREATE TABLE "graphsCol_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"year" numeric NOT NULL,
  	"month" numeric NOT NULL,
  	"day" numeric NOT NULL
  );
  
  CREATE TABLE "graphsCol" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "pages_blocks_featuredchart" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_featuredchart" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_featuredchart" CASCADE;
  DROP TABLE "_pages_v_blocks_featuredchart" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "graphsCol_id" integer;
  ALTER TABLE "homeftChrt" ADD CONSTRAINT "homeftChrt_chart_id_graphsCol_id_fk" FOREIGN KEY ("chart_id") REFERENCES "public"."graphsCol"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homeftChrt" ADD CONSTRAINT "homeftChrt_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homeftChrt_v" ADD CONSTRAINT "_homeftChrt_v_chart_id_graphsCol_id_fk" FOREIGN KEY ("chart_id") REFERENCES "public"."graphsCol"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homeftChrt_v" ADD CONSTRAINT "_homeftChrt_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "graphsCol_chart_series_points" ADD CONSTRAINT "graphsCol_chart_series_points_report_id_polls_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."polls"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "graphsCol_chart_series_points" ADD CONSTRAINT "graphsCol_chart_series_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."graphsCol_chart_series"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "graphsCol_chart_series" ADD CONSTRAINT "graphsCol_chart_series_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."graphsCol"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "graphsCol_windows" ADD CONSTRAINT "graphsCol_windows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."graphsCol"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "graphsCol_events" ADD CONSTRAINT "graphsCol_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."graphsCol"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "homeftChrt_order_idx" ON "homeftChrt" USING btree ("_order");
  CREATE INDEX "homeftChrt_parent_id_idx" ON "homeftChrt" USING btree ("_parent_id");
  CREATE INDEX "homeftChrt_path_idx" ON "homeftChrt" USING btree ("_path");
  CREATE INDEX "homeftChrt_chart_idx" ON "homeftChrt" USING btree ("chart_id");
  CREATE INDEX "_homeftChrt_v_order_idx" ON "_homeftChrt_v" USING btree ("_order");
  CREATE INDEX "_homeftChrt_v_parent_id_idx" ON "_homeftChrt_v" USING btree ("_parent_id");
  CREATE INDEX "_homeftChrt_v_path_idx" ON "_homeftChrt_v" USING btree ("_path");
  CREATE INDEX "_homeftChrt_v_chart_idx" ON "_homeftChrt_v" USING btree ("chart_id");
  CREATE INDEX "graphsCol_chart_series_points_order_idx" ON "graphsCol_chart_series_points" USING btree ("_order");
  CREATE INDEX "graphsCol_chart_series_points_parent_id_idx" ON "graphsCol_chart_series_points" USING btree ("_parent_id");
  CREATE INDEX "graphsCol_chart_series_points_report_idx" ON "graphsCol_chart_series_points" USING btree ("report_id");
  CREATE INDEX "graphsCol_chart_series_order_idx" ON "graphsCol_chart_series" USING btree ("_order");
  CREATE INDEX "graphsCol_chart_series_parent_id_idx" ON "graphsCol_chart_series" USING btree ("_parent_id");
  CREATE INDEX "graphsCol_windows_order_idx" ON "graphsCol_windows" USING btree ("_order");
  CREATE INDEX "graphsCol_windows_parent_id_idx" ON "graphsCol_windows" USING btree ("_parent_id");
  CREATE INDEX "graphsCol_events_order_idx" ON "graphsCol_events" USING btree ("_order");
  CREATE INDEX "graphsCol_events_parent_id_idx" ON "graphsCol_events" USING btree ("_parent_id");
  CREATE INDEX "graphsCol_updated_at_idx" ON "graphsCol" USING btree ("updated_at");
  CREATE INDEX "graphsCol_created_at_idx" ON "graphsCol" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_graphs_fk" FOREIGN KEY ("graphsCol_id") REFERENCES "public"."graphsCol"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_graphsCol_id_idx" ON "payload_locked_documents_rels" USING btree ("graphsCol_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_featuredchart" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"featuredpoll_id" integer,
  	"full_width" boolean DEFAULT false,
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
  
  ALTER TABLE "homeftChrt" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homeftChrt_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "graphsCol_chart_series_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "graphsCol_chart_series" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "graphsCol_windows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "graphsCol_events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "graphsCol" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "homeftChrt" CASCADE;
  DROP TABLE "_homeftChrt_v" CASCADE;
  DROP TABLE "graphsCol_chart_series_points" CASCADE;
  DROP TABLE "graphsCol_chart_series" CASCADE;
  DROP TABLE "graphsCol_windows" CASCADE;
  DROP TABLE "graphsCol_events" CASCADE;
  DROP TABLE "graphsCol" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_graphs_fk";
  
  DROP INDEX "payload_locked_documents_rels_graphsCol_id_idx";
  ALTER TABLE "pages_blocks_featuredchart" ADD CONSTRAINT "pages_blocks_featuredchart_featuredpoll_id_polls_id_fk" FOREIGN KEY ("featuredpoll_id") REFERENCES "public"."polls"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_featuredchart" ADD CONSTRAINT "pages_blocks_featuredchart_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featuredchart" ADD CONSTRAINT "_pages_v_blocks_featuredchart_featuredpoll_id_polls_id_fk" FOREIGN KEY ("featuredpoll_id") REFERENCES "public"."polls"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featuredchart" ADD CONSTRAINT "_pages_v_blocks_featuredchart_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_featuredchart_order_idx" ON "pages_blocks_featuredchart" USING btree ("_order");
  CREATE INDEX "pages_blocks_featuredchart_parent_id_idx" ON "pages_blocks_featuredchart" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_featuredchart_path_idx" ON "pages_blocks_featuredchart" USING btree ("_path");
  CREATE INDEX "pages_blocks_featuredchart_featuredpoll_idx" ON "pages_blocks_featuredchart" USING btree ("featuredpoll_id");
  CREATE INDEX "_pages_v_blocks_featuredchart_order_idx" ON "_pages_v_blocks_featuredchart" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_featuredchart_parent_id_idx" ON "_pages_v_blocks_featuredchart" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_featuredchart_path_idx" ON "_pages_v_blocks_featuredchart" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_featuredchart_featuredpoll_idx" ON "_pages_v_blocks_featuredchart" USING btree ("featuredpoll_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "graphsCol_id";`)
}
