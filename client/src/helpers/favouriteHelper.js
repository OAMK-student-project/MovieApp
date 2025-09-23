import { getMovieDetails } from "../services/movieService"

export async function addToFavourites(movie) {
  console.log("Adding to favourites:", movie.title)
  //fetch details
  const data = await getMovieDetails(movie.id)
  console.log("Movie details:", data)
}