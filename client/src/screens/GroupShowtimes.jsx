import { useState, useEffect, useMemo } from "react";
import { XMLParser } from "fast-xml-parser";
import toast from "react-hot-toast";
import ShowCard from "../components/ShowCard";
import "./GroupPage.css";

const toFinnkino = (isoDate) => {
  const [y, m, d] = isoDate.split("-");
  return `${d}.${m}.${y}`;
};

const timeOf = (iso) =>
  typeof iso === "string" && iso.length >= 16 ? iso.slice(11, 16) : null;

function createXMLParser(arrayName) {
  return new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseTagValue: true,
    parseAttributeValue: true,
    trimValues: true,
    isArray: (name) => name === arrayName,
  });
}

export default function GroupShowtimes({ selectedMovieId }) {
  const url = import.meta.env.VITE_API_FINNKINO_URL;
  const [theaters, setTheaters] = useState([]);
  const [theaterCode, setTheaterCode] = useState("");
  const [events, setEvents] = useState([]);
  const [dateIso, setDateIso] = useState(new Date().toISOString().slice(0, 10));
  const [sortBy, setSortBy] = useState("earliest");
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const res = await fetch(`${url}/TheatreAreas/`, {
          headers: { Accept: "application/xml,text/xml;q=0.9,*/*;q=0.8" },
        });
        const xml = await res.text();
        const parser = createXMLParser("TheatreArea");
        const json = parser.parse(xml);
        const list = json.TheatreAreas.TheatreArea.map(t => ({ ID: t.ID, Name: t.Name }));
        setTheaters(list);
      } catch (err) {
        toast.error("Failed to fetch theaters");
      }
    };
    fetchTheaters();
  }, []);

  useEffect(() => {
    if (!theaterCode) return;

    const fetchMovies = async () => {
      try {
        setStatus("loading");
        const dt = toFinnkino(dateIso);
        const res = await fetch(`${url}/Schedule/?area=${theaterCode}&dt=${dt}`, {
          headers: { Accept: "application/xml,text/xml;q=0.9,*/*;q=0.8" },
        });
        const xml = await res.text();
        const parser = createXMLParser("Show");
        const json = parser.parse(xml);
        const shows = Array.isArray(json.Schedule.Shows.Show) ? json.Schedule.Shows.Show : [];
        const filtered = shows.filter(s => s.EventID === selectedMovieId); // filter by selected movie
        setEvents(filtered);
        setStatus("success");
      } catch (err) {
        console.error(err);
        setEvents([]);
        setStatus("error");
        toast.error("Failed to fetch showtimes");
      }
    };

    fetchMovies();
  }, [theaterCode, dateIso, selectedMovieId]);

  const groupedByTime = useMemo(() => {
    return events.reduce((acc, e) => {
      const t = timeOf(e.dttmShowStart);
      if (!t) return acc;
      (acc[t] ||= []).push(e);
      return acc;
    }, {});
  }, [events]);

  const showTimes = useMemo(() => Object.keys(groupedByTime).sort((a, b) =>
    sortBy === "earliest"
      ? a.localeCompare(b)
      : b.localeCompare(a)
  ), [groupedByTime, sortBy]);

  return (
    <div className="group-showtimes">
      <div className="inputArea">
        <select value={theaterCode} onChange={e => setTheaterCode(e.target.value)}>
          <option value="">Select theater</option>
          {theaters.map(t => <option key={t.ID} value={t.ID}>{t.Name}</option>)}
        </select>
        <input type="date" value={dateIso} onChange={e => setDateIso(e.target.value)} />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="earliest">Earliest first</option>
          <option value="latest">Latest first</option>
        </select>
      </div>

      <div className="showArea">
        {status === "loading" && <p>Loading...</p>}
        {status === "error" && <p>Error loading showtimes</p>}
        {status === "success" && showTimes.length === 0 && <p>No showtimes available</p>}
        {showTimes.map(t => (
          <div key={t} className="showSlot">
            <div className="showTime">{t}</div>
            <div className="shows">
              {groupedByTime[t].map(s => <ShowCard key={s.ID} show={s} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
