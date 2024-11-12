import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import sanityClient from '../sanityClient';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(sanityClient);
function urlFor(source) {
  return builder.image(source);
}

function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "post" && slug.current == $slug][0]{
          title,
          content,
          coverImage,
          author->{
            name,
            bio,
            "profileImageUrl": profilePicture.asset->url
          }
        }`,
        { slug }
      )
      .then((data) => {
        setPost(data);
        setLoading(false); // Set loading to false after fetching data
      })
      .catch(console.error);
  }, [slug]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="blog-post-detail">
      <div className="post-content">
        {post.coverImage && (
          <img src={urlFor(post.coverImage).width(400).url()} alt={post.title} className="cover-image" />
        )}
        <div className="content-wrapper">
          <h1>{post.title}</h1>
          <div className="author-info">
            {post.author.profileImageUrl && (
              <img
                src={post.author.profileImageUrl}
                alt={post.author.name}
                className="author-icon"
              />
            )}
            <p>By {post.author.name}</p>
          </div>
          <div className="content">
            {post.content.map((block, index) => (
              <p key={index}>{block.children[0].text}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPost;
