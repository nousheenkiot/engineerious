# ADR 001: Frontend Architecture Decision

## Context
We need a robust, scalable, and maintainable frontend for the Finance microservices ecosystem.

## Decision
We chose **React 18** with **Vite** for the following reasons:
- **Redux Toolkit**: To manage complex UI state and provide a predictable state container.
- **TanStack Query (React Query)**: To handle server-state (caching, synchronization).
- **MUI (Material UI)**: To use industry-standard accessible components for rapid development.
- **Tailwind CSS**: For custom high-fidelity styling without writing manual CSS.
- **TypeScript**: For strict type safety and better developer experience.

## Alternatives Considered
- **Zustand**: Good for smaller state, but Redux is more standard for complex enterprise financial apps.
- **Chakra UI**: Excellent but MUI has a larger ecosystem for financial dashboards (Data Grids, etc).

## Status
Accepted.
