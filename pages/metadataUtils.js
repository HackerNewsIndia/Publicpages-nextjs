export async function generateMetadata(params) {
  const { blogspace_id, postId } = params;
  const response = await fetch(
    `https://diaryblogapi2.onrender.com/api/companies/${blogspace_id}/posts/${postId}`
  );
  const post = await response.json();

  return {
    title: post.title,
    description: post.description,
    ogImage: {
      url: post.imageUrl,
    },
  };
}
