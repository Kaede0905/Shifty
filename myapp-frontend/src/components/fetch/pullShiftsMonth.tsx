import { usePullMonthShifts } from "./usePullMonthShifts";
import dayjs from "dayjs"

export const usePullShiftsMonth = (storeId: number, year: number, month: number) => {
  const startOfMonth = dayjs(`${year}-${month}-01`);
  const endOfMonth = startOfMonth.endOf("month");

  return usePullMonthShifts(storeId, startOfMonth.format("YYYY-MM-DD"), endOfMonth.format("YYYY-MM-DD"));
};
