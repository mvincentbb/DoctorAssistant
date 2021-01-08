import React from "react";
import { Link } from "react-router-dom";

import icon1 from "../../data/hos-dash/icons/1.png";
import icon2 from "../../data/hos-dash/icons/2.png";
import icon3 from "../../data/hos-dash/icons/3.png";
import icon6 from "../../data/hos-dash/icons/6.png";
import hospitalIcon from "../../data/hos-dash/icons/hospital.png";

const SideBar = () => {

  return (
    <div className="page-sidebar fixedscroll collapseit">
        <div className="page-sidebar-wrapper ps-container ps-active-y" id="main-menu-wrapper">
            <ul className="wraplist" style={{ height: "auto" }}>
                <li className="menusection">Main</li>
                
                <li className="">
                    <Link to={"/dashboard"}>
                        <i className="img"> <img src={icon1} alt="" className="width-20" /> </i>
                        <span className="title">Tableau de bord</span>
                    </Link>
                </li>
                
                <li className="">
                    <a style={{cursor: "pointer"}}>
                        <i className="img">
                            <img src={icon2} alt="" className="width-20" />
                        </i>
                        <span className="title">Patients</span>
                        <span className="arrow "></span>
                    </a>
                    <ul className="sub-menu" wfd-invisible="true">
                        <li>
                            <Link to={"/patients"}>Mes Patients</Link>
                        </li>
                        <li>
                            <Link to={"/patients_new"}>Ajouter un Patient</Link>
                        </li>
                    </ul>
                </li>

                <li className="">
                    <a style={{cursor: "pointer"}}>
                        <i className="img">
                            <img src={hospitalIcon} alt="" className="width-20" />
                        </i>
                        <span className="title">Hopital</span>
                        <span className="arrow "></span>
                    </a>
                    <ul className="sub-menu" wfd-invisible="true">
                        <li>
                            <Link to={"/hospitals"}>Mes Hopitaux</Link>
                        </li>
                        <li>
                            <Link to={"/hospitals_new"}>Ajouter un Hopital</Link>
                        </li>
                    </ul>
                </li>

                <li className="">
                    <a style={{cursor: "pointer"}}>
                        <i className="img"><img src={icon6} alt="" className="width-20" /></i>
                        <span className="title">Rendez-Vous</span>
                        <span className="arrow "></span>
                    </a>

                    <ul className="sub-menu" wfd-invisible="true">
                        <li>
                            <Link to={"/demande_consultations"}>Mes Rendez-Vous</Link>
                        </li>
                        <li>
                            <Link to={"/demande_consultation_new"}>Programmer un RDV</Link>
                        </li>
                    </ul>
                </li>

                <li className="">
                    <a style={{cursor: "pointer"}}>
                        <i className="img">
                            <img src={icon3} alt="" className="width-20" />
                        </i>
                        <span className="title">Consultation</span>
                        <span className="arrow "></span>
                    </a>

                    <ul className="sub-menu" wfd-invisible="true">
                        <li>
                            <Link to={"/consultations"}>Mes Consultations</Link>
                        </li>
                        <li>
                            <Link to={"/consultation_new"}>Ajouter une Consultation</Link>
                        </li>
                    </ul>
                </li>

                {/* <li className="">
                    <a style={{cursor: "pointer"}}>
                        <i className="img">
                            <img src={icon2} alt="" className="width-20" />
                        </i>
                        <span className="title">Médecin</span>
                        <span className="arrow "></span>
                    </a>
                    <ul className="sub-menu" wfd-invisible="true">
                        <li>
                            <Link to={"/doctors"}>Liste des Médecins</Link>
                        </li>
                        <li>
                            <Link to={"/doctors_new"}>Ajouter un Médecin</Link>
                        </li>
                    </ul>
                    <ul className="sub-menu" wfd-invisible="true">
                        <li>
                        <Link to={"/doctors"}>Liste des Médecins</Link>
                        </li>
                        <li>
                        <Link to={"/doctors_new"}>Ajouter un Médecin</Link>
                        </li>
                    </ul>
                </li> */}
            </ul>

            <div className="ps-scrollbar-x-rail" style={{ left: 0 + "px", bottom: 3 + "px" }} wfd-invisible="true">
                <div className="ps-scrollbar-x" style={{ left: 0 + "px", width: 0 + "px" }}></div>
            </div>

            <div className="ps-scrollbar-y-rail" style={{ top: 0 + "px", height: 516 + "px", right: 3 + "px" }}>
                <div className="ps-scrollbar-y" style={{ top: 0 + "px", height: 293 + "px" }}></div>
            </div>
        </div>
    </div>
  );
};

export default SideBar;
