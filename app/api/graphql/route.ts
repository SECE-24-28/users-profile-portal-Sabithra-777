import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { verifyToken } from "@/lib/jwt";
import { NextRequest } from "next/server";

const server = new ApolloServer({ typeDefs, resolvers });

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => {
    const auth = req.headers.get("authorization") || "";
    const token = auth.replace("Bearer ", "");
    const payload = token ? verifyToken(token) : null;
    return { userId: payload?.userId, role: payload?.role };
  },
});

export { handler as GET, handler as POST };
