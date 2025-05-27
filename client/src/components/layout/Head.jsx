// src/components/layout/Head.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

const Head = ({ title, description }) => {
  return (
    <Helmet>
      <title>{title ? `${title} | Digibox Chapisha` : 'Digibox Chapisha'}</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
};

export default Head;