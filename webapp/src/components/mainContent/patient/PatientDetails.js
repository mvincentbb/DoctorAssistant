import React from 'react';
import { Link } from 'react-router-dom';

import PageTitle from '../../card/PageTitle';
import PatientDataService from "../../../services/patient.service";
import NotFound from "../error/404";
import computedAge, {GIRL_AVATAR, BOY_AVATAR, LitteralDate} from '../../../utils';
import PatientInfoItem from '../../card/PatientInfoItem';
import AddConsultation from '../consultation/AddConsultation';
import loading from '../../../data/icons/loading.svg';
import AvatarPreview from '../../card/AvatarPreview';
import TagList from '../../card/TagList';
import { format } from 'path';

class PatientDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            patient: {id: null, 
                nom: "", 
                prenom: "", 
                adresse: "", 
                telephone: "", 
                date_naissance: "", 
                genre: "",
                groupage: "",
                maladies: "",
                allergies: "",
                habitude_alimentaires: "",
                photo: "",
            },
            IMCs: [],
            heartRate: [],
            clolesterol: [],
            glucoseRate: [],
            bloodPressures: [[], []],
        }
    }

    componentWillMount() {
        const { match: { params } } = this.props;
        
        PatientDataService.get(params.id)
        .then(response => {
            this.setState({patient: {...response.data} });
            this.setState({ 
                IMCs: this.getIMCData(), 
                heartRate: this.getHeartRateData(), 
                glucoseRate: this.getGlucoseRateData(), 
                clolesterol : this.getClolesterolData(),
                bloodPressures : this.getBloodPressureData(),
            });

        }).catch(e => {
            this.setState({patient: {...this.state.patient, id: 0}});
            console.log(e);
        });
    }
    
    componentDidMount() {
        window.$(document).ready( () => {
            window.setTimeout(() => {
                this.initCharts();
            }, 1000);
        });
    }

    initCharts = () => {
        if(window.$("#blood-pressure-chart").length && this.state.bloodPressures[0].length) {
            var ctx = window.$("#blood-pressure-chart")[0].getContext("2d");
            
            var myBarChart = new window.Chart(ctx).Line(
                {
                    labels: this.state.bloodPressures[2],
                    datasets: [{
                        label: "Diastolique",
                        fillColor: "rgba(63,81,181,0.5)",
                        strokeColor: "rgba(63,81,181,1)",
                        pointColor: "rgba(63,81,181,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(63,81,181,1)",
                        data: this.state.bloodPressures[0].reverse()
                    }, {
                        label: "Systolique",
                        fillColor: "rgba(103,58,183,0.5)",
                        strokeColor: "rgba(103,58,183,1.0)",
                        pointColor: "rgba(103,58,183,1.0)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(103,58,183,1.0)",
                        data: this.state.bloodPressures[1].reverse()
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

        if(window.$("#IMC_sparkline").length && this.state.IMCs.length) {
            window.$("#IMC_sparkline").sparkline(this.state.IMCs.reverse(), {
                type: 'line',
                width: '100%',
                height: '60',
                lineColor: '#99d683',
                fillColor: '#99d683',
                maxSpotColor: '#99d683',
                highlightLineColor: 'rgba(0, 0, 0, 0.2)',
                highlightSpotColor: '#99d683'
            });
        }

        if(window.$("#heart_rate_sparkline").length && this.state.heartRate.length) {
            window.$("#heart_rate_sparkline").sparkline(this.state.heartRate.reverse(), {
                type: 'line',
                width: '100%',
                height: '60',
                lineColor: '#13dafe',
                fillColor: '#13dafe',
                minSpotColor:'#13dafe',
                maxSpotColor: '#13dafe',
                highlightLineColor: 'rgba(0, 0, 0, 0.2)',
                highlightSpotColor: '#13dafe'
            });
        }

        if(window.$("#glucose_sparkline").length && this.state.glucoseRate.length) {
            window.$("#glucose_sparkline").sparkline(this.state.glucoseRate.reverse(), {
                type: 'line',
                width: '100%',
                height: '80',
                lineColor: '#6164c1',
                fillColor: 'rgba(97, 100, 193, 0.3)',
                highlightLineColor: 'rgba(0,0,0,.1)',
                highlightSpotColor: 'rgba(0,0,0,.2)'
            });
        }

        if(window.$("#clolesterol_sparkline").length && this.state.clolesterol.length) {
            window.$("#clolesterol_sparkline").sparkline(this.state.clolesterol.reverse(), {
                type: 'line',
                width: '100%',
                height: '80',
                lineColor: '#13dafe',
                fillColor: 'rgba(19, 218, 254, 0.3)',
                maxSpotColor: '#99d683',
                highlightLineColor: 'rgba(0, 0, 0, 0.2)',
                highlightSpotColor: 'rgba(0,0,0,.2)'
            });
        }
    };

    getBloodPressureData = () =>  {
        var consultations = this.state.patient.consultations.slice(0, 6);
        var labels = consultations.map( (consultation) => {
            return LitteralDate(consultation.demande_consultation.date_consultation, "SMALL");
        });
        var systolics = consultations.map( (consultation) => {
            return consultation.constantes.systolique;
        });
        var diastolics = consultations.map( (consultation) => {
            return consultation.constantes.diastolique;
        });
        return [diastolics, systolics, labels];
    }

    getIMCData = () =>  {
        var consultations = this.state.patient.consultations,
            IMCs = [],
            masse = null, taille = null;
        
        for(let consultation of consultations) {
            masse = window.parseFloat(consultation.constantes.poids);
            taille = window.parseFloat(consultation.constantes.taille) / 100;
            IMCs.push((masse / (taille * taille)).toFixed(2));
        }
        // console.log(IMCs);
        return IMCs;
    };

    getHeartRateData = () =>  {
        var consultations = this.state.patient.consultations,
        data = [];
        for(let consultation of consultations) {
            data.push(window.parseFloat(consultation.constantes.pouls));
        }
        return data;
    };

    getGlucoseRateData = () =>  {
        var consultations = this.state.patient.consultations,
        data = [];
        for(let consultation of consultations) {
            data.push(window.parseFloat(consultation.constantes.glycemie));
        }
        return data;
    };

    getClolesterolData = () =>  {
        var consultations = this.state.patient.consultations,
        data = [];
        for(let consultation of consultations) {
            data.push(window.parseFloat(consultation.constantes.cholesterol));
        }
        return data;
    };

    render() {
        return (
            <div>
                { this.state.patient.id === null && (
                    <div>
                        <img src={loading} style={{width: '300px', margin: 'auto', display: 'block'}} />
                    </div>
                )}

                { (this.state.patient.id === 0) && (
                    <NotFound />
                )}

                {this.state.patient.id > 0 && (
                    <div>
                        <PageTitle title="Profil du patient" />
                        
                        <div className="clearfix"></div>

                        <div className="col-lg-4">
                            <section className="box ">
                                <div className="content-body p">
                                    <div className="row">
                                        <div className="doctors-list patient relative">
                                            <div className="doctors-head relative text-center">
                                                
                                                { this.state.patient.photo ? (
                                                    <AvatarPreview avatar={this.state.patient.photo} />
                                                ) : (
                                                    <AvatarPreview avatar={this.state.patient.genre === "M" ? BOY_AVATAR : GIRL_AVATAR} />
                                                )}

                                                <h3 className="header w-text relative bold">Nom : {this.state.patient.nom} {this.state.patient.prenom}</h3>
                                                {/* <p className="desc g-text relative">Lorem ipsum dolor sit amet, Earum nes ciunt fugiat enim. Sequi quos labore.</p> */}
                                            </div>
                                            <div className="row">
                                                <div className="patients-info relative">
                                                    <PatientInfoItem title="Sexe" value={this.state.patient.genre === "M" ? "Masculin" : "Féminin"} />
                                                    
                                                    <PatientInfoItem title="Age" value={`${computedAge(this.state.patient.date_naissance)} Ans`} />
                                                    
                                                    { this.state.patient.consultations.length > 0 && (
                                                        <PatientInfoItem title="Taille du patient" value={`${this.state.patient.consultations[0].constantes.taille} cm`} />
                                                    )}
                                                    
                                                    { this.state.patient.consultations.length > 0 && (
                                                        <PatientInfoItem title="Poids du patient" value={`${this.state.patient.consultations[0].constantes.poids} Kg`} />
                                                    )}
                                                </div>
                                            </div>
                                            {/* <!-- end row --> */}
                                            
                                            <div className="col-xs-12 mb-30">
                                                <Link to={`/patients_update/${this.state.patient.id}`} className="btn btn-primary btn-lg gradient-blue d-block" style={{display: 'block', marginTop: '20px'}}>
                                                    <span>Modifier</span>
                                                </Link>
                                                <a data-toggle="modal" href="#cmpltadminModal-7" className="btn btn-primary btn-lg gradient-blue d-block" style={{display: 'block', marginTop: '20px'}}>
                                                    <span>Nouvelle consultation</span>
                                                </a>
                                            </div>
                                            
                                            {/* <div className="modal fade col-xs-12" id="cmpltadminModal-7" tabIndex="-1" role="dialog" aria-hidden="true">
                                                <div className="modal-dialog" style={{width:"80%"}}>
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                                            <h4 className="modal-title">{this.state.patient.nom} {this.state.patient.prenom}</h4>
                                                        </div>
                                                        <div className="modal-body">
                                                            <AddConsultation detail={"detail"} patientId={this.state.patient.id} />
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-info" data-dismiss="modal">Close</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                    
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="col-lg-8 col-md-12">
                            <div className="row">
                                <div className="col-xs-12 col-md-7">
                                    <section className="box ">
                                        <header className="panel_header">
                                            <h2 className="title pull-left">Evolution de la tension artérielle</h2>
                                            
                                        </header>
                                        <div className="content-body">    
                                            <div className="row">
                                                <div className="col-xs-12">
                                                    <div className="blood-pressure-chart-box">
                                                        
                                                        { this.state.bloodPressures[0].length === 0 ? (
                                                            <div>Aucune donnée disponible</div>
                                                        ) : (
                                                            <canvas id="blood-pressure-chart" height="285" width="340"></canvas>
                                                        )}
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <div className="col-xs-12 col-md-5">
                                    
                                    <section className="box patient-consultations-box">
                                        <header className="panel_header">
                                            <h2 className="title pull-left">Consultations</h2>
                                        </header>
                                        <div className="content-body">    
                                            <div className="row">
                                                <div className="col-xs-12" style={{paddingRight: 0}}>
                                                    <ul className="project-activity list-unstyled mb-0">
                                                        
                                                        { this.state.patient.consultations.map((consultation) => (
                                                            <li key={consultation.id} className="activity-list warning">
                                                                <div className="detail-info">
                                                                    <div className="visit-doc">
                                                                        <small className="text-muted detail-consultation-overwiew" dangerouslySetInnerHTML={{__html: consultation.resume}}></small>
                                                                        <p className="message detail-consultation-overwiew" dangerouslySetInnerHTML={{__html: consultation.motif}}></p>
                                                                        
                                                                    </div>
                                                                    <div className="visit-date visit-stat pull-right">
                                                                        {/* <span></span> */}
                                                                        <Link to={`/consultations_update/${consultation.id}`}>
                                                                            <p className="mb-0">OUVRIR</p>
                                                                        </Link>
                                                                        
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        )) }

                                                        { this.state.patient.consultations.length === 0 && (
                                                            <div>Aucune donnée disponible</div>
                                                        )}
                                                        
                                                    </ul>
                                                </div>      
                                            </div> 
                                            {/* <!-- End .row --> */}
                                        </div>
                                    </section>
                                
                                </div>
                            </div>
                            
                            <div className="row">
                                <div className="col-md-12 col-sm-12">
                                    <section className="box gradient-blue" style={{padding:20+'px'}}>
                                        <div className="patient-personal mb-0">
                                            <h4 className="w-text">Groupe sanguin :</h4>
                                            <p className="mb-0 g-text info-medicales">{this.state.patient.groupage}</p>
                                        </div>
                                        <div className="patient-personal mb-0">
                                            <h4 className="w-text">Allergies :</h4>
                                            <TagList list={this.state.patient.allergies ? this.state.patient.allergies.split(',') : []} />
                                        </div>
                                        <div className="patient-personal mb-0">
                                            <h4 className="w-text">Maladies :</h4>
                                            <TagList list={this.state.patient.maladies ? this.state.patient.maladies.split(',') : []} />
                                        </div>
                                        <div className="patient-personal mb-0">
                                            <h4 className="w-text">Habitudes Alimentaires :</h4>
                                            <TagList list={this.state.patient.habitude_alimentaires ? this.state.patient.habitude_alimentaires.split(',') : []} />
                                        </div>
                                        <div className="patient-personal mb-0">
                                            <h4 className="w-text">Pression artérielle :</h4>
                                            { this.state.patient.consultations.length === 0 ? (
                                                <p className="mb-0 g-text info-medicales"><span>---Néant---</span></p>
                                            ) : (
                                                <p className="mb-0 g-text info-medicales">{this.state.bloodPressures[0][0]}/{this.state.bloodPressures[1][0]} mmHG</p>
                                            )}
                                            
                                        </div>
                                        <div className="patient-personal mb-0">
                                            <h4 className="w-text">Température :</h4>
                                            { this.state.patient.consultations.length === 0 ? (
                                                <p className="mb-0 g-text info-medicales"><span>---Néant---</span></p>
                                            ) : (
                                                <p className="mb-0 g-text info-medicales">{this.state.patient.consultations[0].constantes.temperature} Degree</p>
                                            )}
                                            
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>

                        <div className="clearfix"></div>

                        <div className="col-md-12 col-sm-12 col-xs-12">

                            <div className="row mt-15">
                                <div className="col-md-6 col-xs-12 ">
                                    <div className="r1_graph1 db_box db_box_large has-shadow2">
                                        <div className="pat-info-wrapper">
                                            <div className="pat-info text-left">
                                                <h5 className="">Indice de masse corporelle</h5>
                                                
                                                { this.state.IMCs.length > 0 && (
                                                    <h6>
                                                        { this.state.IMCs[0] < 16.5 && ("anorexie") }
                                                        { (this.state.IMCs[0] >= 16.5 && this.state.IMCs[0] < 18.5) && ("maigreur") }
                                                        { (this.state.IMCs[0] >= 18.5 && this.state.IMCs[0] < 25) && ("poids normal") }
                                                        { (this.state.IMCs[0] >= 25 && this.state.IMCs[0] < 30) && ("surpoids") }
                                                        { (this.state.IMCs[0] >= 30 && this.state.IMCs[0] < 35) && ("obésité modérée") }
                                                        { (this.state.IMCs[0] >= 35 && this.state.IMCs[0] <= 40) && ("obésité sévère") }
                                                        { this.state.IMCs[0] > 40 && ("obésité massive") }
                                                    </h6>
                                                )}
                                                
                                            </div>
                                            <div className="pat-val relative">
                                                <h4 className="value p-text">{ this.state.IMCs.length > 0 && this.state.IMCs[0] } <span>Kg / m²</span></h4>
                                            </div>
                                        </div>
                                        
                                        { this.state.IMCs.length === 0 ? (
                                            <div>Aucune donnée disponible</div>
                                        ) : (
                                            <span id="IMC_sparkline">
                                                <canvas width="121" height="60" style={{display: 'inline-block', width: 121+'px', height: 60+'px', verticalAlign: 'top'}}></canvas>
                                            </span>
                                        )}

                                        
                                    </div>
                                </div>
                                <div className="col-md-6 col-xs-12">
                                    <div className="r1_graph1 db_box db_box_large has-shadow2">
                                        <div className="pat-info-wrapper">
                                            <div className="pat-info text-left">
                                                <h5 className="">Rythme Cardiarque</h5>

                                                { this.state.heartRate.length > 0 && (
                                                    <h6 className="red-text">Above the normal</h6>
                                                )}
                                                
                                            </div>
                                            <div className="pat-val relative">
                                                <h4 className="value red-text">{ this.state.heartRate && this.state.heartRate[0] } <span>Par min</span></h4>
                                            </div>
                                        </div>

                                        { this.state.heartRate.length === 0 ? (
                                            <div>Aucune donnée disponible</div>
                                        ) : (
                                            <span id="heart_rate_sparkline">
                                                <canvas width="121" height="60" style={{display: 'inline-block', verticalAlign: 'top'}}></canvas>
                                            </span>
                                        )}
                                            
                                    </div>
                                </div>
                                
                                <div className="col-md-6 col-xs-12">
                                    <div className="r1_graph1 db_box db_box_large has-shadow2">
                                        <div className="pat-info-wrapper">
                                            <div className="pat-info text-left">
                                                <h5 className="">Glycemie</h5>

                                                { this.state.glucoseRate.length > 0 && (
                                                    <h6>In the normal</h6>
                                                )}
                                                
                                            </div>
                                            <div className="pat-val relative">
                                                <h4 className="value green-text">

                                                    { this.state.glucoseRate.length > 0 && (
                                                        <i className="complete fa fa-arrow-up"></i>
                                                    )}
                                                    
                                                    { this.state.glucoseRate.length && this.state.glucoseRate[0] }
                                                    <span>mg/dl</span>
                                                </h4>
                                            </div>
                                        </div>

                                        { this.state.glucoseRate.length === 0 ? (
                                            <div>Aucune donnée disponible</div>
                                        ) : (
                                            <span id="glucose_sparkline">
                                                <canvas width="214" height="60" style={{display: 'inline-block', verticalAlign: 'top'}}></canvas>
                                            </span>
                                        )}
                                            
                                    </div>
                                </div>
                                <div className="col-md-6 col-xs-12">
                                    <div className="r1_graph1 db_box db_box_large has-shadow2">
                                        <div className="pat-info-wrapper">
                                            <div className="pat-info text-left">
                                                <h5 className="">Cholesterol</h5>

                                                { this.state.glucoseRate.length > 0 && (
                                                    <h6>In the normal</h6>
                                                )}
                                                
                                            </div>
                                            <div className="pat-val relative">
                                                <h4 className="value blue-text">

                                                    { this.state.glucoseRate.length > 0 && (
                                                        <i className="cancelled fa fa-arrow-down"></i>
                                                    )}
                                                    
                                                    { this.state.clolesterol && this.state.clolesterol[0] }
                                                    <span>mg/dl</span>
                                                </h4>
                                            </div>
                                        </div>

                                        { this.state.clolesterol.length === 0 ? (
                                            <div>Aucune donnée disponible</div>
                                        ) : (
                                            <span id="clolesterol_sparkline">
                                                <canvas width="214" height="60" style={{display: 'inline-block', verticalAlign: 'top'}}></canvas>
                                            </span>
                                        )}
                                            
                                    </div>
                                </div>
                            </div>
                        
                        </div>

                        <div className="clearfix"></div>
                    </div>
                )}
                
            </div>
        )
    }
}

export default PatientDetails;