import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "polls" ADD COLUMN "subtitle" jsonb;
  ALTER TABLE "_polls_v" ADD COLUMN "version_subtitle" jsonb;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "polls" DROP COLUMN "subtitle";
  ALTER TABLE "_polls_v" DROP COLUMN "version_subtitle";`)
}
