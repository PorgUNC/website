import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_pollarchive" DROP COLUMN "number";
  ALTER TABLE "_pages_v_blocks_pollarchive" DROP COLUMN "number";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_pollarchive" ADD COLUMN "number" numeric DEFAULT 1;
  ALTER TABLE "_pages_v_blocks_pollarchive" ADD COLUMN "number" numeric DEFAULT 1;`)
}
