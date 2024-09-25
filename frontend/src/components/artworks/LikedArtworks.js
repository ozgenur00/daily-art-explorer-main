import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLikedArtworks, fetchArtworkById, unlikeArtwork } from '../../features/artworks/ArtworkThunks';
import '../../styles/artworks/LikedArtworks.css';
import Placeholder from '../common/Placeholder';  

const LikedArtworks = () => {
  const dispatch = useDispatch();
  const likedArtworks = useSelector((state) => state.artwork.likedArtworks);
  const artworkDetails = useSelector((state) => state.artwork.artwork);

  useEffect(() => {
    dispatch(fetchLikedArtworks());
  }, [dispatch]);

  useEffect(() => {
    likedArtworks.forEach((artwork) => {
      if (!artworkDetails[artwork.artwork_id]) {
        dispatch(fetchArtworkById(artwork.artwork_id));
      }
    });
  }, [likedArtworks, dispatch, artworkDetails]);

  const handleUnlike = (artworkId) => {
    dispatch(unlikeArtwork(artworkId));
  };

  return (
    <div className="liked-artworks-page">
      <h2>Liked Artworks</h2>
      <div className="liked-artworks-list">
        {likedArtworks.length > 0 ? (
          likedArtworks.map((artwork) => {
            const details = artworkDetails[artwork.artwork_id];
            return details ? (
              <div className="liked-artwork-card" key={artwork.artwork_id}>
                {details.image_url ? (
                  <img src={details.image_url} alt={details.title} />
                ) : (
                  <Placeholder />
                )}
                <div className="liked-artwork-details">
                  <h3>{details.title}</h3>
                  <p>Artist: {details.artist}</p>
                  <p>Period: {details.period}</p>
                  <p>Medium: {details.medium}</p>
                  <p>Location: {details.location}</p>
                  <button onClick={() => handleUnlike(artwork.artwork_id)}>Unlike</button>
                </div>
              </div>
            ) : (
              <div key={artwork.artwork_id}>Loading...</div>
            );
          })
        ) : (
          <div>No liked artworks available.</div>
        )}
      </div>
    </div>
  );
};

export default LikedArtworks;
