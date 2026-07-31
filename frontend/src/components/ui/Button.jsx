function Button({
  children,
  type = "button",
  variant = "primary",
  onClick,
  disabled = false,
  className = ""
}) {
  const styles = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/10 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-98",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/50 hover:-translate-y-0.5 active:translate-y-0 active:scale-98",
    success: "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md shadow-green-500/10 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-98",
    danger: "bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-md shadow-red-500/10 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-98"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-150 ease-out cursor-pointer flex items-center justify-center gap-1.5 ${
        styles[variant]
      } ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none transform-none shadow-none" : ""} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;