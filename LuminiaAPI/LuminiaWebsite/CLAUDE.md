# LuminiaWebsite (Angular front-end)

Angular 18 SPA using **NgModules** (not standalone components), Angular Material, Leaflet (world map), and `@swimlane/ngx-charts` (gemstone exchange graphs). Plain CSS, no SCSS.

## Commands (run from this folder)

```powershell
npm install
npm start          # ng serve -> http://localhost:4200, expects the API on https://localhost:7276
npm run build      # production build -> dist/ (picked up by `dotnet publish` of LuminiaAPI)
npm run watch      # dev build in watch mode
npm test           # Karma + Jasmine (Chrome)
npx ng generate component <feature>/<name>   # scaffold (adds a .spec.ts stub)
```

## Structure

Each feature is a folder with its own `*.module.ts` that declares its components and registers its routes. The feature module is then imported in `app.module.ts`. `app-routing.module.ts` is empty.

| Route | Feature folder | Notes |
|---|---|---|
| `/` → `/map` | `homepage/` | redirect only |
| `/map`, `/map/:dmCode` | `map/` | Leaflet map; tiles in `src/assets/map/{z}/{x}/{y}.png`; one layer class per marker type in `map/maplayers/` |
| `/items` | `items/` | item list + filter |
| `/pantheon` | `pantheon/` | one `deity-info/*.ts` data file per deity |
| `/calendar` | `calendar/` | in-game date |
| `/infernal-alchemy` | `infernal-alchemy/` | |
| `/gemstone-exchange`, `/gemstone-exchange/:dmCode` | `gemstone-exchange/` | ngx-charts graphs |
| `/luminaries`, `/luminaries/swirling-moon` | `luminary/` | visibility driven by `assets/luminary-settings.json` |
| `/dm/:dmCode` | `dm-page/` | DM tools (set current date, map names, generate gemstone day) |
| `/404`, `**` | `not-found-page/` | must stay the last imported module in `app.module.ts` so the wildcard route matches last |

Routes with `:dmCode` are protected by `guards/dm-check/DmCheckGuard`.

## Talking to the API

- All HTTP calls go through `services/luminia-api/luminia-api.service.ts`. Add new endpoints there, not in components.
- Response shapes live in `services/luminia-api/dtos/*.interface.ts` and enums in `services/luminia-api/enums/`. These mirror the C# DTOs and enums in `LuminiaAPI/Dtos` and `LuminiaAPI/Enums`, so update both sides together.
- The base URL is chosen from `environment.production` (`src/environments/`), and `angular.json` swaps the files for production builds.

## Runtime feature flags (static JSON, no rebuild of logic needed)

- `src/assets/navbar-settings.json`: shows or hides navbar entries (luminaries, gemstone exchange)
- `src/assets/luminary-settings.json`: per-luminary visibility
- `src/assets/version.json`: version shown in the UI, bump on release

## Style

- Colour palette: https://coolors.co/2c2b25-353535-5a5152-908c7a-bdbbb0-cfd2cd-f7f4ea-fbfbf2
- Component CSS has a 2 kB warning budget. A few components already exceed it, which is a warning, not an error.
