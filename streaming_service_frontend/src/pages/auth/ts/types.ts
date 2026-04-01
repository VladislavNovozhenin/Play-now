export type RegisterRequest = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type JwtResponse = {
  access_token: string;
};
