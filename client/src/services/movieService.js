import { tmdb } from "./tmdbClient"

export const getTrendingToday = (page =1) =>
    tmdb("/trending/movie/day", { page })

export const getMovieDetails = (id) =>
    tmdb(`/movie/${id}`, { append_to_response: "credits"})