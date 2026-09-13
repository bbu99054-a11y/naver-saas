# Final Audit Improvements Implementation Tasks

- [x] 1. Create a server action `src/actions/articles.ts` with `checkKeywordDuplicate` to check if keyword was used in the last 30 days.
- [x] 2. Update `src/app/api/generate-seo/route.ts` to instruct AI to output `<post_title>...` and save this parsed title to DB.
- [x] 3. Update `src/app/dashboard/write/page.tsx`:
      - Add duplicate keyword check before generating.
      - Extract `<post_title>` from stream and remove it from parsed HTML.
      - Update UI to show the dynamic title and add a "제목 복사" (Copy Title) button.
- [x] 4. Run `tsc --noEmit` and push to GitHub.
