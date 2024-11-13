import React, { useEffect, useState } from 'react';
import sanityClient from '../sanityClient';

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    sanityClient
      .fetch('*[_type == "service"]{serviceName, "iconUrl": icon.image.asset->url}')
      .then((data) => {
        setServices(data);
        setLoading(false); // Set loading to false after fetching data
      })
      .catch(console.error);
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="services">
      <h1>Services</h1>
      <div className="service-list"> {/* Changed to match the CSS class name */}
        {services.map((service) => (
          <div key={service.serviceName} className="service-item">
            {service.iconUrl && (
              <img src={service.iconUrl} alt={`${service.serviceName} icon`} className="service-icon" />
            )}
            <h3>{service.serviceName}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;
