import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_polls_files_icon" RENAME TO "enum_polls_sidebar_icon";
  ALTER TYPE "public"."enum__polls_v_version_files_icon" RENAME TO "enum__polls_v_version_sidebar_icon";
  ALTER TABLE "polls_files" RENAME TO "polls_sidebar";
  ALTER TABLE "_polls_v_version_files" RENAME TO "_polls_v_version_sidebar";
  ALTER TABLE "polls_sidebar" DROP CONSTRAINT "polls_files_file_id_files_id_fk";
  
  ALTER TABLE "polls_sidebar" DROP CONSTRAINT "polls_files_parent_id_fk";
  
  ALTER TABLE "_polls_v_version_sidebar" DROP CONSTRAINT "_polls_v_version_files_file_id_files_id_fk";
  
  ALTER TABLE "_polls_v_version_sidebar" DROP CONSTRAINT "_polls_v_version_files_parent_id_fk";
  
  ALTER TABLE "polls_sidebar" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_polls_sidebar_icon";
  CREATE TYPE "public"."enum_polls_sidebar_icon" AS ENUM('FaFilePdf', 'FaFile', 'FaFileCode', 'FaFileAlt', 'FaFileImage');
  ALTER TABLE "polls_sidebar" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_polls_sidebar_icon" USING "icon"::"public"."enum_polls_sidebar_icon";
  ALTER TABLE "_polls_v_version_sidebar" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum__polls_v_version_sidebar_icon";
  CREATE TYPE "public"."enum__polls_v_version_sidebar_icon" AS ENUM('FaFilePdf', 'FaFile', 'FaFileCode', 'FaFileAlt', 'FaFileImage');
  ALTER TABLE "_polls_v_version_sidebar" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__polls_v_version_sidebar_icon" USING "icon"::"public"."enum__polls_v_version_sidebar_icon";
  DROP INDEX "polls_files_order_idx";
  DROP INDEX "polls_files_parent_id_idx";
  DROP INDEX "polls_files_file_idx";
  DROP INDEX "_polls_v_version_files_order_idx";
  DROP INDEX "_polls_v_version_files_parent_id_idx";
  DROP INDEX "_polls_v_version_files_file_idx";
  ALTER TABLE "polls_sidebar" ADD CONSTRAINT "polls_sidebar_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "polls_sidebar" ADD CONSTRAINT "polls_sidebar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_version_sidebar" ADD CONSTRAINT "_polls_v_version_sidebar_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_polls_v_version_sidebar" ADD CONSTRAINT "_polls_v_version_sidebar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "polls_sidebar_order_idx" ON "polls_sidebar" USING btree ("_order");
  CREATE INDEX "polls_sidebar_parent_id_idx" ON "polls_sidebar" USING btree ("_parent_id");
  CREATE INDEX "polls_sidebar_file_idx" ON "polls_sidebar" USING btree ("file_id");
  CREATE INDEX "_polls_v_version_sidebar_order_idx" ON "_polls_v_version_sidebar" USING btree ("_order");
  CREATE INDEX "_polls_v_version_sidebar_parent_id_idx" ON "_polls_v_version_sidebar" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_version_sidebar_file_idx" ON "_polls_v_version_sidebar" USING btree ("file_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_polls_sidebar_icon" RENAME TO "enum_polls_files_icon";
  ALTER TYPE "public"."enum__polls_v_version_sidebar_icon" RENAME TO "enum__polls_v_version_files_icon";
  ALTER TABLE "polls_sidebar" RENAME TO "polls_files";
  ALTER TABLE "_polls_v_version_sidebar" RENAME TO "_polls_v_version_files";
  ALTER TABLE "polls_files" DROP CONSTRAINT "polls_sidebar_file_id_files_id_fk";
  
  ALTER TABLE "polls_files" DROP CONSTRAINT "polls_sidebar_parent_id_fk";
  
  ALTER TABLE "_polls_v_version_files" DROP CONSTRAINT "_polls_v_version_sidebar_file_id_files_id_fk";
  
  ALTER TABLE "_polls_v_version_files" DROP CONSTRAINT "_polls_v_version_sidebar_parent_id_fk";
  
  ALTER TABLE "polls_files" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_polls_files_icon";
  CREATE TYPE "public"."enum_polls_files_icon" AS ENUM('file', 'file-code', 'file-text');
  ALTER TABLE "polls_files" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_polls_files_icon" USING "icon"::"public"."enum_polls_files_icon";
  ALTER TABLE "_polls_v_version_files" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum__polls_v_version_files_icon";
  CREATE TYPE "public"."enum__polls_v_version_files_icon" AS ENUM('file', 'file-code', 'file-text');
  ALTER TABLE "_polls_v_version_files" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__polls_v_version_files_icon" USING "icon"::"public"."enum__polls_v_version_files_icon";
  DROP INDEX "polls_sidebar_order_idx";
  DROP INDEX "polls_sidebar_parent_id_idx";
  DROP INDEX "polls_sidebar_file_idx";
  DROP INDEX "_polls_v_version_sidebar_order_idx";
  DROP INDEX "_polls_v_version_sidebar_parent_id_idx";
  DROP INDEX "_polls_v_version_sidebar_file_idx";
  ALTER TABLE "polls_files" ADD CONSTRAINT "polls_files_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "polls_files" ADD CONSTRAINT "polls_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_version_files" ADD CONSTRAINT "_polls_v_version_files_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_polls_v_version_files" ADD CONSTRAINT "_polls_v_version_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "polls_files_order_idx" ON "polls_files" USING btree ("_order");
  CREATE INDEX "polls_files_parent_id_idx" ON "polls_files" USING btree ("_parent_id");
  CREATE INDEX "polls_files_file_idx" ON "polls_files" USING btree ("file_id");
  CREATE INDEX "_polls_v_version_files_order_idx" ON "_polls_v_version_files" USING btree ("_order");
  CREATE INDEX "_polls_v_version_files_parent_id_idx" ON "_polls_v_version_files" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_version_files_file_idx" ON "_polls_v_version_files" USING btree ("file_id");`)
}
