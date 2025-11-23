# E-Market Frontend

## 🛠 Project Overview
E-Market is a full-featured e-commerce frontend built with **React 18+**, **Vite**, and **TailwindCSS / MUI**.  
This version includes:

- JWT authentication with roles (`user`, `seller`, `admin`)  
- Dynamic dashboards per role  
- Global state management (Redux Toolkit / Context API)  
- API data fetching with React Query  
- Cart & checkout system  
- Security, validation, and optimized performance  

---

## 📦 Installation

### 1. Clone repository
```bash
git clone https://github.com/<your-org>/e-market-frontend.git
cd e-market-frontend
```

### 2. Install dependencies
```bash
npm install
```
### 3. Environment variables

```#env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the app
```bash
Run the app
```

## Authentication & Roles
| Role     | Permissions                                                            |
| -------- | ---------------------------------------------------------------------- |
| `user`   | Browse products, manage cart, view own orders,update profile           |
| `seller` | CRUD own products, view orders containing own products, manage coupons |
| `admin`  | Manage users, products, reviews, and logs                              |

