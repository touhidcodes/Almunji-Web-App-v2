# Prisma Text Field Recommendations

The following recommendations identify which fields in the Almunji Prisma schema should use `@db.Text` or `@db.LongText`, along with suggested frontend word limits.

These word limits are application-level guidelines, not MySQL storage limits. Actual storage capacity depends on encoded byte length, language, and database/server configuration.

| Model and field        | Recommended type      | Suggested frontend limit |
| ---------------------- | --------------------- | -----------------------: |
| `UserProfile.bio`      | `@db.Text`            |                500 words |
| `Dictionary.exampleFA` | `@db.Text`            |                300 words |
| `Dictionary.exampleEN` | `@db.Text`            |                300 words |
| `Dictionary.exampleBN` | `@db.Text`            |                300 words |
| `Book.description`     | `@db.Text`            |                500 words |
| `BookContent.text`     | `@db.LongText` (keep) |             10,000 words |
| `Blog.summary`         | `@db.Text`            |                200 words |
| `Blog.content`         | `@db.LongText` (keep) |             10,000 words |
| `Dua.arabic`           | `@db.Text` (keep)     |                500 words |
| `Dua.transliteration`  | `@db.Text` (keep)     |                500 words |
| `Dua.bangla`           | `@db.Text` (keep)     |                500 words |
| `Dua.english`          | `@db.Text` (keep)     |                500 words |
| `Dua.reference`        | `@db.Text` (keep)     |                100 words |
| `Surah.history`        | `@db.Text`            |              2,000 words |
| `Ayah.arabic`          | `@db.Text`            |                300 words |
| `Ayah.transliteration` | `@db.Text`            |                300 words |
| `Ayah.bangla`          | `@db.Text`            |                500 words |
| `Ayah.english`         | `@db.Text`            |                500 words |
| `Tafsir.heading`       | `@db.Text` (keep)     |                100 words |
| `Tafsir.summaryBn`     | `@db.Text` (keep)     |                500 words |
| `Tafsir.summaryEn`     | `@db.Text` (keep)     |                500 words |
| `Tafsir.detailBn`      | `@db.LongText` (keep) |             10,000 words |
| `Tafsir.detailEn`      | `@db.LongText` (keep) |             10,000 words |
| `Tafsir.reference`     | `@db.Text`            |                200 words |

## Notes

- Keep `@db.LongText` for long-form content such as book chapters, blog articles, and detailed tafsir.
- Use `@db.Text` for summaries, biographies, references, examples, and other moderate-length text.
- Short fields such as names, usernames, emails, professions, and scholar names generally do not need `@db.Text`; use appropriately bounded strings where suitable.
- MySQL text types are limited by bytes, not words. Validate word counts in the frontend and enforce server-side byte/request-size limits where needed.
- The suggested word limits are starting points and can be adjusted to match editorial requirements.
