import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import { createRouter } from "next-connect";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function conectaDB() {
  let dbClient;

  dbClient = await database.getNewClient();
  const defaultMigrationOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  return defaultMigrationOptions;
}

async function getHandler(request, response) {
  const defMigOpts = await conectaDB();
  const pendingMigrations = await migrationRunner(defMigOpts);
  response.status(200).json(pendingMigrations);
  defMigOpts.dbClient.end();
}

async function postHandler(request, response) {
  const defMigOpts = await conectaDB();
  const migratedMigrations = await migrationRunner({
    ...defMigOpts,
    dryRun: false,
  });
  defMigOpts.dbClient.end();
  if (migratedMigrations.length > 0) {
    response.status(201).json(migratedMigrations);
  }

  response.status(200).json(migratedMigrations);
}
