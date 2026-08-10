# Internal Link Contextual Mismatch Fix Tasks

- [x] 1. Update `src/app/api/generate-seo/route.ts`: Change `take: 2` to `take: 5` in the `findMany` query for past articles.
- [x] 2. Update `src/app/api/generate-seo/route.ts`: Modify the `<internal_links>` system prompt to explicitly instruct the AI to only insert links if they are contextually relevant, and ignore completely unrelated links.
- [x] 3. Run `tsc --noEmit` and push to GitHub.
