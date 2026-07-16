import * as React from "react";
import { DateCalendar, PickerDay } from "@mui/x-date-pickers";
import dayjs from "dayjs";

interface CustomDayProps {
  day: any;
  selectedDay: any;
  [key: string]: any;
}

function CustomDay(props: CustomDayProps) {
  const { day, selectedDay, ...other } = props;

  const isSelected =
    selectedDay != null && dayjs(day).isSame(selectedDay, "day");

  return (
    <PickerDay
      {...other}
      day={day}
      onDaySelect={() => {}}
      sx={{
        borderRadius: 1,
        ...(isSelected && {
          backgroundColor: "primary.main",
          color: "white",
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        }),
      }}
    />
  );
}

interface CalendarProps {
  value?: any;
  onChange?: (value: any) => void;
}

export function Calendar({ value, onChange }: CalendarProps) {
  return (
    <DateCalendar
      value={value ?? null}
      onChange={(newValue) => {
        onChange?.(newValue);
      }}
      slots={{
        day: (props: any) => (
          <CustomDay {...props} selectedDay={value ?? null} />
        ),
      }}
    />
  );
}

export default Calendar;
