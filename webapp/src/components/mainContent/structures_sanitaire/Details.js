import React from "react";

import PageTitle from "../../card/PageTitle";
import PatientDataService from "../../../services/patient.service";
import NotFound from "../error/404";

import profile from "../../../data/profile/profile.jpg";
import clock from "../../../data/hos-dash/clock.png";
import PatientInfoItem from "../../card/PatientInfoItem";
import { Link } from "react-router-dom";

class PatientDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      patient: {
        id: null,
        nom: "",
        prenom: "",
        adresse: "",
        telephone: "",
        date_naissance: "",
        genre: "",
      },
    };
    this.computedAge = this.computedAge.bind(this);
  }

  componentWillMount() {
    const {
      match: { params },
    } = this.props;

    PatientDataService.get(params.id)
      .then((response) => {
        console.log(response.data);
        this.setState({ patient: { ...response.data } });
      })
      .catch((e) => {
        console.log(e);
        console.log(this.state.patient.id === null);
      });
  }

  componentDidMount() {}

  computedAge(date_naissance) {
    return 41;
  }

  render() {
    return (
      <div>
        {this.state.patient.id !== null ? (
          <div>
            <PageTitle title="Profil Patient" />

            <div className="clearfix"></div>

            <div className="col-lg-4">
              <section className="box ">
                <div className="content-body p">
                  <div className="row">
                    <div className="doctors-list patient relative">
                      <div className="doctors-head relative text-center">
                        <div className="patient-img img-circle">
                          <img
                            src={profile}
                            className="rad-50 center-block"
                            alt=""
                          />
                          <div className="stutas"></div>
                        </div>
                        <h3 className="header w-text relative bold">
                          Nom : {this.state.patient.nom}{" "}
                          {this.state.patient.prenom}
                        </h3>
                        {/* <p className="desc g-text relative">Lorem ipsum dolor sit amet, Earum nes ciunt fugiat enim. Sequi quos labore.</p> */}
                      </div>
                      <div className="row">
                        <div className="patients-info relative">
                          <PatientInfoItem
                            title="Sexe"
                            value={
                              this.state.patient.genre === "M"
                                ? "Masculin"
                                : "Féminin"
                            }
                          />
                          <PatientInfoItem
                            title="Age"
                            value={`${this.computedAge(
                              this.state.patient.date_naissance
                            )} Ans`}
                          />
                          <PatientInfoItem
                            title="Taille du patient"
                            value="176 cm"
                          />
                          <PatientInfoItem
                            title="Poids du patient"
                            value="67 Kg"
                          />
                        </div>
                      </div>
                      {/* <!-- end row --> */}

                      <div className="col-xs-12 mb-30">
                        <div className="reminder-wrapper has-shadow2">
                          <div className="reminder-icon">
                            <img src={clock} width="60" alt="" />
                          </div>
                          <div className="reminder-content">
                            <h4 className="w-text bold">Rappel Alarm</h4>
                            <h5 className="g-text">
                              Demandez d'après le médecin
                            </h5>
                          </div>
                        </div>
                        <Link
                          to={`/patients_update/${this.state.patient.id}`}
                          className="btn btn-primary btn-lg gradient-blue d-block"
                          style={{ display: "block", marginTop: "20px" }}
                        >
                          <span>Edit</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="col-lg-8 col-md-12">
              <div className="row">
                <div className="col-xs-12 col-md-7">
                  <section className="box ">
                    <header className="panel_header">
                      <h2 className="title pull-left">Pression Artérielle</h2>
                      <div className="actions panel_actions pull-right">
                        <a className="box_toggle fa fa-chevron-down"></a>
                        <a
                          className="box_setting fa fa-cog"
                          data-toggle="modal"
                          href="#section-settings"
                        ></a>
                        <a className="box_close fa fa-times"></a>
                      </div>
                    </header>
                    <div className="content-body">
                      <div className="row">
                        <div className="col-xs-12">
                          <div className="">
                            <canvas
                              id="bar-chartjs"
                              height="229"
                              width="306"
                              style={{ width: 306 + "px", height: 229 + "px" }}
                            ></canvas>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="col-xs-12 col-md-5">
                  <section className="box ">
                    <header className="panel_header">
                      <h2 className="title pull-left">Notifications</h2>
                      <div className="actions panel_actions pull-right">
                        <a className="box_toggle fa fa-chevron-down"></a>
                        <a
                          className="box_setting fa fa-cog"
                          data-toggle="modal"
                          href="#section-settings"
                        ></a>
                        <a className="box_close fa fa-times"></a>
                      </div>
                    </header>
                    <div className="content-body">
                      <div className="row">
                        <div className="col-xs-12">
                          <ul className="project-activity list-unstyled mb-0">
                            <li className="activity-list warning">
                              <div className="detail-info">
                                <div className="visit-doc">
                                  <small className="text-muted">
                                    You comfirm Dr sultads visit
                                  </small>
                                  <p className="message">27 July - 05:34</p>
                                </div>
                              </div>
                            </li>
                            <li className="clearfix"></li>
                            <li className="activity-list info">
                              <div className="detail-info">
                                <div className="visit-doc">
                                  <small className="text-muted">
                                    Reminder : Treatment Time!
                                  </small>
                                  <p className="message">25 july - 20:00</p>
                                </div>
                              </div>
                            </li>
                            <li className="activity-list success">
                              <div className="detail-info">
                                <div className="visit-doc">
                                  <small className="text-muted">
                                    You completed Dr Joun visit
                                  </small>
                                  <p className="message">26 Feb - 23:47</p>
                                </div>
                              </div>
                            </li>
                            <li className="activity-list warning">
                              <div className="detail-info">
                                <div className="visit-doc">
                                  <small className="text-muted">
                                    Your Blood check is good!
                                  </small>
                                  <p className="message">23 Jan - 21:45</p>
                                </div>
                              </div>
                            </li>
                            <li className="activity-list danger">
                              <div className="detail-info pb0">
                                <div className="visit-doc">
                                  <small className="text-muted">
                                    You Cancelled Dr Wall Smith visit
                                  </small>
                                  <p className="message">17 Nov - 12:23</p>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      {/* <!-- End .row --> */}
                    </div>
                  </section>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <section
                    className="box gradient-blue"
                    style={{ padding: 20 + "px" }}
                  >
                    <div className="patient-personal mb-0">
                      <h4 className="w-text">Blood type :</h4>
                      <p className="mb-0 g-text">AB+</p>
                    </div>
                    <div className="patient-personal mb-0">
                      <h4 className="w-text">Allergies :</h4>
                      <p className="mb-0 g-text">Penicilin, peanuts</p>
                    </div>
                    <div className="patient-personal mb-0">
                      <h4 className="w-text">Diseases :</h4>
                      <p className="mb-0 g-text">Diabetes</p>
                    </div>
                    <div className="patient-personal mb-0">
                      <h4 className="w-text">Pressure :</h4>
                      <p className="mb-0 g-text">130/80 mmHG</p>
                    </div>
                    <div className="patient-personal mb-0">
                      <h4 className="w-text">Temperture :</h4>
                      <p className="mb-0 g-text">36.8 Degree</p>
                    </div>
                  </section>
                </div>
                <div className="col-md-6 col-sm-12">
                  <section
                    className="box gradient-pink"
                    style={{ padding: 20 + "px" }}
                  >
                    <div className="patient-personal v2 mb-0">
                      <h4 className="w-text">
                        {" "}
                        <span className="text-info bold">-- </span> Regular
                        checkups
                      </h4>
                      <p className="mb-0 g-text"></p>
                    </div>
                    <div className="patient-personal v2 mb-0">
                      <h4 className="w-text">Dr Anthony Wager</h4>
                      <p className="mb-0 g-text">dermatologist</p>
                    </div>
                    <div className="patient-personal v2 mb-0">
                      <h4 className="w-text">Dr Smith Wright </h4>
                      <p className="mb-0 g-text">Clinical doctor</p>
                    </div>
                    <div className="patient-personal v2 mb-0">
                      <h4 className="w-text">Dr Tom Humpton</h4>
                      <p className="mb-0 g-text">Dentist</p>
                    </div>
                    <div className="patient-personal v2 mb-0">
                      <h4 className="w-text">Dr Riphat Jion</h4>
                      <p className="mb-0 g-text">Surgeon</p>
                    </div>
                  </section>
                </div>
              </div>
            </div>

            <div className="clearfix"></div>

            <div className="col-md-7 col-sm-12 col-xs-12">
              <div className="row mt-15">
                <div className="col-md-6 col-xs-12 ">
                  <div className="r1_graph1 db_box db_box_large has-shadow2">
                    <div className="pat-info-wrapper">
                      <div className="pat-info text-left">
                        <h5 className="">Blood pressure</h5>
                        <h6>In the normal</h6>
                      </div>
                      <div className="pat-val relative">
                        <h4 className="value p-text">
                          120/89 <span>mmHG</span>
                        </h4>
                      </div>
                    </div>
                    <span className="sparklinedash2">
                      <canvas
                        width="121"
                        height="60"
                        style={{
                          display: "inline-block",
                          width: 121 + "px",
                          height: 60 + "px",
                          verticalAlign: "top",
                        }}
                      ></canvas>
                    </span>
                  </div>
                </div>
                <div className="col-md-6 col-xs-12">
                  <div className="r1_graph1 db_box db_box_large has-shadow2">
                    <div className="pat-info-wrapper">
                      <div className="pat-info text-left">
                        <h5 className="">Heart Rate</h5>
                        <h6 className="red-text">Above the normal</h6>
                      </div>
                      <div className="pat-val relative">
                        <h4 className="value red-text">
                          107 <span>Per min</span>
                        </h4>
                      </div>
                    </div>
                    <span className="sparklinedash">
                      <canvas
                        width="121"
                        height="60"
                        style={{
                          display: "inline-block",
                          width: 121 + "px",
                          height: 60 + "px",
                          verticalAlign: "top",
                        }}
                      ></canvas>
                    </span>
                  </div>
                </div>

                <div className="col-md-6 col-xs-12">
                  <div className="r1_graph1 db_box db_box_large has-shadow2">
                    <div className="pat-info-wrapper">
                      <div className="pat-info text-left">
                        <h5 className="">Glucose Rate</h5>
                        <h6>In the normal</h6>
                      </div>
                      <div className="pat-val relative">
                        <h4 className="value green-text">
                          <i className="complete fa fa-arrow-up"></i>97
                          <span>mg/dl</span>
                        </h4>
                      </div>
                    </div>
                    <span className="sparkline8">
                      <canvas
                        width="214"
                        height="60"
                        style={{
                          display: "inline-block",
                          width: 214 + "px",
                          height: 60 + "px",
                          verticalAlign: "top",
                        }}
                      ></canvas>
                    </span>
                  </div>
                </div>
                <div className="col-md-6 col-xs-12">
                  <div className="r1_graph1 db_box db_box_large has-shadow2">
                    <div className="pat-info-wrapper">
                      <div className="pat-info text-left">
                        <h5 className="">Clolesterol</h5>
                        <h6>In the normal</h6>
                      </div>
                      <div className="pat-val relative">
                        <h4 className="value blue-text">
                          <i className="cancelled fa fa-arrow-down"></i>124
                          <span>mg/dl</span>
                        </h4>
                      </div>
                    </div>
                    <span className="sparkline9">
                      <canvas
                        width="214"
                        height="60"
                        style={{
                          display: "inline-block",
                          width: 214 + "px",
                          height: 60 + "px",
                          verticalAlign: "top",
                        }}
                      ></canvas>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xs-12 col-md-5">
              <section className="box ">
                <header className="panel_header">
                  <h2 className="title pull-left">Patient Activities</h2>
                  <div className="actions panel_actions pull-right">
                    <a className="box_toggle fa fa-chevron-down"></a>
                    <a
                      className="box_setting fa fa-cog"
                      data-toggle="modal"
                      href="#section-settings"
                    ></a>
                    <a className="box_close fa fa-times"></a>
                  </div>
                </header>
                <div className="content-body pb0">
                  <div className="row">
                    <div className="col-md-10 col-sm-10 col-xs-10 col-md-offset-1 col-sm-offset-1 col-xs-offset-1">
                      <canvas
                        id="radar-chartjs"
                        width="303"
                        height="303"
                        style={{ width: 303 + "px", height: 303 + "px" }}
                      ></canvas>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="clearfix"></div>
          </div>
        ) : (
          <NotFound />
        )}
      </div>
    );
  }
}

export default PatientDetails;
