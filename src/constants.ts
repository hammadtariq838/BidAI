export const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5000'
    : 'https://api.bidai.strux.ai';

export const USERS_URL = `${BASE_URL}/api/users`;
export const TENDERS_URL = `${BASE_URL}/api/tenders`;

export type BidGenerationOrder =
  | 'highest'
  | 'lowest'
  | 'average';
