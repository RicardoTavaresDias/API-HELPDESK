export type UserTokenReturn = {
  user: {
    id: string;
    name: string;
    role: string;
  };
  token: string;
};
