export default function Button({ children, variant = 'primary', onClick, type = 'button', className = '' }) {
  const baseStyle = "padding: 8px 16px; border-radius: 6px; font-weight: 500; cursor: pointer; border: none; transition: 0.2s;";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700", // Assuming you'll map these to your CSS classes
    secondary: "bg-white text-slate-800 border border-slate-300 hover:bg-slate-100",
    danger: "bg-red-100 text-red-600 hover:bg-red-200"
  };

  return (
    <button type={type} onClick={onClick} className={`btn-${variant} ${className}`}>
      {children}
    </button>
  );
}