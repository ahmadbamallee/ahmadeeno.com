// src/sanityClient.js
import sanityClient from '@sanity/client';

export default sanityClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: process.env.REACT_APP_SANITY_DATASET,
  useCdn: true,
  apiVersion: '2023-01-01',
<<<<<<< HEAD
  token: process.env.REACT_APP_SANITY_TOKEN, // Only needed if you're using a private dataset
=======
  token: process.env.REACT_APP_SANITY_TOKEN
>>>>>>> 9d3f800 (Deploy updated project)
});
