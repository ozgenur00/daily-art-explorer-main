import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSavedArtworks, fetchArtworkById, unsaveArtwork } from '../../features/artworks/ArtworkThunks';
import '../../styles/artworks/SavedArtworks.css';
import Placeholder from '../common/Placeholder';  

const SavedArtworks = () => {
  const dispatch = useDispatch();
  const savedArtworks = useSelector((state) => state.artwork.savedArtworks);
  const artworkDetails = useSelector((state) => state.artwork.artwork);

  useEffect(() => {
    dispatch(fetchSavedArtworks());
  }, [dispatch]);

  useEffect(() => {
    savedArtworks.forEach((artwork) => {
      if (!artworkDetails[artwork.artwork_id]) {
        dispatch(fetchArtworkById(artwork.artwork_id));
      }
    });
  }, [savedArtworks, dispatch, artworkDetails]);

  const handleUnsave = (artworkId) => {
    dispatch(unsaveArtwork(artworkId));
  };

  return (
    <div className="saved-artworks-page">
      <h2>Saved Artworks</h2>
      <div className="saved-artworks-list">
        {savedArtworks.length > 0 ? (
          savedArtworks.map((artwork, index) => {
            const details = artworkDetails[artwork.artwork_id];
            return details ? (
              <div className="saved-artwork-card" key={`${artwork.artwork_id}-${index}`}>
                {details.image_url ? (
                  <img src={details.image_url} alt={details.title} />
                ) : (
                  <Placeholder />
                )}
                <div className="saved-artwork-details">
                  <h3>{details.title}</h3>
                  <p>Artist: {details.artist}</p>
                  <p>Period: {details.period}</p>
                  <p>Medium: {details.medium}</p>
                  <p>Location: {details.location}</p>
                  <button onClick={() => handleUnsave(artwork.artwork_id)}>Unsave</button>
                </div>
              </div>
            ) : (
              <div key={`${artwork.artwork_id}-${index}`}>Loading...</div>
            );
          })
        ) : (
          <div>No saved artworks available.</div>
        )}
      </div>
    </div>
  );
};

export default SavedArtworks;
