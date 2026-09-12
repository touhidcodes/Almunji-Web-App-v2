# Database Schema Documentation

---

## 1. Entity Overview

| Entity           | Purpose                               |
| ---------------- | ------------------------------------- |
| `User`           | User account and authentication data  |
| `UserProfile`    | Additional user information           |
| `Permission`     | Available resource/action permissions |
| `UserPermission` | Assigns permissions to users          |
| `Dictionary`     | Persian words and translations        |
| `BookCategories` | Book categories                       |
| `Book`           | Book metadata                         |
| `BookContent`    | Book chapters/sections                |
| `Blog`           | Blog articles                         |
| `Dua`            | Dua/supplication content              |
| `Surah`          | Quran chapters                        |
| `Para`           | Quran Para/Juz                        |
| `Ayah`           | Quran verses                          |
| `Tafsir`         | Tafsir for an Ayah                    |
| `Bookmark`       | User bookmarks for Ayahs and Duas     |

---

## 2. Relationships

```text
User
 ├── UserProfile          1:1
 ├── UserPermission       1:N
 └── Bookmark             1:N

Permission
 └── UserPermission       1:N

BookCategories
 └── Book                  1:N
      └── BookContent      1:N

Surah
 └── Ayah                  1:N

Para
 └── Ayah                  1:N

Ayah
 └── Tafsir                1:1
```

### Bookmark Relationship

`Bookmark` uses a polymorphic reference:

```text
itemType = AYAH → itemId is an Ayah ID
itemType = DUA  → itemId is a Dua ID
```

---

## 3. User

```text
User
├── id: string
├── username: string
├── email: string
├── role: UserRole
├── status: UserStatus
├── createdAt: DateTime
└── updatedAt: DateTime
```

> `password` exists in the database but **must never be exposed to the frontend**.

### UserProfile

```text
UserProfile
├── id: string
├── userId: string
├── name?: string
├── image?: string
├── bio?: string
├── profession?: string
├── address?: string
├── createdAt: DateTime
└── updatedAt: DateTime
```

---

## 4. Quran Models

### Surah

```text
Surah
├── id: string
├── chapter: number
├── totalAyah: number
├── arabic: string
├── english: string
├── bangla?: string
├── history?: string
└── revelation: string
```

### Para

```text
Para
├── id: string
├── number: number
├── arabic: string
├── english?: string
├── bangla?: string
├── startAyahRef: string
└── endAyahRef: string
```

### Ayah

```text
Ayah
├── id: string
├── surahId: string
├── paraId: string
├── number: number
├── arabic: string
├── transliteration?: string
├── bangla?: string
├── english?: string
└── isDeleted: boolean
```

### Tafsir

```text
Tafsir
├── id: string
├── ayahId: string
├── heading?: string
├── summaryBn?: string
├── summaryEn?: string
├── detailBn?: string
├── detailEn?: string
├── scholar?: string
├── reference?: string
└── tags?: string
```

---

## 5. Book Models

### BookCategories

```text
BookCategories
├── id: string
├── name: string
└── isDeleted: boolean
```

### Book

```text
Book
├── id: string
├── name: string
├── slug: string
├── description?: string
├── cover: string
├── categoryId: string
├── isFeatured: boolean
└── isDeleted: boolean
```

### BookContent

```text
BookContent
├── id: string
├── bookId: string
├── section: string
├── index: number
├── text: string
└── isDeleted: boolean
```

`bookId + index` is unique and should be used to maintain content ordering.

---

## 6. Other Content Models

### Dictionary

```text
Dictionary
├── id: string
├── persianWord: string
├── transliteration?: string
├── banglaMeaning: string
├── englishMeaning?: string
├── exampleFA?: string
├── exampleEN?: string
├── exampleBN?: string
└── isDeleted: boolean
```

### Blog

```text
Blog
├── id: string
├── title: string
├── slug: string
├── thumbnail?: string
├── summary?: string
├── content: string
├── isPublished: boolean
├── isFeatured: boolean
└── isDeleted: boolean
```

### Dua

```text
Dua
├── id: string
├── name: string
├── arabic: string
├── transliteration?: string
├── bangla: string
├── english?: string
├── reference?: string
├── tags?: string
└── isDeleted: boolean
```

---

## 7. Bookmark

```text
Bookmark
├── id: string
├── userId: string
├── itemId: string
├── itemType: BookmarkType
└── createdAt: DateTime
```

Supported types:

```text
DUA
AYAH
```

A user cannot bookmark the same item more than once.

---

## 8. Permissions

### UserRole

```text
SUPERADMIN
ADMIN
MODERATOR
USER
```

### UserStatus

```text
ACTIVE
BLOCKED
```

### Action

```text
READ
CREATE
UPDATE
DELETE
```

### Resource

```text
SURAH
PARA
AYAH
TAFSIR
DICTIONARY
BOOK
BOOKCATEGORY
BOOKCONTENT
BLOG
DUA
USER
PERMISSION
BOOKMARK
```

A permission is defined as:

```text
Resource + Action
```

Example:

```text
BOOK + CREATE
BLOG + UPDATE
AYAH + READ
```

---

## 9. Frontend Notes

* IDs are UUID strings.
* `createdAt` and `updatedAt` are returned as date/time strings through JSON APIs.
* Fields marked `?` are optional and may be `null`/absent depending on the API response.
* `isDeleted: true` indicates a soft-deleted record; these should normally not appear in public UI.
* `slug` should be preferred for public URLs where available.
* `password` must never be displayed or stored in frontend state.
* Frontend permission checks should control UI visibility only; **backend authorization is authoritative**.
* API response structures may differ from the Prisma models. Follow the API/Swagger documentation for actual request and response contracts.

---

## 10. Core Data Flow

```text
User
 ├── Profile
 ├── Permissions
 └── Bookmarks
       ├── Ayah
       └── Dua

BookCategory → Book → BookContent

Surah → Ayah ← Para
          ↓
        Tafsir
```
