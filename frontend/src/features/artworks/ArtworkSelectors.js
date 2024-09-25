export const selectArtworks = (state) => state.artwork.artworks;
export const selectCurrentPage = (state) => state.artwork.currentPage;
export const selectTotalPages = (state) => state.artwork.totalPages;
export const selectArtworkStatus = (state) => state.artwork.status;
export const selectArtworkError = (state) => state.artwork.error;
export const selectFlashMessage = (state) => state.artwork.flashMessage;
export const selectLikedArtworks = (state) => state.artwork.likedArtworks || [];
