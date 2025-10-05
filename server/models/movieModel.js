import db from '../helpers/db.js'

async function getAllMovies(){
    const result = await db.query(`SELECT * FROM movies`);
    return result.rows;
}

async function findById(tmdbId) {
  const q = `SELECT movie_id, title, original_title, release_date, poster_path,
                    backdrop_path, runtime, genres, fetched_at
             FROM movies
             WHERE movie_id = $1`;
  const { rows } = await db.query(q, [tmdbId]);
  return rows[0] ?? null;
}

//Transform TMBD movie to a row in a database
//Use only fields necessery in the UI
function mapTmdbToRow(tmdb) {
  return {
    movie_id: tmdb.id,
    title: tmdb.title ?? tmdb.original_title ?? "",
    original_title: tmdb.original_title ?? null,
    release_date: tmdb.release_date ?? null,
    poster_path: tmdb.poster_path ?? null,
    backdrop_path: tmdb.backdrop_path ?? null,
    runtime: tmdb.runtime ?? null,
    genres: JSON.stringify(tmdb.genres ?? []),
    overview: tmdb.overview ?? null,
  };
}

export async function updateFromTmdb(tmdbMovie) {
  const m = mapTmdbToRow(tmdbMovie);
  const q = `
    INSERT INTO movies (movie_id, title, original_title, release_date,
                        poster_path, backdrop_path, runtime, genres, fetched_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8, NOW())
    ON CONFLICT (movie_id) DO UPDATE SET
      title = EXCLUDED.title,
      original_title = EXCLUDED.original_title,
      release_date = EXCLUDED.release_date,
      poster_path = EXCLUDED.poster_path,
      backdrop_path = EXCLUDED.backdrop_path,
      runtime = EXCLUDED.runtime,
      genres = EXCLUDED.genres,
      fetched_at = NOW()
    RETURNING movie_id, title, original_title, release_date, poster_path,
              backdrop_path, runtime, genres, fetched_at;
  `;
  const params = [
    m.movie_id, m.title, m.original_title, m.release_date,
    m.poster_path, m.backdrop_path, m.runtime, m.genres,
  ];
  const { rows } = await db.query(q, params);
  return rows[0];
}

/**
 * Massapäivitys useille TMDB-elokuville kerralla (valinnainen optimointi listanäkymiin).
 * Syö tmdbMovie-olioiden taulukon.
 */
export async function bulkUpdateFromTmdb(tmdbMovies = []) {
  if (!tmdbMovies.length) return [];

  // Valmistellaan arvot
  const mapped = tmdbMovies.map(mapTmdbToRow);

  // Rakennetaan parametrisoitu VALUES-lista
  const values = [];
  const params = [];
  mapped.forEach((m, i) => {
    const base = i * 8;
    values.push(`($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8}, NOW())`);
    params.push(
      m.movie_id, m.title, m.original_title, m.release_date,
      m.poster_path, m.backdrop_path, m.runtime, m.genres
    );
  });

  const q = `
    INSERT INTO movies (movie_id, title, original_title, release_date,
                        poster_path, backdrop_path, runtime, genres, fetched_at)
    VALUES ${values.join(",")}
    ON CONFLICT (movie_id) DO UPDATE SET
      title = EXCLUDED.title,
      original_title = EXCLUDED.original_title,
      release_date = EXCLUDED.release_date,
      poster_path = EXCLUDED.poster_path,
      backdrop_path = EXCLUDED.backdrop_path,
      runtime = EXCLUDED.runtime,
      genres = EXCLUDED.genres,
      fetched_at = NOW()
    RETURNING movie_id, title, original_title, release_date, poster_path,
              backdrop_path, runtime, genres, fetched_at;
  `;

  const { rows } = await db.query(q, params);
  return rows;
}

export async function findManyByIds(tmdbIds = []) {
  if (!tmdbIds.length) return [];
  const q = `
    SELECT movie_id, title, original_title, release_date, poster_path,
           backdrop_path, runtime, genres, fetched_at
    FROM movies
    WHERE movie_id = ANY($1::int[])
  `;
  const { rows } = await db.query(q, [tmdbIds]);
  return rows;
}

export async function updateFetchedAt(tmdbId) {
  const { rows } = await db.query(
    `UPDATE movies SET fetched_at = NOW() WHERE movie_id = $1 RETURNING *`,
    [tmdbId]
  );
  return rows[0] ?? null;
}

export async function deleteMovie(tmdbId){
  const result = await db.query(`DELETE FROM movies WHERE movie_id=$1 RETURNING *`,
    [tmdbId]);
    return result.rows[0] || null; //Return null if nothing found
}

/**
 * Hyödyllinen apu TTL-tarkistukseen palvelukerroksessa.
 * Palauttaa true, jos rivi puuttuu tai on vanhempi kuin ttlMs.
 */
export function isStale(row, ttlMs) {
  if (!row?.fetched_at) return true;
  const age = Date.now() - new Date(row.fetched_at).getTime();
  return age > ttlMs;
}

export { getAllMovies, findById };