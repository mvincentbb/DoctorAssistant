import React from "react";

import PageTitle from "../../../card/PageTitle";
import Cookies from "universal-cookie";
import DoctorDetailForm from "./DoctorDetailForm";
import patientIcon from '../../../../data/icons/gradient/icons8-fever-96.png';
import patientIcon2 from '../../../../data/icons/gradient/icons8-hand-with-a-pill-96.png';
import patientIcon3 from '../../../../data/icons/gradient/icons8-hospital-bed-96.png';
import patientIcon4 from '../../../../data/icons/gradient/icons8-t-shirt-96.png';
import DashboardResumeItem from "../../../card/dashboard-resume-item";
import { BOY_AVATAR, random_item, literalHour, LitteralDate } from "../../../../utils";
import DoctorDataService from "../../../../services/doctor.service";
import { Link } from "react-router-dom";

const cookies = new Cookies();

class DoctorDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activites: {
                label: [],
                consultations: [],
                patients: [],
            },
            patients_incoming: {
                labels: [],
                males: [],
                females: [],
            },
            consultations: {
                total: 0,
                a_venir: 0
            },
            patients: {
                total: 0,
                new: 0
            },
            rdv: {
                total: 0,
                actuel: 0,
                liste: []
            },
            orderedRDVs: {}
        };
    }

    componentWillMount() {
        DoctorDataService.getDashInfos()
        .then((response) => {
            this.setState(response.data, this.getOrderedRDVs);
        })
        .catch((e) => {
            console.log(e);
        })
    }

    componentDidMount() {
        window.$(document).ready( () => {
            window.setTimeout(() => {
                this.initCharts();
            }, 2000);
        });
    }

    initCharts = () => {
        if(window.$("#activity-chartjs").length) {
            var ctx = window.$("#activity-chartjs")[0].getContext("2d");
            
            var activityChart = new window.Chart(ctx).Line(
                {
                    labels: this.state.activites.label.reverse(),
                    datasets: [{
                        label: "Diastolique",
                        fillColor: "rgba(63,81,181,0.5)",
                        strokeColor: "rgba(63,81,181,1)",
                        pointColor: "rgba(63,81,181,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(63,81,181,1)",
                        data: this.state.activites.patients.reverse()
                    }, {
                        label: "Systolique",
                        fillColor: "rgba(103,58,183,0.5)",
                        strokeColor: "rgba(103,58,183,1.0)",
                        pointColor: "rgba(103,58,183,1.0)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(103,58,183,1.0)",
                        data: this.state.activites.consultations.reverse()
                    }]
                }, 
                {
                    responsive: true,
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return "$" + Number(tooltipItem.yLabel) + " and so worth it !";
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Ice Cream Truck',
                        position: 'bottom'
                    },
                }
            );
        }

        if(window.$("#maladies-chartjs").length) {
            var doughnutData = [{
                value: 200,
                color: "#E91E63",
                highlight: "rgba(250,133,100,0.8)",
                label: "Paludisme"
            }, {
                value: 150,
                color: "#2acd72",
                highlight: "rgba(44,188,108,0.65)",
                label: "Epathite"
            }, {
                value: 100,
                color: "#eee",
                highlight: "#e1dcdc",
                label: "Cholera"
            }, {
                value: 120,
                color: "rgba(103,58,183,1.0)",
                highlight: "rgba(103,58,183,0.8)",
                label: "Ebola"
            }

            ];

            var ctxd = document.getElementById("maladies-chartjs").getContext("2d");
            var myDoughnut = new window.Chart(ctxd).Doughnut(doughnutData, {
                responsive: true
            });
        }

        if(window.$("#patient-incoming-chartjs").length){

            var patientsIncomingChartData = {
                labels: this.state.patients_incoming.labels.reverse(),
                datasets: [{
                    fillColor: "#26dad2",
                    strokeColor: "#26dad2",
                    highlightFill: "rgba(38,218,210,0.8)",
                    highlightStroke: "#26dad2",
                    data: this.state.patients_incoming.males.reverse()
                }, {
                    fillColor: "rgba(70, 128, 255,1)",
                    strokeColor: "rgba(70, 128, 255,0.8)",
                    highlightFill: "rgba(70, 128, 255,0.8)",
                    highlightStroke: "rgba(70, 128, 255,1.0)",
                    data: this.state.patients_incoming.females.reverse()
                }]

            }

            var ctxb = document.getElementById("patient-incoming-chartjs").getContext("2d");
            new window.Chart(ctxb).Bar(patientsIncomingChartData);
        }
    }

    getOrderedRDVs = () => {
        var rdvs = {};

        this.state.rdv.liste.map( (rdv) => {
            var date = new Date(rdv.date_consultation);
            var key = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

            if ( rdvs.hasOwnProperty(key) ) {
                rdvs[key].push(rdv);
            }
            else {
                rdvs[key] = [rdv];
            }
        });

        console.log(rdvs);
        this.setState({orderedRDVs: rdvs});
    }

    getDateKey = (date) => {
        date = new Date(date);
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    }

    render() {
        const borderColors = ['#2acd72', '#f46bd7', '#ffc04f', '#07c7e0'];
        
        return (
            <div>
                {/* <PageTitle title="Tableau de board" /> */}

                <div>
                    <div className="row">
                        <div className="col-lg-9"> 
                            <div className="row dashboard-resume-list">
                                
                                <DashboardResumeItem 
                                    title="Total Patients" 
                                    value={this.state.patients.total} icon={patientIcon4} 
                                    footer={{label: "Total nouveau patient", value: this.state.patients.new}} 
                                    style={{
                                        backgroundImage: "linear-gradient(to right bottom, #00d0c2, #1fd3c6, #2fd6ca, #3bd9ce, #46dcd2)",
                                        boxShadow: "0px 0px 15px 0px rgba(70,220,210,1)"
                                    }}
                                />
                                <DashboardResumeItem 
                                    title="Total Consultations" 
                                    value={this.state.consultations.total} icon={patientIcon2} 
                                    footer={{label: "Consultation à venir", value: this.state.consultations.a_venir}} 
                                    style={{
                                        backgroundImage: "linear-gradient(to right top, #6e8df2, #6686f1, #5e7ff1, #5578f0, #4d71ef)",
                                        boxShadow: "0px 0px 15px 0px #4d71ef"
                                    }}
                                />
                                <DashboardResumeItem 
                                    title="Rendez-vous" 
                                    value={this.state.rdv.total} icon={patientIcon} 
                                    footer={{label: "Rendez-vous d'aujourd'hui", value: this.state.orderedRDVs[this.getDateKey(new Date())] ? this.state.orderedRDVs[this.getDateKey(new Date())].length : 0}} 
                                    style={{
                                        backgroundImage: "linear-gradient(to right top, #f29d6e, #f29765, #f1915d, #f18b54, #f0854c)",
                                        boxShadow: "0px 0px 15px 0px #F29D6E"
                                    }}
                                />
                                
                            </div>

                            <section className="box doctor-activity">
                                <header className="panel_header">
                                    <h2 className="title pull-left">Evolution du nombre de consultations et de patients dans le temps</h2>
                                </header>
                                <div className="content-body">    
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <div className="doctor-activity-chart-box">
                                                
                                                <canvas id="activity-chartjs"></canvas>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="row">
                                <div className="col-lg-6">
                                    <section className="box diseases-report">
                                        <header className="panel_header">
                                            <h2 className="title pull-left">Les maladies recurrentes</h2>
                                        </header>
                                        <div className="content-body">    
                                            <div className="row">
                                                <div className="col-xs-12">
                                                    <div className="doctor-activity-chart-box">
                                                        
                                                        <canvas id="maladies-chartjs"></canvas>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <div className="col-lg-6">
                                    <section className="box patient-income">
                                        <header className="panel_header">
                                            <h2 className="title pull-left">Répartition des patients par sexe</h2>
                                        </header>
                                        <div className="content-body">    
                                            <div className="row">
                                                <div className="col-xs-12">
                                                    <div className="doctor-activity-chart-box">
                                                        
                                                        <canvas id="patient-incoming-chartjs" style={{width: '100%', height: '200px'}}></canvas>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3" id="appointments">
                            
                            <div className="appointment-day today-appointment">
                                <div className="appointment-day-header row">
                                    <div className="col-lg-8"><span>Rendez-vous</span></div>
                                    <div className="col-lg-4" style={{padding: '0 5px'}}><span className="appointment-date">AUJOURD'HUI</span></div>
                                </div>
                                <div className="appointment-day-content" style={{height: '300px'}}>
                                    { this.state.orderedRDVs[this.getDateKey(new Date())] && this.state.orderedRDVs[this.getDateKey(new Date())].map( (rdv) => (
                                        <div className="item" key={rdv.id}>
                                            <div className="row" style={{borderLeft: `2px solid ${random_item(borderColors)}`}}>
                                                {/* <div className="col-lg-2" style={{padding: 0, background: 'white'}}>
                                                    <div className="avatar" style={{backgroundImage: `url(${BOY_AVATAR})`}}></div>
                                                </div> */}
                                                <div className="col-lg-12" style={{ background: 'white' }}>
                                                    <div className="nom-motif">
                                                        <span> { rdv.patient.nom} </span>
                                                        <span> - </span>
                                                        <span> { rdv.hopital.denomination} </span>{/* MOTIF DE CONSULTATION */}
                                                    </div>
                                                    <div className="heure">
                                                        <span>{literalHour(rdv.date_consultation)} </span>
                                                        <span> . </span>
                                                        <span> 30 Mins </span>
                                                    </div>
                                                    <div style={{padding: "5px 0 5px 0"}}>
                                                        <Link to={`/patients_details/${rdv.patient.id}`} className="appointment-action">HISTORIQUE</Link>
                                                        <Link to={`/patient/consultation/new/?appointment=${rdv.id}`} className="appointment-action" style={{color: '#00c4ff'}}>CONSULTER</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                        
                                </div>
                            </div>

                            { Object.keys(this.state.orderedRDVs).map( (key) => {
                                
                                return (
                                    <div key={key} className="appointment-day">
                                        <div className="appointment-day-header row">
                                            <div className="col-lg-7"><span>Rendez-vous passés</span></div>
                                            <div className="col-lg-5" style={{padding: '0 5px'}}><span className="appointment-date">{LitteralDate(key, "SMALL")}</span></div>
                                        </div>
                                        <div className="appointment-day-content">

                                            { this.state.orderedRDVs[key].map( (rdv) => {
                                                return (
                                                    <div key={rdv.id} className="item">
                                                        <div className="row" style={{borderLeft: `1px solid #6565653b`}}>
                                                            <div className="col-lg-12" style={{ background: 'white' }}>
                                                                <div className="nom-motif">
                                                                    <span>{ rdv.patient.nom} </span>
                                                                    <span> - </span>
                                                                    <span> { rdv.hopital.denomination} </span>
                                                                </div>
                                                                <div className="heure">
                                                                    <span>{literalHour(rdv.date_consultation)} </span>
                                                                    {/* <span> . </span> */}
                                                                    {/* <span> 30 Mins </span> */}
                                                                </div>
                                                                <div style={{padding: "5px 0 5px 0"}}>
                                                                    <span className="appointment-action" style={{color: 'gray'}}>HISTORIQUE MEDICAL</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                                    
                                        </div>
                                    </div>
                                )
                                
                            })}

                        </div>
                    </div>
                </div>

                <div className="modal fade col-xs-12 d-none" id="doctorDetailsModal" tabIndex="-1" role="dialog"aria-hidden="true">
                    <div className="modal-dialog h-available" style={{ width: 96+"%"}}>
                        <div className="modal-content h-available" style={{  }}>
                            <div className="modal-body h-available" style={{ padding: 0 }}>
                                <DoctorDetailForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DoctorDashboard;
