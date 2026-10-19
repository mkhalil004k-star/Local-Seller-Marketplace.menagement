import React from 'react'
import { useLocation } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import UserSidebar from './UserSidebar'

function SidebarSwitch() {
  useLocation()
  let role = localStorage.getItem("role")

  if (role === "admin") return <AdminSidebar />
  if (role === "seller" || role === "buyer") return <UserSidebar />
  return null
}

export default SidebarSwitch