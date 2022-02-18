import Pray from "./pray";
interface User {
  id: number;
  name: string;
  img: string;
  provider: string;
  createdAt: Date;
  Prays: Pray[];
  userId: string;
  Followers: [];
  Followings: User[];
  background: string;
}

export default User;
