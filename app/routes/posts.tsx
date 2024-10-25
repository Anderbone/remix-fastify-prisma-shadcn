import { json, ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import { getAllPosts, createPostWithUser } from "~/db/posts";
import type { Post, User } from "@prisma/client";

type LoaderData = {
  posts: (Post & { author: User })[];
};

export const loader: LoaderFunction = async () => {
  const posts = await getAllPosts();
  return json({ posts });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!username || !title || !content) {
    return json({ error: "All fields are required" }, { status: 400 });
  }

  try {
    await createPostWithUser(username, title, content);
    return json({ success: true });
  } catch (error) {
    return json({ error: "Failed to create post and user" }, { status: 500 });
  }
};

export default function Posts() {
  const { posts } = useLoaderData<LoaderData>();
  const actionData = useActionData();

  return (
    <div>
      <h1>Create a New Post</h1>
      <Form method="post">
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div>
          <label htmlFor="title">Post Title:</label>
          <input type="text" id="title" name="title" required />
        </div>
        <div>
          <label htmlFor="content">Post Content:</label>
          <textarea id="content" name="content" required></textarea>
        </div>
        <button type="submit">Create Post</button>
      </Form>

      <h2>All Posts</h2>
      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>By: {post.author.name}</p>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
