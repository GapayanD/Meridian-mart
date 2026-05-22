import React from 'react';
import { Helmet } from 'react-helmet-async';

interface Props {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
}

const DEFAULTS = {
  title: 'Meridian Mart — Premium Local Marketplace',
  description: 'Shop curated electronics, fashion, home & living, and more. Free shipping on orders over ₱2,000. Cash on delivery available.',
  image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200',
};

export const SEO: React.FC<Props> = ({
  title = DEFAULTS.title,
  description = DEFAULTS.description,
  image = DEFAULTS.image,
  type = 'website',
}) => {
  const fullTitle = title === DEFAULTS.title ? title : `${title} — Meridian Mart`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};
