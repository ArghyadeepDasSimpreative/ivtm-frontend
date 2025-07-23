import { useState, useEffect } from 'react';
import Select from 'react-select';

const CustomSelect = ({
  data,
  config,
  label,
  onSelect,
  defaultValue,
  width = "300px",
  isMulti = false,
}) => {
  const options = data.map((item) => ({
    value: item[config.key],
    label: item[config.label],
  }));

  const [selectedValue, setSelectedValue] = useState(defaultValue);

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className="my-3" style={{ width, maxWidth: '600px' }}>
      {label && (
        <label className="block text-white font-medium mb-5 text-xl">{label}</label>
      )}
      <Select
        isMulti={isMulti}
        value={selectedValue}
        options={options}
        onChange={onSelect}
        menuPortalTarget={document.body}
        className="!text-xl"
        styles={{
          control: (base, state) => ({
            ...base,
            backgroundColor: '#1f2937', // slate-800
            borderColor: state.isFocused ? '#3b82f6' : '#4b5563', // blue-500 or gray-600
            borderWidth: '1px',
            borderRadius: '0.5rem',
            minHeight: '44px',
            boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
            color: '#f9fafb', // text-gray-100
            '&:hover': {
              borderColor: '#3b82f6',
            },
          }),
          singleValue: (base) => ({
            ...base,
            color: '#f9fafb',
          }),
          input: (base) => ({
            ...base,
            color: '#f9fafb',
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused
              ? '#3b82f6' // blue-500
              : state.isSelected
              ? '#2563eb' // blue-600
              : '#1f2937', // slate-800
            color: state.isFocused || state.isSelected ? '#ffffff' : '#d1d5db', // gray-300
            padding: '8px 12px',
            cursor: 'pointer',
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: '#1f2937',
            borderRadius: '0.5rem',
            zIndex: 9999,
          }),
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
          }),
          placeholder: (base) => ({
            ...base,
            color: '#9ca3af', // gray-400
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: '#374151', // slate-700
            color: '#f9fafb',
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: '#f9fafb',
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: '#f87171', // red-400
            ':hover': {
              backgroundColor: '#b91c1c', // red-700
              color: 'white',
            },
          }),
        }}
      />
    </div>
  );
};

export default CustomSelect;
