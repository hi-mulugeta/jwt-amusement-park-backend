# 🔐 JWT Amusement Park - Backend

[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000.svg?logo=express)](https://expressjs.com/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-000000.svg?logo=jsonwebtokens)](https://jwt.io/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933.svg?logo=node.js)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A secure Express.js backend implementing JWT authentication with role-based authorization, designed to teach authentication concepts through an amusement park analogy.

## 🏰 API Architecture

| Component          | Responsibility                 | Implementation                 |
| ------------------ | ------------------------------ | ------------------------------ |
| **Authentication** | Issue & verify JWT tokens      | `/api/login` + JWT middleware  |
| **Authorization**  | Role-based access control      | Custom middleware chains       |
| **Security**       | Protect against common attacks | CORS, bcrypt, input validation |
| **Simplicity**     | Easy to understand & extend    | Minimal dependencies           |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/jwt-amusement-park-backend.git
cd jwt-amusement-park-backend
```
