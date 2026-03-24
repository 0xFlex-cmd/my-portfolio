import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getHomelabProjects,
  getHomelabProjectBySlug,
  getHomelabProjectById,
  createHomelabProject,
  updateHomelabProject,
  deleteHomelabProject,
} from "../db";

const homelabProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  technologies: z.string().optional(),
  published: z.boolean().default(false),
  imageUrl: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
});

export const homelabRouter = router({
  // Public procedures
  list: publicProcedure
    .input(z.object({ published: z.boolean().optional() }).optional())
    .query(async ({ input }) => {
      const projects = await getHomelabProjects(input?.published);
      return projects;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const project = await getHomelabProjectBySlug(input.slug);
      if (!project) {
        throw new Error("Homelab project not found");
      }
      return project;
    }),

  // Admin procedures
  create: adminProcedure
    .input(homelabProjectSchema)
    .mutation(async ({ input, ctx }) => {
      const project = await createHomelabProject({
        ...input,
        authorId: ctx.user.id,
      });
      return project;
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        data: homelabProjectSchema.partial(),
      })
    )
    .mutation(async ({ input }) => {
      const project = await getHomelabProjectById(input.id);
      if (!project) {
        throw new Error("Homelab project not found");
      }
      const result = await updateHomelabProject(input.id, input.data);
      return result;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const project = await getHomelabProjectById(input.id);
      if (!project) {
        throw new Error("Homelab project not found");
      }
      const result = await deleteHomelabProject(input.id);
      return result;
    }),

  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const project = await getHomelabProjectById(input.id);
      if (!project) {
        throw new Error("Homelab project not found");
      }
      return project;
    }),
});
