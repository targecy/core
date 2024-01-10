import { useField } from 'formik';
import React from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // @todo(kevin): we want to match its styles with our theme, right?

type DatePickerProps = Omit<ReactDatePickerProps, 'onChange'> & {
  name: string;
  className?: string;
  onChange?: ReactDatePickerProps['onChange'];
};

const DatePicker: React.FC<DatePickerProps> = ({ name, className, onChange, ...props }) => {
  const [field, , helpers] = useField(name);

  const handleChange = (date: Date | null, event: React.SyntheticEvent<any> | undefined) => {
    onChange && onChange(date, event);
    void helpers.setValue(date);
  };

  return (
    <ReactDatePicker
      {...field}
      {...props}
      selected={(field.value && new Date(field.value)) || null}
      onChange={handleChange}
      className={className}
      wrapperClassName="w-full"
    />
  );
};

export default React.memo(DatePicker);
