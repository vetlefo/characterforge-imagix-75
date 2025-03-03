
import React from 'react';
import WebsitePreview from '../components/preview/WebsitePreview';

// Add a placeholder implementation to satisfy TypeScript
interface WebsitePreviewProps {
  html: string;
}

const Website = () => {
  return <WebsitePreview html="<h1>Website Preview</h1>" />;
};

export default Website;
