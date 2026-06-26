export interface Review {
  _id?: string;

  name: string;
  role: string;
  feedback: string;
  rating: number;
  imgSrc?: string;

  status: "pending" | "approved" | "rejected";

  approvedAt?: Date;
  rejectedAt?: Date;
  createdAt?: Date;
}

