# Fusion Starter Project Documentation

This document provides a comprehensive overview of the Fusion Starter project, a production-ready full-stack React application template. It integrates an Express server and features React Router 6 SPA mode, TypeScript, Vitest, Zod, and modern tooling.

## Table of Contents

1.  [Introduction](#introduction)
2.  [Tech Stack](#tech-stack)
3.  [Project Structure](#project-structure)
4.  [Key Features](#key-features)
    *   [SPA Routing System](#spa-routing-system)
    *   [Styling System](#styling-system)
    *   [Express Server Integration](#express-server-integration)
    *   [Shared Types](#shared-types)
5.  [Development Commands](#development-commands)
6.  [Adding Features](#adding-features)
    *   [Add new colors to the theme](#add-new-colors-to-the-theme)
    *   [New API Route](#new-api-route)
    *   [New Page Route](#new-page-route)
7.  [Production Deployment](#production-deployment)
8.  [Architecture Notes](#architecture-notes)

## 1. Introduction

The Fusion Starter is designed to provide a robust foundation for full-stack React applications. It emphasizes a streamlined development experience with hot-reloading for both client and server code, type safety across the stack, and a comprehensive UI component library. While it includes an Express server, API endpoints should only be created when strictly necessary for server-side logic (e.g., private key handling, specific database operations).

## 2. Tech Stack

*   **Package Manager**: PNPM (preferred)
*   **Frontend**: React 18, React Router 6 (SPA mode), TypeScript, Vite, TailwindCSS 3
*   **Backend**: Express server integrated with Vite dev server
*   **Testing**: Vitest
*   **UI**: Radix UI, TailwindCSS 3, Lucide React icons

## 3. Project Structure

```
client/                   # React SPA frontend
├── pages/                # Route components (Index.tsx = home)
├── components/ui/        # Pre-built UI component library
├── App.tsx                # App entry point and with SPA routing setup
└── global.css            # TailwindCSS 3 theming and global styles

server/                   # Express API backend
├── index.ts              # Main server setup (express config + routes)
└── routes/               # API handlers

shared/                   # Types used by both client & server
└── api.ts                # Example of how to share api interfaces
```

## 4. Key Features

### SPA Routing System

The application utilizes React Router 6 for its Single Page Application (SPA) routing.

*   The home page component is located at [`client/pages/Index.tsx`](client/pages/Index.tsx).
*   Routes are defined in [`client/App.tsx`](client/App.tsx) using `react-router-dom` imports.
*   All custom page components should reside in the [`client/pages/`](client/pages/) directory.

**Example Route Definition:**

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/" element={<Index />} />
  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
  <Route path="*" element={<NotFound />} />
</Routes>;
```

### Styling System

The styling system is built around modern CSS practices and utility-first principles.

*   **Primary Styling**: TailwindCSS 3 utility classes are used for most styling.
*   **Theme and Design Tokens**: Global theme configurations and design tokens are managed in [`client/global.css`](client/global.css) and [`tailwind.config.ts`](tailwind.config.ts).
*   **UI Components**: A collection of pre-built, accessible UI components is available in the [`client/components/ui/`](client/components/ui/) directory, leveraging Radix UI.
*   **Utility Function**: The `cn()` function (combining `clsx` and `tailwind-merge`) is provided for conditionally applying and merging TailwindCSS classes.

**`cn()` Utility Usage Example:**

```typescript
// cn utility usage
className={cn(
  "base-classes",
  { "conditional-class": condition },
  props.className  // User overrides
)}
```

### Express Server Integration

The project features a tightly integrated Express server.

*   **Development Environment**: During development, both the frontend and backend run on a single port (8080), enabling seamless interaction.
*   **Hot Reload**: Both client and server code benefit from hot-reloading, significantly speeding up development cycles.
*   **API Endpoints**: All API endpoints are prefixed with `/api/`.

**Example API Routes:**

*   `GET /api/ping` - A simple endpoint to check server responsiveness.
*   `GET /api/demo` - A demonstration endpoint.

### Shared Types

To ensure type consistency and safety across the full stack, shared interfaces and types are defined in the [`shared/`](shared/) folder.

**Example Shared Type Import:**

```typescript
import { DemoResponse } from '@shared/api';
```

**Path Aliases:**

*   `@shared/*` - Alias for the `shared/` folder.
*   `@/*` - Alias for the `client/` folder.

## 5. Development Commands

The following `pnpm` commands are available for development and build processes:

*   `pnpm dev` - Starts the development server, including both client and server with hot-reloading.
*   `pnpm build` - Creates a production-ready build of the application.
*   `pnpm start` - Starts the production server.
*   `pnpm typecheck` - Runs TypeScript validation across the project.
*   `pnpm test` - Executes Vitest tests.

## 6. Adding Features

### Add new colors to the theme

To extend the color palette of the application:

1.  Open [`client/global.css`](client/global.css).
2.  Open [`tailwind.config.ts`](tailwind.config.ts).
3.  Add your new TailwindCSS colors to both files as per Tailwind's configuration guidelines.

### New API Route

Follow these steps to add a new API endpoint:

1.  **Optional**: Define a shared interface for the API response in [`shared/api.ts`](shared/api.ts) for type safety:

    ```typescript
    export interface MyRouteResponse {
      message: string;
      // Add other response properties here
    }
    ```

2.  Create a new route handler file in [`server/routes/my-route.ts`](server/routes/my-route.ts):

    ```typescript
    import { RequestHandler } from "express";
    import { MyRouteResponse } from "@shared/api"; // Optional: for type safety

    export const handleMyRoute: RequestHandler = (req, res) => {
      const response: MyRouteResponse = {
        message: 'Hello from my endpoint!'
      };
      res.json(response);
    };
    ```

3.  Register the new route in [`server/index.ts`](server/index.ts) within the `createServer` function:

    ```typescript
    import { handleMyRoute } from "./routes/my-route";

    // Add to the createServer function:
    app.get("/api/my-endpoint", handleMyRoute);
    ```

4.  Consume the new API endpoint in your React components with type safety:

    ```typescript
    import { MyRouteResponse } from '@shared/api'; // Optional: for type safety

    const response = await fetch('/api/my-endpoint');
    const data: MyRouteResponse = await response.json();
    ```

### New Page Route

To add a new page to the frontend:

1.  Create a new React component file in [`client/pages/MyPage.tsx`](client/pages/MyPage.tsx).
2.  Add the new route definition in [`client/App.tsx`](client/App.tsx):

    ```typescript
    <Route path="/my-page" element={<MyPage />} />
    ```

## 7. Production Deployment

The Fusion Starter project supports various production deployment strategies:

*   **Standard Build**: Use `pnpm build` to create a standard production build.
*   **Binary Executables**: The project can be compiled into self-contained executables for Linux, macOS, and Windows.
*   **Cloud Deployment**: Easy deployment to Netlify or Vercel is supported via their respective MCP integrations. Both providers are fully compatible with this starter template.

## 8. Architecture Notes

Key architectural considerations for the Fusion Starter:

*   **Single-Port Development**: Vite and Express are integrated to run on a single port during development, simplifying the setup.
*   **End-to-End TypeScript**: TypeScript is utilized across the client, server, and shared codebases for enhanced type safety and developer experience.
*   **Full Hot Reload**: Both frontend and backend code benefit from hot-reloading, enabling rapid iteration.
*   **Production Readiness**: The template is designed for production use, offering multiple deployment options.
*   **Comprehensive UI Library**: Includes a rich set of UI components for accelerated UI development.
*   **Type-Safe API Communication**: Shared interfaces facilitate type-safe communication between the client and server.