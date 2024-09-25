import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchArtworkById, likeArtwork, saveArtwork, unlikeArtwork, unsaveArtwork } from "../../features/artworks/ArtworkThunks";
import { resetArtworksState } from "../../features/artworks/ArtworkSlice";
import Spinner from '../common/Spinner';
import Placeholder from '../common/Placeholder'; 
import '../../styles/artworks/ArtworkDetails.css';

const ArtworkDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const artwork = useSelector((state) => state.artwork.artwork[id]);
    const status = useSelector((state) => state.artwork.status);
    const error = useSelector((state) => state.artwork.error);
    const likedArtworks = useSelector((state) => state.artwork.likedArtworks);
    const savedArtworks = useSelector((state) => state.artwork.savedArtworks);
    
    const isLiked = artwork && (likedArtworks || []).some(liked => liked.artwork_id === artwork.id);
    const isSaved = artwork && (savedArtworks || []).some(saved => saved.artwork_id === artwork.id);
  
    
    useEffect(() => {
        dispatch(fetchArtworkById(id));
        return () => {
            dispatch(resetArtworksState());
        };
    }, [dispatch, id]);

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

    if (status === 'failed' && error) {
        return <div>Error: {error}</div>;
    }

   
    if (status === 'loading' || !artwork) {
        return <Spinner />;
    }

    return (
        <div className="artwork-details-container" data-testid="artwork-details">
            <div className="artwork-content">
                {artwork.image_url ? (
                    <img 
                        src={artwork.image_url} 
                        alt={artwork.title} 
                        className="artwork-image"
                        onError={(e) => e.target.src = Placeholder} 
                    />
                ) : (
                    <Placeholder /> 
                )}
                <h2 data-testid="artwork-title">{artwork.title}</h2>
                <p data-testid="artwork-artist">Artist: {artwork.artist}</p>
                <p data-testid="artwork-period">Period: {artwork.period}</p>
                <p data-testid="artwork-medium">Medium: {artwork.medium}</p>
                <p data-testid="artwork-location">Location: {artwork.location}</p>
                <div className="button-group">
                <button data-testid="like-button" onClick={handleToggleLike}>{isLiked ? 'Unlike' : 'Like'}</button>
                <button data-testid="save-button" onClick={handleToggleSave}>{isSaved ? 'Unsave' : 'Save'}</button>

                </div>
            </div>
        </div>
    );
};


export default ArtworkDetails;