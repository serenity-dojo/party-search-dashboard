# 📋 Sanctions Dashboard

The **Sanctions Dashboard** is a sample React-based UI application for searching and reviewing parties subject to sanctions screening as part of the Serenity Dojo BDD workshop.

It is designed to integrate with a .NET backend service (`PartySearchApi.Api` - see https://github.com/serenity-dojo/party-search-api) and supports fast, robust frontend and end-to-end testing.

To run the UI front-end along with the DotNet backend, clone the PartySearchApi repository into a directory alongside this one.

## 🏫 Architecture Overview

| Layer | Technology | Notes |
|:---|:---|:---|
| **Frontend** | React 18 + TypeScript + Material UI (MUI) | Main application UI |
| **Backend** | .NET Core API (separate repo/folder) | Exposes `/api/Parties` endpoint |
| **Unit & Component Testing** | Jest + Testing Library | For isolated unit/component tests |
| **End-to-End Testing** | Playwright + Cucumber | For functional and acceptance tests |
| **Dev Tools** | Cross-env, Concurrently, Start-server-and-test, Wait-on | Dev automation & test orchestration |


---

## 📦 Main npm Scripts

| Script | Purpose |
|:---|:---|
| `start` | Starts the React frontend app only (`http://localhost:3000`) |
| `start:backend` | Starts the .NET backend API (`https://localhost:5044`) |
| `start:servers` | Starts **both** backend and frontend servers concurrently |
| `wait:servers` | Waits until both frontend and backend ports are available (5044 and 3000) |
| `build` | Builds the frontend for production |
| `test` | Runs all unit tests, UI component tests, and acceptance tests for UI only |
| `test:unit` | Runs only unit tests with Jest (CI mode) |
| `test:unit:dev` | Runs unit tests in interactive watch mode (local dev) |
| `test:component:ui` | Runs UI component tests using Playwright |
| `test:acceptance:ui` | Runs Cucumber UI tests assuming frontend is running |
| `test:acceptance:e2e` | Spins up frontend and backend, then runs E2E Cucumber tests |
| `test:acceptance:all` | Spins up both servers, runs **all** Cucumber tests (UI + E2E) |

✅ All tests will automatically wait for servers to be available before starting.

---

## 🛠 Key Technologies

- **React** + **TypeScript** for frontend development
- **Material UI (MUI)** for design system and styling
- **Jest** and **React Testing Library** for unit testing
- **Playwright** for component and page-level UI testing
- **Cucumber.js** for Gherkin-style acceptance tests
- **Start-server-and-test** to automate startup and testing
- **Dotnet Core** for backend services (in https://github.com/serenity-dojo/party-search-api)
- **Axios** for API calls
- **Cross-env** to manage environment variables across systems
- **Concurrently** to run multiple services in parallel

---

## 🌍 Environment Variables

Create a `.env` file if needed:

```env
REACT_APP_API_BASE_URL=https://localhost:5044/api
```

This ensures that the frontend points to the correct backend API.

---

## 🏃‍♂️ Local Development Flow

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start backend and frontend servers together:

   ```bash
   npm run start:servers
   ```

3. Access the frontend at [http://localhost:3000](http://localhost:3000)  
   Backend API will be available at [https://localhost:5044/api/Parties](https://localhost:5044/api/Parties)

---

## 🧪 Running Tests

- **Unit tests only**:

  ```bash
  npm run test:unit
  ```

- **Playwright component tests**:

  ```bash
  npm run test:component:ui
  ```

- **Acceptance UI tests** (frontend only):

  ```bash
  npm run test:acceptance:ui
  ```

- **Full end-to-end acceptance tests** (frontend + backend):

  ```bash
  npm run test:acceptance:e2e
  ```

- **Run everything together**:

  ```bash
  npm run test
  ```

---

## 📋 Folder Structure Overview

| Folder | Purpose |
|:---|:---|
| `/src/components` | React components (e.g., `PartySearch.tsx`) |
| `/src/services` | API service wrappers (e.g., `partyApiService.ts`) |
| `/src/testUtils` | Test utility functions and API mocking helpers |
| `/features` | Cucumber acceptance tests |
| `/tests/e2e` | Playwright UI and E2E tests |
| `/public` | Static assets and health endpoint |



