import { describe, expect, it, beforeEach, vi } from "vitest";
import { homelabRouter } from "./homelab";
import * as db from "../db";
import type { TrpcContext } from "../_core/context";

// Mock the database module
vi.mock("../db", () => ({
  getHomelabProjects: vi.fn(),
  getHomelabProjectBySlug: vi.fn(),
  getHomelabProjectById: vi.fn(),
  createHomelabProject: vi.fn(),
  updateHomelabProject: vi.fn(),
  deleteHomelabProject: vi.fn(),
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

describe("homelab router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("list", () => {
    it("should return all published homelab projects", async () => {
      const mockProjects = [
        {
          id: 1,
          title: "Test Project",
          slug: "test-project",
          description: "Test description",
          content: "Test content",
          technologies: "Docker, Kubernetes",
          authorId: 1,
          published: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.getHomelabProjects).mockResolvedValue(mockProjects);

      const caller = homelabRouter.createCaller({} as TrpcContext);
      const result = await caller.list({ published: true });

      expect(result).toEqual(mockProjects);
      expect(db.getHomelabProjects).toHaveBeenCalledWith(true);
    });
  });

  describe("getBySlug", () => {
    it("should return a homelab project by slug", async () => {
      const mockProject = {
        id: 1,
        title: "Test Project",
        slug: "test-project",
        description: "Test description",
        content: "Test content",
        technologies: "Docker, Kubernetes",
        authorId: 1,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.getHomelabProjectBySlug).mockResolvedValue(mockProject);

      const caller = homelabRouter.createCaller({} as TrpcContext);
      const result = await caller.getBySlug({ slug: "test-project" });

      expect(result).toEqual(mockProject);
      expect(db.getHomelabProjectBySlug).toHaveBeenCalledWith("test-project");
    });

    it("should throw error if project not found", async () => {
      vi.mocked(db.getHomelabProjectBySlug).mockResolvedValue(undefined);

      const caller = homelabRouter.createCaller({} as TrpcContext);

      await expect(
        caller.getBySlug({ slug: "nonexistent" })
      ).rejects.toThrow("Homelab project not found");
    });
  });

  describe("create", () => {
    it("should create a new homelab project", async () => {
      const ctx = createAdminContext();
      const mockResult = { insertId: 1 };

      vi.mocked(db.createHomelabProject).mockResolvedValue(mockResult as any);

      const caller = homelabRouter.createCaller(ctx);
      const result = await caller.create({
        title: "New Project",
        slug: "new-project",
        description: "New description",
        content: "New content",
        technologies: "Docker",
        published: false,
      });

      expect(result).toEqual(mockResult);
      expect(db.createHomelabProject).toHaveBeenCalledWith({
        title: "New Project",
        slug: "new-project",
        description: "New description",
        content: "New content",
        technologies: "Docker",
        published: false,
        authorId: 1,
      });
    });
  });

  describe("update", () => {
    it("should update a homelab project", async () => {
      const ctx = createAdminContext();
      const mockProject = {
        id: 1,
        title: "Test Project",
        slug: "test-project",
        description: "Test description",
        content: "Test content",
        technologies: "Docker, Kubernetes",
        authorId: 1,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.getHomelabProjectById).mockResolvedValue(mockProject);
      vi.mocked(db.updateHomelabProject).mockResolvedValue({ affectedRows: 1 } as any);

      const caller = homelabRouter.createCaller(ctx);
      const result = await caller.update({
        id: 1,
        data: {
          title: "Updated Project",
          slug: "updated-project",
          content: "Updated content",
        },
      });

      expect(result).toEqual({ affectedRows: 1 });
      expect(db.updateHomelabProject).toHaveBeenCalled();
      const callArgs = vi.mocked(db.updateHomelabProject).mock.calls[0];
      expect(callArgs[0]).toBe(1);
      expect(callArgs[1]).toMatchObject({
        title: "Updated Project",
        slug: "updated-project",
        content: "Updated content",
      });
    });
  });

  describe("delete", () => {
    it("should delete a homelab project", async () => {
      const ctx = createAdminContext();
      const mockProject = {
        id: 1,
        title: "Test Project",
        slug: "test-project",
        description: "Test description",
        content: "Test content",
        technologies: "Docker, Kubernetes",
        authorId: 1,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.getHomelabProjectById).mockResolvedValue(mockProject);
      vi.mocked(db.deleteHomelabProject).mockResolvedValue({ affectedRows: 1 } as any);

      const caller = homelabRouter.createCaller(ctx);
      const result = await caller.delete({ id: 1 });

      expect(result).toEqual({ affectedRows: 1 });
      expect(db.deleteHomelabProject).toHaveBeenCalledWith(1);
    });
  });
});
