import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "polls" DROP CONSTRAINT "polls_hero_image_id_media_id_fk";
  
  ALTER TABLE "_polls_v" DROP CONSTRAINT "_polls_v_version_hero_image_id_media_id_fk";
  
  DROP INDEX "polls_hero_image_idx";
  DROP INDEX "_polls_v_version_version_hero_image_idx";
  ALTER TABLE "polls" DROP COLUMN "hero_image_id";
  ALTER TABLE "_polls_v" DROP COLUMN "version_hero_image_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "polls" ADD COLUMN "hero_image_id" integer;
  ALTER TABLE "_polls_v" ADD COLUMN "version_hero_image_id" integer;
  ALTER TABLE "polls" ADD CONSTRAINT "polls_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_polls_v" ADD CONSTRAINT "_polls_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "polls_hero_image_idx" ON "polls" USING btree ("hero_image_id");
  CREATE INDEX "_polls_v_version_version_hero_image_idx" ON "_polls_v" USING btree ("version_hero_image_id");`)
}
