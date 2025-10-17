import React from "react";

type Props = {
  date: string;
  hour: number;
  isSelected: boolean;
  onClick: (date: string, hour: number) => void;
};

export default function ShiftCell({ date, hour, isSelected, onClick }: Props) {
  return (
    <td
      className={`border h-10 cursor-pointer transition-colors text-center 
        ${isSelected ? "bg-blue-500 text-white" : "hover:bg-blue-50"}`}
      onClick={() => onClick(date, hour)}
    >
      {/* クリックで選択するセル */}
    </td>
  );
}
