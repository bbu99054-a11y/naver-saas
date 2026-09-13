# Upsert Bug Fix Tasks

- [x] 1. Refactor `prisma.user.upsert` in `src/app/api/generate-seo/route.ts` to use `findUnique` and `create`
- [x] 2. Refactor `prisma.apiKey.upsert` in `src/actions/settings.ts` to use `findUnique` and `create/update`
- [x] 3. Push changes and verify build using `tsc --noEmit`
