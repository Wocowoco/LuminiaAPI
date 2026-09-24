# CLAUDE.md

Luminia is a companion website for a D&D campaign set in the world of Luminia: an interactive world map, item list, pantheon, calendar, a fictional "gemstone exchange" stock market, and a few DM-only tools. Production runs at https://luminia.be.

## Repository layout

```
LuminiaAPI.sln                  Solution: LuminiaAPI + GemstoneExchangeGenerator
LuminiaAPI/                     ASP.NET Core 10 Web API (also hosts the built SPA)
  Controllers/                  REST controllers, all routed as api/[controller]
  Context/LuminiaContext.cs     EF Core DbContext (MySQL) + ILuminiaContext interface
  Entities/                     EF entities, all inherit EntityBase (ObjectId key + audit columns)
  Dtos/                         Request/response DTOs, one folder per feature
  Mappers/                      AutoMapper Profiles (+ static GemstoneExchangeGraphMapper)
  Handlers/                     Business logic that doesn't belong in a controller
  Enums/                        Gemstone, MapLayer (mirrored in the Angular app)
  GemstoneExchangeSettings.json Per-gemstone price-simulation parameters, read at runtime
  LuminiaWebsite/               Angular 22 front-end (see LuminiaAPI/LuminiaWebsite/CLAUDE.md)
GemstoneExchangeGenerator/      Console tool to generate/tune gemstone price series (dev-only)
```

Root-level `bin/` and `obj/` are stale leftovers from an old net6.0 build; ignore them.

## Tooling

- .NET SDK 10+ (projects target `net10.0`)
- Node.js 22.22+ or 24.15+ and npm (Angular CLI 22 is a local devDependency; use `npx ng` or the npm scripts)
- MySQL (EF Core via `MySql.EntityFrameworkCore`). There are **no EF migrations**; the schema is managed directly in the database.

## Build

```powershell
# Back-end (whole solution). In Debug, the first build runs `npm install` in LuminiaWebsite if node_modules is missing.
dotnet build LuminiaAPI.sln

# Front-end only
cd LuminiaAPI/LuminiaWebsite
npm install
npm run build            # production build -> LuminiaWebsite/dist/
```

The production Angular build prints budget warnings (component CSS > 6 kB, initial bundle > 1 MB). These are pre-existing and do not fail the build.

## Run locally

The API and the Angular dev server run as two separate processes (the SpaProxy package is referenced but not wired up in `launchSettings.json`).

```powershell
dotnet run --project LuminiaAPI --launch-profile LuminiaAPI   # https://localhost:7276, Swagger at /swagger
cd LuminiaAPI/LuminiaWebsite; npm start                      # http://localhost:4200
```

The Angular app picks its API base URL from `environment.production` in `LuminiaApiService`: `https://localhost:7276/api/` in dev, `https://luminia.be/api/` in production.

**Warning:** `Program.cs` always uses the `LuminiaDbOnline` connection string, which points at the live production database. Running the API locally reads and writes production data. To use a local MySQL, switch it to `LuminiaDB` (don't commit that change unless the user asks).

## Test

- Front-end: `cd LuminiaAPI/LuminiaWebsite; npm test` (Karma + Jasmine, needs Chrome). Most `.spec.ts` files are CLI-generated "should create" stubs.
- Back-end: there is no .NET test project.

## Package / deploy

The API project serves the SPA. `dotnet publish` runs `npm install` and `npm run build` in `LuminiaWebsite`, then copies `dist/**` into `wwwroot/` of the publish output, except the map tile sets `assets/map` and `assets/mapDM`, which are deployed to the server separately (see the `PublishRunWebpack` target in `LuminiaAPI.csproj`). `Program.cs` serves it with `UseStaticFiles()` and `MapFallbackToFile("index.html")`.

```powershell
dotnet publish LuminiaAPI/LuminiaAPI.csproj -c Release -o publish
# or, to also get a zip:
./scripts/package.ps1
```

Output: `LuminiaAPI.dll`/`.exe`, `appsettings.json`, `GemstoneExchangeSettings.json`, and `wwwroot/` holding the Angular app. It's framework-dependent, so the host needs the ASP.NET Core 10 runtime. A full publish takes about 1 minute, mostly `npm install`.

## Versioning

The version lives in `LuminiaWebsite/src/assets/version.json` (the navbar displays it), with a matching `vX.Y.Z` git tag per release. Bump it with the `/bump-version` skill (`.claude/skills/bump-version`), which updates the file, commits and pushes the branch. Don't edit the version by hand, and don't create version tags on branches: the `Tag release` GitHub Action (`.github/workflows/tag-release.yml`) tags the merge commit once the bump lands on `main`.

**Before creating a pull request, always ask the user (AskUserQuestion) whether to bump the version:** Major (e.g. 3.0.0), Minor (e.g. 2.2.0), Bugfix (e.g. 2.1.1), or No bump, with the real numbers computed from the current version. If they pick a bump, run the `bump-version` skill with that level before opening the PR.

Stale config (don't rely on it): `Properties/PublishProfiles/FolderProfile.pubxml` still points at `net6.0`, and the `deploy` target in `angular.json` refers to `@angular/fire`, which isn't installed.

## Back-end conventions

- Controllers inject `ILuminiaContext` and AutoMapper `IMapper` and query the DbSets directly with LINQ. There's no repository layer. Handlers (e.g. `CreateGemstoneExchangesHandler`) hold non-trivial logic and are registered in `Program.cs` as interface + implementation.
- New entities inherit `EntityBase`, get a `DbSet` on **both** `ILuminiaContext` and `LuminiaContext`, and need a matching table in MySQL. `SaveChangesAsync` fills in the audit columns (`CreationDate/User`, `UpdateDate/User`) automatically.
- Mapping goes in an AutoMapper `Profile` under `Mappers/`. Profiles are discovered via `AddAutoMapper(typeof(Program))`.
- Namespaces: older files use block-scoped `namespace X { }`, newer ones file-scoped `namespace X;`. Follow the surrounding file.
- "Player vs DM" visibility is a `showAll` query flag. Players see data only up to the in-game `CurrentDate.DayNumber`; DM views pass `showAll=true` to see generated future data.
- `Gemstone` and `MapLayer` enums are duplicated in `LuminiaWebsite/src/app/services/luminia-api/enums/`. Keep both sides in sync.

## Known issues (don't "fix" these without asking)

- `appsettings.json` has DB credentials committed in plain text.
- There's no authentication on the API. CORS allows any origin, and write endpoints (PATCH/POST) are open.
- DM access is a client-side route guard (`DmCheckGuard`) that checks a hardcoded code in the URL.
