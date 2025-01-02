import Header from "@/components/shared/header";
import "../admin.css";
import AdminProductContent from "@/components/content/AdminProductContent";

export default function Home() {
  return (
    <>
      <Header homeLink="../../" logoLink="../../logo-gray.webp" />
      <main>
        <div className="admin-wrapper">
          <div className="admin-wrapper__content">
            <h2>Administrace</h2>
            <AdminProductContent />
          </div>
        </div>
      </main>
    </>
  );
}
