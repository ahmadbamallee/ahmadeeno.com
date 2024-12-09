import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import sanityClient from '../sanityClient';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(sanityClient);
function urlFor(source) {
  return builder.image(source);
}

function Home() {
  const [homeData, setHomeData] = useState(null);
  const [trendingPost, setTrendingPost] = useState(null);
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

    sanityClient
      .fetch(`*[_type == "trendingOnSite"][0]{
        title,
        slug,
        _createdAt,
        author-> { name, "imageUrl": profilePicture.asset->url }
      }`)
      .then((data) => setTrendingPost(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (homeData && homeData.titles) {
      const title = homeData.titles[currentTitleIndex];
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
    <div className="app-wrapper">
      {/* Home Section */}
      <div className="home">
        <div className="home-content">
          <p className="intro">{homeData.intro}</p>
          <h1>
            I'm <strong>{homeData.name}</strong>
          </h1>
          <h2 className="dynamic-title">{displayedTitle}</h2>
          <div className="buttons">
            <Link to="/certificates" className="btn btn-primary">Certificates</Link>
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

      {/* Trending on Site Section */}
      {trendingPost && (
        <section className="trending-site-section">
          <h2>Trending on Site</h2>
          <div className="trending-content">
            <h3>{trendingPost.title}</h3>
            <div className="author-info">
              {trendingPost.author.imageUrl && (
                <img
                  src={urlFor(trendingPost.author.imageUrl).width(50).url()}
                  alt={trendingPost.author.name}
                  className="author-icon"
                />
              )}
              <p>By {trendingPost.author.name} • {new Date(trendingPost._createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
