import { useEffect, useState, useMemo } from "react";
import { XMLParser } from "fast-xml-parser";
import "./Theater.css";
import ShowCard from "../components/ShowCard";

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

function Theater() {
  const url = import.meta.env.VITE_API_FINNKINO_URL;
  const [theaters, setTheaters] = useState([{ ID: "", Name: "Ladataan…" }]);
  const [theaterCode, setTheaterCode] = useState("");
  const [events, setEvents] = useState([]);
  const [dateIso, setDateIso] = useState(() => new Date().toISOString().slice(0, 10));
  
  const [sortBy, setSortBy] = useState("earliest");
  const [status, setStatus] = useState("idle"); //Tilat: idle, loading, success/error

  useEffect(() => {
    const abortController = new AbortController();

    (async () => {
      try {
        const response = await fetch(url+`/TheatreAreas/`, {
          signal: abortController.signal,
          headers: { Accept: "application/xml,text/xml;q=0.9,*/*;q=0.8" }
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const xml = await response.text();
        const parser = createXMLParser("TheatreArea");
        const json = parser.parse(xml);
        const locations = json.TheatreAreas.TheatreArea;
        if (locations.length === 0) throw new Error("Tyhjä tulos");
        setTheaters(locations);
        setTheaterCode(0);
      } catch (err) {
        if (abortController.signal.aborted) return;
        console.error("Finnkino Theatres haku epäonnistui:", err);
        setTheaters([{ ID: "", Name: "Virhe haussa" }]);
        setTheaterCode("");
      }
    })();

    return () => abortController.abort();
  }, []);

const fetchMovies = async (areaCode) => {
  const abortController = new AbortController();
  const area = Number(String(areaCode).trim());
  if (!Number.isFinite(area) || area === 0) { //isFinite tarkistaa onko area numero
    setStatus("idle");
    setEvents([]);
    return;
  }

  const dt = toFinnkino(dateIso); // esim. "17.09.2025"
  setStatus("loading");

  try {
    const response = await fetch(`${url}/Schedule/?area=${area}&dt=${dt}`, {
      signal: abortController.signal,
      headers: { Accept: "application/xml,text/xml;q=0.9,*/*;q=0.8" }
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status} ${response.statusText}${body ? ` – ${body.slice(0,160)}` : ""}`);
    }

    const xml = await response.text();
    const parser = createXMLParser("Show");
    const json = parser.parse(xml);
    const shows = json.Schedule.Shows.Show;
    setEvents(Array.isArray(shows) ? shows : []);
    setStatus("success");
  } catch (err) {
    console.error(err);
    setEvents([]);
    setStatus("error");
    alert(err.message);
  }
  return () => abortController.abort();
};

useEffect(()=>{
    fetchMovies(theaterCode);
  },[theaterCode, dateIso]);

const { showTimes, groupedByTime } = useMemo(() => {
  const valid = events.filter((event) => timeOf(event.dttmShowStart));
  const groups = valid.reduce((acc, event) => {
    const t = timeOf(event.dttmShowStart);        // t on aina "HH:MM"
    (acc[t] ||= []).push(event);
    return acc;
  }, {});

  const toMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const times = Object.keys(groups).sort((a, b) =>
    sortBy === "earliest" ? toMinutes(a) - toMinutes(b) : toMinutes(b) - toMinutes(a)
  );

  return { showTimes: times, groupedByTime: groups };
}, [events, sortBy]);

const handleStatus = () => {
  switch (status) {
    case "idle":
      return null;
    case "loading":
      return <div>Loading...</div>;
    case "error":
      return <div>Error. Please try again</div>;
    case "success":
      return showTimes.length === 0 ? (
        <div>No movies to show</div>
      ) : (
        showTimes.map((t) => (
          <div key={t} className="showSlot">
            <div className="showTime">{t}</div>
            <div className="shows">
              {groupedByTime[t].map((event) => (
                <ShowCard key={`${event.ID}-${event.dttmShowStart}`} show={event} />
              ))}
            </div>
          </div>
        ))
      );
    default:
      return null;
  }
};

  return (
    <div className="finnkino">
      <div className="inputArea">
        <select value={theaterCode} onChange={(e) => setTheaterCode(e.target.value)}>
          {theaters.map(theater=>{
          return <option key={theater.ID} value={theater.ID}>{theater.Name}</option> 
          })}
        </select>
        <input
          type="date"
          value={dateIso}
          onChange={(e) => setDateIso(e.target.value)}
        />
        <select onChange={(e)=>setSortBy(e.target.value)}>
          <option value="earliest">Earliest first</option>
          <option value="latest">Latest first</option>
        </select>
      </div>
      <div className="showArea">{handleStatus()}</div>
    </div>
  );
}

export default Theater;
