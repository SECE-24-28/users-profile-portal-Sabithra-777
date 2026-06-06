import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: String!
    email: String!
    role: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Student {
    id: String!
    name: String!
    email: String!
    phone: String
    department: String!
    year: Int!
    profileImage: String
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    students: [Student!]!
    student(id: String!): Student
    me: User
  }

  type Mutation {
    register(email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!

    addStudent(
      name: String!
      email: String!
      phone: String
      department: String!
      year: Int!
    ): Student!

    updateStudent(
      id: String!
      name: String
      email: String
      phone: String
      department: String
      year: Int
      profileImage: String
    ): Student!

    deleteStudent(id: String!): Boolean!

    updateProfileImage(id: String!, profileImage: String!): Student!
  }
`;
