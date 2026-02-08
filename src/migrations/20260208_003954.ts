import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forms_blocks_year" ADD COLUMN "allow_multiple" boolean DEFAULT false;
  ALTER TABLE "forms_blocks_year" ADD COLUMN "allow_searching" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forms_blocks_year" DROP COLUMN "allow_multiple";
  ALTER TABLE "forms_blocks_year" DROP COLUMN "allow_searching";`)
}
