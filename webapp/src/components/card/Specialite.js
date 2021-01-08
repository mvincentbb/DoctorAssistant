import React, { useState, useEffect } from 'react';
import {Image} from 'react-bootstrap';

import {BASE_URL} from '../../http-common';

const handleOnclik = (event) => {

}

const Specialite = ({libelle, icon, onClick, id, onMount}) => {

    useEffect(() => {
        const selector = `#pills-tab4 .r4_counter_.db_box`;
        window.$(selector).hover(
            function() {
                window.$(this).css("background-color", "white !important")
            },
            function() {
                window.$(this).css("background", "white !important")
            }
        );

        onMount(id);
    });
    
    return (
        <div className="r4_counter_ db_box" id={`specialite-${id}`} onClick={(event) => {onClick(id);}}>
            <div className="row">
                <div className="col-lg-4">
                    <i className="pull-left ico-icon icon-md icon-primary mt-10">
                        <Image src={`${BASE_URL}/static/specialite/${icon}`} className="ico-icon-o" />
                    </i>
                </div>
                
                <div className="col-lg-8">
                    <div className="stats" style={{marginTop: 30+'px'}}>
                        <h3 className="mb-5 text-center">{libelle}</h3>
                    </div>
                </div>
            </div>
            
            
        </div>
    )
}

export default Specialite;