# LibraryHub

A full-stack library management experience built with React (TypeScript) and Spring Boot. Readers can explore and borrow books, review their history, settle late fees with Stripe, and message administrators, while admins respond to patron questions. All secure endpoints are protected with Okta-backed JWT authentication over HTTPS.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Installation Requirements](#installation-requirements)
- [Installation & Setup](#installation--setup)
  - [1. Clone & Directory Layout](#1-clone--directory-layout)
  - [2. Backend Configuration (Spring Boot)](#2-backend-configuration-spring-boot)
  - [3. Frontend Configuration (React)](#3-frontend-configuration-react)
  - [4. HTTPS Certificates for Local Development](#4-https-certificates-for-local-development)
  - [5. Stripe Configuration](#5-stripe-configuration)
  - [6. Database Bootstrapping](#6-database-bootstrapping)
- [Running the Project](#running-the-project)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Contributors](#contributors)
- [Versioning](#versioning)
- [Author](#author)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Architecture Overview
- **Frontend**: React 19 + TypeScript SPA served at `https://localhost:3000`, guarded by Okta and using Stripe Elements for payments.
- **Backend**: Spring Boot 2.7 REST API on `https://localhost:8443` with Spring Data JPA, Spring Data REST, and Okta resource server support.
- **Database**: MySQL 8.x, accessed via JPA repositories.
- **Security**: HTTPS-only local dev, Okta JWT verification, CORS restricted to the React origin.
- **Payments**: Stripe Payment Intent flow for clearing late fees.

## Installation Requirements
Install these before proceeding:
1. **Java Development Kit (JDK) 18** (includes `keytool`):  
   - Linux: `sudo apt install openjdk-18-jdk`  
   - macOS: install from [Adoptium Temurin](https://adoptium.net/)
2. **Apache Maven 3.8+**:  
   - Linux/macOS: `brew install maven` or `sudo apt install maven`  
   - Windows: download from [https://maven.apache.org](https://maven.apache.org)
3. **Node.js 18+ & npm**:  
   - Recommended via [nvm](https://github.com/nvm-sh/nvm) (`nvm install 18 && nvm use 18`)
4. **MySQL Server 8.x** with an accessible user/password pair.
5. **OpenSSL** (typically preinstalled):
   - Linux: `sudo apt install openssl` if missing.
6. **Okta Developer Account**:  
   - Create a free account at [https://developer.okta.com/](https://developer.okta.com/) and register both SPA and Web API applications to obtain client IDs, issuer URLs, and custom claims (`userType` for admin users).
7. **Stripe Account** (test mode is fine):  
   - Sign up at [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register) to obtain publishable and secret keys.

## Installation & Setup

### 1. Clone & Directory Layout
```bash
git clone <your-fork-or-clone-url> library-app
cd library-app
```
Project layout highlights:
- `backend/spring-boot-library`: Spring Boot service
- `frontend/react-library`: React client
- `starter-files/Scripts`: SQL helpers for schema and seed data
- root `README.md`: this document

### 2. Backend Configuration (Spring Boot)
1. Navigate to the backend:
   ```bash
   cd backend/spring-boot-library
   ```
2. Copy `src/main/resources/application.properties` as needed and update:
   - **MySQL** connection URL, username, and password (`spring.datasource.*`).
   - **Okta** credentials: `okta.oauth2.client-id` and `okta.oauth2.issuer`.
   - **Server SSL** settings already reference `library-keystore.p12`; ensure you generate it in the next section.
   - **Stripe Secret Key** in `application.yml` (`stripe.key.secret`).
3. Ensure the database `reactlibrarydatabase` exists:
   ```sql
   CREATE DATABASE reactlibrarydatabase CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
4. (Optional) Verify Maven wrapper permissions: `chmod +x mvnw`.

### 3. Frontend Configuration (React)
1. From project root:
   ```bash
   cd frontend/react-library
   npm install
   ```
2. Create `.env` (not committed) with the API base:
   ```
   REACT_APP_API=https://localhost:8443/api
   ```
3. Update Okta SPA settings in `src/lib/oktaConfig.ts` (client ID, issuer, redirect URI).
4. Update Stripe publishable key in `src/index.tsx` (`loadStripe('<your-publishable-key>')`).
5. Confirm the HTTPS dev server flag in `package.json` (`"start": "HTTPS=true react-scripts start"`).

### 4. HTTPS Certificates for Local Development
Generate certificates before starting servers:

**Frontend TLS certificate** (run inside `frontend/react-library`):
```bash
openssl req -x509 \
  -out ssl-localhost/localhost.crt \
  -keyout ssl-localhost/localhost.key \
  -newkey rsa:2048 -nodes -sha256 -days 365 \
  -config localhost.conf
```
Ensure the generated `.crt` and `.key` files remain in `ssl-localhost/`.

**Backend keystore** (run inside `backend/spring-boot-library`):
```bash
keytool -genkeypair -alias ElvisLibrary -keystore src/main/resources/library-keystore.p12 \
  -keypass secret -storeType PKCS12 -storepass secret -keyalg RSA -keysize 2048 -validity 365 \
  -dname "C=CN, ST=Hong Kong Special Administrative Region, L=Hong Kong, O=ElvisLUK, OU=Training Backend, CN=localhost" \
  -ext "SAN=dns:localhost"
```
Use matching passwords or update `application.properties` to reflect changes.

### 5. Stripe Configuration
1. In Stripe Dashboard, create test API keys.
2. Backend: set the **secret key** in `application.properties`.
3. Frontend: set the **publishable key** in `src/index.tsx`.
4. (Optional) Configure webhook endpoints if needed for production; not required for local Payment Intents.

### 6. Database Bootstrapping
Initial schema and sample data scripts are in `starter-files/Scripts`:
1. `React-Springboot-Add-Tables-Script-1.sql` – creates core tables (`book`, `checkout`, `history`, `message`, `payment`, `review`).
2. `React-SpringBoot-Add-Books-Script-*.sql` – imports sample books.
3. `Payment Script/Payment Script.sql` – seeds initial payment records.
Run them sequentially against `reactlibrarydatabase` using your preferred MySQL client:
```bash
mysql -u <user> -p reactlibrarydatabase < starter-files/Scripts/React-Springboot-Add-Tables-Script-1.sql
# repeat for other files
```

## Running the Project

1. **Backend** (`backend/spring-boot-library`):
   ```bash
   ./mvnw clean spring-boot:run
   ```
   The API listens on `https://localhost:8443/api`.

2. **Frontend** (`frontend/react-library`):
   ```bash
   npm start
   ```
   The SPA serves at `https://localhost:3000`. Accept browser warnings for the self-signed certificate if prompted.

3. Sign in through the Okta-hosted widget. Ensure your Okta user contains a `userType` claim set to `"admin"` to access admin routes.

## Key Features

- **Home Experience**: Marketing carousel, hero section, and service highlights on the landing page (`HomePage`).
- **Catalog Search** (`SearchBooksPage`): Paginated book browsing with text search and category filters (Front End, Back End, Data, DevOps).
- **Book Detail & Reviews** (`BookCheckoutPage`):
  - Live availability, rating summary, and review submissions.
  - Secure checkout, renew, and return flows gated by outstanding fees.
- **Loan Shelf** (`ShelfPage`):
  - Track active loans with due-date warnings and management modals.
  - Review complete borrowing history with pagination.
- **Messaging Center** (`MessagesPage`):
  - Patrons submit support questions and follow admin responses.
- **Admin Tools** (`ManageLibraryPage`):
  - Review open patron tickets and respond inline (admin-only access).
- **Payments** (`PaymentPage`):
  - Display outstanding late fees and process payments via Stripe Elements and Payment Intents.
- **Security**:
  - JWT validation via Okta; `secure` endpoints require Bearer tokens.
  - HTTPS enforced for both services; CORS restricted to the React origin.
- **Data Access**:
  - Spring Data REST auto-exposes repositories (`/books`, `/reviews`, `/messages`, `/histories`, `/payments`) with HAL pagination.
  - Custom services for checkout logic, late fee calculation, and Stripe settlement.

## Technology Stack

- **Frontend**
  - React 19, TypeScript, React Router v5 SecureRoute wrappers
  - Okta React SDK & Sign-In Widget
  - Stripe Elements & `@stripe/stripe-js`
  - Bootstrap-driven styling (custom CSS in `App.css`)
- **Backend**
  - Spring Boot 2.7 (Web, Data JPA, Data REST)
  - Okta Spring Boot Starter (resource server JWT validation)
  - Stripe Java SDK
  - MySQL Connector/J, Lombok
- **Tooling**
  - Maven Wrapper (`./mvnw`)
  - npm 9+ / Node 18+
  - OpenSSL, keytool for TLS assets

## Contributors
- **Elvis Luk** – Maintainer and primary developer

You can also review the repository’s Contributors page for the complete list of people who participated in this project.

## Versioning
- **v1.0.0** – Initial release (current)

## Author
- Elvis Luk ([Elvis Luk](https://github.com/LucianLuk))

## License
This project is licensed under the MIT License. See `LICENSE.md` for details.

## Acknowledgements
- Inspired by resources from [darbyluv2code/fullstack-react-and-springboot](https://github.com/darbyluv2code/fullstack-react-and-springboot) for architectural guidance and starter assets.
