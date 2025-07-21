# 🎬 Movie Review System

A full-stack MERN (MongoDB, Express.js, React, Node.js) web application that allows users to view, review, and recommend movies. This project features a modern UI built with React + Vite and a RESTful backend powered by Node.js + Express + MongoDB.

---

## 📁 Project Structure

```
Movie-Review-System/
├── client/          # React + Vite frontend
├── server/          # Node.js + Express backend
├── package.json     # Root scripts for both servers
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Aditikeshri12/Movie-Review-System.git
cd Movie-Review-System
```

### 2. Install Dependencies

Install root, client, and server dependencies:

```bash
# Root (for concurrently)
npm install

# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

---

## ▶️ Running the Application

From the root folder, run the following:

```bash
npm run dev
```

This uses `concurrently` to run:

- Frontend on [http://localhost:5137](http://localhost:5137)
- Backend on [http://localhost:5000](http://localhost:5000)

---

## 🧠 Scripts

In the root `package.json`:

```json
"scripts": {
  "dev": "concurrently \"npm run server\" \"npm run client\"",
  "server": "cd server && nodemon index.js",
  "client": "cd client && npm run dev"
}
```

> Ensure `concurrently` and `nodemon` are installed:

```bash
npm install --save-dev concurrently nodemon
```

---

## 🧰 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Dev Tools**: Nodemon, Concurrently, Axios, Git

---

## 📦 Environment Variables

Create a `.env` file in the `server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

---

## ✨ Features

- Search and browse movie recommendations
- Submit reviews and ratings
- Responsive and modern UI
- RESTful API integration
- MongoDB for storing reviews and movies

---

## 📷 Screenshots

_Add screenshots here if needed (UI preview)._

---

## 👩‍💻 Author

**Aditi Keshri**  
GitHub: [@Aditikeshri12](https://github.com/Aditikeshri12)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---
