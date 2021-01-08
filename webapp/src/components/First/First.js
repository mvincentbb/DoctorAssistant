import React from 'react';

import {Col} from 'react-bootstrap';
import {Image} from 'react-bootstrap';

import hosIconSo1 from '../../data/icons/hos-icon-so1.png';

const First = () => (
    <Col xs={12} sm={6} lg={3}>
        <div className="r4_counter db_box">
            <i className="pull-left ico-icon icon-md icon-primary mt-10">
                <Image src={hosIconSo1} className="ico-icon-o" />
            </i>
            <div className="stats">
                <h3 className="mb-5">200 Bed</h3>
                <span>Total Hospital Beds </span>
            </div>
        </div>
    </Col>
)

export default First;