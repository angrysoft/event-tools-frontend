interface User {
  username: string;
  authorities: Authority[];
}

interface Authority {
  authority: string;
}

export { User };
