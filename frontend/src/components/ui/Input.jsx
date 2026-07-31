function Input({
  label,
  type = "text",
  name,
  value,
  placeholder,
  onChange,
  required = false,
  disabled = false
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-1.5 text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}

export default Input;