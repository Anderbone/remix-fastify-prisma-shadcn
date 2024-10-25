import { json, ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import { getAllPosts, createPostWithUser } from "~/db/posts";
import type { Post, User } from "@prisma/client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription } from "~/components/ui/alert";

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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Create a New Post</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="post" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input type="text" id="username" name="username" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Post Title</Label>
              <Input type="text" id="title" name="title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Post Content</Label>
              <Textarea id="content" name="content" required />
            </div>
            <Button type="submit">Create Post</Button>
          </Form>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">All Posts</h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-2">
                By: {post.author.name}
              </p>
              <p>{post.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
