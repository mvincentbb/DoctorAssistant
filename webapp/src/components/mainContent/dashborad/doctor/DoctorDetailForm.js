import React from "react";

import Cookies from "universal-cookie";
import FormBoxItem from "../../../card/FormBoxItem";
import Specialite from "../../../card/Specialite";
import SpecialiteDataService from "../../../../services/specialite.service";
import DoctorDataService from "../../../../services/doctor.service";
import StructureSanitaireTabPane from "./StructureSanitaireTabPane";

const cookies = new Cookies();

class DoctorDetailForm extends React.Component {
    constructor(props) {
        super(props);
        var user = cookies.get("loggedUser");
        // console.log(user);
        this.state = {
            nom: user.first_name ? user.first_name : "",
            prenom: user.last_name ? user.last_name: "",
            date_naissance: user.date_naissance ? user.date_naissance : "",
            genre: user.genre ? user.genre : "M",
            adresse: user.adresse ? user.adresse : "",
            specialite: user.specialite,
            telephone: user.telephone ? user.telephone : "",
            bio: user.bio ? user.bio : "",
            specialites: [],
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSpecialiteClik = this.handleSpecialiteClik.bind(this);
    }

    handleInputChange(name, value) {
        this.setState({ [name]: value });
    }

    componentWillMount() {
        SpecialiteDataService.getAll()
            .then((response) => {
            this.setState({ specialites: response.data });
            console.log("dmldkzeldkzelk");
            })
            .catch((error) => {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
            });
    }

    updateDoctorInfo = () => {
        let data = cookies.get("loggedUser");
        data = Object.assign({}, data, this.state);
        data["first_name"] = this.state.nom;
        data["last_name"] = this.state.prenom;

        window.$("#pills .finish").text("sending....").addClass("disabled");
        DoctorDataService.update(data["id"], data)
            .then((response) => {
            cookies.set("loggedUser", response.data);
            this.setState({ ...response.data });
            window.$("#pills .finish").text("Finish").removeClass("disabled");
            window.$("#doctorDetailsModal").modal("toggle");
            })
            .catch((error) => {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
            });
    };

    handleSpecialiteChildMount = (specialite_id) => {
        const selector = `#pills-tab4 .r4_counter_.db_box`;
        if (specialite_id === this.state.specialite) {
            window
            .$(selector + `#specialite-${specialite_id}`)
            .css("background", "linear-gradient(-12deg,#2a57d7 0,#9eeeff 100%)");
            window
            .$(selector + `#specialite-${specialite_id}`)
            .find("h3")
            .css("color", "white");
        }
    };

  SpecialiteChildMount = (specialite_id) => {
    const selector = `#pills-tab4 .r4_counter_.db_box`;
    if (specialite_id === this.state.specialite) {
      window
        .$(selector + `#specialite-${specialite_id}`)
        .css("background", "linear-gradient(-12deg,#2a57d7 0,#9eeeff 100%)");
      window
        .$(selector + `#specialite-${specialite_id}`)
        .find("h3")
        .css("color", "white");
    }
  };
  componentDidMount() {
    if (!this.mustComplete()) {
      window.$("#doctorDetailsModal").modal("toggle");
        }
        window.$("#pills .finish").click(this.updateDoctorInfo);
    }

    mustComplete() {
        return this.state.nom && this.state.prenom && this.state.genre && this.state.date_naissance && this.state.specialite;
        // return false;
    }
    handleSpecialiteClik(id) {
        const selector = `#pills-tab4 .r4_counter_.db_box`;
        window.$(selector).css("background", "white");
        window.$(selector).find("h3").css("color", "#505458");

        window
            .$(selector + `#specialite-${id}`)
            .css("background", "linear-gradient(-12deg,#2a57d7 0,#9eeeff 100%)");
        window
            .$(selector + `#specialite-${id}`)
            .find("h3")
            .css("color", "white");

        this.state.specialite = id;
    }

  render() {
    const GenderSelectOptions = [
      { id: null, libelle: "----Selectionnez un genre-----" },
      { id: "M", libelle: "Masculin" },
      { id: "F", libelle: "Féminin" },
    ];
	
	return (
      <section className="box h-available" style={{ margin: 0 }}>
        <header className="panel_header">
          <h2 className="title pull-left">
            Nous aimerions savoir un peu plus sur vous
          </h2>
        </header>
        <div className="content-body h-available">
          <div className="row h-available">
            <div className="col-xs-12 h-available">
              <form id="doctorDetailForm" className="h-available" noValidate="novalidate">
                <div id="pills" className="wizardpills h-available">
                  
                  <ul className="form-wizard nav nav-pills">
                    <li className="">
                      <a href="#pills-tab1" data-toggle="tab" aria-expanded="true" >
                        <span>
                          <i className="fas fa-user-edit fa-3x form-wizard-nav-icon" title="Etat Civil"></i>
                        </span>
                      </a>
                    </li>
                    <li className="">
                      <a href="#pills-tab2" data-toggle="tab" aria-expanded="false">
                        <span>
                          <i className="fas fa-address-card fa-3x form-wizard-nav-icon" title="Adresse" ></i>
                        </span>
                      </a>
                    </li>
                    <li className="">
                      <a
                        href="#pills-tab3"
                        data-toggle="tab"
                        aria-expanded="false"
                      >
                        <span>
                          <i
                            className="fas fa-info-circle fa-3x form-wizard-nav-icon"
                            title="Biographie"
                          ></i>
                        </span>
                      </a>
                    </li>
                    <li className="">
                      <a
                        href="#pills-tab4"
                        data-toggle="tab"
                        aria-expanded="false"
                      >
                        <span>
                          <i
                            className="fas fa-briefcase-medical fa-3x form-wizard-nav-icon"
                            title="Spécialité"
                          ></i>
                        </span>
                      </a>
                    </li>
                    <li className="">
                      <a
                        href="#pills-tab5"
                        data-toggle="tab"
                        aria-expanded="false"
                      >
                        <span>
                          <i
                            className="fas fa-hospital fa-3x form-wizard-nav-icon"
                            title="Structures Sanitaires"
                          ></i>
                        </span>
                      </a>
                    </li>
                  </ul>
                  <div id="bar" className="progress active">
                    <div
                      className="progress-bar progress-bar-primary"
                      role="progressbar"
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{ width: 20 + "%" }}
                    ></div>
                  </div>

                  <div className="tab-content h-available">
                    <div className="tab-pane h-available" id="pills-tab1">
                      <h4  className="font-fondamento-bold">Informations Personnelles</h4>
                      <br />
                      <div className="row">
                        <div className="col-lg-6 col-xs-12">
                          <FormBoxItem
                            type="text"
                            label="Nom"
                            onInputChange={this.handleInputChange}
                            name="nom"
                            value={this.state.nom}
                          />
                        </div>
                        <div className="col-lg-6 col-xs-12">
                          <FormBoxItem
                            type="text"
                            label="Prénoms"
                            onInputChange={this.handleInputChange}
                            name="prenom"
                            value={this.state.prenom}
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-6 col-xs-12">
                          <FormBoxItem
                            type="date"
                            label="Date de Naissance"
                            onInputChange={this.handleInputChange}
                            name="date_naissance"
                            value={this.state.date_naissance}
                          />
                        </div>
                        <div className="col-lg-6 col-xs-12">
                          <FormBoxItem
                            type="select"
                            label="Genre"
                            onInputChange={this.handleInputChange}
                            name="genre"
                            value={this.state.genre}
                            selectOptions={GenderSelectOptions}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="tab-pane h-available" id="pills-tab2">
                        <h4 className="font-fondamento-bold">Contacts</h4>
                        <br />
                        <div className="row">

                            <div className="col-lg-6 col-xs-12">
                                <FormBoxItem
                                type="text"
                                label="Quartier de Résidence"
                                onInputChange={this.handleInputChange}
                                name="adresse"
                                value={this.state.adresse}
                                />
                            </div>
                            
                            <div className="col-lg-6 col-xs-12">
                                <FormBoxItem
                                type="text"
                                label="Numéro de Téléphone"
                                onInputChange={this.handleInputChange}
                                name="telephone"
                                value={this.state.telephone}
                                />
                            </div>

                        </div>
                    </div>

                    <div className="tab-pane h-available" id="pills-tab3">
                      <h4 className="font-fondamento-bold">Biographie Professionnelle</h4>
                      <br />
                      <div className="row">
                        <div className="col-lg-6 col-xs-12">
                            <FormBoxItem
                                type="textarea"
                                label="Bio"
                                onInputChange={this.handleInputChange}
                                name="bio"
                                value={this.state.bio}
                            />
                        </div>
                      </div>
                    </div>

                    <div className="tab-pane h-available" id="pills-tab4">
                        <h4 className="font-fondamento-bold">Quelle est votre spécialité ? </h4>
                        <br />
                        <div className="row">
                            {this.state.specialites.map(({ libelle, icon, id }) => (
                                <div className="col-lg-3 col-xs-12" key={id}>
                                    <Specialite
                                        libelle={libelle}
                                        icon={icon}
                                        id={id}
                                        onClick={this.handleSpecialiteClik}
                                        onMount={this.handleSpecialiteChildMount}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="tab-pane h-available" id="pills-tab5">
                        
                        <StructureSanitaireTabPane
                            structureSanitaires={this.state.structureSanitaires}
                            onStructureSanitaireClick={this.handleStructureSanitaireClick}
                            onStructureSanitaireMount={this.handleStructureSanitaireChildMount}
                        />
                    
                    </div>

                    <ul className="pager wizard" style={{}}>
                        <li className="previous first" style={{ display: "none" }}><a style={{cursor: "pointer"}}>First</a></li>
                        <li className="previous"><a style={{cursor: "pointer"}}>Previous</a></li>
                        <li className="next last" style={{ display: "none" }}><a style={{cursor: "pointer"}}>Last</a></li>
                        <li className="next"><a style={{cursor: "pointer"}}>Next</a></li>
                        <li className="finish"><a style={{cursor: "pointer"}}>Finish</a></li>
                    </ul>

                    <div className="clearfix"></div>
                    
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default DoctorDetailForm;
