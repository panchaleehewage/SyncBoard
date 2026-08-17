export default function Column({ title, count, children }) {
  return (
    <div className="column">
      <h3>{title} <span className="task-count">{count}</span></h3>
      <div className="task-list">
        {children}
      </div>
    </div>
  );
}