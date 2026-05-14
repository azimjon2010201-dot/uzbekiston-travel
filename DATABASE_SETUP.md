# PostgreSQL Database Setup

Bu loyiha endi statik frontend bilan birga Node.js + Express backend, Prisma ORM va PostgreSQL database orqali ishlaydi.

## Texnologiyalar

- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Node.js, Express
- ORM: Prisma
- Database: PostgreSQL
- Security: bcrypt password hashing, JWT auth, Helmet, CORS, rate limit, Zod validation, Prisma parameterized queries

## Project Structure

```text
uzbekiston/
  index.html
  styles.css
  package.json
  .env.example
  prisma/
    schema.prisma
    migrations/
      000001_init/
        migration.sql
  src/
    app.js
    server.js
    config/
      env.js
      prisma.js
    middleware/
      asyncHandler.js
      auth.js
      errorHandler.js
    modules/
      users/
        user.controller.js
        user.routes.js
        user.service.js
        user.validators.js
```

## Database Schema

`users` jadvali:

| Field | Type | Izoh |
| --- | --- | --- |
| id | UUID/Text | Primary key |
| first_name | varchar(80) | Ism |
| last_name | varchar(80) | Familiya |
| email | varchar(255) | Unique email |
| phone | varchar(32) | Unique telefon |
| password_hash | varchar(255) | bcrypt hash |
| role | enum | USER, ADMIN, OWNER |
| created_at | timestamp | Yaratilgan vaqt |
| updated_at | timestamp | Yangilangan vaqt |

Schema fayli: `prisma/schema.prisma`

## Database ulash bosqichlari

1. Node.js o'rnating:
   https://nodejs.org

2. PostgreSQL o'rnating va database yarating:

```sql
CREATE DATABASE uzbekiston_travel;
```

3. `.env.example` faylidan `.env` yarating:

```powershell
Copy-Item .env.example .env
```

4. `.env` ichidagi `DATABASE_URL` ni o'zingizning PostgreSQL login/parolingizga moslang:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/uzbekiston_travel?schema=public"
PORT=8000
JWT_SECRET="kamida-32-ta-belgidan-iborat-maxfiy-kalit"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:8000"
API_BASE_URL="http://localhost:8000"
```

5. Dependency o'rnating:

```powershell
npm install
```

6. Prisma migration ishga tushiring:

```powershell
npm run prisma:migrate
```

7. Prisma client generate qiling:

```powershell
npm run prisma:generate
```

8. Serverni ishga tushiring:

```powershell
npm run dev
```

Server:

```text
http://localhost:8000
```

Frontend ham shu server orqali ochiladi.

## API Endpointlar

### POST /register

Foydalanuvchini ro'yxatdan o'tkazadi. Parol databasega hash holatda saqlanadi.

Request:

```json
{
  "firstName": "Azimjon",
  "lastName": "Keldiyorov",
  "email": "azimjon2010201@gmail.com",
  "phone": "+998901234567",
  "password": "secret123"
}
```

Response:

```json
{
  "user": {
    "id": "...",
    "firstName": "Azimjon",
    "lastName": "Keldiyorov",
    "email": "azimjon2010201@gmail.com",
    "phone": "+998901234567",
    "role": "USER",
    "createdAt": "...",
    "updatedAt": "..."
  },
  "token": "jwt-token"
}
```

### POST /login

Email va parol orqali login qiladi.

Request:

```json
{
  "email": "azimjon2010201@gmail.com",
  "password": "secret123"
}
```

### GET /users

Foydalanuvchilar ro'yxatini qaytaradi. `Authorization: Bearer <token>` kerak. Token admin yoki ega hisobiga tegishli bo'lishi kerak.

### PUT /users/:id

Foydalanuvchi ma'lumotlarini yangilaydi. Admin/ega tokeni kerak.

```json
{
  "firstName": "Azimjon",
  "lastName": "Keldiyorov",
  "phone": "+998901234567"
}
```

### DELETE /users/:id

Foydalanuvchini database ichidan o'chiradi. Admin/ega tokeni kerak.

## Test qilish

Register:

```powershell
Invoke-RestMethod -Method POST http://localhost:8000/register `
  -ContentType "application/json" `
  -Body '{"firstName":"Azimjon","lastName":"Keldiyorov","email":"azimjon2010201@gmail.com","phone":"+998901234567","password":"secret123"}'
```

Login:

```powershell
$login = Invoke-RestMethod -Method POST http://localhost:8000/login `
  -ContentType "application/json" `
  -Body '{"email":"azimjon2010201@gmail.com","password":"secret123"}'
```

Users:

```powershell
Invoke-RestMethod -Method GET http://localhost:8000/users `
  -Headers @{ Authorization = "Bearer $($login.token)" }
```

## Security eslatmalari

- Parol `bcrypt` orqali hash qilinadi.
- SQL injectiondan himoya uchun Prisma ORM ishlatiladi.
- Inputlar `zod` orqali validatsiya qilinadi.
- `GET /users` JWT token bilan himoyalangan.
- Helmet security headerlar qo'shadi.
- Rate limit 15 daqiqada 100 request qilib qo'yilgan.
- `.env` GitHubga yuklanmasligi uchun `.gitignore` ga qo'shilgan.
