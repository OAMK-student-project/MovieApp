# MovieApp
Student project – Fullstack

Web-sovellus elokuvaharrastajille. Kurssi: *Web-ohjelmoinnin sovellusprojekti*. Hyödynnetään The Movie Database (TMDB) ja Finnkino -rajapintoja.

## Teknologiat
- Frontend: React (Vite), Axios, React Router
- Backend: Node.js, Express, PostgreSQL (pg)
- Dokumentaatio: OpenAPI (Swagger), dbdiagram.io
- Versionhallinta: GitHub

## Projektin rakenne
```
MovieApp/
  client/            # React frontend
   /components       # Uudelleenkäytettävät komponentit
   /context          # Kontekstit, kuten käyttäjän tiedot
   /screens          # Näkymät, jotka vastaavat reittejä. (Home, Login jne)
  server/            # Node/Express backend
   /controllers      # Sovelluslogiikka (esim. userController.js, reviewController.js)
   /helpers          # Pienet apufunktiot
   /middleware       # Esimerkiksi auth.js
   /models           # Tietokantalogiikka
   /service          # Ulkoiset integraatiot the Movie Databaseen ja Finnkinoon
  docs/              # openapi.yaml, kaaviot, backlog-kuvat
  .gitignore
  README.md
```

## Reitit
Määritetyt reitit
   /home
   /login
   /theater
   /theater/shows/?area=xxxx&dt=dd.mm.yyyy
   /theater/locations/


## Kloonaus ja alustus

### Playwright ja chromium asennukset
Tämä on lisätty 14.9.2025
Aja komennot:
   npm i playwright fast-xml-parser
   npx playwright install chromium

1. Kloonaa repo omalle koneellesi:
   ```bash
   git clone <repo-url>
   cd MovieApp
   ```

2. Asenna frontendin (React) riippuvuudet:
   ```bash
   cd client
   npm install
   ```

3. Asenna backendin (Express) riippuvuudet:
   ```bash
   cd ../server
   npm install
   ```

4. Käynnistä palvelut:
   - Frontend:
     ```bash
     cd client
     npm run dev
     ```
     → http://localhost:5173

   - Backend:
     ```bash
     cd server
     npm run devStart
     ```
     → http://localhost:3001

Huomio:
- `node_modules/`-kansiota ei ole repossa. Se luodaan aina `npm install` -komennolla.
- Kaikki tarvittavat kirjastot ja niiden versiot on määritetty `package.json` + `package-lock.json` -tiedostoissa, joten `npm install` asentaa saman ympäristön kaikille.
- `.env`-tiedosto täytyy jokaisen luoda itse `server/`-kansioon (tietokannan osoite, API-avaimet).




## Asennus ja käynnistys

### Backend
```bash

```

### Frontend
```bash

```


### Ympäristömuuttujat
Luo `server/.env`:
```
DATABASE_URL=xxx
PORT=xxx
```

## Dokumentaatio
Täydennetään myöhemmin
