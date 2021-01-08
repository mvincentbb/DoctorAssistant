import React from 'react';
import Cookies from 'universal-cookie';

import AuthService from "../../../services/auth.service";
import SpecialiteDataService from "../../../services/specialite.service";

import signup from "../../../data/icons/signup.png"
import FormBoxItem from '../../card/FormBoxItem';
import { Link } from 'react-router-dom';
import { error } from 'jquery';

const cookies = new Cookies();

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "", email: "",
            password: "", r_password: "",
        };
        this.register = this.register.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSignInClicked = this.handleSignInClicked.bind(this);
    }

    register(event) {
        var data = {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
        };
    
        AuthService.register(data)
            .then(response => {
                this.setState({ username: "" ,email: "", password: "" });
                cookies.set('loggedUser', response.data, { path: '/' });
                
                window.location.href =  "login";
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                    for (var key in error.response.data) {
                        if (error.response.status === 400) {
                            if (this.state.hasOwnProperty(key)) {
                                window.$(`#${key}-control`).find("span").text(error.response.data[key]);
                                window.$(`#${key}-control`).find("span").addClass("error");
                            }
                        }
                    }
                } 
                else if (error.request) {
                    console.log(error.request);
                } 
                else {
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });
    }

    handleInputChange(name, value) {
        // const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSignInClicked() {
        console.log("handleSignInClicked");
        window.$("#msg_validate").submit();
    }

    componentWillMount() {
        
    }

    componentDidMount() {
        window.$("body").addClass("login_page");
        window.$("#msg_validate").validate({
            rules: {
               "username":{
                    "required": true,
                    "minlength": 6,
               },
               "email": {
                    "required": true,
                    "email": true,
               },
               "password": {
                    "required": true
               },
               "r_password": {
                    "required": true,
                    "equals_to": "password",
                }
            },
            submitHandler: (form) => {
                this.register();
            }
        });
        window.$.validator.addMethod(
            "equals_to",
            function(value, element, name) {
                console.log(value === window.$(`input[name='${name}']`).val());
                return value === window.$(`input[name='${name}']`).val();
            },"doit etre egale au mot de passe"
        );
        this.props.onLoginPageLoaded();
    }

    componentWillUnmount() {
        window.$("body").removeClass("login_page");
    }

    render() {
        const GenderSelectOptions = [
            {id: null, libelle: "----Selectionnez un genre-----"},
            {id: "M", libelle: "Masculin"},
            {id: "F", libelle: "Féminin"},
        ];

        return (
                <div>
                    <div className="container-fluid">
                        <div className="login-wrapper row">
                            <div id="login" className="login loginpage col-lg-offset-2 col-md-offset-3 col-sm-offset-3 col-xs-offset-0 col-xs-12 col-sm-6 col-lg-8" style={{marginTop: '-8.5px'}}>    
                                <div className="login-form-header">
                                    <img src={signup} alt="login-icon" style={{maxWidth:'64px'}}/>
                                    <div className="login-header">
                                        <h4 className="bold color-white">Inscrivez-vous maintenant !</h4>
                                        <h4><small>Veuillez saisir vos données pour vous inscrire.</small></h4>
                                    </div>
                                </div>
                            
                                <div className="box login">

                                    <div className="content-body" style={{paddingTop:'30px'}}>

                                        <form id="msg_validate" onSubmit={this.register} action="#" noValidate="novalidate" className="no-mb no-mt">
                                            <div className="row">
                                                <div className="col-xs-12">

                                                    <div class="col-lg-6 no-pl">
                                                        <FormBoxItem 
                                                            type="text"
                                                            label="Username"
                                                            onInputChange={this.handleInputChange}
                                                            name="username"
                                                            value={this.state.username}/>
                                                    </div>
                                                    <div class="col-lg-6 no-pl">
                                                        <FormBoxItem 
                                                            type="email"
                                                            label="Email"
                                                            onInputChange={this.handleInputChange}
                                                            name="email"
                                                            value={this.state.email}/>
                                                    </div>
                                                    <div class="col-lg-6 no-pl">
                                                        <FormBoxItem 
                                                            type="password"
                                                            label="Password" 
                                                            onInputChange={this.handleInputChange}
                                                            name="password"
                                                            value={this.state.password}/>
                                                    </div>
                                                    <div class="col-lg-6 no-pl">
                                                        <FormBoxItem 
                                                            type="password"
                                                            label="REPEAT Password" 
                                                            onInputChange={this.handleInputChange}
                                                            name="r_password"
                                                            value={this.state.r_password}/>
                                                    </div>
                                                    
                                                </div>
                                            </div>

                                            <div className="pull-left">
                                                <a onClick={this.handleSignInClicked} className="btn btn-primary mt-10 btn-corner right-15">S'inscrire</a>
                                                <Link style={{color: "white"}} to="/login" className="btn mt-10 btn-corner signin" title="log in" >Se connecter</Link>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                <p id="nav">
                                    {/* <Link to="#" className="pull-left" title="Password Lost and Found" >Forgot password?</Link>
                                    <Link to="/login" className="pull-right" title="Sign In" >Login</Link> */}
                                </p>

                            </div>
                        </div>
                    </div>
                </div>
        );
    }
} 

export default Login;