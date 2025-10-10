import { useEffect, useState, useMemo } from "react";
import { XMLParser } from "fast-xml-parser";
import ShowCard from "./ShowCard.jsx";
import "../screens/Theater.css"

const toFinnkino = (isoDate) => {
  const [y, m, d] = isoDate.split("-");
  return `${d}.${m}.${y}`;
};

const timeOf = (iso) => (typeof iso === "string" && iso.length >= 16 ? iso.slice(11, 16) : null);

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

export default function TheaterPanel() {
  const url = import.meta.env.VITE_API_FINNKINO_URL;
  const [theaters, setTheaters] = useState([]);
  const [theaterCode, setTheaterCode] = useState("");
  const [events, setEvents] = useState([]);
  const [dateIso, setDateIso] = useState(() => new Date().toISOString().slice(0, 10));
  const [sortBy, setSortBy] = useState("earliest");
  const [status, setStatus] = useState("idle");

  // Fetch theater list
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`${url}/TheatreAreas/`, {
          signal: controller.signal,
          headers: { Accept: "application/xml" },
        });
        const xml = await res.text();
        const parser = createXMLParser("TheatreArea");
        const json = parser.parse(xml);
        const list = json.TheatreAreas.TheatreArea || [];
        setTheaters(list);
      } catch (err) {
        console.error("Failed to load theaters:", err);
      }
    })();
    return () => controller.abort();
  }, []);

  // Fetch showtimes when selection changes
  useEffect(() => {
    if (!theaterCode) return;
    const controller = new AbortController();
    const dt = toFinnkino(dateIso);
    (async () => {
      try {
        setStatus("loading");
        const res = await fetch(`${url}/Schedule/?area=${theaterCode}&dt=${dt}`, {
          signal: controller.signal,
          headers: { Accept: "application/xml" },
        });
        const xml = await res.text();
        const parser = createXMLParser("Show");
        const json = parser.parse(xml);
        setEvents(json.Schedule.Shows.Show || []);
        setStatus("success");
      } catch (err) {
        console.error("Failed to load schedule:", err);
        setStatus("error");
      }
    })();
    return () => controller.abort();
  }, [theaterCode, dateIso]);

  // Sort and group showtimes
  const { showTimes, groupedByTime } = useMemo(() => {
    const valid = events.filter((e) => timeOf(e.dttmShowStart));
    const groups = valid.reduce((acc, e) => {
      const t = timeOf(e.dttmShowStart);
      (acc[t] ||= []).push(e);
      return acc;
    }, {});
    const toMinutes = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    const sorted = Object.keys(groups).sort((a, b) =>
      sortBy === "earliest" ? toMinutes(a) - toMinutes(b) : toMinutes(b) - toMinutes(a)
    );
    return { showTimes: sorted, groupedByTime: groups };
  }, [events, sortBy]);

  return (
    <div className="theater-panel">
      <h3>Showtimes Near You</h3>
      <div className="inputArea">
        <select value={theaterCode} onChange={(e) => setTheaterCode(e.target.value)}>
          <option value="">Select theater</option>
          {theaters.map((t) => (
            <option key={t.ID} value={t.ID}>{t.Name}</option>
          ))}
        </select>
        <input type="date" value={dateIso} onChange={(e) => setDateIso(e.target.value)} />
        <select onChange={(e) => setSortBy(e.target.value)}>
          <option value="earliest">Earliest</option>
          <option value="latest">Latest</option>
        </select>
      </div>

      <div className="showArea">
        {status === "loading" && <p>Loading showtimes...</p>}
        {status === "error" && <p>Error loading showtimes.</p>}
        {status === "success" &&
          showTimes.map((t) => (
            <div key={t} className="showSlot">
              <div className="showTime">{t}</div>
              <div className="shows">
                {groupedByTime[t].map((e) => (
                  <ShowCard key={`${e.ID}-${e.dttmShowStart}`} show={e} />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}