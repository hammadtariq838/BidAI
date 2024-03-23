import { Tender, User } from './primitive.type';

export type BaseResponse = {
  success: boolean;
  message: string;
};

export type UserResponse = BaseResponse & {
  account: User;
};

export type UsersResponse = BaseResponse & {
  accounts: User[];
};

export type TendersResponse = BaseResponse & {
  tenders: Tender[];
};

export type TenderByIdResponse = BaseResponse & {
  tender: Tender;
};

export type SearchByPayItemResponse = BaseResponse & {
  items: Tender['items'];
};

export type CountiesResponse = BaseResponse & {
  counties: string[];
};

export type TenderTypesResponse = BaseResponse & {
  tenderTypes: string[];
};

export type BiddersResponse = BaseResponse & {
  bidders: {
    name: string;
    quote: number;
  }[];
};
