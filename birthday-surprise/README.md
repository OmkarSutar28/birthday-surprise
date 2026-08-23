# Birthday Surprise — Angular + .NET

A recreation of the "passcode lock → polaroid reveal → letter with photos → cake surprise"
website. Frontend is Angular 17 (standalone components), backend is a .NET 8 Web API.

## Project structure

```
birthday-surprise/
├── backend/BirthdayApi/
│   ├── Controllers/BirthdayController.cs   # passcode check, content config, photo listing
│   ├── Program.cs
│   ├── appsettings.json                    # <-- EDIT passcode, names, letter text here
│   └── wwwroot/photos/                     # <-- DROP YOUR PHOTOS HERE
└── frontend/
    └── src/app/components/
        ├── lock-screen/  (passcode keypad)
        ├── card/         (polaroid reveal)
        ├── letter/       (letter + photo gallery)
        └── cake/         (candle blow + confetti finale)
```

## 1. Add your own photos (no code changes needed)

Put your images in `backend/BirthdayApi/wwwroot/photos/`:
- `main.jpg` → the hero photo on the polaroid reveal screen (rename in
  `appsettings.json` → `Birthday:MainPhoto` if you use a different filename/format).
- any other image files (`photo1.jpg`, `us2.png`, ...) → automatically show up
  in the letter page's photo gallery, newest additions included, just refresh the page.

## 2. Edit the text

Everything text-based (passcode, recipient name, letter contents, signature)
lives in `backend/BirthdayApi/appsettings.json` under the `Birthday` section.
Change it, save, restart the API — no frontend rebuild required.

## 3. Run the backend

Requires the .NET 8 SDK.

```bash
cd backend/BirthdayApi
dotnet restore
dotnet run
```

API runs at `http://localhost:5080` (Swagger UI at `/swagger` in dev mode).

## 4. Run the frontend

Requires Node.js 18+ and the Angular CLI (`npm i -g @angular/cli`, or just use
`npx ng`).

```bash
cd frontend
npm install
npm start
```

App runs at `http://localhost:4200` and calls the API at `http://localhost:5080/api`
(configured in `src/environments/environment.ts`).

## Flow

1. `/` — passcode keypad (default passcode: `12345`, change it in appsettings.json)
2. `/card` — polaroid photo reveal with a "tap for a surprise" link
3. `/letter` — handwritten-style letter + photo gallery pulled live from the backend
4. `/cake` — tap the cake to blow out the candles → confetti + "Happy Birthday" banner

Route guards (`unlockedGuard`) stop someone from jumping straight to `/card`,
`/letter`, or `/cake` by typing the URL without entering the passcode first.

## Deploying

Build the Angular app (`npm run build`) and either serve `dist/birthday-surprise`
from the .NET app's `wwwroot` (simplest, single deployable) or host it separately
and update `Cors:AllowedOrigins` in `appsettings.json` to your frontend's domain.
