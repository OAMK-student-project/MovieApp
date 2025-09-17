import "./MovieDetailsCard.css";

function MovieDetailsCard({ onClose, show }) {
    const auditoriumNumber = (show.TheatreAuditorium?.match(/\d+/)?.[0]) ?? "?"
  return (
  <div className="overlay" onClick={onClose}>
    <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <img className="detailPhoto" src={show.Images.EventLargeImagePortrait}/>
        <div>{show.OriginalTitle}</div>
        <div>{`Auditorium ${auditoriumNumber}`}</div>
        <div>{`Length: ${show.LengthInMinutes} mins`}</div>
        <div>{`Presentation method: ${show.PresentationMethod}`}</div>
        <a href={show.ShowURL}>Go to Finnkino</a>
    </div>
  </div>);
}

export default MovieDetailsCard;