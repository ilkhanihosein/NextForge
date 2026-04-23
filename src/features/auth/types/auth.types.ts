export type AuthRole = "admin" | "user";

/** Minimal identity returned by the sample `/api/auth` routes. */
export type AuthUser = {
  id: number;
  email: string;
  name: string;
  role: AuthRole;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string | null;
  user: AuthUser;
};
