export type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
};

export type LoginUserRequest = {
  email: string;
  password: string;
};

export type GetTendersRequest = {
  county?: string;
  tender_type?: string;
  bidder?: string;
  budget_min?: string;
  budget_max?: string;
};

export type GetTenderByIdRequest = {
  id: string;
  pay_item?: string;
};
