import React, { useState, useEffect } from 'react';

import clock from "../../../data/hos-dash/clock.png";

const RDVItem = ({}) => {

    useEffect(() => {
        
    });
    
    return (
        <div className="reminder-wrapper has-shadow2">
		    <div className="reminder-icon">
		        <img src={clock} width="60" alt=""/>
		    </div>
		    <div className="reminder-content">
		        <h4 className="w-text bold">RDV</h4>
		        <h5 className="g-text">ask about medicine</h5>
		    </div>
		</div>
    )
}

export default RDVItem;