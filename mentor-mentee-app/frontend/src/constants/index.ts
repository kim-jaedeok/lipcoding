export const API_BASE_URL = "http://localhost:8080/api";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  PROFILE: "/profile",
  MENTORS: "/mentors",
  REQUESTS: "/requests",
} as const;

export const ROLES = {
  MENTOR: "MENTOR",
  MENTEE: "MENTEE",
} as const;

export const MATCH_REQUEST_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
} as const;

export const LOCAL_STORAGE_KEYS = {
  TOKEN: "auth_token",
  USER: "user_data",
} as const;

export const DEFAULT_IMAGES = {
  MENTOR: "https://placehold.co/500x500.jpg?text=MENTOR",
  MENTEE: "https://placehold.co/500x500.jpg?text=MENTEE",
} as const;

export const MAX_IMAGE_SIZE = 1048576; // 1MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
