interface Doc {
  name: string;
  expire: Date;
  file: File | null;
  expirationDate: boolean;
  workerId: number;
}

interface DocForm {}

export { Doc, DocForm };
