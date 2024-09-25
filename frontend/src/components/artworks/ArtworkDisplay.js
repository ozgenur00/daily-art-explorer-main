import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArtwork, likeArtwork, unlikeArtwork, saveArtwork, unsaveArtwork } from '../../features/artworks/ArtworkThunks';
import '../../styles/artworks/ArtworkDisplay.css';
import Metadata from '../common/Metadata';
import Placeholder from '../common/Placeholder'; 
import Spinner from '../common/Spinner';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'react-share';

const ArtworkDisplay = () => {
  const dispatch = useDispatch();
  const artwork = useSelector((state) => state.artwork.artwork);
  const likedArtworks = useSelector((state) => state.artwork.likedArtworks);
  const savedArtworks = useSelector((state) => state.artwork.savedArtworks);
  const status = useSelector((state) => state.artwork.status);
  const error = useSelector((state) => state.artwork.error);

  const isLiked = artwork && (likedArtworks || []).some(liked => liked.artwork_id === artwork.id);
  const isSaved = artwork && (savedArtworks || []).some(saved => saved.artwork_id === artwork.id);

  useEffect(() => {
    dispatch(fetchArtwork());
  }, [dispatch]);

  const handleFetchNewArtwork = () => {
    dispatch(fetchArtwork());
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

  if (status === 'loading') return <div data-testid="spinner"><Spinner /></div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  const shareUrl = artwork ? `${window.location.origin}/artwork/${artwork.id}` : window.location.href;
  const title = artwork ? artwork.title : 'Check out this artwork!';
  const description = artwork ? `Discover ${artwork.title} by ${artwork.artist}.` : 'Explore beautiful artwork daily';

  return (
    <div className="artwork-display-container">
      <Metadata title={title} description={description} image={artwork?.image_url || '/path/to/placeholder.jpg'} url={shareUrl} />
  
      {artwork ? (
        <div className="artwork-content">
        <h2>{artwork.title}</h2>
        {artwork.image_url ? (
          <img src={artwork.image_url} alt={artwork.title} className="artwork-image" />
        ) : (
          <Placeholder />  
        )}
        <p>Artist: {artwork.artist}</p>
        <p>Period: {artwork.period}</p>
        <p>Medium: {artwork.medium}</p>
        <p>Location: {artwork.location}</p>
        <div className="button-group">
          <button onClick={handleToggleLike}>{isLiked ? 'Unlike' : 'Like'}</button>
          <button onClick={handleToggleSave}>{isSaved ? 'Unsave' : 'Save'}</button>
          <button onClick={handleFetchNewArtwork}>Show Another Artwork</button>
        </div>
        <div className="share-buttons">
          <h3>Share this artwork:</h3>
          <FacebookShareButton url={shareUrl} quote={title}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TwitterShareButton url={shareUrl} title={title}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <LinkedinShareButton url={shareUrl} title={title}>
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
          <WhatsappShareButton url={shareUrl} title={title}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
        </div>
      </div>
      ) : (
        <div>No artwork with an image available</div>
      )}
    </div>
  );
};

export default ArtworkDisplay;
