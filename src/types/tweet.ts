import User from "./user";

interface Tweet {
  content: string;
  createdAt: Date;
  id: number;
  img: string;
  updatedAt: Date;
  weekend: number;
  User: User;
}

export default Tweet;
