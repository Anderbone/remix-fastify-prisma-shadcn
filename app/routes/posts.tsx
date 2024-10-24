import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import type { Post } from "@prisma/client";
import { getAllPosts } from "~/db/posts";

type LoaderData = {
  posts: Post[];
};

export const loader: LoaderFunction = async () => {
  const posts = await getAllPosts();
  return json({ posts });
};

export default function Index() {
  const { posts } = useLoaderData<LoaderData>();

  return (
    <div>
      <h1>My Blog Posts</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
