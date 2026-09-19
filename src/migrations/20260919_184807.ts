import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "polls_statistics_line_charts_series_data" RENAME TO "plnChrt_series_data";
  ALTER TABLE "polls_statistics_line_charts_series" RENAME TO "plnChrt_series";
  ALTER TABLE "polls_statistics_line_charts" RENAME TO "plnChrt";
  ALTER TABLE "_polls_v_version_statistics_line_charts_series_data" RENAME TO "_plnChrt_v_series_data";
  ALTER TABLE "_polls_v_version_statistics_line_charts_series" RENAME TO "_plnChrt_v_series";
  ALTER TABLE "_polls_v_version_statistics_line_charts" RENAME TO "_plnChrt_v";
  ALTER TABLE "plnChrt_series_data" DROP CONSTRAINT "polls_statistics_line_charts_series_data_parent_id_fk";
  
  ALTER TABLE "plnChrt_series" DROP CONSTRAINT "polls_statistics_line_charts_series_parent_id_fk";
  
  ALTER TABLE "plnChrt" DROP CONSTRAINT "polls_statistics_line_charts_parent_id_fk";
  
  ALTER TABLE "_plnChrt_v_series_data" DROP CONSTRAINT "_polls_v_version_statistics_line_charts_series_data_parent_id_fk";
  
  ALTER TABLE "_plnChrt_v_series" DROP CONSTRAINT "_polls_v_version_statistics_line_charts_series_parent_id_fk";
  
  ALTER TABLE "_plnChrt_v" DROP CONSTRAINT "_polls_v_version_statistics_line_charts_parent_id_fk";
  
  DROP INDEX "polls_statistics_line_charts_series_data_order_idx";
  DROP INDEX "polls_statistics_line_charts_series_data_parent_id_idx";
  DROP INDEX "polls_statistics_line_charts_series_order_idx";
  DROP INDEX "polls_statistics_line_charts_series_parent_id_idx";
  DROP INDEX "polls_statistics_line_charts_order_idx";
  DROP INDEX "polls_statistics_line_charts_parent_id_idx";
  DROP INDEX "_polls_v_version_statistics_line_charts_series_data_order_idx";
  DROP INDEX "_polls_v_version_statistics_line_charts_series_data_parent_id_idx";
  DROP INDEX "_polls_v_version_statistics_line_charts_series_order_idx";
  DROP INDEX "_polls_v_version_statistics_line_charts_series_parent_id_idx";
  DROP INDEX "_polls_v_version_statistics_line_charts_order_idx";
  DROP INDEX "_polls_v_version_statistics_line_charts_parent_id_idx";
  ALTER TABLE "plnChrt_series_data" ADD CONSTRAINT "plnChrt_series_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."plnChrt_series"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "plnChrt_series" ADD CONSTRAINT "plnChrt_series_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."plnChrt"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "plnChrt" ADD CONSTRAINT "plnChrt_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_plnChrt_v_series_data" ADD CONSTRAINT "_plnChrt_v_series_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_plnChrt_v_series"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_plnChrt_v_series" ADD CONSTRAINT "_plnChrt_v_series_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_plnChrt_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_plnChrt_v" ADD CONSTRAINT "_plnChrt_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "plnChrt_series_data_order_idx" ON "plnChrt_series_data" USING btree ("_order");
  CREATE INDEX "plnChrt_series_data_parent_id_idx" ON "plnChrt_series_data" USING btree ("_parent_id");
  CREATE INDEX "plnChrt_series_order_idx" ON "plnChrt_series" USING btree ("_order");
  CREATE INDEX "plnChrt_series_parent_id_idx" ON "plnChrt_series" USING btree ("_parent_id");
  CREATE INDEX "plnChrt_order_idx" ON "plnChrt" USING btree ("_order");
  CREATE INDEX "plnChrt_parent_id_idx" ON "plnChrt" USING btree ("_parent_id");
  CREATE INDEX "_plnChrt_v_series_data_order_idx" ON "_plnChrt_v_series_data" USING btree ("_order");
  CREATE INDEX "_plnChrt_v_series_data_parent_id_idx" ON "_plnChrt_v_series_data" USING btree ("_parent_id");
  CREATE INDEX "_plnChrt_v_series_order_idx" ON "_plnChrt_v_series" USING btree ("_order");
  CREATE INDEX "_plnChrt_v_series_parent_id_idx" ON "_plnChrt_v_series" USING btree ("_parent_id");
  CREATE INDEX "_plnChrt_v_order_idx" ON "_plnChrt_v" USING btree ("_order");
  CREATE INDEX "_plnChrt_v_parent_id_idx" ON "_plnChrt_v" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "plnChrt_series_data" RENAME TO "polls_statistics_line_charts_series_data";
  ALTER TABLE "plnChrt_series" RENAME TO "polls_statistics_line_charts_series";
  ALTER TABLE "plnChrt" RENAME TO "polls_statistics_line_charts";
  ALTER TABLE "_plnChrt_v_series_data" RENAME TO "_polls_v_version_statistics_line_charts_series_data";
  ALTER TABLE "_plnChrt_v_series" RENAME TO "_polls_v_version_statistics_line_charts_series";
  ALTER TABLE "_plnChrt_v" RENAME TO "_polls_v_version_statistics_line_charts";
  ALTER TABLE "polls_statistics_line_charts_series_data" DROP CONSTRAINT "plnChrt_series_data_parent_id_fk";
  
  ALTER TABLE "polls_statistics_line_charts_series" DROP CONSTRAINT "plnChrt_series_parent_id_fk";
  
  ALTER TABLE "polls_statistics_line_charts" DROP CONSTRAINT "plnChrt_parent_id_fk";
  
  ALTER TABLE "_polls_v_version_statistics_line_charts_series_data" DROP CONSTRAINT "_plnChrt_v_series_data_parent_id_fk";
  
  ALTER TABLE "_polls_v_version_statistics_line_charts_series" DROP CONSTRAINT "_plnChrt_v_series_parent_id_fk";
  
  ALTER TABLE "_polls_v_version_statistics_line_charts" DROP CONSTRAINT "_plnChrt_v_parent_id_fk";
  
  DROP INDEX "plnChrt_series_data_order_idx";
  DROP INDEX "plnChrt_series_data_parent_id_idx";
  DROP INDEX "plnChrt_series_order_idx";
  DROP INDEX "plnChrt_series_parent_id_idx";
  DROP INDEX "plnChrt_order_idx";
  DROP INDEX "plnChrt_parent_id_idx";
  DROP INDEX "_plnChrt_v_series_data_order_idx";
  DROP INDEX "_plnChrt_v_series_data_parent_id_idx";
  DROP INDEX "_plnChrt_v_series_order_idx";
  DROP INDEX "_plnChrt_v_series_parent_id_idx";
  DROP INDEX "_plnChrt_v_order_idx";
  DROP INDEX "_plnChrt_v_parent_id_idx";
  ALTER TABLE "polls_statistics_line_charts_series_data" ADD CONSTRAINT "polls_statistics_line_charts_series_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls_statistics_line_charts_series"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "polls_statistics_line_charts_series" ADD CONSTRAINT "polls_statistics_line_charts_series_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls_statistics_line_charts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "polls_statistics_line_charts" ADD CONSTRAINT "polls_statistics_line_charts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_version_statistics_line_charts_series_data" ADD CONSTRAINT "_polls_v_version_statistics_line_charts_series_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v_version_statistics_line_charts_series"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_version_statistics_line_charts_series" ADD CONSTRAINT "_polls_v_version_statistics_line_charts_series_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v_version_statistics_line_charts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_version_statistics_line_charts" ADD CONSTRAINT "_polls_v_version_statistics_line_charts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "polls_statistics_line_charts_series_data_order_idx" ON "polls_statistics_line_charts_series_data" USING btree ("_order");
  CREATE INDEX "polls_statistics_line_charts_series_data_parent_id_idx" ON "polls_statistics_line_charts_series_data" USING btree ("_parent_id");
  CREATE INDEX "polls_statistics_line_charts_series_order_idx" ON "polls_statistics_line_charts_series" USING btree ("_order");
  CREATE INDEX "polls_statistics_line_charts_series_parent_id_idx" ON "polls_statistics_line_charts_series" USING btree ("_parent_id");
  CREATE INDEX "polls_statistics_line_charts_order_idx" ON "polls_statistics_line_charts" USING btree ("_order");
  CREATE INDEX "polls_statistics_line_charts_parent_id_idx" ON "polls_statistics_line_charts" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_version_statistics_line_charts_series_data_order_idx" ON "_polls_v_version_statistics_line_charts_series_data" USING btree ("_order");
  CREATE INDEX "_polls_v_version_statistics_line_charts_series_data_parent_id_idx" ON "_polls_v_version_statistics_line_charts_series_data" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_version_statistics_line_charts_series_order_idx" ON "_polls_v_version_statistics_line_charts_series" USING btree ("_order");
  CREATE INDEX "_polls_v_version_statistics_line_charts_series_parent_id_idx" ON "_polls_v_version_statistics_line_charts_series" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_version_statistics_line_charts_order_idx" ON "_polls_v_version_statistics_line_charts" USING btree ("_order");
  CREATE INDEX "_polls_v_version_statistics_line_charts_parent_id_idx" ON "_polls_v_version_statistics_line_charts" USING btree ("_parent_id");`)
}
