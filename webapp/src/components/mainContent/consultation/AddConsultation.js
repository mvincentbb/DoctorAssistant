import React from "react";
import qs from "qs";
import FormBox from "../../card/FormBox";

import ConsultationDataService from "../../../services/consultation.service";
import DemandeConsultationsDataService from "../../../services/demande_consultation.service";
import PatientDataService from "../../../services/patient.service";
import StructureSanitaireDataService from "../../../services/structureSanitaire.service";
import OrdonnanceService from "../../../services/ordonnance.service";
import PrescriptionService from "../../../services/prescription.service";
import ProduitService from "../../../services/produit.service";

import Cookies from "universal-cookie";
import DemandeConsultationHeader from "../demande_consultation/DemandeConsultationHeader";
import SearchSelect from "../../card/SearchSelect";
import { LitteralDate, literalHour } from "../../../utils";

const cookies = new Cookies();
class AddConsultation extends React.Component {
    
    constructor(props) {
        super(props);

        const { } = this.props;
        const { location: { search } } = this.props;
        const queries = qs.parse(search.slice(1));
        console.log(queries);
        
        this.state = {
            consultation: {
                demande_consultation: (queries.appointment) ? parseInt(queries.appointment) : null,
                motif: "Motif",
                interrogatoire: "interrogatoire",
                resume: "resume",
                hypothese_diagnostique: "hypothese_diagnostique",

                constantes: {
                    id: null,
                    temperature: "30",
                    poids: "100",
                    taille: "160",
                    systolique: "30",
                    diastolique: "30",
                    glycemie: "30",
                    cholesterol: "35",
                    pouls: "45",
                },
            },

            ordonnance: {
                consultation: null
            },
            prescription: {
                produit: {
                    id: 0,
                    denomination: "",
                    nom_commercial: "Quaterm",
                    dosage: "",
                    forme: "Comprimé",
                },
                quantite: 1,
                posologie: "1 mat 1 soir"
            },

            selectedOrdonnance: null,

            submitted: false,
            isSubmitting: false,
            isisDemandeConsultationChecked: false,
            demandes: [],
            patients: [],
            produits:[],
            structures: [],
            ordonnances: [],
            structure: {},
            consultationMessage: String,
            demandeConsultation: { status: 1, patient: this.props.patientId },
            selectedPatient: null
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleConstanteInputChange = this.handleConstanteInputChange.bind(this);
        this.saveConsultation = this.saveConsultation.bind(this);
        this.handleCKEInputChange = this.handleCKEInputChange.bind(this);
    }

    changePatientPhoto = (demande_id) => {
        for (let demande of this.state.demandes) {
            if (demande.id === demande_id) {
                for (let patient of this.state.patients) {
                    if (demande.patient === patient.id) {
                        this.setState({selectedPatient: patient});
                    }
                }
            }
        }
    }

    handleInputChange(name, value) {
        if (name === "demande_consultation") {
            console.log("CHANGING... ", value);
            this.changePatientPhoto(value);
        }

        this.setState({ structure: { ...this.state.structure, [name]: value }, consultation: { ...this.state.consultation, [name]: value } });
        console.log("CHANGING... ", name, value);
    }

    handleConstanteInputChange(name, value) {
        this.setState({ 
            consultation: { 
                ...this.state.consultation, 
                constantes: {...this.state.consultation.constantes, [name]: value} 
            } 
        });
    }

    handleCKEInputChange(name, data) {
        console.log(name, data);
        this.setState({
            consultation: { ...this.state.consultation, [name]: data },
        });
    }

    componentWillMount() {

        const { } = this.props;
        const { location: { search } } = this.props;
        const queries = qs.parse(search.slice(1));

        DemandeConsultationsDataService.getAll()
        .then((response) => {
            this.setState({ demandes: response.data }, () => { 
                if (queries.appointment) {
                    this.changePatientPhoto(parseInt(queries.appointment));
                }
            });
        })
        .catch(() => {
            window.showErrorMessage("Echec!!")
        });

        ProduitService.getAll()
        .then(response => {
            this.setState({produits: response.data});
        }).catch(e => {
            console.log(e);
        });

        // this.refreshOrdonnances();

        PatientDataService.getAll()
        .then((response) => {
            this.setState({ patients: response.data }, () => { 
                if (queries.appointment) {
                    this.changePatientPhoto(parseInt(queries.appointment));
                }
            });
        })
        .catch(() => {
            window.showErrorMessage("Echec!!")
        });

        StructureSanitaireDataService.getMine()
        .then((response) => {
            this.setState({ structures: response.data });
        })
        .catch(() => {
            window.showErrorMessage("Echec!!")
        });
    }

    refreshOrdonnances = () => {
        ConsultationDataService.getOrdonnances(this.state.consultation.id)
        .then((response) => {
            this.setState({ ordonnances: response.data }, this.refreshSelectedOrdonnance);
        })
        .catch(() => {
            window.showErrorMessage("Echec!!")
        });
    }

    refreshSelectedOrdonnance = () => {
        var res = null;
        if (this.state.selectedOrdonnance !== null) {
            for (let ordonnance of this.state.ordonnances) {
                if (this.state.selectedOrdonnance.id === ordonnance.id) {
                    res = ordonnance;
                    break;
                }
            }
            console.log(res);
            this.setState({selectedOrdonnance: res});
        }
    }

    addOrdonnance = () => {
        const data = this.state.ordonnance;
        OrdonnanceService.create(data)
        .then(() => {
            this.refreshOrdonnances();
        })
        .catch(() => {
            window.showErrorMessage("Echec!!")
        });
    }

    addPrescription = () => {
        if (this.state.prescription.produit.id) {
            const data = {
                ...this.state.prescription,
                produit: this.state.prescription.produit.id,
                ordonnance: this.state.selectedOrdonnance.id,
            };
            PrescriptionService.create(data)
            .then(() => {
                this.refreshOrdonnances();
            })
            .catch(() => {
                window.showErrorMessage("Echec!!")
            });
        }
    }

    deleteOrdonnance = (id) => {
        OrdonnanceService.delete(id)
        .then(() => {
            this.refreshOrdonnances();
        })
        .catch(() => {
            window.showErrorMessage("Echec!!");
        });
    }

    deletePrescription = (id) => {
        PrescriptionService.delete(id)
        .then(() => {
            this.refreshOrdonnances();
        })
        .catch(() => {
            window.showErrorMessage("Echec!!");
        });
    }

    editOrdonnance = (ordonnance) => {
        this.setState({selectedOrdonnance: ordonnance});
    }

    handlePrescriptionInputChange = (name, value) => {
        console.log("prescription")
        this.setState({ 
            prescription: { 
                ...this.state.prescription, 
                [name]: name === "produit" ? this.getSelectedProduit(value) : value
            } 
        });
    }

    getSelectedProduit = (id) => {
        for (let produit of this.state.produits) {
            if (parseInt(id) === produit.id) 
                return produit
        }
        return null
    }

    componentDidMount() {
        window.$(document).ready(function () {
            //Initialize tooltips
            window.$('.nav-tabs > li a[title]').tooltip();
            
            //Wizard
            window.$('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        
                var $target = window.$(e.target);
            
                if ($target.parent().hasClass('disabled')) {
                    return false;
                }
            });
        
            window.$(".next-step").click(function () {
        
                var $active = window.$('.wizard .nav-tabs li.active');
                $active.next().removeClass('disabled');
                nextTab($active);
        
            });
            window.$(".prev-step").click(function () {
        
                var $active = window.$('.wizard .nav-tabs li.active');
                prevTab($active);
        
            });

            function nextTab(elem) {
                window.$(elem).next().find('a[data-toggle="tab"]').click();
            }
            function prevTab(elem) {
                window.$(elem).prev().find('a[data-toggle="tab"]').click();
            }
        });
    }

    saveConsultation(e) {
        const target = e.target;
        var user = cookies.get("loggedUser");
        
        var data = {
            structure_sanitaire_pk:this.state.structure.id,
            medecin_pk:user.id,
            ...this.state.consultation,
            ...this.state.demandeConsultation,
        };

        ConsultationDataService.create(data)
            .then(response => {
                window.showSuccess('the consultation has been saved successfuly');
                this.setState({
                    ordonnance: {consultation: response.data.id},
                    consultation: response.data
                });
                window.$(target).parent().prev().find("button").trigger("click");
            })
            .catch(() => {
                window.showErrorMessage("Echec!!")
            });
    }

    goBack = () =>{
        this.setState({selectedOrdonnance: null});
    }
    
    render() {

        const { } = this.props;
        const { location: { search } } = this.props;
        const queries = qs.parse(search.slice(1));

        function getConsultationMessage(patients,patient, ndate){
            const date = new Date(ndate)
            const mdate = ("0"+date.getDay()).slice(-2, 3)+"/"+("0"+date.getMonth()).slice(-2,3)+"/"+date.getFullYear()+" A "+("0"+date.getHours()).slice(-2,3)+":"+("0"+date.getMinutes()).slice(-2,3)+":"+("0"+date.getSeconds()).slice(-2,3)
            var person = patients.find((p) => p.id === patient);
            var message = person?.nom + " "+person?.prenom+" a demande une consultation, le  "+mdate
            return message;
        }
        

        const demandesSelectOptions = [ {id: -1, libelle: "----Selectionnez une demande de consultation-----"} ].concat(this.state.demandes.map((demande)=>(this.state.patients.find(patient =>patient.id == demande.patient))?(({id:demande.id, libelle: getConsultationMessage(this.state.patients,demande.patient,demande.date_consultation)})):{}));

        const structureSelectOptions = [ {id: -1, libelle: "---- selectionner une stucture sanitaire -----"} ].concat(this.state.structures.map((structure)=>({id:structure.id,libelle:structure.denomination})));

        const formBoxes = [
            {
                headerTitle: "Constantes",
                fields: [
                    {
                        type: "number",
                        label: "Température",
                        name: "temperature",
                        value: this.state.consultation.constantes.temperature,
                    },
                    {
                        type: "number",
                        label: "Poids (Kg)",
                        name: "poids",
                        value: this.state.consultation.constantes.poids,
                    },
                    {
                        type: "number",
                        label: "Taille (cm)",
                        name: "taille",
                        value: this.state.consultation.constantes.taille,
                    },
                    {
                        type: "number",
                        label: "Systolique",
                        name: "systolique",
                        value: this.state.consultation.constantes.systolique,
                    },
                    {
                        type: "number",
                        label: "Diastolique",
                        name: "diastolique",
                        value: this.state.consultation.constantes.diastolique,
                    },
                    {
                        type: "number",
                        label: "Glycemie (mg/dl)",
                        name: "glycemie",
                        value: this.state.consultation.constantes.glycemie,
                    },
                    {
                        type: "number",
                        label: "Cholesterol (mg/dl)",
                        name: "cholesterol",
                        value: this.state.consultation.constantes.cholesterol,
                    },
                    {
                        type: "number",
                        label: "Pouls (Par minute)",
                        name: "pouls",
                        value: this.state.consultation.constantes.pouls,
                    },

                ],
            },

            {
                headerTitle: "Details de la consultation",
                fields: [
                    {
                        type: "Cke",
                        label: "Motif",
                        name: "motif",
                        value: this.state.consultation.motif,
                    },
                    {
                        type: "Cke",
                        label: "Interrogatoire",
                        name: "interrogatoire",
                        value: this.state.consultation.interrogatoire,
                    },
                    {
                        type: "Cke",
                        label: "Resume",
                        name: "resume",
                        value: this.state.consultation.resume,
                    },
                    {
                        type: "Cke",
                        label: "hypothese diagnostique",
                        name: "hypothese_diagnostique",
                        value: this.state.consultation.hypothese_diagnostique,
                    }
                ],
            },
            
        ];

        var tmp = queries.appointment ? null : (
            this.props.detail == "detail" ? {
                type: "select",
                label: "Liste de structure sanitaires",
                name: "id",
                value: this.state.structure.id,
                selectOptions: structureSelectOptions,
            } : {
                type: "select",
                label: "Demande de consultation",
                name: "demande_consultation",
                value: this.state.consultation.demande_consultation,
                selectOptions: demandesSelectOptions,
            }
        )

        if (tmp)
            formBoxes[1].fields = [tmp].concat(formBoxes[1].fields);

    return (
      <div>
        {/* <PageTitle title="Ajout d'une nouvelle consultation" /> */}

        <div className="col-xs-12 ">
            
            <DemandeConsultationHeader 
                entityName="Nouvelle consultation" 
                patientPhoto={this.state.consultation.demande_consultation && this.state.selectedPatient ? this.state.selectedPatient.photo : null} 
                hospitalPhoto={null} />
          
            <div className="bg-w">

                <div className="">
                    <div className="row">
                        <section>
                            <div className="wizard">
                                <div className="wizard-inner">
                                    <div className="connecting-line"></div>
                                    <ul className="nav nav-tabs" role="tablist">

                                        <li role="presentation" className="active">
                                            <a href="#step1" data-toggle="tab" aria-controls="step1" role="tab" title="Constantes">
                                                <span className="round-tab">
                                                    <i className="fas fa-thermometer-half" style={{fontSize: '2rem', color: '#555555'}}></i>
                                                </span>
                                            </a>
                                        </li>

                                        <li role="presentation" className="disabled">
                                            <a href="#step2" data-toggle="tab" aria-controls="step2" role="tab" title="Details de la consultation">
                                                <span className="round-tab">
                                                    <i className="fas fa-book-medical" style={{fontSize: '2rem', color: '#555555'}}></i>
                                                </span>
                                            </a>
                                        </li>

                                        <li role="presentation" className="disabled">
                                            <a href="#step3" data-toggle="tab" aria-controls="step3" role="tab" title="Ordonance">
                                                <span className="round-tab">
                                                    <i className="fas fa-list-ol" style={{fontSize: '2rem', color: '#555555'}}></i>
                                                </span>
                                            </a>
                                        </li>

                                        <li role="presentation" className="disabled">
                                            <a href="#complete" data-toggle="tab" aria-controls="complete" role="tab" title="Complete">
                                                <span className="round-tab">
                                                    <i className="fas fa-thumbs-up" style={{fontSize: '2rem', color: '#555555'}}></i>
                                                </span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <div role="form">
                                    <div className="tab-content">

                                        { formBoxes.map((box, index) => (

                                            <div key={index} className={`tab-pane ${index===0 ? "active" : ""}`} role="tabpanel" id={`step${index+1}`}>
                                                {/* ${index===0 ? "active" : ""} */}
                                                <FormBox
                                                    box={box}
                                                    key={box.headerTitle}
                                                    fromType="add"
                                                    isSubmitting={this.state.isSubmitting}
                                                    onInputChange={ box.headerTitle === "Constantes" ? this.handleConstanteInputChange : this.handleInputChange}
                                                    onCKEditorChange={this.handleCKEInputChange}
                                                    onSaveBtnTapped={this.saveConsultation}
                                                />
                                                <div>
                                                    { index === 0 && (
                                                        <ul className="list-inline pull-right">
                                                            <li><button type="button" className="btn btn-primary next-step">Suivant</button></li>
                                                        </ul>
                                                    )}

                                                    { index === 1 && (
                                                        <ul className="list-inline pull-right">
                                                            <li><button type="button" className="btn btn-default prev-step">Précédant</button></li>
                                                            <li style={{display: 'none'}}><button type="button" className="btn btn-primary next-step">Enregistrer et continuer</button></li>
                                                            <li><button type="button" onClick={this.saveConsultation} className="btn btn-primary">Enregistrer et continuer</button></li>
                                                        </ul>
                                                    )}

                                                    { index === 2 && (
                                                        <ul className="list-inline pull-right">
                                                            <li><button type="button" className="btn btn-default prev-step">Précédant</button></li>
                                                            <li><button type="button" className="btn btn-primary btn-info-full next-step">Terminer</button></li>
                                                        </ul>
                                                    )}
                                                </div>
                                                    
                                            </div>
                                        
                                        )) }

                                        <div className="tab-pane" role="tabpanel" id="step3">

                                            { this.state.selectedOrdonnance ? (
                                                <div id="prescription-tab-pane">
                                                    <span onClick={this.goBack} className="back__btn"><i className="fas fa-arrow-left fa-2x"></i></span>
                                                    <div className="row">

                                                        { this.state.selectedOrdonnance.prescriptions.map( (prescription)=> {

                                                            return (
                                                                <div key={prescription.id} className="col-lg-12">
                                                                    <div className="prescription-item">
                                                                        <div className="row">
                                                                            <div className="col-lg-3" style={{textAlign: 'unset'}}>
                                                                                <span className="icon"><i className="fas fa-pills fa-2x" aria-hidden="true"></i></span>
                                                                                <span>{prescription.produit.nom_commercial}</span>
                                                                            </div>

                                                                            <div className="col-lg-2">
                                                                                <span>{prescription.produit.forme}</span>
                                                                            </div>

                                                                            <div className="col-lg-2">
                                                                                <span>{prescription.produit.dosage}</span>
                                                                            </div>

                                                                            <div className="col-lg-2">
                                                                                <span>{prescription.quantite}</span>
                                                                            </div>

                                                                            <div className="col-lg-2">
                                                                                <span>{prescription.posologie}</span>
                                                                            </div>

                                                                            <div className="col-lg-1">
                                                                                <span onClick={ () => { this.deletePrescription(prescription.id)}} className="icon"><i style={{color: '#e45e85'}} className="fas fa-trash fa-2x" aria-hidden="true"></i></span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }) }

                                                        <div id="prescription-form" className="row">
                                                            <div className="col col-lg-3" style={{textAlign: 'unset'}}>
                                                                <label>Désignation</label>

                                                                <SearchSelect
                                                                    options={ this.state.produits.map( (produit) => (
                                                                        { id: produit.id, value: `${produit.nom_commercial} | ${produit.forme} | ${produit.dosage}` }
                                                                    ))}
                                                                    onInputChange={this.handlePrescriptionInputChange}
                                                                    value={this.state.prescription.produit.id}
                                                                    name="produit"
                                                                />
                                                            </div>

                                                            <div className="col col-lg-2">
                                                                <label>Présentation</label>
                                                                <input type="text" className="form-control" disabled value={this.state.prescription.produit.forme} />
                                                            </div>

                                                            <div className="col col-lg-2">
                                                                <label>Dosage</label>
                                                                <input type="text" className="form-control" disabled value={this.state.prescription.produit.dosage} />
                                                            </div>

                                                            <div className="col col-lg-2">
                                                                <label>Quantité</label>
                                                                <input onChange={ (e) => {this.handlePrescriptionInputChange("quantite", e.target.value)}} type="number" className="form-control" value={this.state.prescription.quatite} />
                                                            </div>

                                                            <div className="col col-lg-2">
                                                                <label>Posologie</label>
                                                                <input onChange={ (e) => {this.handlePrescriptionInputChange("posologie", e.target.value)}} type="text" className="form-control" value={this.state.prescription.posologie}/>
                                                            </div>

                                                            <div className="col col-lg-1">
                                                                <span onClick={ () => {  }} className="icon" style={{padding: '10px', textAlign: 'center'}}>
                                                                    <i style={{color: '#e45e85'}} className="fas fa-times fa-2x" aria-hidden="true"></i>
                                                                </span>
                                                            </div>
                                                        </div>
                                                                
                                                        <div className="col-lg-12">
                                                            <div className="new-prescription-placeholder" onClick={this.addPrescription}>
                                                                <div className="content">
                                                                    <div className="moncircle monshape" style={{margin: '5px 0px 0 0', width: '50px', height: '50px', background: '#17a4d8' }} title="Ajouter une prescription">
                                                                        <i className="text fa fa-plus fa-3x" style={{textShadow: 'none', fontSize: '3em'}}></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div id="ordonnance-tab-pane">
                                                    <div className="row">
                                                        { this.state.ordonnances.map( (ordonnance, index)=> {

                                                            return (
                                                                <div key={ordonnance.id} className="col-lg-3">
                                                                    <div className="ordonnance-item">
                                                                        <div className="ordonnance-title">Ordonnance No {index+1} </div>
                                                                        <div>Date : {LitteralDate(ordonnance.mod_date_time, "SMALL")}</div>
                                                                        <div>Heure : {literalHour(ordonnance.mod_date_time)}</div>

                                                                        <section className="actions-overlay">
                                                                            <div onClick={ () => {this.editOrdonnance(ordonnance)} } className="action left-action"><i className="fas fa-pen-alt fa-2x"></i></div>
                                                                            <div onClick={ () => {this.deleteOrdonnance(ordonnance.id)} } className="action right-action"><i className="fas fa-trash fa-2x"></i></div>
                                                                        </section>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                                
                                                        <div className="col-lg-3">
                                                            <div className="new-record-placeholder" onClick={this.addOrdonnance}>
                                                                <div className="content">
                                                                    <div className="moncircle monshape" style={{margin: '13px 10px 0 0', width: '70px', height: '70px', background: '#17a4d8' }} title="Ajouter une ordonnance">
                                                                        <i className="text fa fa-plus fa-3x" style={{textShadow: 'none', fontSize: '3em'}}></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <ul className="list-inline pull-right">
                                                <li><button type="button" className="btn btn-default prev-step">Précédant</button></li>
                                                <li><button type="button" className="btn btn-primary btn-info-full next-step">Terminer</button></li>
                                            </ul>
                                        </div>

                                        <div className="tab-pane" role="tabpanel" id="complete">
                                            <h3>Complete</h3>
                                            <p>You have successfully completed all steps.</p>
                                        </div>
                                        <div className="clearfix"></div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

            </div>
        </div>
      </div>
    );
  }
}

export default AddConsultation;
