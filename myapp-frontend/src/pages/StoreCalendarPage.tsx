import { useParams } from "react-router-dom";
import { MonthCalendar } from "./MonthCalendar";
import { usePullStoreInfo } from "@/components/fetch/usePullStoreInfo";

export const StoreCalendarPage = () => {
  const { id } = useParams<{ id: string }>();
  const { stores} = usePullStoreInfo(); // ← loading, error も使う想定
  const storeId = Number(id);
  const store = stores.find((s) => s.id === storeId);
  const storeName = store?.name;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  return (
    <div className="p-4">
      <MonthCalendar
        storeId={storeId}
        storeName={storeName!}
        year={year}
        month={month}
      />
    </div>
  );
};
