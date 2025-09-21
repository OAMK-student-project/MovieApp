const BASE_URL = "https://api.themoviedb.org/3"

const v4Token = import.meta.env.VITE_TMDB_TOKEN
const v3Key   = import.meta.env.VITE_TMDB_KEY

const headers = v4Token
  ? {
      Authorization: `Bearer ${v4Token}`,
      "Content-Type": "application/json;charset=utf-8",
    }
  : {
      "Content-Type": "application/json;charset=utf-8",
    }

function buildUrl(path, params = {}) {
  const merged = {
    language: "fi-FI",
    ...(v4Token ? {} : { api_key: v3Key }),
    ...params,
  };
  const qs = new URLSearchParams(merged).toString()
  return `${BASE_URL}${path}${qs ? `?${qs}` : ""}`
}

export async function tmdb(path, params = {}) {
  const url = buildUrl(path, params)
  try {
    const res = await fetch(url, { headers, mode: "cors" })
    if (!res.ok) {
      const text = await res.text().catch(() => "")
      throw new Error(`TMDB ${res.status} ${res.statusText}\n${text || url}`)
    }
    return res.json();
  } catch (err) {
    
    console.error("TMDB fetch failed:", url, err);
    throw err;
  };
}