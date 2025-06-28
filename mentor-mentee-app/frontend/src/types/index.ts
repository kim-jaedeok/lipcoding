export interface User {
  id: number;
  email: string;
  name: string;
  fullName: string;
  role: "MENTOR" | "MENTEE";
  bio?: string;
  skills?: string[];
  hasImage?: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  role: "mentor" | "mentee";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  name: string;
  bio?: string;
  image?: string; // Base64 encoded
  skills?: string[]; // For mentors only
}

export interface Mentor {
  id: number;
  name: string;
  bio: string;
  skills: string[];
  hasImage: boolean;
  imageUrl: string;
  createdAt: string;
}

export interface MatchRequest {
  id: number;
  message: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
  createdAt: string;
  mentorId: number;
  menteeId: number;
  mentorName?: string;
  menteeName?: string;
  mentor?: Mentor;
  mentee?: {
    id: number;
    name: string;
    bio: string;
    hasImage: boolean;
    imageUrl: string;
  };
}

export interface CreateMatchRequestRequest {
  mentorId: number;
  menteeId?: number; // Optional since it will be added automatically
  message: string;
}

export interface ApiError {
  error: string;
  details?: unknown;
}
