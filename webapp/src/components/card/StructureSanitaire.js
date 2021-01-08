import React, {useEffect, useState} from 'react';
import {Image} from 'react-bootstrap';

import {BASE_URL} from '../../http-common';
import hospitalBuilding from '../../data/icons/hospital-building.png'

const handleOnclik = (event) => {

}

const StructureSanitaire = ({nom, adresse, onClick, id, isSelected, isOwned}) => {
    return (
        <div id={`structureSanitaire-${id}`} className="doctor-card has-shadow">
            <input type='hidden' name='medecinStructureSanitaireID' value=''/>
            <div className="doc-info-wrap text-left">
                <div className="doctor-img" style={{borderRadius: 0}}>
                    <img src={hospitalBuilding} alt=""/>
                </div>
                <div className="doc-info">
                    <h4 className="bold dot-dot">{nom}</h4>
                    <h5 className="dot-dot">{adresse}</h5>
                    <div className="doc-rating">
                        { !isOwned && (
                            <span 
                                onClick={(event) => {onClick(id);}} 
                                className="btn" 
                                style={{
                                    cursor: 'pointer', 
                                    background: `${ isSelected ? "#26e2d6" : "" }`,
                                    color: `${ isSelected ? "#333333" : "" }`
                                }}
                            >
                                { isSelected ? "Retirer la demande" : "Ajouter" }
                            </span>
                        )}
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StructureSanitaire;