import React from 'react';
import { Link } from 'react-router-dom';


const TopnavItem = ({label, icon, to, isActive, onClick, id}) => {
    
    const handleClick = (e) => {
        onClick(id);
    }

    return (
    
        <li className={`topnav-item ${isActive? 'active': ''} item2`} onClick={handleClick} >
            <Link to={to} className="nav-link w-text" style={{display: 'block'}}>
                <i className={`fa ${icon} mr-10`}></i>{label}
            </Link>
        </li>

    )
}

export default TopnavItem;