import { NavLink, useNavigate } from 'react-router-dom'
import { SIDEBAR_ITEMS } from '../../constants'

import './style.scss'

const Sidebar = () => {
    const navigate = useNavigate();
    const handlelogout = () => {
        localStorage.removeItem('token');
        navigate('/login')
    }

    return (
        <div className='sidebar'>
            <div>
                <h1 className='main_title'>Dashboard</h1>

                <div className='sidebar_items'>
                    {
                        SIDEBAR_ITEMS.map(({ title, path }) => (
                            <NavLink key={title} to={path}>
                                <p className='title'>{title}</p>
                            </NavLink>
                        ))
                    }
                </div>
            </div>

            <button onClick={handlelogout} className='logout'>
                Chiqish
            </button>
        </div>
    )
}

export default Sidebar;