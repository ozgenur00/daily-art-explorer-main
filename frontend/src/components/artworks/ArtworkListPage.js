import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllArtworks } from '../../features/artworks/ArtworkThunks';
import '../../styles/artworks/ArtworkListPage.css';
import Spinner from '../common/Spinner';
import ArtworkCard from '../artworks/ArtworkCard';

const ArtworkListPage = () => {
    const dispatch = useDispatch();
    const artworks = useSelector((state) => state.artwork.artworks);
    const status = useSelector((state) => state.artwork.status);
    const error = useSelector((state) => state.artwork.error);
    const currentPage = useSelector((state) => state.artwork.currentPage); 
    const totalPages = useSelector((state) => state.artwork.totalPages); 
    const pageSize = 21; 

    const [query, setQuery] = useState('');
    const [filteredArtworks, setFilteredArtworks] = useState([]);

    useEffect(() => {
        dispatch(fetchAllArtworks({ page: currentPage, pageSize }));
    }, [dispatch, currentPage, pageSize]);

    useEffect(() => {
        const filtered = artworks.filter(artwork =>
            artwork.title.toLowerCase().includes(query.toLowerCase()) ||
            artwork.artist.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredArtworks(filtered);
    }, [artworks, query]);

    const handleSearchChange = (e) => {
        setQuery(e.target.value);
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            dispatch(fetchAllArtworks({ page: newPage, pageSize }));
        }
    };

    if (status === 'loading') return <Spinner />;
    if (status === 'failed') return <div>Error: {error}</div>;

    return (
        <div className="artwork-list-page">
            <input
                type="text"
                placeholder="Search artworks..."
                value={query}
                onChange={handleSearchChange}
                className="filter-input"
            />
            <div className="artwork-grid">
                {filteredArtworks.length > 0 ? (
                    filteredArtworks.map((artwork) => (
                        <ArtworkCard key={artwork.id} artwork={artwork} />
                    ))
                ) : (
                    <p>No artworks available.</p>
                )}
            </div>

            <div className="pagination-controls">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};


export default ArtworkListPage;
