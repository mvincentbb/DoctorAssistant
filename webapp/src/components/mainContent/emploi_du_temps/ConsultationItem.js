import React, { useEffect } from 'react';
import {LitteralDate} from '../../../utils';


const ConsultationItem = ({consultation, demande_consultation}) => {

    
    
    return (
        <section className="box gradient-pink" style={{paddingLeft:'5px', paddingRight: '20px', marginLeft: '8px'}}>
            <div style={{width: 'fit-content', background: 'white', padding: '5px', fontWeight: 'bolder'}}>
                <i className="far fa-calendar-alt"></i> {" "}
                { LitteralDate(demande_consultation.date_consultation) }
            </div>
            <div className="doctor-card mb-0">
                <div className="row mt-5">
                    <div className="col-lg-6 col-xs-6 col-md-6">
                        <div style={{textAlign: 'center'}}>
                            <i className="far fa-hospital fa-2x" style={{color:'aqua', marginBottom:'10px'}}></i>
                        </div>
                        <div style={{textAlign: "center"}}>
                            <span style={{fontWeight: 700}}> {demande_consultation.hopital.denomination} </span>
                        </div>
                    </div>
                    <div className="col-lg-6 col-xs-6 col-md-6">
                        <div style={{textAlign: 'center'}}>
                            <i className="far fa-user fa-2x" style={{color:'aqua', marginBottom:'10px'}}></i>
                        </div>
                        <div style={{textAlign: "center"}}>
                            <span style={{fontWeight: 700}}> {demande_consultation.patient.nom} {demande_consultation.patient.prenom} </span>
                        </div>
                    </div>
                </div>
                <div className="doc-info-wrap transparent mb-30" style={{padding:0}}>
                    <div className="patient-personal mb-0">
                        <h4 className="detail-consultation-title" style={{color: '#795548'}}>Motif :</h4>
                        <p className="mb-0 g-text detail-consultation" dangerouslySetInnerHTML={{__html: consultation.motif}}></p>
                    </div>
                    <div className="patient-personal mb-0">
                        <h4 className="detail-consultation-title" style={{color: '#795548'}}>Interrogatoire :</h4>
                        <p className="mb-0 g-text detail-consultation" dangerouslySetInnerHTML={{__html: consultation.interrogatoire}}></p>
                    </div>
                    <div className="patient-personal mb-0">
                        <h4 className="detail-consultation-title" style={{color: '#795548'}}>Hypothese :</h4>
                        <p className="mb-0 g-text detail-consultation" dangerouslySetInnerHTML={{__html: consultation.hypothese_diagnostique}}></p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ConsultationItem;