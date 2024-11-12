import React, { useEffect, useState } from 'react';
import sanityClient from '../sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import { Link } from 'react-router-dom';

const POSTS_PER_PAGE = 5; // Define the number of posts per page

const builder = imageUrlBuilder(sanityClient);
function urlFor(source) {
  return builder.image(source);
}

function Blog() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "post"]{
        title,
        slug,
        content,
        coverImage,
        author->{
          name,
          "imageUrl": profilePicture.asset->url
        }
      }`)
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  // Calculate the current posts to display based on the page
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Calculate the total number of pages
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="blog">
      <h1>Blog</h1>
      <div className="blog-list">
        {currentPosts.map((post) => (
          <div key={post.slug.current} className="blog-post">
            <img
              src={urlFor(post.coverImage).width(200).url()}
              alt={post.title}
              className="post-cover-image"
            />
            <div className="blog-content">
              <h2>{post.title}</h2>
              <div className="author-info">
                {post.author.imageUrl && (
                  <img
                    src={post.author.imageUrl}
                    alt={post.author.name}
                    className="author-icon"
                  />
                )}
                <p>By {post.author.name}</p>
              </div>
              <p>{post.content[0]?.children[0]?.text.slice(0, 100)}...</p>
              <Link to={`/blog/${post.slug.current}`} className="read-more-button">
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Blog;
