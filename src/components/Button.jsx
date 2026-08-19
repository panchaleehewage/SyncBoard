export default function Button({ children, variant = 'primary', onClick, type = 'button', className = '' }) {
  return (
    <button type={type} onClick={onClick} className={`btn-${variant} ${className}`}>
      {children}
    </button>
  );
}