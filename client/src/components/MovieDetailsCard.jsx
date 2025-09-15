import "./MovieDetailsCard.css";

function MovieDetailsCard({ onClose, show }) {
    const auditoriumNumber = (show.auditorium?.match(/\d+/)?.[0]) ?? "?"
  return (
  <div className="overlay" onClick={onClose}>
    <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <img className="detailPhoto" src={show.images.large}/>
        <div>{show.title}</div>
        <div>{`Auditorium ${auditoriumNumber}`}</div>
        <div>{`Length: ${show.lengthMin} mins`}</div>
        <div>{`Presentation method: ${show.presentationMethod}`}</div>
    </div>
  </div>);
}

export default MovieDetailsCard;