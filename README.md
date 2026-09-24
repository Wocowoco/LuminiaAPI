# Luminia
A project for all things Luminia related (API + Angular)

- `LuminiaAPI/` - ASP.NET Core 10 Web API (MySQL via EF Core), also serves the built website
- `LuminiaAPI/LuminiaWebsite/` - Angular 22 front-end
- `GemstoneExchangeGenerator/` - console tool to generate gemstone exchange price data

## Getting started

Requirements: .NET 10 SDK and Node.js.

```powershell
# API - https://localhost:7276 (Swagger at /swagger)
dotnet run --project LuminiaAPI --launch-profile LuminiaAPI

# Website - http://localhost:4200
cd LuminiaAPI/LuminiaWebsite
npm install
npm start
```

## Packaging

```powershell
dotnet publish LuminiaAPI/LuminiaAPI.csproj -c Release -o publish
```

This also builds the Angular app and places it in `publish/wwwroot`, so the output folder is a single deployable site.

Colortheme used: https://coolors.co/2c2b25-353535-5a5152-908c7a-bdbbb0-cfd2cd-f7f4ea-fbfbf2
