export type AdminSection = 'notice' | 'sync';

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
}

export function AdminSidebar({
  activeSection,
  onSectionChange,
}: AdminSidebarProps) {
  return (
    <aside className="admin-sidebar">
      <ul className="admin-sidebar-menu">
        <li
          className={`admin-sidebar-item ${activeSection === 'notice' ? 'active' : ''}`}
          onClick={() => onSectionChange('notice')}
        >
          공지사항 관리
        </li>
        <li
          className={`admin-sidebar-item ${activeSection === 'sync' ? 'active' : ''}`}
          onClick={() => onSectionChange('sync')}
        >
          강의 동기화
        </li>
      </ul>
    </aside>
  );
}
