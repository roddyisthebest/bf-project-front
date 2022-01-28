import User from "./user";

interface Penalty {
  User: User;
  UserId: number;
  createdAt: Date;
  id: number;
  paper: number;
  payed: boolean;
  updatedAt: Date;
}

export default Penalty;
