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
  style = "dark"
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
    <div className="my-3" style={{ width, maxWidth: '600px' }}>
      {label && (
        <label
          className={`block font-medium mb-5 text-xl ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}
        >
          {label}
        </label>
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
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            borderColor: state.isFocused
              ? '#3b82f6'
              : isDark
              ? '#4b5563'
              : '#d1d5db',
            borderWidth: '1px',
            borderRadius: '0.5rem',
            minHeight: '44px',
            boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
            color: isDark ? '#f9fafb' : '#111827',
            '&:hover': {
              borderColor: '#3b82f6',
            },
          }),
          singleValue: (base) => ({
            ...base,
            color: isDark ? '#f9fafb' : '#111827',
          }),
          input: (base) => ({
            ...base,
            color: isDark ? '#f9fafb' : '#111827',
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
            borderRadius: '0.5rem',
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
    </div>
  );
};

export default CustomSelect;
