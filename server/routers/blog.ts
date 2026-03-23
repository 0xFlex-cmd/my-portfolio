import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getBlogPosts,
  getBlogPostBySlug,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "../db";

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  published: z.boolean().default(false),
});

export const blogRouter = router({
  // Public procedures
  list: publicProcedure
    .input(z.object({ published: z.boolean().optional() }).optional())
    .query(async ({ input }) => {
      const posts = await getBlogPosts(input?.published);
      return posts;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const post = await getBlogPostBySlug(input.slug);
      if (!post) {
        throw new Error("Blog post not found");
      }
      return post;
    }),

  // Admin procedures
  create: adminProcedure
    .input(blogPostSchema)
    .mutation(async ({ input, ctx }) => {
      const post = await createBlogPost({
        ...input,
        authorId: ctx.user.id,
      });
      return post;
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        data: blogPostSchema.partial(),
      })
    )
    .mutation(async ({ input }) => {
      const post = await getBlogPostById(input.id);
      if (!post) {
        throw new Error("Blog post not found");
      }
      const result = await updateBlogPost(input.id, input.data);
      return result;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const post = await getBlogPostById(input.id);
      if (!post) {
        throw new Error("Blog post not found");
      }
      const result = await deleteBlogPost(input.id);
      return result;
    }),

  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const post = await getBlogPostById(input.id);
      if (!post) {
        throw new Error("Blog post not found");
      }
      return post;
    }),
});
