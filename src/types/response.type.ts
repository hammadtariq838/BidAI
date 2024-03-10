export type BaseResponse = {
  success: boolean;
  message: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
  isActive: boolean;
};

export type UserResponse = BaseResponse & {
  account: User;
};
