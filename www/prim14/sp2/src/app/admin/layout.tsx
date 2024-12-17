import "./admin.css";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="admin-wrapper">
      <div className="admin-wrapper__content">
        <h2>Administrace</h2>
        {children}
      </div>
    </div>
  );
}
