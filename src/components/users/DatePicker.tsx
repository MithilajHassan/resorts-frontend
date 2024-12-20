import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import { DateRange } from "react-day-picker";

interface MyDatePickerProps {
  setCheckIn: (date: Date | undefined) => void;
  setCheckOut: (date: Date | undefined) => void;
}

function MyDatePicker({ setCheckIn, setCheckOut }: MyDatePickerProps) {
  const [range, setRange] = useState<DateRange | undefined>(undefined);


  const handleSelect = (selectedRange: DateRange | undefined) => {
    if (selectedRange?.from) {
      const fromDate = selectedRange.from;
      let toDate = selectedRange.to;

      if (toDate && fromDate) {
        const minToDate = new Date(fromDate);
        minToDate.setDate(minToDate.getDate() + 1)

        if (toDate < minToDate) {
          toDate = minToDate;
        }
      }

      setRange({ from: fromDate, to: toDate });
      setCheckIn(fromDate);
      setCheckOut(toDate);
    }
  }

  return (
    <div className="">
      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        numberOfMonths={2}
        disabled={{ before: new Date() }}
      />
    </div>
  );
}

export default MyDatePicker;