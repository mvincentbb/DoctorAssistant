import React, { useState } from "react";
import AddHeader from "../../card/AddHeader";
import FormBox from "../../card/FormBox";

import DoctorDataService from "../../../services/doctor.service";
import SpecialiteDataService from "../../../services/specialite.service";

import PageTitle from "../../card/PageTitle";
import FormBoxFooter from "../../card/FormBoxFooter";

class AddDoctor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doctor: {
        id: null,
        fisrt_name: null,
        last_name: null,
        username: null,
        email: null,
        password: null,
        specialite: null,
        bio: null,
        genre: null,
        telephone: null,
        adresse: null,
        date_naissance: null,
      },
      submitted: false,
      isSubmitting: false,
      specialites: [],
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.saveDoctor = this.saveDoctor.bind(this);
    this.newDoctor = this.newDoctor.bind(this);
  }

  handleInputChange(name, value) {
    // const { name, value } = event.target;
    this.setState({ doctor: { ...this.state.doctor, [name]: value } });
    console.log("CHANGING... ", name, value);
  }

  saveDoctor() {
    var data = {
      first_name: this.state.doctor.nom,
      email: this.state.doctor.email,
      password: this.state.doctor.password,
      last_name: this.state.doctor.prenom,
      username: this.state.doctor.username,
      specialite: this.state.doctor.specialite,
      bio: this.state.doctor.bio,
      genre: this.state.doctor.genre,
      telephone: this.state.doctor.telephone,
      adresse: this.state.doctor.adresse,
      date_naissance: this.state.doctor.date_naissance,
    };
    console.log(data);

    DoctorDataService.create(data)
      .then((response) => {
        this.newDoctor();
        console.log(response.data, this.state.submitted);
        window.showSuccess("Le médecin a été enrégistré avec succès");
        this.props.history.push(`/doctors_details/${response.data.id}`);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }
  newDoctor() {
    this.setState({
      id: null,
      fisrt_name: null,
      last_name: null,
      username: null,
      email: null,
      password: null,
      specialite: null,
      bio: null,
      genre: null,
      telephone: null,
      adresse: null,
      date_naissance: null,
    });
    this.setState({ submitted: true });
  }

  componentWillMount() {
    SpecialiteDataService.getAll()
      .then((response) => {
        this.setState({ specialites: response.data.results });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const GenderSelectOptions = [
      { id: "N", libelle: "----Selectionnez un genre-----" },
      { id: "M", libelle: "Masculin" },
      { id: "F", libelle: "Féminin" },
    ];
    
    const specialiteSelectOptions = [
      { id: null, libelle: "----Selectionnez une specialite-----" },
    ].concat(this.state.specialites);
    
    const formBoxes = [
      {
        headerTitle: "Information personnelle du medecin",
        fields: [
          {
            type: "text",
            label: "Username",
            name: "username",
            value: this.state.doctor.username,
          },
          {
            type: "text",
            label: "Email",
            name: "email",
            value: this.state.doctor.email ? this.state.doctor.email : "",
          },
          {
            type: "text",
            label: "Nom",
            name: "nom",
            value: this.state.doctor.nom ? this.state.doctor.nom : "",
          },
          {
            type: "text",
            label: "Prénom",
            name: "prenom",
            value: this.state.doctor.prenom ? this.state.doctor.prenom : "",
          },
          {
            type: "text",
            label: "Adresse",
            name: "adresse",
            value: this.state.doctor.adresse ? this.state.doctor.adresse : "",
            description: 'e.g. "Agoe-cacaveli"',
          },
          {
            type: "select",
            label: "Spécialité",
            name: "specialite",
            value: this.state.doctor.specialite ? this.state.doctor.specialite : 0,
            selectOptions: specialiteSelectOptions,
          },
          {
            type: "textarea",
            label: "Biographie",
            name: "bio",
            value: this.state.doctor.bio ? this.state.doctor.bio : "",
            description: 'e.g. "Biologie"',
          },
          {
            type: "date",
            label: "Date de naissance",
            name: "date_naissance",
            value: this.state.doctor.date_naissance ? this.state.doctor.date_naissance : "",
          },
          {
            type: "text",
            label: "Téléphone",
            name: "telephone",
            value: this.state.doctor.telephone ? this.state.doctor.telephone : "",
          },
          {
            type: "select",
            label: "Genre",
            name: "genre",
            value: this.state.doctor.genre ? this.state.doctor.genre : "N",
            selectOptions: GenderSelectOptions,
          },
        ],
      },
    ];

    return (
      <div>
        <PageTitle title="Ajout de Medecin" />

        <div className="col-xs-12 ">
          <AddHeader entityName="medecin" type="add" />

          <div className="bg-w">
            {formBoxes.map((box) => (
              <FormBox
                box={box}
                key={box.headerTitle}
                fromType="add"
                isSubmitting={this.state.isSubmitting}
                onInputChange={this.handleInputChange}
                onSaveBtnTapped={this.saveDoctor}
              />
            ))}

            <div className="row">
                <div className="col-lg-10 col-lg-offset-1 col-xs-12">
                    <FormBoxFooter
                        isSubmitting={this.state.isSubmitting}
                        onSaveBtnTapped={this.saveDoctor}
                        fromType="add"
                    />
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddDoctor;
