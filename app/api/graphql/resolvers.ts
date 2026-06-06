import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";
import { GraphQLError } from "graphql";

interface Context {
  userId?: string;
  role?: string;
}

function requireAuth(ctx: Context) {
  if (!ctx.userId) throw new GraphQLError("Unauthorized", { extensions: { code: "UNAUTHORIZED" } });
}

export const resolvers = {
  Query: {
    students: async (_: unknown, __: unknown, ctx: Context) => {
      requireAuth(ctx);
      return prisma.student.findMany({ orderBy: { createdAt: "desc" } });
    },
    student: async (_: unknown, { id }: { id: string }, ctx: Context) => {
      requireAuth(ctx);
      return prisma.student.findUnique({ where: { id } });
    },
    me: async (_: unknown, __: unknown, ctx: Context) => {
      if (!ctx.userId) return null;
      return prisma.user.findUnique({ where: { id: ctx.userId } });
    },
  },

  Mutation: {
    register: async (_: unknown, { email, password }: { email: string; password: string }) => {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) throw new GraphQLError("Email already in use");
      const hashed = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({ data: { email, password: hashed } });
      const token = signToken({ userId: user.id, email: user.email, role: user.role });
      return { token, user };
    },

    login: async (_: unknown, { email, password }: { email: string; password: string }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new GraphQLError("Invalid credentials");
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new GraphQLError("Invalid credentials");
      const token = signToken({ userId: user.id, email: user.email, role: user.role });
      return { token, user };
    },

    addStudent: async (
      _: unknown,
      args: { name: string; email: string; phone?: string; department: string; year: number },
      ctx: Context
    ) => {
      requireAuth(ctx);
      return prisma.student.create({ data: args });
    },

    updateStudent: async (
      _: unknown,
      { id, ...data }: { id: string; name?: string; email?: string; phone?: string; department?: string; year?: number; profileImage?: string },
      ctx: Context
    ) => {
      requireAuth(ctx);
      return prisma.student.update({ where: { id }, data });
    },

    deleteStudent: async (_: unknown, { id }: { id: string }, ctx: Context) => {
      requireAuth(ctx);
      await prisma.student.delete({ where: { id } });
      return true;
    },

    updateProfileImage: async (
      _: unknown,
      { id, profileImage }: { id: string; profileImage: string },
      ctx: Context
    ) => {
      requireAuth(ctx);
      return prisma.student.update({ where: { id }, data: { profileImage } });
    },
  },
};
