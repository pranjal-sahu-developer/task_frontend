<img width="1538" height="869" alt="Screenshot 2026-06-10 160401" src="https://github.com/user-attachments/assets/e5558ea3-802a-4a8d-bccc-c9b527747a95" />
<img width="1477" height="849" alt="Screenshot 2026-06-10 160313" src="https://github.com/user-attachments/assets/f4ee88c5-7337-4a26-aaa6-387f02f9d7d5" />
<img width="1477" height="849" alt="Screenshot 2026-06-10 160313" src="https://github.com/user-attachments/assets/b42dc876-1854-4701-b748-e96d5df2fd76" />
<img width="1457" height="823" alt="Screenshot 2026-06-10 160304" src="https://github.com/user-attachments/assets/566deb88-056a-4bd2-bc46-7a2d703d0ef1" />
# Student Management App
---

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite
- React Router
- React Hook Form (form validation)
- Axios (API calls)
- CryptoJS (client-side AES encryption)
- Tailwind CSS

**Backend**
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- CryptoJS (server-side AES encryption)
- bcrypt (password hashing)
- JWT (login sessions)

---

## How Encryption Works

We use **two levels of AES encryption** with different secret keys.

| Level | Where | Key (env variable) |
|-------|--------|---------------------|
| Level 1 | Frontend | `VITE_SECRET_KEY` (client) / `CLIENT_SECRET_KEY` (server) |
| Level 2 | Backend only | `BACKEND_SECRET_KEY` |

> **Important:** `VITE_SECRET_KEY` and `CLIENT_SECRET_KEY` must be the **same value**. The frontend encrypts with one key, and the backend decrypts with the matching key.

### When saving data (Register / Update)

```
User fills form
    → Frontend encrypts each field (Level 1)
    → Sends encrypted payload to API
    → Backend decrypts Level 1
    → Backend encrypts again with Level 2
    → Stored in MongoDB (double encrypted)
```

Password gets an extra step: after Level 1 decrypt, it is **bcrypt-hashed**, then Level 2 encrypted before storage.

### When reading data (Student list)

```
MongoDB (Level 2 encrypted)
    → Backend decrypts Level 2
    → Backend re-encrypts with Level 1
    → Sends to frontend (still encrypted on the wire)
    → Frontend decrypts Level 1
    → User sees readable data
```

Password is never sent back in plain text — the API returns a redacted placeholder for that field.

**Relevant files if you want to dig in:**
- Client: `client/src/utils/crypto.ts`
- Server: `server/src/utils/encryption.ts`
- Server logic: `server/src/services/studentService.ts`

---

## Prerequisites

Before you start, make sure you have:

- **Node.js** (v18 or above works fine)
- **MongoDB** running locally (or a MongoDB Atlas connection string)
- **npm** (comes with Node)

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd task-react-node-typescript
```

### 2. Start MongoDB

If you're running MongoDB locally, make sure the service is up. Default connection used in the project:

```
mongodb://localhost:27017/task-react-node-typescript
```

You can change this in the server `.env` file.

### 3. Backend setup

```bash
cd server
npm install
```

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

**Server `.env` variables:**

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: `5001`) |
| `MONGODB_URI` | MongoDB connection string |
| `CLIENT_URL` | Frontend URL for CORS (default: `http://localhost:5173`) |
| `CLIENT_SECRET_KEY` | Level 1 key — must match client `VITE_SECRET_KEY` |
| `BACKEND_SECRET_KEY` | Level 2 key — server only, keep this private |
| `JWT_SECRET` | Secret for login tokens |

Start the server:

```bash
npm run dev
```

Server runs at `http://localhost:5001` (or whatever port you set).

### 4. Frontend setup

Open a new terminal:

```bash
cd client
npm install
```

Copy the example env file:

```bash
cp .env.example .env
```

**Client `.env` variables:**

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (e.g. `http://localhost:5001/api`) |
| `VITE_SECRET_KEY` | Level 1 key — must match server `CLIENT_SECRET_KEY` |

Start the frontend:

```bash
npm run dev
```

App opens at `http://localhost:5173`.

### 5. Try it out

1. Go to **Register** (`/register`) and create a student.
2. Go to **Login** (`/login`) with that email and password.
3. After login you'll land on the **Dashboard** — view, edit, or delete students from there.

---

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/register` | Register a new student |
| `POST` | `/api/login` | Student login |
| `GET` | `/api/students` | Get all students |
| `PUT` | `/api/student/:id` | Update a student |
| `DELETE` | `/api/student/:id` | Delete a student |
| `GET` | `/api/health` | Health check |

All student payloads travel encrypted (Level 1) between client and server.

---

## Project Structure

```
task-react-node-typescript/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # Forms, list, layout
│       ├── pages/          # Login, Register, Dashboard
│       ├── services/       # API + encryption helpers
│       └── utils/          # crypto, auth
├── server/                 # Express backend
│   └── src/
│       ├── controllers/
│       ├── services/       # Business logic + encryption flow
│       ├── models/         # Mongoose Student schema
│       └── utils/          # AES encryption helpers
└── README.md
```

---

## Screenshots

A quick look at the app in action:

### 1. Student Registration

New students sign up here. All fields are validated and encrypted before the form is submitted.

![Student Registration](./docs/screens<img width="1136" height="892" alt="Screenshot 2026-06-10 160202" src="https://github.com/user-attachments/assets/f515b52f-588f-4a15-86f9-718370fecfb1" />ster.png)

### 2. Login

Registered students log in with email and password. Credentials are encrypted on the client before hitting the API.

![Student Login](./docs/screenshots/login.png)

### 3. Student List (Dashboard)

After login, you land on the dashboard. The list shows decrypted student records — the backend sends Level 1 encrypted data and the frontend decrypts it for display.

![Student List](./docs/screenshots/student-list.png)

### 4. Edit Student

Click **Edit** on any row to open the modal. Data is decrypted for editing and re-encrypted when you save.

![Edit Student](./docs/screenshots/edit-student.png)

### 5. Delete Student

Click **Delete** to remove a record. A confirmation prompt shows up first, then a success message once it's done.

![Delete Student](./docs/screenshots/delete-student.png)

---

## Scripts

**Server**
- `npm run dev` — development with nodemon
- `npm run build` — compile TypeScript
- `npm start` — run production build

**Client**
- `npm run dev` — Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build

---

## Notes

- Registration is public; the student list and CRUD live behind login.
- If encryption fails, double-check that `VITE_SECRET_KEY` and `CLIENT_SECRET_KEY` are identical.
- Passwords are hashed with bcrypt before the second encryption layer — so even after full decryption, you only ever compare against a hash at login time.

---

Built as part of a React + Node.js + MongoDB assignment with 2-level encryption.
