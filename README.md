# LYNX Parking Companion

A small React + TypeScript application that shows real-time parking availability for the city of Ghent.

Built for the LYNX Ghent interview assignment.

## Features

- **First-time setup flow** – users must enter profile data (first name, last name, license plate, car make, car model) before they can access the app.
- **Persistent profile** – stored in `localStorage` via Zustand `persist` middleware. Returning users skip setup automatically.
- **Profile page** – edit profile or delete all data. Deleting redirects back to setup and clears the favorite parking too.
- **Parking overview** – live data from the City of Ghent open data API:
  - name, open/closed status, available spaces, address
  - loading, error (with retry), and empty states
  - search by parking name
  - sort by name asc/desc and available spaces asc/desc
  - star-favorite one parking (persisted in `localStorage`); the favorite is always pinned at the top
- **Parking detail page** – shows description, opening hours, website link, operator, category (in/out LEZ), parking type, address, status, available spaces, and an embedded Google Maps iframe based on coordinates.
- **Auto-refresh** – React Query refetches every 60 seconds (the dataset updates ~once a minute).

## Tech Stack

- React 19 + TypeScript
- Create React App (`react-scripts` 5)
- Ant Design 5
- React Router DOM v7
- Zustand v5 (with `persist`) for client state
- React Query v3 for server state
- Axios for HTTP
- SCSS for styling
- Jest + React Testing Library

## Project Structure

```
src/
  app/
    App.tsx              # Providers (QueryClient, Router, ConfigProvider)
    routes.tsx           # Route table + setup/profile guards
  components/
    AppLayout/           # Header + menu + outlet
    LoadingState/
    ErrorState/
    EmptyState/
  features/
    profile/
      ProfileForm.tsx
      SetupPage.tsx
      ProfilePage.tsx
      profileStore.ts    # Zustand persisted profile store
      profileTypes.ts
    parkings/
      ParkingOverviewPage.tsx
      ParkingDetailPage.tsx
      ParkingCard.tsx
      ParkingFilters.tsx
      parkingApi.ts      # axios + useParkingsQuery hook
      parkingMapper.ts   # raw -> ParkingStructure mapper (defensive)
      parkingStore.ts    # Zustand persisted favorite
      parkingTypes.ts    # ParkingStructure, RawGhentParkingRecord, ParkingSortOption
      parkingUtils.ts    # filter/sort/pin helpers (pure)
  styles/
    global.scss
  test/
    testUtils.tsx        # Providers + mock parking fixtures
  __tests__/             # Jest + RTL tests
  setupTests.ts
  index.tsx
```

## Getting Started

This project uses **pnpm** as its package manager (declared via `"packageManager": "pnpm@10.33.0"` in `package.json`).

### Prerequisites

- Node.js ≥ 18 (tested on v22)
- pnpm ≥ 10 — install once globally if not present:
  ```sh
  npm install -g pnpm
  ```

### Install

```sh
pnpm install
```

No `--legacy-peer-deps` flag needed — pnpm resolves the `react-query@3` peer conflict automatically.

### Commands

| Command | Description |
|---|---|
| `pnpm start` | Start the dev server at <http://localhost:3000> |
| `pnpm build` | Create a production build in `build/` |
| `pnpm test -- --watchAll=false` | Run all tests once (no watch mode) |
| `pnpm lint` | Lint all `.ts`/`.tsx` files |
| `pnpm lint:fix` | Lint and auto-fix |
| `pnpm typecheck` | TypeScript type-check without emitting files |
| `pnpm validate` | Lint + typecheck + tests in sequence |

All tests run against in-memory mocks – the real Ghent API is never called.

## Architecture Notes

- **Zustand only for client state** – profile and `favoriteParkingId` are the only pieces of UI state that need to outlive a page reload. Both stores use the `persist` middleware so the user's data lives in `localStorage`.
- **React Query for server state** – `useParkingsQuery` owns fetching, caching, loading/error state, retry, and 60 s polling. Components stay declarative.
- **Defensive mapper** – the Ghent dataset has free-text fields and some records contain `"?"` placeholders. `parkingMapper.ts` normalises the raw `RawGhentParkingRecord` into a clean `ParkingStructure` and never leaks the raw shape to the rest of the app.
- **Pure utilities** – filter, sort, and favorite-pinning live in `parkingUtils.ts`, which makes them trivially unit-testable and easy to compose in the overview page.
- **Route guards** – `routes.tsx` redirects users with no profile to `/setup`, and users with a profile away from `/setup` back to `/parkings`.

## Assumptions About the Ghent API

The relevant fields used from `bezetting-parkeergarages-real-time`:

| API field                  | Mapped to                        |
|----------------------------|----------------------------------|
| `name`                     | `name`                           |
| `description`              | `description`                    |
| `openingtimesdescription`  | `openingHours`                   |
| `urllinkaddress`           | `website`                        |
| `operatorinformation`      | `operator`                       |
| `categorie`                | `category` (e.g. "parking in LEZ") |
| `type`                     | `type` (e.g. `carPark`)          |
| `availablecapacity`        | `availableSpaces`                |
| `totalcapacity`            | `totalCapacity`                  |
| `occupation`               | `occupationPct`                  |
| `isopennow`, `temporaryclosed` | `isOpen`, `temporaryClosed`  |
| `locationanddimension.roadName` | `address`                   |
| `locationanddimension.coordinatesForDisplay` / `location` | `latitude`, `longitude` |
| `text`                     | `extraInfo` (optional notice)    |
| `lastupdate`               | `lastUpdate`                     |

- `locationanddimension` is a JSON-encoded string; the mapper wraps `JSON.parse` in a try/catch.
- `roadName` is sometimes `"?"` or missing — the mapper falls back to `"Address not available"`.
- Coordinates are read from `coordinatesForDisplay` first and fall back to the top-level `location` array.

## Known Limitations

- No service worker / offline support.
- The Google Maps iframe uses the public embed URL without an API key. For a production deployment you would swap this for an embed with a key (or another map provider).
- The Ghent dataset only exposes 13 parkings at the time of writing, so pagination is not implemented.
- Antd 5 currently logs a React 19 compatibility warning in `test` and dev environments. Functionality is unaffected; this is tracked upstream by Ant Design.
- `react-query@3` is unmaintained but explicitly required by the assignment. `--legacy-peer-deps` is needed at install time.
