import React from 'react';
const DemandeConsultationItemFormData = ({nom, prenom, date,color,id}) => (
    <li class="activity-list warning" className={color}>
        <div class="detail-info">
            <div class="visit-doc">
                <small class="text-muted">
Demande fait par {id} {nom} {prenom} a eu lieu le,
                </small>
                <p class="message">
                    {date}
                </p>
            </div>
        </div>
    </li>
)

export default DemandeConsultationItemFormData;