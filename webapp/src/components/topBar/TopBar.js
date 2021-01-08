import React, {useState} from 'react';

import Avatar1 from '../../data/profile/avatar-1.png'
import Avatar2 from '../../data/profile/avatar-2.png'
import Avatar3 from '../../data/profile/avatar-3.png'
import Avatar4 from '../../data/profile/avatar-4.png'
import Avatar5 from '../../data/profile/avatar-5.png'
import Profile from '../../data/profile/profile.jpg'

import TopnavItem from './topnavItem/TopnavItem';
import TopNavSearchForm from './topnavSearchForm/TopNavSearchForm';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import {GIRL_AVATAR, BOY_AVATAR, LitteralDate, literalHour} from '../../utils';
import { Avatar } from 'avataaars';

const cookies = new Cookies();

const TopBar = () => {
    const user = cookies.get("loggedUser");
    const [items, setItems] = useState([false, false, false]);
    var [date, setDate] = useState(new Date());

    const logout = () => {
        cookies.remove("loggedUser");
        cookies.remove("token");
        cookies.remove("userType");
        window.location.href =  "login";
    }

    const makeActive = (id) => {
        console.log("cli", id);
        var tmp = [false, false, false];
        tmp[id] = true;
        setItems(tmp);
    }

    // setInterval(()=> { setDate(new Date()) }, 6000);

    return (
        <div className="page-topbar gradient-blue1 sidebar_shift">
            <div className="logo-area crypto">

            </div>
            <div className="quick-area">
                <div className="pull-left">
                    <ul className="info-menu left-links list-inline list-unstyled">
                        
                        <li className="sidebar-toggle-wrap">
                            <a href="#" id="sidebar_toggler" data-toggle="sidebar" className="sidebar_toggle">
                                <i className="fa fa-bars"></i>
                            </a>
                        </li>

                        <TopnavItem label="Mon Planning" icon="fa-calendar-alt" to="/schedules/" isActive={items[0]} id={0} onClick={makeActive} />
                        {/* <TopnavItem label="Reports" icon="fa-area-chart" to="#" isActive={false}/> */}
                        <TopnavItem label="Mes Patients" icon="fa-users" to="/patients/" isActive={items[1]} id={1} onClick={makeActive}/>
                        <TopnavItem label="Mes Hopitaux" icon="fa-hospital" to="/hospitals/" isActive={items[2]} id={2} onClick={makeActive}/>
                        
                        {/* <TopNavSearchForm/> */}

                    </ul>
                </div>
                <div className="pull-right">
                    <ul className="info-menu right-links list-inline list-unstyled">

                        <li className="now-date">
                            <div>
                                <i className="fa fa-calendar-day"></i>
                                <span> {LitteralDate(date, "SMALL")} </span>
                            </div>
                        </li>

                        <li className="now-date">
                            <div>
                                <i className="fa fa-clock"></i>
                                <span> {literalHour(date)} </span>
                            </div>
                        </li>

                        <li className="notify-toggle-wrapper spec showopacity" style={{marginRight: '40px'}}>
                            <div className="toggle moncircle monshape" data-toggle="dropdown" style={{top: '13px', height: '30px', width: '30px'}}>
                                <i className="text fa fa-plus"></i>
                            </div>
                            <ul className="dropdown-menu profile animated fadeIn" style={{ left:-20+'px'}}>
                                
                                <li>
                                    <Link to="/patients_new">
                                        <i className="fa fa-user"></i> Patient
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/hospitals_new">
                                        <i className="fas fa-hospital"></i> Hopital
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/consultation_new">
                                        <i className="fa fa-book"></i> Consultation
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        
                        
                        { user && (
                        <li className="profile showopacity">
                                <a href="#" data-toggle="dropdown" className="toggle">
                                    <img className="img-circle img-inline" src={user.genre === "M" ? BOY_AVATAR : GIRL_AVATAR}/>
                                    
                                    <span>Dr {user.username} <i className="fa fa-angle-down"></i></span>
                                </a>
                                <ul className="dropdown-menu profile animated fadeIn">
                                    {/* <li>
                                        <Link to={`/profile`}>
                                            <i className="fas fa-id-badge"></i> Profile
                                        </Link>
                                    </li> */}
                                    <li className="">
                                        <a onClick={logout} style={{cursor : 'pointer'}}>
                                            <i className="fas fa-sign-out-alt"></i> Déconnection
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        )}
                    </ul>
                </div>
            </div>

        </div>
    )
}

export default TopBar;