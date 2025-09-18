import { useState } from "react";
import MovieDetailsCard from "./MovieDetailsCard";

function ShowCard({ show }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="showCard">
      <img
        className="photo"
        src={show.Images.EventLargeImagePortrait}
        onClick={() => setShowDetails(true)}
      />
      {showDetails && (<MovieDetailsCard onClose={() => setShowDetails(false)} show={show} />
      )}
    </div>
  );
}

export default ShowCard;
