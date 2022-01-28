interface Route {
  path: string;
  name: string;
  meta: {
    isMenu: boolean;
    layout: string;
    requireAuth: boolean;
    icon: string;
    bottom: boolean;
  };

  component: any;
}

export default Route;
