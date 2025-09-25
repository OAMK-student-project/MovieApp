# MovieApp
Student project – Fullstack

Web-sovellus elokuvaharrastajille. Kurssi: *Web-ohjelmoinnin sovellusprojekti*. Hyödynnetään The Movie Database (TMDB) ja Finnkino -rajapintoja.

## Teknologiat
#### Frontend:
<ol>
   <li>Node.js</li>
   <li>React (Vite)</li>
   <li>React Router DOM</li>
   <li>React DOM</li>
   <li>Axios</li>
</ol>

#### Backend
<ol>
   <li>Node.js</li>
   <li>Express</li>
   <li>cors</li>
   <li>bcrypt</li>
   <li>fast-xml-parser</li>
   <li>jsonwebtoken</li>
   <li>npx</li>
   <li>pg</li>
</ol>

- Dokumentaatio: OpenAPI (Swagger), dbdiagram.io
- Versionhallinta: GitHub

## Projektin rakenne
```
MovieApp/
  client/            # React frontend
   /components       # Uudelleenkäytettävät komponentit
   /context          # Kontekstit, kuten käyttäjän tiedot
   /screens          # Näkymät, jotka vastaavat reittejä. (Home jne)
      /account       # Käyttäjän hallinta, Login, Signup jne.
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
#### Frontend
Luo .env tiedosto polkuun: `/client/`

VITE_API_URL=http://localhost:3001
VITE_API_FINNKINO_URL=https://www.finnkino.fi/xml
VITE_TMDB_TOKEN=xxxx
VITE_TMDB_KEY=xxxx

#### Backend
Luo .env tiedosto polkuun: `server/`:
```
PORT=3001

#Frontend addres
FRONTEND_URL=http://localhost:5173

#In http this is "development"
#in production this is "production"
NODE_ENV=false

# Render Postgres connection
DB_HOST=xxx
DB_PORT=xxxx
DB_USER=xxx
DB_PASSWORD=xxxx
DB_NAME=xxxx
DUMMY_HASH=xxxx

#JWT
JWT_SECRET_KEY=Salaisuus
REFRESH_TOKEN_MS=2592000000

TEST_DB_NAME = testMovieApp
TMDB_BEARER_TOKEN=xxxxx
```

## Dokumentaatio
Täydennetään myöhemmin
