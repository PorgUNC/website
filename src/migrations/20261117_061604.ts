import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN "prefix" varchar DEFAULT '';
  ALTER TABLE "files" ADD COLUMN "prefix" varchar DEFAULT '';
  ALTER TABLE "avatars" ADD COLUMN "prefix" varchar DEFAULT '';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" DROP COLUMN "prefix";
  ALTER TABLE "files" DROP COLUMN "prefix";
  ALTER TABLE "avatars" DROP COLUMN "prefix";`)
}
