export type Tender = {
  _id: string;
  tender_id: string;
  description: string;
  county: string[];
  project_type: string[];
  department: string;
  budget: number;
  bidders: {
    name: string;
    quote: number;
  }[];
  items: {
    ref_no: number;
    item: string;
    item_description: string;
    item_qnty: number;
    units: string;
    bids: (number | null)[];
  }[];
};

export type User = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
  isActive: boolean;
};
