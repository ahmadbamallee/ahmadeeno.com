import React, { useEffect, useState } from 'react';
import sanityClient from '../sanityClient';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(sanityClient);
function urlFor(source) {
  return builder.image(source);
}

function Certificates() {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "certificate"]{
        title,
        description,
        "imageUrl": certificateImage.asset->url
      }`)
      .then((data) => setCertificates(data))
      .catch(console.error);
  }, []);

  return (
    <div className="certificates">
      <h1>Certificates</h1>
      <div className="certificate-list">
        {certificates.map((certificate, index) => (
          <div key={index} className="certificate-card">
            {certificate.imageUrl && (
              <img
                src={urlFor(certificate.imageUrl).width(200).url()}
                alt={certificate.title}
                className="certificate-image"
              />
            )}
            <h2 className="certificate-title">{certificate.title}</h2> {/* Ensure this is correct */}
            <p className="certificate-description">{certificate.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Certificates;
