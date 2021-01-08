import React from "react";

import PageTitle from "../../card/PageTitle";
import DoctorItem from "./DoctorItem";
import DoctorDataService from "../../../services/doctor.service";

class DoctorList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      medecins: [],
    };
  }

  componentWillMount() {
    DoctorDataService.getAll()
      .then((response) => {
        this.setState({ medecins: response.data });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    return (
      <div>
        <PageTitle title="Liste des Médecins" />

        {this.state.medecins.map(
          ({
            first_name,
            last_name,
            username,
            genre = "Masculin",
            date_naissance = 21,
            id,
            adresse,
          }) => (
            <DoctorItem
              fullname={`${first_name} ${last_name}` && username}
              gender={genre}
              date_naissance={date_naissance}
              id={id}
              key={id}
            />
          )
        )}
      </div>
    );
  }
}

export default DoctorList;
