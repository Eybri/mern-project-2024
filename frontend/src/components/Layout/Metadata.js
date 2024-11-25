import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const MetaData = ({ title }) => {
    return (
        <HelmetProvider>
            <Helmet>
                <title>{`${title} - Avyhea Folk Co.`}</title>
            </Helmet>
        </HelmetProvider>
    );
};

export default MetaData;
