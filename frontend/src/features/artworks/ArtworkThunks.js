// src/features/artworks/artworkThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchArtwork = createAsyncThunk('artwork/fetchArtwork', async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    
    if (!token) {
        return rejectWithValue("Token is missing");
    }

    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    try {
        const response = await api.post('/artworks/fetch', { count: 1 }, config);
        console.log('Artwork fetched:', response.data); // Log the artwork data here
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});


export const fetchArtworkWithImage = createAsyncThunk(
    'artwork/fetchArtworkWithImage',
    async (_, { rejectWithValue }) => {
      try {
        let artwork;
        do {
          const response = await api.post('/artworks/fetch', { count: 1 });
          artwork = response.data[0];
        } while (!artwork || !artwork.image_url);
  
        return artwork;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
);


export const fetchArtworkById = createAsyncThunk(
    'artwork/fetchArtworkById',
    async (artworkId, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        if (!token) {
            return rejectWithValue("Token is missing");
        }

        try {
            const response = await api.get(`/artworks/${artworkId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);



export const likeArtwork = createAsyncThunk(
    'artwork/likeArtwork',
    async (artworkId, { getState, rejectWithValue }) => {
        const token = getState().auth.token;  // Get the token from state
        if (!token) {
            return rejectWithValue("Token is missing");
        }

        try {
            const response = await api.post('/likes', { artwork_id: artworkId }, {
                headers: { Authorization: `Bearer ${token}` }, 
            });
            return response.data;  // Return response data on success
        } catch (error) {
            if (error.response?.data?.message === 'Artwork already liked') {
                return rejectWithValue('Artwork already liked');
            }
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


export const unlikeArtwork = createAsyncThunk(
    'artwork/unlikeArtwork',
    async (artworkId, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        console.log('Unliking artwork with ID:', artworkId);  // Log the artworkId

        if (!token) {
            return rejectWithValue("Token is missing");
        }

        try {
            await api.delete(`/likes/${artworkId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return artworkId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


export const saveArtwork = createAsyncThunk(
    'artwork/saveArtwork',
    async (artworkId, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        if (!token) {
            return rejectWithValue("Token is missing");
        }

        try {
            const response = await api.post('/saved_artworks', { artwork_id: artworkId }, {
                headers: { Authorization: `Bearer ${token}` },  
            });
            return response.data; 
        } catch (error) {
            if (error.response?.data?.message === 'Artwork already saved') {
                return rejectWithValue('Artwork already saved');
            }
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const unsaveArtwork = createAsyncThunk('artwork/unsaveArtwork', async (artworkId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) {
      return rejectWithValue("Token is missing");
    }

    console.log('Sending DELETE request for artwork ID:', artworkId); // Log this

    try {
      await api.delete(`/saved_artworks/${artworkId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return artworkId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
});



export const fetchLikedArtworks = createAsyncThunk('artwork/fetchLikedArtworks', async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) {
        return rejectWithValue("Token is missing");
    }

    try {
        const response = await api.get('/likes', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const fetchSavedArtworks = createAsyncThunk('artwork/fetchSavedArtworks', async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) {
        return rejectWithValue("Token is missing");
    }

    try {
        const response = await api.get('/saved_artworks', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const fetchFilteredArtworks = createAsyncThunk(
    'artwork/fetchFilteredArtworks',
    async (filters = {}, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        if (!token) {
            return rejectWithValue("Token is missing");
        }

        const config = {
            headers: { Authorization: `Bearer ${token}` },
            params: filters
        };

        try {
            const response = await api.get('/artworks', config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    });
    export const fetchAllArtworks = createAsyncThunk(
        'artwork/fetchAllArtworks',
        async ({ page = 1, pageSize = 21 }, { getState, rejectWithValue }) => {
          const token = getState().auth.token;
          if (!token) {
            return rejectWithValue("Token is missing");
          }
      
          const config = {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, pageSize }  
          };
      
          try {
            const response = await api.get('/artworks', config);
            return response.data; 
          } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
          }
        }
      );