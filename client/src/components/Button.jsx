const Button = ({
  children,
  variant = "primary",
  className = "",
  loading = false,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2";

  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-800 shadow-sm",
    secondary:
      "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 shadow-sm",
    ghost: "text-gray-700 hover:bg-gray-100",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
