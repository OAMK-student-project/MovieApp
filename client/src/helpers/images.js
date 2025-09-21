const BASE = "https://image.tmdb.org/t/p"

export const posterUrl = (path, size = "w500") =>
    path ? `${BASE}/${size}${path}`: ""
export const backdropUrl = (path, size = "w1280") =>
    path ? `${BASE}/${size}${path}`: ""
export const profileUrl = (path, size = "w185") =>
    path ? `${BASE}/${size}${path}`: ""