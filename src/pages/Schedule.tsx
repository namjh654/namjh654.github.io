import { useState } from "react";
import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
import "../styles/Pages/Schedule.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const Schedule = () => {
  const [value, setValue] = useState<Value>(new Date());

  const onChange = (value: Value) => {
    setValue(value);
    console.log("val", value);
  };

  return (
    <div className="container">
      <Calendar onChange={onChange} value={value} />
    </div>
  );
};

export default Schedule;
