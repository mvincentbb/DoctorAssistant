import React from 'react';
import {Link} from 'react-router-dom';
// import {Col} from 'react-bootstrap';

import doc2 from '../../../data/hos-dash/doc2.jpg';
import PatientInfoItem from '../../card/PatientInfoItem';
import DoctorInfoItem from '../../card/DoctorInfoItem';
import computedAge from '../../../utils';
import PatientDataService from "../../../services/patient.service"
import { data } from 'jquery';

const DoctorItem = ({fullname, gender, date_naissance, id}) => {
    let [patients, setPatients] = React.useState('')
    const getPatientsNum = id => {
        // console.log()
        PatientDataService.countPatients({doctorpatients:id}).then((response) => {
            setPatients(response.data)
        })
        .catch((e) => {
            // console.log(e);
        });
        console.log(patients)
        return patients
    }
    return (
    <div className="col-lg-4 col-md-6">
        <section className="box ">
            <div className="content-body p">
                <div className="row">
                    <div className="doctors-list patient relative">
                        <div className="doctors-head relative text-center">
                            <div className="doctor-card has-shadow">
                                <div className="doc-info-wrap text-left">
                                    <div className="doctor-img">
                                        <img src={doc2} alt=""/>
                                    </div>
                                    <div className="doc-info">
                                        <h4 className="bold">{fullname}</h4>
                                        <h5>Surgeon</h5>
                                        <div className="doc-rating">
                                            <i className="fa fa-star"></i>
                                            <i className="fa fa-star"></i>
                                            <i className="fa fa-star"></i>
                                            <i className="fa fa-star"></i>
                                            <i className="fa fa-star"></i>
                                            <span>4.8</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div className="row">
                            <div className="patients-info relative">
                                <DoctorInfoItem title="Patients" value={getPatientsNum(id)} />
                                <DoctorInfoItem title=" " value=" " />
                                <DoctorInfoItem title="Doc age" value={computedAge(date_naissance)+" Ans"}/>
                            </div>
                        </div>
                        {/* <!-- end row --> */}
                        
                        <div className="col-xs-12 mb-30">
                            <div className="form-group no-mb">
                                <Link to={`/doctors_details/${id}`} className="btn btn-primary btn-lg gradient-blue" style={{width:100+'%'}}>View Profile</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
)}

export default DoctorItem;