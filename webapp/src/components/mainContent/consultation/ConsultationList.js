import React from 'react';

import PageTitle from '../../card/PageTitle';
import ConsultationDataService from "../../../services/consultation.service";
import ConsultationItem from './ConsultationItem';
import PatientDataService from "../../../services/patient.service"
import DemandeConsultationsDataService from "../../../services/demande_consultation.service"
import EditConsultation from './EditConsultation';
import { data } from 'jquery';


class ConsultationList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            consultations: [],
            patients:[],
            demandes:[],
            selectedconsultation: {id:1},
            edit:false
        }
        this.updateConsultationState = this.updateConsultationState.bind(this);
    }
    componentWillMount() {
        ConsultationDataService.getAll()
        .then(response => {
            this.setState({consultations: response.data});
        }).catch(e => {
            console.log(e);
        });
        DemandeConsultationsDataService.getAll()
        .then(response => {
            this.setState({demandes: response.data});
            console.log(this.state.demandes)
        }).catch(e => {
            console.log(e);
        });
        PatientDataService.getAll()
        .then(response => {
            this.setState({patients: response.data});
            console.log(this.state.patients)
        }).catch(e => {
            console.log(e);
        });
        
    }
    handleSelect = (e) => {
        const selected = this.state.selected;
        selected[e.target.name] = e.target.checked;
        this.setState({ selected });
    } 
    updateConsultationState(consultation){
        this.setState({selectedconsultation:consultation})
    }
    render() {
        function getDemande(demandes,id){
            var dmd = demandes.find(d => d.id === id);
            console.log(dmd+"==========="+id);
            return dmd
        }
        
        return (
            <div>
                <PageTitle title="Toutes les consultations" />
                <section className="box">
                        <header className="panel_header">
                            <h2 className="title pull-left">Toute les consultations</h2>
                            <div className="actions panel_actions pull-right">
                                {/* <a className="box_toggle fa fa-chevron-down"></a> */}
                                {/* <a className="box_setting fa fa-cog" data-toggle="modal" href="#section-settings"></a> */}
                                {/* <a className="box_close fa fa-times"></a> */}
                            </div>
                        </header>
                        <div className="content-body">
                            <div className="row">
                                <div className="col-xs-12">

                                    <div className="table-responsive" data-pattern="priority-columns">
                                        <table id="tech-companies-1" className="table vm table-small-font no-mb table-bordered table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Demande de consultations</th>
                                                    <th>Motif</th>
                                                    <th>Interrogatoire</th>
                                                    <th>Resume</th>
                                                    <th>Hypothese diagnostique</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.consultations.map(consultation =>
                                                    <ConsultationItem
                                                        updateConsultation={()=>(this.setState({selectedconsultation:consultation}))}
                                                        key={consultation.id}
                                                        demande={getDemande(this.state.demandes,consultation.demande_consultation)}
                                                        patients = {this.state.patients}
                                                        edit={this.state.edit}
                                                        consultation={consultation}
                                                    />
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </section>
                    <div className="modal fade col-xs-12" id={`cmpltadminModal-${this.state.selectedconsultation.id}`} tabindex="-1" role="dialog" aria-hidden="true">
                                            <div class="modal-dialog">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <button type="button" id="closeBtnConsultation" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                                        <h4 class="modal-title"><span dangerouslySetInnerHTML={{__html: this.state.selectedconsultation.motif}}/></h4>
                                                    </div>
                                                    <div class="modal-body">
                                                        {this.state.edit ? <EditConsultation consultation={this.state.selectedconsultation}/> : <div dangerouslySetInnerHTML={{__html:"Resume: "+this.state.selectedconsultation.resume}} />}
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button class="btn btn-default" onClick={()=> this.setState({edit:false}) } type="button">Afficher</button>
                                                        <button class="btn btn-primary" onClick={()=> this.setState({edit:true}) } type="button">Modifier</button>
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                            {/* <div class="clearfix"></div> */}
            </div>
        )
    }
}

export default ConsultationList;