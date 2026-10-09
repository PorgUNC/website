import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forms_blocks_select" ADD COLUMN "random_choice_order" boolean DEFAULT false;
  ALTER TABLE "forms_blocks_radio" ADD COLUMN "random_choice_order" boolean DEFAULT false;
  ALTER TABLE "media" DROP COLUMN "_objectkey";
  ALTER TABLE "files" DROP COLUMN "_objectkey";
  ALTER TABLE "avatars" DROP COLUMN "_objectkey";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "files" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "avatars" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "forms_blocks_select" DROP COLUMN "random_choice_order";
  ALTER TABLE "forms_blocks_radio" DROP COLUMN "random_choice_order";`)
}
