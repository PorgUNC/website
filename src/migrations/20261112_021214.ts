import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_archive" ADD COLUMN "show_images" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_archive" ADD COLUMN "show_descriptions" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_archive" ADD COLUMN "show_dates" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "show_images" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "show_descriptions" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "show_dates" boolean DEFAULT true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_archive" DROP COLUMN "show_images";
  ALTER TABLE "pages_blocks_archive" DROP COLUMN "show_descriptions";
  ALTER TABLE "pages_blocks_archive" DROP COLUMN "show_dates";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "show_images";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "show_descriptions";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "show_dates";`)
}
