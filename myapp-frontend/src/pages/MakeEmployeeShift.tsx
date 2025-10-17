import { usePullStoreInfo } from "@/components/fetch/usePullStoreInfo";
import { useParams } from "react-router-dom";
import ShiftCalendar from "@/components/myUi/ShiftCalendar";

const MakeEmployeeShift = () => {
  const { id } = useParams<{ id: string }>();
  const { stores } = usePullStoreInfo();
  const storeId = Number(id);
  const store = stores.find((s) => s.id === storeId);

  if (!store) return <h1>店舗が見つかりません</h1>;

  return (
    <div>
      <ShiftCalendar store={store} />
    </div>
  );
};

export default MakeEmployeeShift;
