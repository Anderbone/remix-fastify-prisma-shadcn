import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getAllPosts() {
  try {
    const posts = await prisma.post.findMany({
      include: { author: true }
    })
    return posts
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export async function createPostWithUser(username: string, title: string, content: string) {
  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        author: {
          create: {
            name: username
          }
        }
      },
      include: { author: true }
    })
    return newPost
  } catch (error) {
    console.error('Error creating post with user:', error)
    throw error
  }
}
