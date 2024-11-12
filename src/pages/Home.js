import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import sanityClient from '../sanityClient';
import imageUrlBuilder from '@sanity/image-url';

// Set up the image builder
const builder = imageUrlBuilder(sanityClient);
function urlFor(source) {
  return builder.image(source);
}

function Home() {
  const [homeData, setHomeData] = useState(null);
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const typingSpeed = 150;
  const deletingSpeed = 100;
  const pauseDuration = 2000;

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "home"][0]{ heroImage, titles, intro, name }`)
      .then((data) => setHomeData(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (homeData && homeData.titles) {
      let title = homeData.titles[currentTitleIndex];
      let speed = isDeleting ? deletingSpeed : typingSpeed;

      const handleTyping = setTimeout(() => {
        setDisplayedTitle((prev) =>
          isDeleting ? title.substring(0, prev.length - 1) : title.substring(0, prev.length + 1)
        );

        if (!isDeleting && displayedTitle === title) {
          setIsDeleting(true);
          speed = pauseDuration;
        } else if (isDeleting && displayedTitle === "") {
          setIsDeleting(false);
          setCurrentTitleIndex((prevIndex) => (prevIndex + 1) % homeData.titles.length);
          speed = pauseDuration;
        }
      }, speed);

      return () => clearTimeout(handleTyping);
    }
  }, [homeData, displayedTitle, isDeleting, currentTitleIndex, typingSpeed, deletingSpeed, pauseDuration]);

  if (!homeData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      <div className="home-content">
        <p className="intro">{homeData.intro}</p>
        <h1>
          I'm <strong>{homeData.name}</strong>
        </h1>
        <h2 className="dynamic-title">{displayedTitle}</h2> {/* Display dynamic title below */}
        <div className="buttons">
          <Link to="/skills" className="btn btn-primary">Skills</Link>
          <Link to="/resume" className="btn btn-outline">Resume</Link>
        </div>
      </div>
      {homeData.heroImage && (
        <img 
          src={urlFor(homeData.heroImage).width(200).url()} 
          alt="Profile" 
          className="profile-image" 
        />
      )}
    </div>
  );
}

export default Home;
