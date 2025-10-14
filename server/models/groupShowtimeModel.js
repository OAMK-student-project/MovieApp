import db from "../helpers/db.js";

// Hae kaikki näytösajat tietylle ryhmälle
export const getShowtimesByGroup = async (groupId) => {
  const result = await db.query(
    `SELECT * FROM "Group_showtimes" WHERE group_id = $1 ORDER BY show_date ASC`,
    [groupId]
  );
  return result.rows;
};

// Lisää uusi näytösaika
export const createShowtime = async (groupId, movieTitle, theaterName, showDate) => {
  const result = await db.query(
    `INSERT INTO "Group_showtimes" (group_id, movie_title, theater_name, show_date)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [groupId, movieTitle, theaterName, showDate]
  );
  return result.rows[0];
};

// Poista näytösaika
export const deleteShowtime = async (id) => {
  await db.query(`DELETE FROM "Group_showtimes" WHERE id = $1`, [id]);
};