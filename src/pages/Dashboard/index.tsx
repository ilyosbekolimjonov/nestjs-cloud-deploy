import { Outlet } from "react-router-dom"
import Sidebar from "../../components/Sidebar"

import './style.scss'

const Dashboard = () => {
  return (
    <div className="dashboard">
        <Sidebar />

        <div className="main_content">
            <Outlet />
        </div>
    </div>
  )
}

export default Dashboard