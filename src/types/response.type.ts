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

// excluded the items field from the Tender type
export type TendersResponse = BaseResponse & {
  tenders: Omit<Tender, 'items'>[];
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

export type SummaryResponse = BaseResponse & {
  summary: {
    totalProjects: number;
    totalBidTypes: number;
    totalContractors: number;
    totalCounties: number;
    budgetStats: {
      min: number;
      max: number;
      mean: number;
    };
    countyTenderCounts: {
      county: string;
      count: number;
    }[];
  };
};
