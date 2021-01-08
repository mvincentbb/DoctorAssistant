import React from 'react';

import PageTitle from '../../card/PageTitle';
import DoctorDataService from "../../../services/doctor.service";
import NotFound from "../error/404";

import badge from "../../../data/hos-dash/badge.png"
import avatar2 from "../../../data/profile/avatar-2.png"
import doc1 from "../../../data/hos-dash/doc1.jpg"
import doc3 from "../../../data/hos-dash/doc3.jpg"
import { Link } from 'react-router-dom';

class DoctorDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            doctor: {id: null, first_name: "", last_name: "", username: ""},
        }
    }

    componentWillMount() {
        const { match: { params } } = this.props;
        
        DoctorDataService.get(params.id)
        .then(response => {
            console.log(response.data);
            this.setState({doctor: {...response.data}});
        }).catch(e => {
            console.log(e);
            console.log(this.state.doctor.id === null);
        });
    }

    componentDidMount() {
        
    }

    render() {
        return (
                <div>
                    {this.state.doctor.id !== null ? (
                        <div>
                            <PageTitle title="Doctor Profil" />
                            
                            <div className="col-lg-4">
                                <section className="box ">
                                    <div className="content-body p">
                                        <div className="row">
                                            <div className="doctors-list v2  relative">
                                                <div className="doctors-head relative text-left mb-0">
                                                    <div className="doc-img img-circle">
                                                        <img src={doc1} className="img-thumbnail center-block" alt=""/>
                                                        <div className="stutas"></div>
                                                    </div>
                                                    <h3 className="header relative bold">Dr : Smith Wright</h3>
                                                    <h5 className="boldy">Hair Repair and Loss Expert</h5>
                                                    <p className="desc relative mb-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti eveniet sit digni ssimos dolores reiciendis voluptate at quae deleniti voluptatibus molestias.</p>
                                                    <div className="doc-rating mb-30">
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <span>4.8</span>
                                                    </div>

                                                    <Link to={`/doctors_update/${this.state.doctor.id}`} className="btn btn-primary btn-lg gradient-blue d-block" style={{display: 'block', marginBottom: '20px'}}>
                                                        <span>Edit</span>
                                                    </Link>

                                                    <div className="email-div">
                                                        <i className="fa fa-envelope f-s-14 mr-10"></i><span>Email</span>
                                                        <a href="#" className="blue-text">
                                                            <h5 className="text-info">smith-wright@example.com</h5>
                                                        </a>
                                                        <button type="button" className="btn btn-success btn-icon btn-lg mt-10 right15">
                                                            <i className="fa fa-send f-s-14"></i> &nbsp; <span>Send Message</span>
                                                        </button>
                                                    </div>  
                                                </div>
                                                
                                            </div>
                                           
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className="col-lg-8 col-md-12">
                                <div className="row">
                                    <div className="col-xs-12 col-md-6">
                                        <section className="box ">
                                            <header className="panel_header">
                                                <h2 className="title pull-left">Messages</h2>
                                            </header>
                                            <div className="content-body">    
                                                <div className="row align-items-center flex">
                                                    <div className="col-xs-12">
                                                        <div className="pat-info-wrapper align-center">
                                                            <div className="pat-info text-right mr-10">
                                                                <h2 className="bold m-count">25</h2>
                                                            </div>
                                                            <div className="pat-val relative">
                                                                <h4 className="value p-text mb-0"><i className="fa fa-envelope message green-text has-shadow f-s-20 mr-10"></i><span>New</span></h4>
                                                            </div>
                                                        </div>
                                                        <div className="relative mb-15">
                                                            <div className="round">S</div>
                                                            <div className="designer-info">
                                                                <h6 className="msg-sender">Sunil Joshi</h6>
                                                                <small className="text-muted">Lorem ipsum dolor sit amet...</small>
                                                                <h6 className="text-muted mt-0 mb-0">18/09/2018  20:23 AM</h6>
                                                            </div>
                                                        </div>
                                                        <div className="relative">
                                                            <div className="round">F</div>
                                                            <div className="designer-info">
                                                                <h6 className="msg-sender">Fardnio Nany</h6>
                                                                <small className="text-muted">Lorem ipsum dolor sit amet...</small>
                                                                <h6 className="text-muted mt-0 mb-0">18/09/2018  20:23 AM</h6>
                                                            </div>
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                    <div className="col-xs-12 col-md-6">
                                        
                                        <section className="box ">
                                            <header className="panel_header">
                                                <h2 className="title pull-left">Notifications</h2>
                                            </header>
                                            <div className="content-body">    
                                                <div className="row">
                                                    <div className="col-xs-12">
                                                        <ul className="project-activity list-unstyled mb-0">
                                                            <li className="activity-list ">
                                                                <div className="detail-info v2">
                                                                    <div className="doc-img-con pull-left mr-10">
                                                                        <img src={doc3} width="80" alt=""/>
                                                                    </div>
                                                                    <div className="visit-doc">
                                                                        <p className="text-muted mb-0 boldy">
                                                                            Dr sultads Send you Photo 
                                                                        </p>
                                                                        <small className="message">
                                                                            Just Now
                                                                        </small>
                                                                        
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li className="clearfix"></li>
                                                            <li className="activity-list ">
                                                                <div className="detail-info v2">
                                                                    <div className="doc-img-con pull-left mr-10">
                                                                        <i className="fa fa-rocket icon-rounded icon-primary animated fadeIn" style={{padding:11+'px'}}></i>
                                                                    </div>
                                                                    <div className="visit-doc">
                                                                        <p className="text-muted mb-0 boldy">
                                                                            Reminder : Treatment Time!
                                                                        </p>
                                                                        <small className="message">
                                                                            25 july - 20:00
                                                                        </small>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li className="activity-list ">
                                                                <div className="detail-info v2">
                                                                    <div className="doc-img-con pull-left mr-10">
                                                                        <i className="fa fa-bar-chart round-success rd-50 w-text animated fadeIn" style={{padding:11+'px'}}></i>
                                                                    </div>
                                                                    <div className="visit-doc">
                                                                        <p className="text-muted mb-0 boldy">
                                                                             Resport created successfully 
                                                                        </p>
                                                                        <small className="message">
                                                                            26 Feb - 23:47
                                                                        </small>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                           
                                                        </ul>
                                                    </div>      
                                                </div> 
                                                {/* <!-- End .row --> */}
                                            </div>
                                        </section>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 col-md-6">
                                        <section className="box ">
                                            <header className="panel_header">
                                                <h2 className="title pull-left">Badges</h2>
                                                <div className="actions panel_actions pull-right">
                                                    <a className="box_toggle fa fa-chevron-down"></a>
                                                    <a className="box_setting fa fa-cog" data-toggle="modal" href="#section-settings"></a>
                                                    <a className="box_close fa fa-times"></a>
                                                </div>
                                            </header>
                                            <div className="content-body">    
                                                <div className="row align-items-center flex">
                                                    <div className="col-xs-12 text-center">
                                                        
                                                        <img src={badge} style={{maxWidth:85+'px'}} alt=""/>
                                                        <h4 className="boldy">You don’t have badges yet</h4>
                                                        <div className="mt-10 text-center">
                                                            <button type="button" className="btn btn-success gradient-blue btn-lg mt-10 right15">
                                                                <span>earn budges</span>
                                                            </button>
                                                        </div>
                                                        
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                    <div className="col-xs-12 col-md-6">
                                        <section className="box ">
                                            <header className="panel_header">
                                                <h2 className="title pull-left">Speciality</h2>
                                                <div className="actions panel_actions pull-right">
                                                    <a className="box_toggle fa fa-chevron-down"></a>
                                                    <a className="box_setting fa fa-cog" data-toggle="modal" href="#section-settings"></a>
                                                    <a className="box_close fa fa-times"></a>
                                                </div>
                                            </header>
                                            <div className="content-body">    
                                                <div className="row align-items-center flex">
                                                    <div className="col-xs-12">
                                                        
                                                        <div className="speciality-item relative">
                                                            <div className="doc-img-con speciality pull-left">
                                                                <img src="../data/hos-dash/speciality1.png" width="80" alt=""/>
                                                            </div>
                                                            <div className="designer-info">
                                                                <h6 className="msg-sender">Certified</h6>
                                                                <small className="text-muted f-s-14">Cold Laser Therapy</small>
                                                            </div>
                                                        </div>
                                                        <div className="speciality-item relative ">
                                                            <div className="doc-img-con speciality pull-left">
                                                                <img src="../data/hos-dash/speciality2.png" width="80" alt=""/>
                                                            </div>
                                                            <div className="designer-info">
                                                                <h6 className="msg-sender">Medication Laser</h6>
                                                                <small className="text-muted f-s-14">Hair Lose Product</small>
                                                            </div>
                                                        </div>
                                                        <div className="speciality-item relative mb-0">
                                                            <div className="doc-img-con speciality pull-left">
                                                                <img src="../data/hos-dash/speciality2.png" width="80" alt=""/>
                                                            </div>
                                                            <div className="designer-info">
                                                                <h6 className="msg-sender">professional</h6>
                                                                <small className="text-muted f-s-14">Certified Hair Lose Surgery</small>
                                                            </div>
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </div>
                            <div className="clearfix"></div>

                            
                            <div className="col-xs-12 col-md-6">
                                <section className="box ">
                                    <header className="panel_header">
                                        <h2 className="title pull-left">Recent Visits</h2>
                                        <div className="actions panel_actions pull-right">
                                            <a className="box_toggle fa fa-chevron-down"></a>
                                            <a className="box_setting fa fa-cog" data-toggle="modal" href="#section-settings"></a>
                                            <a className="box_close fa fa-times"></a>
                                        </div>
                                    </header>
                                    <div className="content-body">    
                                        <div className="row">
                                            <div className="col-xs-12">
                                                <ul className="project-activity list-unstyled mb-0">
                                                    <li className="activity-list warning">
                                                        <div className="detail-info v2">
                                                            <div className="doc-img-con pull-left mr-10">
                                                                <img src={avatar2} width="80" alt=""/>
                                                            </div>
                                                            <div className="visit-doc">
                                                                <p className="message">
                                                                     Mutten Sultan <span className="text-info bold">( Blood Check )</span>
                                                                </p>
                                                                <small className="text-muted">
                                                                    Blood Check
                                                                </small>
                                                            </div>
                                                            <div className="visit-date pull-right">
                                                                <p className="mb-0">25 Nov</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="clearfix"></li>
                                                    <li className="activity-list info">
                                                        <div className="detail-info v2">
                                                            <div className="doc-img-con pull-left mr-10">
                                                                <img src={avatar2} width="80" alt=""/>
                                                            </div>
                                                            <div className="visit-doc">
                                                                <p className="message ">
                                                                     Smith Watson <span className="text-info bold">( Medicine )</span>
                                                                </p>
                                                                <small className="text-muted">
                                                                    Thryoid Test
                                                                </small>
                                                            </div>
                                                            <div className="visit-date pull-right">
                                                                <p className="mb-0">25 Nov</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="activity-list success">
                                                        <div className="detail-info v2">
                                                            <div className="doc-img-con pull-left mr-10">
                                                                <img src={avatar2} width="80" alt=""/>
                                                            </div>
                                                            <div className="visit-doc">
                                                                <p className="message ">
                                                                    Sarah Mutten <span className="text-info bold">( Pathology )</span>
                                                                </p>
                                                                <small className="text-muted">
                                                                    Full Blood image
                                                                </small>
                                                            </div>
                                                            <div className="visit-date pull-right">
                                                                <p className="mb-0">25 Nov</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="activity-list success">
                                                        <div className="detail-info v2">
                                                            <div className="doc-img-con pull-left mr-10">
                                                                <img src={avatar2} width="80" alt=""/>
                                                            </div>
                                                            <div className="visit-doc">
                                                                <p className="message ">
                                                                    Shadow laoono <span className="text-info bold">( Medicine )</span>
                                                                </p>
                                                                <small className="text-muted">
                                                                    Full Blood image
                                                                </small>
                                                            </div>
                                                            <div className="visit-date pull-right">
                                                                <p className="mb-0">25 Nov</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="activity-list danger">
                                                        <div className="detail-info v2 pb0">
                                                            <div className="doc-img-con pull-left mr-10">
                                                                <img src={avatar2} width="80" alt=""/>
                                                            </div>
                                                            <div className="visit-doc">
                                                                <p className="message ">
                                                                     Morese Sharpe <span className="text-info bold">( Routine Visit )</span>
                                                                </p>
                                                                <small className="text-muted">
                                                                    Full Body Test
                                                                </small>
                                                            </div>
                                                            <div className="visit-date pull-right">
                                                                <p className="mb-0">25 Nov</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>      
                                        </div> 
                                        {/* <!-- End .row --> */}
                                    </div>
                                </section>
                            </div>
                            
                            <div className="col-xs-12 col-md-6">
                                <section className="box ">
                                    <header className="panel_header">
                                        <h2 className="title pull-left">Patients Notes</h2>
                                        <div className="actions panel_actions pull-right">
                                            <a className="box_toggle fa fa-chevron-down"></a>
                                            <a className="box_setting fa fa-cog" data-toggle="modal" href="#section-settings"></a>
                                            <a className="box_close fa fa-times"></a>
                                        </div>
                                    </header>
                                    <div className="content-body">    
                                        <div className="row">
                                            <div className="col-xs-12">
                                                <ul className="project-activity list-unstyled mb-0">
                                                    <li className="activity-list warning">
                                                        <div className="detail-info">
                                                            <div className="visit-doc">
                                                                <small className="text-muted f-s-14 mb-7">
                                                                    I feel better NowMutten Sultan
                                                                </small>
                                                                <p className="message">
                                                                    Meditation
                                                                </p>
                                                                
                                                            </div>
                                                            <div className="visit-date visit-stat pull-right">
                                                                <p className="mb-0">OPEN</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="clearfix"></li>
                                                    <li className="activity-list info">
                                                        <div className="detail-info">
                                                            <div className="visit-doc">
                                                                <small className="text-muted f-s-14 mb-7">
                                                                    Treatment was good!
                                                                </small>
                                                                <p className="message">
                                                                    Thyroid Test
                                                                </p>
                                                            </div>
                                                            <div className="visit-date visit-stat pull-right">
                                                                <p className="mb-0 uppercase">closed</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="activity-list success">
                                                        <div className="detail-info">
                                                            <div className="visit-doc">
                                                                <small className="text-muted f-s-14 mb-7">
                                                                    My hair is gone!
                                                                </small>
                                                                <p className="message">
                                                                    Unhappy
                                                                </p>
                                                            </div>
                                                            <div className="visit-date visit-stat pull-right">
                                                                <p className="mb-0 uppercase">open</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="activity-list warning">
                                                        <div className="detail-info">
                                                            <div className="visit-doc">
                                                                <small className="text-muted f-s-14 mb-7">
                                                                    My hair is gone!
                                                                </small>
                                                                <p className="message">
                                                                    Unhappy
                                                                </p>
                                                            </div>
                                                            <div className="visit-date visit-stat pull-right">
                                                                <p className="mb-0 uppercase">closed</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="activity-list danger">
                                                        <div className="detail-info pb0">
                                                            <div className="visit-doc">
                                                                <small className="text-muted f-s-14 mb-7">
                                                                    Mediacal Care is just a click away
                                                                </small>
                                                                <p className="message">
                                                                    Join Pain
                                                                </p>
                                                            </div>
                                                            <div className="visit-date visit-stat pull-right">
                                                                <p className="mb-0 uppercase">open</p>
                                                            </div>
                                                        </div>
                                                    </li>


                                                </ul>
                                            </div>      
                                        </div> 
                                        {/* <!-- End .row --> */}
                                    </div>
                                </section>
                            </div>
                            <div className="clearfix"></div>
                        </div>
                    ) : (
                        <NotFound />
                    )}
                    
                </div>
        )
    }
}

export default DoctorDetails;