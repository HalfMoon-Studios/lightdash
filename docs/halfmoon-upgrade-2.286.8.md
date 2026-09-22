# Half Moon Lightdash upgrade: 2.9.1 to 2.286.8

Prepared 22 September 2026. Target upstream tag: `2.286.8`.

## Scope

- Preserve the fork's dbt 1.10 image, ECR build workflow and Compose customisations.
- Exclude the separate `codex/redshift-connection-pool` change.
- Preserve production settings, including `SITE_URL=https://lightdash.halfmoon.gg`.
- ECS service: `lightdash/LightdashECSService`, region `eu-west-1`.
- Task resources: 256 CPU units, 2048 MiB memory, Linux x86-64.

## Safety and rollback baseline

`lightdash upgrade-check --from 2.9.1 --to 2.286.8` covers the complete span,
with no missing releases or mandatory intermediate stops. Its rolling-update
verdict is unsafe: old and new application workers must not overlap during
the database upgrade. Use a planned stop-and-start deployment.

Previous task definition: `lightdash:49`. Its image uses a mutable `latest` tag;
rollback must pin the observed running digest rather than resolving that tag again:

```text
153390026119.dkr.ecr.eu-west-1.amazonaws.com/lightdash@sha256:ac255e5f6c8fdf9b51b752ea9716689e666f616e99181af8d858caaf8c8d83fa
```

Pre-upgrade RDS snapshot: `lightdash-pre-2-286-8-20260922` on `rds-postgres`.
The `prod` database also contains the unrelated `gameforge` schema. Never restore
the entire production instance in place as a Lightdash-only rollback. Restore a
snapshot to a separate instance and recover only the Lightdash schemas, or use
a fresh schema-scoped dump captured while Lightdash is stopped. Preserve
extensions (`uuid-ossp`, `citext`, `ltree`) and the Lightdash encryption key.

## Validation and cutover gates

1. Build the fork image for `linux/amd64`; publish with a version/commit tag and
   pin the ECS task to its digest.
2. Restore `public` and `graphile_worker` into an isolated database. Keep the
   scheduler disabled and use isolated object storage during the rehearsal.
3. Run migrations and check readiness, authenticated access, external invite
   validation, representative Redshift queries, dashboards and exports.
4. Confirm the snapshot is available and the schema-scoped restore works.
5. Stop the production service and wait for all old tasks/workers to stop.
   Capture a fresh Lightdash-only backup before starting the new task.
6. Verify the new task's version, migrations, ALB health and smoke tests.
   Do not automatically restart the old image against a migrated database.

## Preparation evidence

- Full application Docker compilation and bundled DuckDB compatibility check passed.
- Isolated schema restore succeeded with 431 existing migrations, 11 users,
  969 saved queries and 53 dashboards.
- The RDS snapshot reached `available`.
- Rehearsal passed migrations, authenticated chart/dashboard listing, saved-chart
  execution against Redshift, asynchronous SQL, CSV generation/download and
  external invitation registration. dbt reports 1.10.19. The unchanged headless
  browser generated a valid PDF; a full dashboard PDF was not tested.
- Pinned deployment task: `lightdash:51`, image digest
  `sha256:e8de8a7aff6f33e318aaa0ee402b62c267523ef0cd0d0caf3c7a1f6b8fc49249`.
- Pinned rollback task: `lightdash:50` (use only with a compatible/restored database).
- After the old task stopped, a fresh 21,392,661-byte schema backup was captured
  at `.local/upgrade-backups/lightdash-before-2.286.8-20260922.dump` (ignored by Git,
  restricted filesystem permissions). Its archive index is readable by pg_restore.
- The public health endpoint reports 2.286.8 with no pending migrations, and
  `/readyz` returns HTTP 200. ECS revision 51 reached `COMPLETED` and its ALB
  target is healthy. Automatic rollback protection was restored after completion.
- Production retains 11 users, 969 saved queries and 53 dashboards; its migration
  count is now 473. The unrelated `gameforge` schema still has 11 tables.
- Temporary test containers, their anonymous volumes and the test network were
  removed after validation. The production backup and RDS snapshot are retained.
- Production authenticated smoke tests were not repeated because the saved CLI
  credential was invalid; authenticated functional checks ran on the isolated copy.
