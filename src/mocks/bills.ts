import dayjs from "dayjs";
import { Bill } from "../models/Bill";

export const singleBill: Bill[] = [{payee: "hehe", amount: 121.22, deadline: dayjs(), reminder: dayjs().add(1, 'day')}];
