import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sanityClient from '../sanityClient';

function About() {
  const [aboutData, setAboutData] = useState(null);
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const typingSpeed = 150; // Typing speed in milliseconds
  const deletingSpeed = 100; // Deleting speed in milliseconds
  const pauseDuration = 2000; // Pause duration at the end of each title

  useEffect(() => {
    sanityClient
      .fetch('*[_type == "about"]{content, "profileImageUrl": profileImage.asset->url, titles}')
      .then((data) => setAboutData(data[0]))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (aboutData && aboutData.titles) {
      let title = aboutData.titles[currentTitleIndex];
      let speed = isDeleting ? deletingSpeed : typingSpeed;

      const handleTyping = setTimeout(() => {
        setDisplayedTitle((prev) =>
          isDeleting ? title.substring(0, prev.length - 1) : title.substring(0, prev.length + 1)
        );

        if (!isDeleting && displayedTitle === title) {
          setIsDeleting(true);
          speed = pauseDuration; // Pause before starting deletion
        } else if (isDeleting && displayedTitle === "") {
          setIsDeleting(false);
          setCurrentTitleIndex((prevIndex) => (prevIndex + 1) % aboutData.titles.length);
          speed = pauseDuration; // Pause before typing the next title
        }
      }, speed);

      return () => clearTimeout(handleTyping);
    }
  }, [aboutData, displayedTitle, isDeleting, currentTitleIndex, typingSpeed, deletingSpeed, pauseDuration]);

  if (!aboutData) return <div className="loading">Loading...</div>;

  return (
    <div className="about">
      <div className="about-content-wrapper">
        <p className="intro">HELLO</p>
        <h1>
          I'm <strong>Ahmad</strong>
          <span className="dynamic-title">[{displayedTitle}]</span>
        </h1>
        <p className="about-content">{aboutData.content}</p>
        <button onClick={() => navigate('/certificates')} className="btn btn-primary">
          Certificates
        </button>
      </div>
      {aboutData.profileImageUrl && (
        <img src={aboutData.profileImageUrl} alt="Profile" className="about-image" />
      )}
    </div>
  );
}

export default About;
