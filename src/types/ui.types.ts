// --- Breadcrumbs ---
export interface BreadcrumbItem {
  label: string;
  icon?: string;
  route?: string;
}

// --- Sidebar ---
export interface MenuItem {
  name: string;
  path: string;
  icon: string;
  roles?: string[];
}

export interface MenuGroup {
  title: string;
  items: MenuItem[];
}

// --- TableGrid ---
export type LayoutType = 'list' | 'grid';
