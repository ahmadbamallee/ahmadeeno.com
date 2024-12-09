import React, { useEffect, useState } from 'react';
import sanityClient from '../sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import BlockContent from '@sanity/block-content-to-react';

const builder = imageUrlBuilder(sanityClient);
function urlFor(source) {
  return builder.image(source);
}

function About() {
  const [aboutData, setAboutData] = useState(null);
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const typingSpeed = 150;
  const deletingSpeed = 100;
  const pauseDuration = 2000;

  useEffect(() => {
    sanityClient
      .fetch('*[_type == "about"][0]{content, profileImage, titles}')
      .then((data) => setAboutData(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (aboutData && aboutData.titles) {
      const title = aboutData.titles[currentTitleIndex];
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
          setCurrentTitleIndex((prevIndex) => (prevIndex + 1) % aboutData.titles.length);
          speed = pauseDuration;
        }
      }, speed);

      return () => clearTimeout(handleTyping);
    }
  }, [aboutData, displayedTitle, isDeleting, currentTitleIndex]);

  if (!aboutData) return <div className="loading">Loading...</div>;

  return (
    <div className="about">
      <div className="about-content-wrapper">
        <p className="intro">HELLO</p>
        <h1>
          I'm <strong>Ahmad</strong>
          <span className="dynamic-title">{displayedTitle}</span>
        </h1>
        <div className="about-content">
          {aboutData.content && (
            <BlockContent 
              blocks={aboutData.content}
              projectId={sanityClient.config().projectId}
              dataset={sanityClient.config().dataset}
            />
          )}
        </div>
      </div>
      {aboutData.profileImage && (
        <img 
          src={urlFor(aboutData.profileImage)
            .width(220)
            .quality(100)
            .url()} 
          alt="Profile" 
          className="about-image" 
        />
      )}
    </div>
  );
}

export default About;
