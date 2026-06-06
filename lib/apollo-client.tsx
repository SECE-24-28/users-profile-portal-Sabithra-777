"use client";
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({ uri: "/api/graphql" });

const authLink = setContext((_, { headers }) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  return { headers: { ...headers, authorization: token ? `Bearer ${token}` : "" } };
});

const client = new ApolloClient({ link: authLink.concat(httpLink), cache: new InMemoryCache() });

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
