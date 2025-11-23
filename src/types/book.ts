// types/book.ts
export interface Owner {
  _id: string;
  name: string;
  email: string;
  location?: any;
}

export interface BookItem {
  _id: string;
  title: string;
  author: string;
  category: string;
  condition: string;
  price: number;
  location: {
    type: string;
    coordinates: number[];
  };
  owner: Owner | string; // owner can be object or string
  image: string;
  description: string;
  available: boolean;
  isApproved: boolean;
  approvalStatus: string;
  approvedBy: string;
  approvedAt: string;
  isFeatured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
}