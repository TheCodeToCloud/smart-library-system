# 📚 Smart Library Management System (LMS)

![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)
![Django](https://img.shields.io/badge/Django-5.0+-092E20.svg?logo=django)
![React](https://img.shields.io/badge/React-18.2+-61DAFB.svg?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF.svg?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green.svg)

A modern, fast, and feature-rich Smart Library Management System. Built with a robust **Django** backend and a blazing-fast **React + Vite** frontend, it provides a seamless experience for managing books, users, and library operations.

---

## ✨ Features

- 📖 **Comprehensive Book Management:** Add, edit, and categorize books easily.
- 👥 **User & Member Roles:** Different access levels for librarians and members.
- 🔄 **Circulation System:** Track book issues, returns, and due dates efficiently.
- 📊 **Smart Dashboard:** Get instant insights with analytics and statistics.
- 🔐 **Secure Authentication:** JWT-based secure login and registration.
- 🚀 **Blazing Fast UI:** Responsive and modern user interface powered by React & Vite.
- 📱 **Mobile Friendly:** Works seamlessly across devices.

---

## 🛠️ Technology Stack

### Backend (API)
- **Framework:** Django & Django REST Framework (DRF)
- **Database:** SQLite (Development) / PostgreSQL (Production Ready)
- **Authentication:** JWT (JSON Web Tokens)

### Frontend (UI)
- **Framework:** React.js
- **Build Tool:** Vite
- **Language:** TypeScript / JavaScript

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/TheCodeToCloud/smart-library-system.git
cd smart-library-system
```

### 2️⃣ Run the Backend (Django)

Open a terminal and navigate to the backend folder:

```bash
cd backend
```

**Create & Activate Virtual Environment:**
```bash
# On Windows
python -m venv venv
.\venv\Scripts\activate

# On Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

**Install Dependencies & Run:**
```bash
pip install -r requirements.txt
python manage.py migrate
python seed_data.py   # Optional: Seeds the database with sample books and an admin user
python manage.py runserver
```
The backend API will run on `http://127.0.0.1:8000/`.

**Default Credentials:**
If you run `python seed_data.py`, an admin user will be created. The default email is `admin@library.com`. You can set the password by adding `ADMIN_DEFAULT_PASSWORD=yourpassword` to your `backend/.env` file. If not set, it will auto-generate a secure password and print it to the console.

---

### 🧠 What Makes This "SMART"?
This system isn't just a standard CRUD application. It includes several intelligent features built for modern library workflows:
- **KYC-Gated Borrowing:** Students must upload their ID proof and have their KYC reviewed and approved by an admin/librarian before they can borrow books.
- **QR-Based Issue/Return:** Each book generates a unique QR code. The built-in scanner allows instant lookups for borrowing or returning books using a device camera.
- **Automated Escalating Reminders:** A cron-compatible scheduled job sends overdue reminders via email, escalating the tone (gentle → warning → fine notice) based on how many days the book is overdue.
- **Content-Based Recommendations:** The student dashboard recommends books using a content-based filtering algorithm that matches overlapping categories and authors from their borrow history, ranked by overall popularity and availability.

---

### 3️⃣ Run the Frontend (React/Vite)

Open a **new** terminal and navigate to the frontend folder:

```bash
cd frontend
```

**Install Dependencies & Run:**
```bash
npm install
npm run dev
```
The frontend application will be available at `http://localhost:5173/`.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ by [TheCodeToCloud](https://github.com/TheCodeToCloud)*
