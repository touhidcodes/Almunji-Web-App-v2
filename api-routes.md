# Almunji API Endpoints Documentation

This document provides a comprehensive list of all API routes, endpoints, and CRUD methods for the Almunji project.

## Base URL

All routes are prefixed with the base API URL (e.g., `http://localhost:5000/api/v1`).

---

## 1. Authentication (`/`)

| Method | Endpoint           | Description               | Access                 |
| :----- | :----------------- | :------------------------ | :--------------------- |
| POST   | `/register`        | Register a new user       | Public                 |
| POST   | `/login`           | Login user and get tokens | Public                 |
| POST   | `/refresh-token`   | Refresh the access token  | Public                 |
| POST   | `/change-password` | Change user password      | Admin, Moderator, User |

---

## 2. User Management (`/user`)

| Method | Endpoint          | Description              | Access                 |
| :----- | :---------------- | :----------------------- | :--------------------- |
| GET    | `/`               | Get current session user | Admin, Moderator, User |
| GET    | `/profile`        | Get session user profile | Admin, Moderator, User |
| GET    | `/all`            | Get all users            | Admin                  |
| PUT    | `/profile`        | Update user profile      | Admin, Moderator, User |
| PUT    | `/status/:userId` | Update user status       | Admin                  |

---

## 3. Permissions (`/permission`)

| Method | Endpoint         | Description                        | Access      |
| :----- | :--------------- | :--------------------------------- | :---------- |
| POST   | `/`              | Create a new permission            | Super Admin |
| GET    | `/`              | Get all permissions                | Admin       |
| POST   | `/assign`        | Assign permission to a user        | Admin       |
| GET    | `/user/:userId`  | Get permissions of a specific user | Admin       |
| DELETE | `/remove`        | Remove a permission from a user    | Admin       |
| DELETE | `/:permissionId` | Hard delete a permission           | Admin       |

---

## 4. Book Categories (`/category`)

| Method | Endpoint             | Description            | Access           |
| :----- | :------------------- | :--------------------- | :--------------- |
| POST   | `/`                  | Create a new category  | Admin, Moderator |
| GET    | `/admin/all`         | Get all categories     | Admin, Moderator |
| PUT    | `/:categoryId`       | Update a category      | Admin, Moderator |
| DELETE | `/:categoryId`       | Soft delete a category | Admin, Moderator |
| DELETE | `/admin/:categoryId` | Hard delete a category | Admin, Moderator |

---

## 5. Books (`/book`)

| Method | Endpoint                | Description                | Access                        |
| :----- | :---------------------- | :------------------------- | :---------------------------- |
| POST   | `/`                     | Create a new book          | Admin, Moderator              |
| GET    | `/all`                  | Get all books              | Public                        |
| GET    | `/admin/all`            | Get all books (admin view) | Admin, Moderator, Super Admin |
| GET    | `/:bookId`              | Get book by ID             | Public                        |
| GET    | `/slug/:slug`           | Get book by slug           | Public                        |
| GET    | `/category/:categoryId` | Get books by category ID   | Public                        |
| PUT    | `/:bookId`              | Update a book              | Admin, Moderator              |
| DELETE | `/:bookId`              | Soft delete a book         | Admin, Moderator              |
| DELETE | `/admin/:bookId`        | Hard delete a book         | Admin                         |

---

## 6. Book Content (`/book/content`)

| Method | Endpoint            | Description               | Access                        |
| :----- | :------------------ | :------------------------ | :---------------------------- |
| POST   | `/`                 | Create book content       | Super Admin, Admin, Moderator |
| GET    | `/admin/all`        | Get all book contents     | Super Admin, Admin, Moderator |
| GET    | `/:contentId`       | Get book content by ID    | Public                        |
| GET    | `/book/:bookId`     | Get contents by book ID   | Public                        |
| GET    | `/index/:bookId`    | Get book index by book ID | Public                        |
| PUT    | `/:contentId`       | Update book content       | Super Admin, Admin, Moderator |
| DELETE | `/:contentId`       | Soft delete book content  | Super Admin, Admin, Moderator |
| DELETE | `/admin/:contentId` | Hard delete book content  | Admin                         |

---

## 7. Dictionary (`/dictionary`)

| Method | Endpoint         | Description                  | Access           |
| :----- | :--------------- | :--------------------------- | :--------------- |
| POST   | `/word`          | Create a new dictionary word | Admin, Moderator |
| GET    | `/suggestion`    | Get word suggestions         | Public           |
| GET    | `/admin/words`   | Get all words (admin view)   | Admin, Moderator |
| GET    | `/:wordId`       | Get word by ID               | Public           |
| PUT    | `/:wordId`       | Update a word                | Admin, Moderator |
| DELETE | `/:wordId`       | Soft delete a word           | Admin, Moderator |
| DELETE | `/admin/:wordId` | Hard delete a word           | Admin            |

---

## 8. Blog (`/blog`)

| Method | Endpoint         | Description                     | Access                        |
| :----- | :--------------- | :------------------------------ | :---------------------------- |
| POST   | `/`              | Create a new blog post          | Super Admin, Admin, Moderator |
| GET    | `/all`           | Get all blog posts              | Public                        |
| GET    | `/admin/all`     | Get all blog posts (admin view) | Super Admin, Admin, Moderator |
| GET    | `/:blogId`       | Get blog post by ID             | Public                        |
| GET    | `/slug/:slug`    | Get blog post by slug           | Public                        |
| PUT    | `/:blogId`       | Update a blog post              | Super Admin, Admin, Moderator |
| DELETE | `/:blogId`       | Soft delete a blog post         | Super Admin, Admin, Moderator |
| DELETE | `/admin/:blogId` | Hard delete a blog post         | Super Admin, Admin            |

---

## 9. Dua (`/dua`)

| Method | Endpoint        | Description               | Access           |
| :----- | :-------------- | :------------------------ | :--------------- |
| POST   | `/`             | Create a new dua          | Admin, Moderator |
| GET    | `/all`          | Get all duas              | Public           |
| GET    | `/admin/all`    | Get all duas (admin view) | Admin, Moderator |
| GET    | `/:duaId`       | Get dua by ID             | Public           |
| PUT    | `/:duaId`       | Update a dua              | Admin, Moderator |
| DELETE | `/:duaId`       | Soft delete a dua         | Admin, Moderator |
| DELETE | `/admin/:duaId` | Hard delete a dua         | Admin            |

---

## 10. Surah (`/surah`)

| Method | Endpoint          | Description                 | Access                        |
| :----- | :---------------- | :-------------------------- | :---------------------------- |
| POST   | `/`               | Create a new surah          | Super Admin, Admin, Moderator |
| GET    | `/all`            | Get all surahs              | Public                        |
| GET    | `/admin/all`      | Get all surahs (admin view) | Super Admin, Admin, Moderator |
| GET    | `/:surahId`       | Get surah by ID             | Public                        |
| PUT    | `/:surahId`       | Update a surah              | Super Admin, Admin, Moderator |
| DELETE | `/admin/:surahId` | Hard delete a surah         | Super Admin, Admin            |

---

## 11. Para (`/para`)

| Method | Endpoint   | Description                | Access                        |
| :----- | :--------- | :------------------------- | :---------------------------- |
| POST   | `/`        | Create a new para          | Super Admin, Admin, Moderator |
| GET    | `/`        | Get all paras              | Public                        |
| GET    | `/admin`   | Get all paras (admin view) | Super Admin, Admin, Moderator |
| GET    | `/:paraId` | Get para by ID             | Public                        |
| PUT    | `/:paraId` | Update a para              | Super Admin, Admin, Moderator |
| DELETE | `/:paraId` | Soft delete a para         | Super Admin, Admin, Moderator |

---

## 12. Ayah (`/ayah`)

| Method | Endpoint           | Description                            | Access                        |
| :----- | :----------------- | :------------------------------------- | :---------------------------- |
| POST   | `/`                | Create a new ayah                      | Super Admin, Admin, Moderator |
| GET    | `/all`             | Get all ayahs                          | Public                        |
| GET    | `/:ayahId`         | Get ayah by ID                         | Public                        |
| GET    | `/para/:paraId`    | Get ayahs by para ID                   | Public                        |
| GET    | `/surah/:surahId`  | Get ayahs by surah ID                  | Public                        |
| GET    | `/tafsir/:surahId` | Get ayahs and their tafsir by surah ID | Public                        |
| PUT    | `/:ayahId`         | Update an ayah                         | Super Admin, Admin, Moderator |
| DELETE | `/:ayahId`         | Soft delete an ayah                    | Super Admin, Admin, Moderator |
| DELETE | `/admin/:ayahId`   | Hard delete an ayah                    | Super Admin, Admin            |

---

## 13. Tafsir (`/tafsir`)

| Method | Endpoint           | Description                 | Access           |
| :----- | :----------------- | :-------------------------- | :--------------- |
| POST   | `/`                | Create a new tafsir         | Admin, Moderator |
| GET    | `/admin/all`       | Get all tafsir (admin view) | Admin, Moderator |
| GET    | `/ayah/:ayahId`    | Get tafsir by ayah ID       | Public           |
| GET    | `/:tafsirId`       | Get tafsir by ID            | Public           |
| PUT    | `/:tafsirId`       | Update a tafsir             | Admin, Moderator |
| DELETE | `/:tafsirId`       | Soft delete a tafsir        | Admin, Moderator |
| DELETE | `/admin/:tafsirId` | Hard delete a tafsir        | Admin            |

---

## 14. Bookmarks (`/bookmark`)

| Method | Endpoint             | Description             | Access                 |
| :----- | :------------------- | :---------------------- | :--------------------- |
| POST   | `/`                  | Create a bookmark       | Admin, Moderator, User |
| GET    | `/me`                | Get my bookmarks        | Admin, Moderator, User |
| GET    | `/:bookmarkId`       | Get a specific bookmark | Admin, Moderator, User |
| DELETE | `/:bookmarkId`       | Delete a bookmark       | Admin, Moderator, User |
| GET    | `/`                  | Get all bookmarks       | Admin                  |
| DELETE | `/admin/:bookmarkId` | Hard delete a bookmark  | Admin                  |

---

## 15. Uploads (`/upload`)

| Method | Endpoint      | Description                   | Access             |
| :----- | :------------ | :---------------------------- | :----------------- |
| POST   | `/dictionary` | Upload dictionary data (Bulk) | Super Admin, Admin |
