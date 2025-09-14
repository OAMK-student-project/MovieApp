import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./Theater.css";
import ShowCard from "../components/ShowCard";

const toFinnkino = (isoDate) => {
  const [y, m, d] = isoDate.split("-");
  return `${d}.${m}.${y}`;
};

const timeOf = (iso) => iso.slice(11, 16);

function Theater() {
  const url = "http://localhost:3001/theater";
  const [theaters, setTheaters] = useState([]);
  const [events, setEvents] = useState([]);
  const [dateIso, setDateIso] = useState(() => new Date().toISOString().slice(0, 10));
  const [theaterCode, setTheaterCode] = useState(0);
  const [sortBy, setSortBy] = useState("earliest");
  const [status, setStatus] = useState("idle"); //Tilat: idle, loading, success/error
  //const [showTimes, setShowTimes] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${url}/locations`);
        setTheaters([, ...(Array.isArray(data) ? data : [])]);
      } catch (err) {
        alert(err.message);
      }
    })();
  }, []);

  const fetchMovies = async (areaCode) => {
    const area = Number(String(areaCode).trim());
    if (!Number.isFinite(area) || area === 0) {
      setStatus("idle");
      setEvents([]);
      return;
    }
    const dt = toFinnkino(dateIso);
    setStatus("loading");
    try {
      const { data } = await axios.get(`${url}/shows`, { params: { area, dt } });
      setStatus("success");
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setStatus("error");
      console.error(err.response?.status, err.message);
      setEvents([]);
      alert(err.message);
    }
  };

  useEffect(()=>{
    fetchMovies(theaterCode);
  },[theaterCode, dateIso]);

  const { showTimes, groupedByTime } = useMemo(() => {
    const groups = events.reduce((acc, ev) => {
      const t = timeOf(ev.start);
      (acc[t] ||= []).push(ev);
      return acc;
    }, {});

    const toMinutes = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };

    const times = Object.keys(groups).sort((a, b) =>
      sortBy === "earliest"
        ? toMinutes(a) - toMinutes(b)   // aikaisin ensin
        : toMinutes(b) - toMinutes(a)   // myöhäisin ensin
    );
    return { showTimes: times, groupedByTime: groups };
  }, [events, sortBy]);

  const handleStatus = () => {
    if (status === "loading") {
      return <div>Loading...</div>
    } else if(status === "error") {
      return <div>Error. Please try again</div>
    } else if(status === "success" && showTimes.length===0) {
      return <div>No movies to show</div>
    } else {
      return(
        showTimes.map((t) => (
          <div key={t} className="showSlot">
            <div className="showTime">{t}</div>
            <div className="shows">
              {groupedByTime[t].map((event) => (
                <ShowCard
                  key={event.uuid}
                  show={event}
                />
              ))}
            </div>
          </div>
        )));
    }
  }

  return (
    <div className="finnkino">
      <div className="inputArea">
        <select defaultValue={0} onChange={(e) => setTheaterCode(e.target.value)}>
          {theaters.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
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
