import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "forms_blocks_year" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"min_year" numeric NOT NULL,
  	"max_year" numeric NOT NULL,
  	"width" numeric,
  	"required" boolean DEFAULT false,
  	"default_value" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "forms_blocks_year" ADD CONSTRAINT "forms_blocks_year_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "forms_blocks_year_order_idx" ON "forms_blocks_year" USING btree ("_order");
  CREATE INDEX "forms_blocks_year_parent_id_idx" ON "forms_blocks_year" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_year_path_idx" ON "forms_blocks_year" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "forms_blocks_year" CASCADE;`)
}
