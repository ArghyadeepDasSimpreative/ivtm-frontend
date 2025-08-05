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
  style = "dark",
  error // Added error prop to match InputField
}) => {
  const options = data.map((item) => ({
    value: item[config.key],
    label: item[config.label],
  }));

  const [selectedValue, setSelectedValue] = useState(defaultValue);

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  const isDark = style === "dark";

  return (
    <div className="w-full !max-w-[600px]"> {/* Updated to match InputField container */}
      {label && (
        <label className="block text-md text-gray-600 mb-2"> {/* Updated to match InputField label styling */}
          {label}
        </label>
      )}
      <Select
        isMulti={isMulti}
        value={selectedValue}
        options={options}
        onChange={onSelect}
        menuPortalTarget={document.body}
        className="!text-md"
        styles={{
          control: (base, state) => ({
            ...base,
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            borderColor: error 
              ? '#ef4444' // Red border when error exists
              : state.isFocused
              ? '#3b82f6'
              : isDark
              ? '#4b5563'
              : '#d1d5db',
            borderWidth: '1px',
            borderRadius: '0.375rem', // Updated to match InputField (rounded-md)
            minHeight: '48px', // Updated to match InputField height (py-3)
            boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
            color: isDark ? '#f9fafb' : '#111827',
            '&:hover': {
              borderColor: error ? '#ef4444' : '#3b82f6',
            },
          }),
          valueContainer: (base) => ({
            ...base,
            padding: '0 12px', // Updated to match InputField px-3
          }),
          singleValue: (base) => ({
            ...base,
            color: isDark ? '#f9fafb' : '#111827',
          }),
          input: (base) => ({
            ...base,
            color: isDark ? '#f9fafb' : '#111827',
            margin: 0,
            padding: 0,
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused
              ? '#3b82f6'
              : state.isSelected
              ? '#2563eb'
              : isDark
              ? '#1f2937'
              : '#ffffff',
            color:
              state.isFocused || state.isSelected
                ? '#ffffff'
                : isDark
                ? '#d1d5db'
                : '#111827',
            padding: '8px 12px',
            cursor: 'pointer',
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            borderRadius: '0.375rem', // Updated to match InputField
            zIndex: 9999,
          }),
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
          }),
          placeholder: (base) => ({
            ...base,
            color: isDark ? '#9ca3af' : '#6b7280',
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: isDark ? '#374151' : '#e5e7eb',
            color: isDark ? '#f9fafb' : '#111827',
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: isDark ? '#f9fafb' : '#111827',
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: isDark ? '#f87171' : '#dc2626',
            ':hover': {
              backgroundColor: isDark ? '#b91c1c' : '#fecaca',
              color: isDark ? '#ffffff' : '#7f1d1d',
            },
          }),
        }}
      />
      {error && <p className="text-red-500 text-md mt-1">{error}</p>} {/* Added error display to match InputField */}
    </div>
  );
};

export default CustomSelect;