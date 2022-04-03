export type Bill = {
  id: string;
  payee: string;
  amount: number;
  deadline: Date;
  userId?: string;
  category?: string;
  completedDate?: Date | null;
};
