export type Bill = {
  id?: string;
  payee: string;
  amount: number;
  category: string;
  deadline: Date;
  userId?: string;
};
