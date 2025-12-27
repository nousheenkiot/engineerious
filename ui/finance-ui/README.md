# FinanceEngine UI

A production-ready React frontend for the Finance microservices architecture.

## Tech Stack
- **Framework**: React 18 + TypeScript (Vite)
- **State Management**: Redux Toolkit (Data persist/UI state)
- **Data Fetching**: Axios + TanStack Query (Server state/Caching)
- **UI Architecture**: Material UI (MUI) + Tailwind CSS
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form + Zod
- **Routing**: React Router v6
- **Internationalization**: i18next

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Installation
```bash
cd ui/finance-ui
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## Folder Structure
- `src/api`: Axios instance and API definitions.
- `src/components`: UI components (common and layout).
- `src/features`: Business logic split by domain (Redux slices).
- `src/pages`: Page components.
- `src/theme`: MUI theme customization.

## Deployment

### Docker
```bash
docker build -t finance-ui .
docker run -p 80:80 finance-ui
```

### Kubernetes
```bash
kubectl apply -f k8s/deployment.yml
```

## CI/CD
Managed via GitHub Actions in `.github/workflows/main.yml`.
- Runs on every PR to `main` and push to `main`.
- Validates linting, types, and build.
