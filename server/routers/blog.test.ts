import { describe, expect, it, beforeEach, vi } from "vitest";
import { blogRouter } from "./blog";
import * as db from "../db";
import type { TrpcContext } from "../_core/context";

// Mock the database module
vi.mock("../db", () => ({
  getBlogPosts: vi.fn(),
  getBlogPostBySlug: vi.fn(),
  getBlogPostById: vi.fn(),
  createBlogPost: vi.fn(),
  updateBlogPost: vi.fn(),
  deleteBlogPost: vi.fn(),
}));

type AdminUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AdminUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };

  return ctx;
}

describe("blog router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("list", () => {
    it("should return all published blog posts", async () => {
      const mockPosts = [
        {
          id: 1,
          title: "Test Post",
          slug: "test-post",
          content: "Test content",
          excerpt: "Test excerpt",
          authorId: 1,
          published: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.getBlogPosts).mockResolvedValue(mockPosts);

      const caller = blogRouter.createCaller({} as TrpcContext);
      const result = await caller.list({ published: true });

      expect(result).toEqual(mockPosts);
      expect(db.getBlogPosts).toHaveBeenCalledWith(true);
    });
  });

  describe("getBySlug", () => {
    it("should return a blog post by slug", async () => {
      const mockPost = {
        id: 1,
        title: "Test Post",
        slug: "test-post",
        content: "Test content",
        excerpt: "Test excerpt",
        authorId: 1,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.getBlogPostBySlug).mockResolvedValue(mockPost);

      const caller = blogRouter.createCaller({} as TrpcContext);
      const result = await caller.getBySlug({ slug: "test-post" });

      expect(result).toEqual(mockPost);
      expect(db.getBlogPostBySlug).toHaveBeenCalledWith("test-post");
    });

    it("should throw error if post not found", async () => {
      vi.mocked(db.getBlogPostBySlug).mockResolvedValue(undefined);

      const caller = blogRouter.createCaller({} as TrpcContext);

      await expect(caller.getBySlug({ slug: "nonexistent" })).rejects.toThrow(
        "Blog post not found"
      );
    });
  });

  describe("create", () => {
    it("should create a new blog post", async () => {
      const ctx = createAdminContext();
      const mockResult = { insertId: 1 };

      vi.mocked(db.createBlogPost).mockResolvedValue(mockResult as any);

      const caller = blogRouter.createCaller(ctx);
      const result = await caller.create({
        title: "New Post",
        slug: "new-post",
        content: "New content",
        excerpt: "New excerpt",
        published: false,
      });

      expect(result).toEqual(mockResult);
      expect(db.createBlogPost).toHaveBeenCalledWith({
        title: "New Post",
        slug: "new-post",
        content: "New content",
        excerpt: "New excerpt",
        published: false,
        authorId: 1,
      });
    });
  });

  describe("update", () => {
    it("should update a blog post", async () => {
      const ctx = createAdminContext();
      const mockPost = {
        id: 1,
        title: "Test Post",
        slug: "test-post",
        content: "Test content",
        excerpt: "Test excerpt",
        authorId: 1,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.getBlogPostById).mockResolvedValue(mockPost);
      vi.mocked(db.updateBlogPost).mockResolvedValue({ affectedRows: 1 } as any);

      const caller = blogRouter.createCaller(ctx);
      const result = await caller.update({
        id: 1,
        data: {
          title: "Updated Post",
          slug: "updated-post",
          content: "Updated content",
        },
      });

      expect(result).toEqual({ affectedRows: 1 });
      expect(db.updateBlogPost).toHaveBeenCalled();
      const callArgs = vi.mocked(db.updateBlogPost).mock.calls[0];
      expect(callArgs[0]).toBe(1);
      expect(callArgs[1]).toMatchObject({
        title: "Updated Post",
        slug: "updated-post",
        content: "Updated content",
      });
    });
  });

  describe("delete", () => {
    it("should delete a blog post", async () => {
      const ctx = createAdminContext();
      const mockPost = {
        id: 1,
        title: "Test Post",
        slug: "test-post",
        content: "Test content",
        excerpt: "Test excerpt",
        authorId: 1,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.getBlogPostById).mockResolvedValue(mockPost);
      vi.mocked(db.deleteBlogPost).mockResolvedValue({ affectedRows: 1 } as any);

      const caller = blogRouter.createCaller(ctx);
      const result = await caller.delete({ id: 1 });

      expect(result).toEqual({ affectedRows: 1 });
      expect(db.deleteBlogPost).toHaveBeenCalledWith(1);
    });
  });
});
