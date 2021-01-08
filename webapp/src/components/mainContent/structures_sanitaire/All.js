import React from "react";

import PageTitle from "../../card/PageTitle";
import HospitalItem from "./Item";
import StructureSanitaireDataService from "../../../services/structureSanitaire.service";
import MedecinStructureSanitaireDataService from "../../../services/medecinStructureSanitaire.service";

import Cookies from 'universal-cookie';
import noItem from '../../../data/icons/no-item3.png';
import loading from '../../../data/icons/loading.svg';

const cookies = new Cookies();

class HopitalList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hopitals: null,
        }
    }

    componentWillMount() {
        StructureSanitaireDataService.getMine()
        .then(response => {
            this.setState({hopitals: response.data});
        }).catch(e => {
            window.showErrorMessage("Echec !!!")
        });
    }

    delete = (id, owner) => {
    let doctor_id = cookies.get("loggedUser")["id"];

    if (!owner) {
        MedecinStructureSanitaireDataService.delete(doctor_id, id, "my_hos")
        .then((response) => {
            window.showSuccess("Structure sanitaire supprimé !");
            this.setState({ hopitals: response.data });
        })
        .catch((e) => {
            window.showErrorMessage("Something went wrong!!!");
        });
    } else if (owner === doctor_id) {
        StructureSanitaireDataService.delete(id, "my_hos")
        .then((response) => {
            window.showSuccess("Structure sanitaire supprimée !");
            this.setState({ hopitals: response.data });
        })
        .catch((e) => {
            window.showErrorMessage("Something went wrong!!!");
        });
    }
    };

    seeDetails = (id) => {};

    edit = (id) => {
        this.props.history.push(`/hospitals_update/${id}`);
    }
    render() {
        return (
            <div>
                <PageTitle title="Toutes mes structures sanitaires" />
                
                <div className="row">
                    { this.state.hopitals !== null && this.state.hopitals.map((hopital) => 
                        <div className="col-xs-12 col-lg-3 structure-sanitaire-column" key={hopital.id}>
                            <HospitalItem 
                                data={hopital}
                                onDeleteClick={this.delete}
                                onEditClick={this.edit}
                                onSeeClick={this.seeDetails}
                            />
                        </div>
                    )}

                    { this.state.hopitals === null && (
                        <div>
                            <img src={loading} style={{width: '300px', margin: 'auto', display: 'block'}} />
                        </div>
                    )}

                    { (this.state.hopitals !== null && this.state.hopitals.length === 0) && (
                        <div>
                            <img src={noItem} style={{width: 50+'%', margin: 'auto', display: 'block'}} />
                        </div>
                    )}
                </div>
                
            </div>
        )
    }
}

export default HopitalList;
