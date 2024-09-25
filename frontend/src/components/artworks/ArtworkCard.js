import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/artworks/ArtworkCard.css';
import { likeArtwork, unlikeArtwork, saveArtwork, unsaveArtwork } from '../../features/artworks/ArtworkThunks';
import { useDispatch, useSelector } from 'react-redux';
import Placeholder from '../common/Placeholder'; 

const ArtworkCard = ({ artwork }) => {
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const likedArtworks = useSelector((state) => state.artwork.likedArtworks);
    const savedArtworks = useSelector((state) => state.artwork.savedArtworks);
    
    const isLiked = artwork && (likedArtworks || []).some(liked => liked.artwork_id === artwork.id);
    const isSaved = artwork && (savedArtworks || []).some(saved => saved.artwork_id === artwork.id);
  

    const handleViewMore = () => {
        navigate(`/artwork/${artwork.id}`);
    };

    const handleToggleLike = () => {
        if (isLiked) {
            dispatch(unlikeArtwork(artwork.id));
        } else {
            dispatch(likeArtwork(artwork.id));
        }
    };
    
    const handleToggleSave = () => {
        if (isSaved) {
          dispatch(unsaveArtwork(artwork.id)); 
        } else {
          dispatch(saveArtwork(artwork.id)); 
        }
      };

    return (
        <div className="artwork-card">
            {!imageError && artwork.image_url ? (
                <img 
                    src={artwork.image_url} 
                    alt={artwork.title} 
                    onError={() => setImageError(true)} 
                />
            ) : (
                <Placeholder />
            )}
            <h3>{artwork.title}</h3>
            <p>Artist: {artwork.artist}</p>
            <p>Period: {artwork.period}</p>
            <p>Medium: {artwork.medium}</p>
            <button onClick={handleViewMore}>View More</button>
            <button onClick={handleToggleLike}>{isLiked ? 'Unlike' : 'Like'}</button>
            <button onClick={handleToggleSave}>{isSaved ? 'Unsave' : 'Save'}</button>
        </div>
    );
};

export default ArtworkCard;
