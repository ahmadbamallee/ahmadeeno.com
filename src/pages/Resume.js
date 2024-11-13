import React, { useEffect, useState } from 'react';
import sanityClient from '../sanityClient';
import PortableText from '@sanity/block-content-to-react';

function Resume() {
  const [resumeData, setResumeData] = useState([]);
  const [cvUrl, setCvUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false); // Track confirmation popup state

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "resume"]{
        sectionTitle,
        items[]{
          title,
          description,
          location,
          period
        },
        "cvUrl": cvFile.asset->url
      }`)
      .then((data) => {
        setResumeData(data);
        if (data[0]?.cvUrl) setCvUrl(data[0].cvUrl);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadClick = (e) => {
    e.preventDefault(); // Prevent default download action
    setShowConfirm(true); // Show confirmation popup
  };

  const confirmDownload = () => {
    setShowConfirm(false);
    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = 'My_CV.pdf';
    link.click();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="resume">
      <h1>Resume</h1>
      {resumeData.map((section, sectionIndex) => (
        <div key={section.sectionTitle || sectionIndex} className="resume-section">
          <h2 className="section-title">{section.sectionTitle}</h2>
          <div className="resume-items">
            {section.items && section.items.length > 0 ? (
              section.items.map((item, index) => (
                <div key={index} className="resume-item">
                  <h3>{item.title}</h3>
                  {item.period && <p className="period">{item.period}</p>}
                  {item.location && <p className="location">{item.location}</p>}
                  <div className="description">
                    {item.description && <PortableText blocks={item.description} />}
                  </div>
                </div>
              ))
            ) : (
              <p>No items available in this section.</p>
            )}
          </div>
        </div>
      ))}
      {cvUrl && (
        <button onClick={handleDownloadClick} className="cv-download-button">
          Download my CV
        </button>
      )}
      {showConfirm && (
        <div className="confirm-popup">
          <div className="popup-content">
            <p>Are you sure you want to download the CV?</p>
            <button onClick={confirmDownload} className="confirm-button">Yes</button>
            <button onClick={() => setShowConfirm(false)} className="cancel-button">No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Resume;
