export type ReaderItem = {
  _id: string;
  name: string;
  email: string;
  password: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  bio?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
