import React from 'react';
// import {Col} from 'react-bootstrap';

import avatar1 from '../../../data/profile/avatar-1.png';

const PatientItem = ({fullname, gender, age}) => (
    <div className="col-lg-4 col-md-6">
        <section className="box ">
            <div className="content-body p">
                <div className="row">
                    <div className="doctors-list patient relative">
                        <div className="doctors-head relative text-center">
                            <div className="patient-img img-circle">
                                <img src={avatar1} className="rad-50 center-block" alt=""/>
                                <div className="stutas recent"></div>
                            </div>
                            <h3 className="header w-text relative bold">Nom : {fullname} </h3>
                            
                        </div>
                        <div className="row">
                            <div className="patients-info relative">
                                <div className="col-sm-6 col-xs-12">
                                    <div className="patient-card has-shadow2">
                                        <div className="doc-info-wrap">
                                            <div className="patient-info">
                                                <h5 className="bold">{gender}</h5>
                                                <h6>Genre</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-xs-12">
                                    <div className="patient-card has-shadow2">
                                        <div className="doc-info-wrap">
                                            <div className="patient-info">
                                                <h5 className="bold">Age: {age}</h5>
                                                <h6>Age</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        
                        <div className="col-xs-12 mb-30">
                            <div className="form-group no-mb">
                                <button type="button" className="btn btn-primary btn-lg gradient-blue" style={{width: 100+'%'}}> Voir Profil</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
)

export default PatientItem;