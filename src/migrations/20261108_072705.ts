import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "polls_blocks_plotly_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"data" jsonb,
  	"caption" jsonb,
  	"full_width" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "polls_blocks_plotly_side_by_side" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_chart" jsonb,
  	"right_chart" jsonb,
  	"caption" jsonb,
  	"full_width" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "_polls_v_blocks_plotly_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"data" jsonb,
  	"caption" jsonb,
  	"full_width" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_polls_v_blocks_plotly_side_by_side" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"left_chart" jsonb,
  	"right_chart" jsonb,
  	"caption" jsonb,
  	"full_width" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "polls_blocks_plotly_block" ADD CONSTRAINT "polls_blocks_plotly_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "polls_blocks_plotly_side_by_side" ADD CONSTRAINT "polls_blocks_plotly_side_by_side_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_blocks_plotly_block" ADD CONSTRAINT "_polls_v_blocks_plotly_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_blocks_plotly_side_by_side" ADD CONSTRAINT "_polls_v_blocks_plotly_side_by_side_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "polls_blocks_plotly_block_order_idx" ON "polls_blocks_plotly_block" USING btree ("_order");
  CREATE INDEX "polls_blocks_plotly_block_parent_id_idx" ON "polls_blocks_plotly_block" USING btree ("_parent_id");
  CREATE INDEX "polls_blocks_plotly_block_path_idx" ON "polls_blocks_plotly_block" USING btree ("_path");
  CREATE INDEX "polls_blocks_plotly_side_by_side_order_idx" ON "polls_blocks_plotly_side_by_side" USING btree ("_order");
  CREATE INDEX "polls_blocks_plotly_side_by_side_parent_id_idx" ON "polls_blocks_plotly_side_by_side" USING btree ("_parent_id");
  CREATE INDEX "polls_blocks_plotly_side_by_side_path_idx" ON "polls_blocks_plotly_side_by_side" USING btree ("_path");
  CREATE INDEX "_polls_v_blocks_plotly_block_order_idx" ON "_polls_v_blocks_plotly_block" USING btree ("_order");
  CREATE INDEX "_polls_v_blocks_plotly_block_parent_id_idx" ON "_polls_v_blocks_plotly_block" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_blocks_plotly_block_path_idx" ON "_polls_v_blocks_plotly_block" USING btree ("_path");
  CREATE INDEX "_polls_v_blocks_plotly_side_by_side_order_idx" ON "_polls_v_blocks_plotly_side_by_side" USING btree ("_order");
  CREATE INDEX "_polls_v_blocks_plotly_side_by_side_parent_id_idx" ON "_polls_v_blocks_plotly_side_by_side" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_blocks_plotly_side_by_side_path_idx" ON "_polls_v_blocks_plotly_side_by_side" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "polls_blocks_plotly_block" CASCADE;
  DROP TABLE "polls_blocks_plotly_side_by_side" CASCADE;
  DROP TABLE "_polls_v_blocks_plotly_block" CASCADE;
  DROP TABLE "_polls_v_blocks_plotly_side_by_side" CASCADE;`)
}
