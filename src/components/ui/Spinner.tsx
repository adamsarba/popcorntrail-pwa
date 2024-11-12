export function Spinner({ className = "" }) {
  return (
    <span className={`spinner ${className}`}>
      {[...Array(8)].map((_, index) => (
        <span key={index} className={`bar${index + 1}`}></span>
      ))}
    </span>
  );
}
