import React, { useEffect, useState } from "react";
import { Avatar } from "primereact/avatar";
import { getUserProfileApi } from "../../services/Userservices";

const navItems = [
  {
    id: "profile",
    label: "Thông tin cá nhân",
    icon: "pi pi-user",
    path: "/profile",
  },
  {
    id: "packages",
    label: "Gói dịch vụ",
    icon: "pi pi-box",
    path: "/packages",
  },
  { id: "posts", label: "Bài đăng", icon: "pi pi-file", path: "/posts" },
  {
    id: "roommates",
    label: "Nhóm ở ghép",
    icon: "pi pi-users",
    path: "/roommates",
  },
  { id: "chat", label: "Chat", icon: "pi pi-comments", path: "/chat/:userId" },
];

const SidebarNav = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const response = await getUserProfileApi();
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const currentPath = window.location.pathname;

  const handleNavigation = (path) => {
    if (currentPath !== path) {
      window.location.href = path;
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f5f6]">
      <div className="container mx-auto py-6 px-4">
        <div className="flex gap-6">
          {/* Nav Sidebar */}
          <div className="w-64">
            {/* User Info */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow">
              <div className="flex items-center gap-3">
                <Avatar
                  size="large"
                  shape="circle"
                  icon="pi pi-user"
                  className="bg-orange-500"
                />
                <div>
                  <h3 className="font-semibold">
                    {loading ? "Loading..." : userInfo?.userName || "Guest"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {userInfo?.hometown || ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-lg shadow">
              <nav className="p-2">
                <ul className="space-y-1">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => handleNavigation(item.path)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                          currentPath === item.path
                            ? "bg-orange-500 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <i className={item.icon} />
                          <span>{item.label}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default SidebarNav;
