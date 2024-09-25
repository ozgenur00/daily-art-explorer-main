// src/components/FlashMessage.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearFlashMessage } from '../../features/artworks/ArtworkSlice';
import '../../styles/layout/FlashMessage.css';

const FlashMessage = () => {
    const message = useSelector((state) => state.artwork.flashMessage);
    const dispatch = useDispatch();

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                dispatch(clearFlashMessage());
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [message, dispatch])

    if (!message) return null;

    return (
        <div className="flash-message-container">
            <div className="flash-message">
                <p className="flash-message-text">{message}</p>
            </div>
        </div>
    )
}

export default FlashMessage;