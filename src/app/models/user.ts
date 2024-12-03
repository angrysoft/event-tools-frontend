interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  authority: string;
  coordinator: boolean;
  worker: boolean;
  groupOwner: boolean;
}

export { User };
