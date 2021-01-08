import React, {useEffect, useState} from 'react';
import StructureSanitaire from '../../../card/StructureSanitaire';
import Cookies from 'universal-cookie';
import noItem from '../../../../data/icons/no-item3.png';
import loading from '../../../../data/icons/loading.svg';

const ListeStructureSanitaire = ({filterText, liste, onClick, owned, added}) => {
    
    let filteredList = null;
    let ownedList = null;

    const [showOther, setShowOther] = useState(1); //other hospitals

    const toggleLists = (event) => {
        setShowOther( !showOther );
    };

    if (liste && added) {
        filteredList = liste.filter( elt =>  {
            return !owned.includes(elt.id) && (elt.denomination.toLowerCase() + elt.adresse.toLowerCase()).indexOf(filterText.toLowerCase()) !== -1;
        });
        ownedList = liste.filter( elt =>  {
            return owned.includes(elt.id);
        });
    }

    return (

        <div className="row">

            <div id="other-hospital" className={`col-lg-12 col-xs-12 ${ showOther ? 'show-other-hospital' : 'hide-other-hospital'}`}>
            <div className="list-hospital-title">Hopitaux Existants</div>
                <div className="row">
                    { filteredList && filteredList.map(({denomination, adresse, id}) => (
                        <div className="col-lg-3 col-xs-12" key={id} style={{margin: '10px 0 0 0'}}>
                            <StructureSanitaire nom={denomination} adresse={adresse} id={id} onClick={onClick} isSelected={added.includes(id)} isOwned={false} />
                        </div>
                    ))}

                    { !filteredList && (
                        <div>
                            <img src={loading} style={{width: '200px', margin: 'auto', display: 'block'}} />
                        </div>
                    )}
                    
                    { (filteredList && filteredList.length === 0) && (
                        <div>
                            <img src={noItem} style={{width: '400px', margin: 'auto', display: 'block'}} />
                        </div>
                    )}
                </div>
            </div>
            
            <div id="owned-hospital" className={`col-lg-12 col-xs-12 ${ showOther ? 'hide-owned-hospital' : 'show-owned-hospital'}`}>
                <div className="list-hospital-title">Mes Hopitaux</div>
                <div className="row">
                    { ownedList && ownedList.map(({denomination, adresse, id}) => (
                        <div className="col-lg-3 col-xs-12" key={id} style={{marginTop: '20px'}}>
                            <StructureSanitaire nom={denomination} adresse={adresse} id={id} onClick={onClick} isOwned={true} />
                        </div>
                    ))}

                    { !ownedList && (
                        <div>
                            <img src={loading} style={{width: '200px', margin: 'auto', display: 'block'}} />
                        </div>
                    )}
                    
                    { (ownedList && ownedList.length === 0) && (
                        <div>
                            <img src={noItem} style={{width: '400px', margin: 'auto', display: 'block'}} />
                        </div>
                    )}
                </div>
            </div>

            <div>
                <div id="owned-hospital-toggler" onClick={toggleLists}>
                    <i className={`fas fa-chevron-${ showOther ? 'left' : 'right'} fa-2x`}></i>
                </div>
            </div>
        </div>
    )
}

export default ListeStructureSanitaire;