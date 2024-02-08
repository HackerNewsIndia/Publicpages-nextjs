// import React from "react";

// export async function generateMetadata(params) {
//   const { blogspace_id, postId } = params;
//   const response = await fetch(
//     `https://diaryblogapi2.onrender.com/api/companies/${blogspace_id}/posts/${postId}`
//   );
//   const post = await response.json();

//   return {
//     title: post.title,
//     description: post.description,
//     imageUrl: post.imageUrl,
//   };
// }

// export default generateMetadata;

import React from "react";

export const generateMetadata = async (params) => {
  const { blogspace_id, postId } = params;
  const response = await fetch(
    `https://diaryblogapi2.onrender.com/api/companies/${blogspace_id}/posts/${postId}`
  );
  const post = await response.json();

  return {
    title: post.title,
    description: post.description,
    imageUrl: post.imageUrl,
  };
};
