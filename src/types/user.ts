import Pray from "./pray";
interface User {
  id: number;
  name: string;
  img: string;
  provider: string;
  Prays: Pray[];
}

export default User;
