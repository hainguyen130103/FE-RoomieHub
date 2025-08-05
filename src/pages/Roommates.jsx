import React from "react";
import SidebarNav from "../components/layouts/SidebarNav";

const Roommates = () => {
  return (
    <SidebarNav>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 flex items-center justify-center">
          <h2 className="text-3xl font-bold text-green-600">Trang Nhóm ở ghép</h2>
        </div>
      </div>
    </SidebarNav>
  );
};

export default Roommates;