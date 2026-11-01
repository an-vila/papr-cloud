import { useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { useDrive } from "@/hooks/useDrive";
import {
  HardDriveIcon,
  UserIcon,
  Trash2Icon,
  PlusIcon,
  HardDriveUploadIcon,
  FolderPlusIcon,
} from "lucide-react";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { StorageWidget } from "@/components/layout/StorageWidget";

const Sidebar = ({ onCreateFolderClick, isMobileOpen, setIsMobileOpen }) => {
  const { isUploading, uploadFiles } = useDrive();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    if (e.taget.files && e.target.files.length > 0) {
      uploadFiles(e.target.files, currentFolderId);
      e.target.value = "";
    }
  };

  const navItems = [
    { label: "My Drive", path: "/", icon: HardDriveIcon },
    { label: "Shared Files", path: "/shared", icon: UserIcon },
    { label: "Trash", path: "/trash", icon: Trash2Icon },
  ];

  return (
    <>
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200">
          <img src="/logo.svg" alt="Logo" className="size-11" />
          <div>
            <h1 className="text-2xl font-medium uppercase text-slate-800">
              PAPR Cloud
            </h1>
            <p className="text-xs text-slate-500 tracking-wider font-medium uppercase">
              Cloud Storage
            </p>
          </div>
        </div>

        <div className="p-4">
          <input
            type="file"
            ref={fileInputRef}
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <Dropdown
            trigger={
              <button
                type="button"
                disabled={isUploading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm rounded-lg transition-all disabled:opacity-50 cursor-pointer"
              >
                <PlusIcon className="size-5" />
                <span>New Item</span>
              </button>
            }
            align="left"
            className="w-32"
          >
            <DropdownItem
              icon={HardDriveUploadIcon}
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Files
            </DropdownItem>
            <DropdownItem icon={FolderPlusIcon} onClick={onCreateFolderClick}>
              New Folder
            </DropdownItem>
          </Dropdown>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === "/"
                ? location.pathname === "/" ||
                  location.pathname.startsWith("/drive")
                : location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "border-r-3 border-orange-500 bg-linear-to-r from-orange-50 to-orange-100 text-orange-600"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon
                  className={`size-4.5 ${
                    isActive ? "text-orange-600" : "text-slate-500"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <StorageWidget />
      </aside>
    </>
  );
};

export default Sidebar;
