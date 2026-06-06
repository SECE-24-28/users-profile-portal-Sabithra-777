import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user { id email role }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      token
      user { id email role }
    }
  }
`;

export const GET_STUDENTS = gql`
  query Students {
    students {
      id name email phone department year profileImage createdAt
    }
  }
`;

export const ADD_STUDENT = gql`
  mutation AddStudent($name: String!, $email: String!, $phone: String, $department: String!, $year: Int!) {
    addStudent(name: $name, email: $email, phone: $phone, department: $department, year: $year) {
      id name email phone department year profileImage
    }
  }
`;

export const UPDATE_STUDENT = gql`
  mutation UpdateStudent($id: String!, $name: String, $email: String, $phone: String, $department: String, $year: Int, $profileImage: String) {
    updateStudent(id: $id, name: $name, email: $email, phone: $phone, department: $department, year: $year, profileImage: $profileImage) {
      id name email phone department year profileImage
    }
  }
`;

export const DELETE_STUDENT = gql`
  mutation DeleteStudent($id: String!) {
    deleteStudent(id: $id)
  }
`;

export const UPDATE_PROFILE_IMAGE = gql`
  mutation UpdateProfileImage($id: String!, $profileImage: String!) {
    updateProfileImage(id: $id, profileImage: $profileImage) {
      id profileImage
    }
  }
`;
