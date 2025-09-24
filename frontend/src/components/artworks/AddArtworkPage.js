import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddArtworkPage = () => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [period, setPeriod] = useState('');
  const [medium, setMedium] = useState('');
  const [location, setLocation] = useState('');
  const [metUrl, setMetUrl] = useState('');
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('artist', artist);
      formData.append('period', period);
      formData.append('medium', medium);
      formData.append('location', location);
      formData.append('metUrl', metUrl);
      if (image) {
        formData.append('image', image); // Multer backend için field adı "image"
      }

      await axios.post('http://localhost:4000/api/artworks', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // login sonrası token varsa
        },
      });

      alert('Artwork başarıyla eklendi!');
      navigate('/artworks'); // browse sayfasına geri dön
    } catch (err) {
      console.error('Error uploading artwork:', err);
      alert('Bir hata oluştu!');
    }
  };

  return (
    <div className="add-artwork-page">
      <h2>Add New Artwork</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
        <input
          type="text"
          placeholder="Period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        />
        <input
          type="text"
          placeholder="Medium"
          value={medium}
          onChange={(e) => setMedium(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Met URL"
          value={metUrl}
          onChange={(e) => setMetUrl(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit">Upload Artwork</button>
      </form>
    </div>
  );
};

export default AddArtworkPage;
