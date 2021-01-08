import React, { useState } from "react";
import AddHeader from "../../card/AddHeader";
import FormBox from "../../card/FormBox";

import DoctorDataService from "../../../services/doctor.service";
import SpecialiteDataService from "../../../services/specialite.service";

import PageTitle from "../../card/PageTitle";
import NotFound from "../error/404";
import FormBoxFooter from "../../card/FormBoxFooter";

class EditDoctor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doctor: {
        id: null,
        first_name: null,
        last_name: null,
        username: null,
        email: null,
        password: String,
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
    this.deleteDoctor = this.deleteDoctor.bind(this);
  }

  componentWillMount() {
    const {
      match: { params },
    } = this.props;

    DoctorDataService.get(params.id)
      .then((response) => {
        console.log(response.data);
        this.setState({ doctor: { ...response.data } });
      })
      .catch((e) => {
        console.log(e);
        console.log(this.state.doctor.id === null);
      });

    SpecialiteDataService.getAll()
      .then((response) => {
        this.setState({ specialites: response.data.results });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  handleInputChange(name, value) {
    // const { name, value } = event.target;
    this.setState({ doctor: { ...this.state.doctor, [name]: value } });
    console.log("CHANGING... ", name, value);
  }

  saveDoctor() {
    var data = {
      first_name: this.state.doctor.first_name,
      email: this.state.doctor.email,
      last_name: this.state.doctor.last_name,
      username: this.state.doctor.username,
      specialite: this.state.doctor.specialite,
      bio: this.state.doctor.bio,
      genre: this.state.doctor.genre,
      telephone: this.state.doctor.telephone,
      adresse: this.state.doctor.adresse,
      date_naissance: this.state.doctor.date_naissance,
    };
    DoctorDataService.update(this.state.doctor.id, data)
      .then((response) => {
        this.setState({ doctor: { ...response.data } });
        console.log(response);
        window.showSuccess("Le médecin été enregistré avec succès");
      })
      .catch((e) => {
        console.log(e.response);
      });
  }

  deleteDoctor() {
    DoctorDataService.delete(this.state.doctor.id)
      .then((response) => {
        console.log(response.status);
        window.$("#deleteConfirmationModal").modal("toggle");
        window.showSuccess("Médecin supprimé avec succès");
        setTimeout(() => {
          this.props.history.push("/doctors/");
        }, 500);
      })
      .catch((e) => {
        console.log(e);
        window.showErrorMessage("Something went wrong!!!");
      });
  }

  render() {
    const GenderSelectOptions = [
      { id: null, libelle: "----Sélectionnez le genre-----" },
      { id: "M", libelle: "Masculin" },
      { id: "F", libelle: "Femminin" },
    ];
    const specialiteSelectOptions = [
      { id: null, libelle: "----Selectionnez une spécialité-----" },
    ].concat(this.state.specialites);
    const formBoxes = [
      {
        headerTitle: "Information personnelle du médecin",
        fields: [
          {
            type: "text",
            label: "Username",
            name: "username",
            value: this.state.doctor.username,
          },
          {
            type: "text",
            label: "Nom",
            name: "first_name",
            value: this.state.doctor.first_name,
          },
          {
            type: "text",
            label: "Prénom",
            name: "last_name",
            value: this.state.doctor.last_name,
          },
          {
            type: "text",
            label: "Email",
            name: "email",
            value: this.state.doctor.email,
          },
          {
            type: "text",
            label: "Adresse",
            name: "adresse",
            value: this.state.doctor.adresse,
            description: 'e.g. "Agoe-cacaveli"',
          },
          {
            type: "select",
            label: "Specialité",
            name: "specialite",
            value: this.state.doctor.specialite,
            selectOptions: specialiteSelectOptions,
          },
          {
            type: "textarea",
            label: "bio",
            name: "bio",
            value: this.state.doctor.bio,
            description: 'e.g. "Biologie"',
          },
          {
            type: "date",
            label: "Date de naissance",
            name: "date_naissance",
            value: this.state.doctor.date_naissance,
          },
          {
            type: "text",
            label: "Téléphone",
            name: "telephone",
            value: this.state.doctor.telephone,
          },
          {
            type: "select",
            label: "Genre",
            name: "genre",
            value: this.state.doctor.genre,
            selectOptions: GenderSelectOptions,
          },
        ],
      },
    ];

    return (
      <div>
        {this.state.doctor.id !== null ? (
          <div>
            <PageTitle title="Modifiez vos information" />

            <div className="col-xs-12 ">
              <AddHeader entityName="medecin" type="edit" />

              <div className="bg-w">
                {formBoxes.map((box) => (
                  <FormBox
                    box={box}
                    fromType="edit"
                    isSubmitting={this.state.isSubmitting}
                    onInputChange={this.handleInputChange}
                    onSaveBtnTapped={this.saveDoctor}
                    onDeleteBtnTapped={this.deleteDoctor}
                  />
                ))}
              </div>

              <div className="row">
                <div className="col-lg-10 col-lg-offset-1 col-xs-12">
                    <FormBoxFooter
                        isSubmitting={this.state.isSubmitting}
                        onSaveBtnTapped={this.saveDoctor}
                        onDeleteBtnTapped={this.deleteDoctor}
                        fromType="edit"
                    />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <NotFound />
        )}
      </div>
    );
  }
}

export default EditDoctor;
