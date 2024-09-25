// src/components/Metadata.js
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const Metadata = ({ title, description, image, url }) => {
    useEffect(() => {
        document.title = title || 'Daily Art Explorer';
    }, [title]);

    return (
        <Helmet>
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
        </Helmet>
    );
};

export default Metadata;
