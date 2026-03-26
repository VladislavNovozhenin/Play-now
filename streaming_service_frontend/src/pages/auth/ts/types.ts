export type RegisterDto = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type LoginDto = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
};
