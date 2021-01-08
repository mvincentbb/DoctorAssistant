import React from "react";
import { BOY_AVATAR } from "../../utils";

class CustomSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedOption: null
        };
    }

    componentWillReceiveProps(nextProps) {
        var selectedOption = null;
        if (nextProps.value !== 0) {
            for (let option of nextProps.options) {
                if (parseInt(nextProps.value) === option.id) {
                    selectedOption = option;
                    break;
                }
            }
            this.setState({selectedOption: selectedOption});
        }
    }

    componentDidMount() {}

    isMobileDevice = () => {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    }

    open_select =(event) => {
        var idx = event.target;
        var idx1 =  idx.getAttribute('data-n-select');

        var ul_cont_li = window.$(idx).parent().find(".cont_select_int > li");

        var hg = 0;

        var slect_open = window.$(idx).parent()[0].getAttribute('data-selec-open');

        var slect_element_open = window.$(idx).parent().find("select")[0];
        
        if (this.isMobileDevice()) { 
            if (window.document.createEvent) { // All
                var evt = window.document.createEvent("MouseEvents");
                evt.initMouseEvent("mousedown", false, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                slect_element_open.dispatchEvent(evt);
            }
            else if (slect_element_open.fireEvent) { // IE
                slect_element_open.fireEvent("onmousedown");
            }
            else {
                slect_element_open.click();
            }
        }else {

            for (var i = 0; i < ul_cont_li.length; i++) {
                hg += ul_cont_li[i].offsetHeight;
            };
            if (slect_open == 'false') {
                window.$(idx).parent()[0].setAttribute('data-selec-open','true');
                window.$(idx).parent().find(".cont_list_select_mate > ul")[0].style.height = hg+"px";
                window.$(idx).parent().find(".icon_select_mate")[0].style.transform = 'rotate(180deg)';
            }else{
                window.$(idx).parent()[0].setAttribute('data-selec-open','false');
                window.$(idx).parent().find(".icon_select_mate")[0].style.transform = 'rotate(0deg)';
                window.$(idx).parent().find(".cont_list_select_mate > ul")[0].style.height = "0px";
            }
        }
    }

    salir_select = (elt) => {
        var indx = elt.getAttribute('data-index');

        var select_ = window.$(elt).parent().parent().parent().find("select")[0];
        
        window.$(elt).parent()[0].style.height = "0px";
        window.$(elt).parent().parent().prev()[0].style.transform = 'rotate(0deg)';
        window.$(elt).parent().parent().parent()[0].setAttribute('data-selec-open','false');
    }

    _select_option = (elt) => {

        var indx = elt.getAttribute('data-index'),
            selc= elt.getAttribute('data-selec-index');
            
        if (this.isMobileDevice()) {
            selc = selc -1;
        }
        
        var select_ = window.$(elt).parent().parent().parent().find("select")[0];
       
        var li_s = window.$(elt).parent().find('li');
        
        var p_act = window.$(elt).parent().parent().parent().find(".selecionado_opcion")[0].innerHTML = elt.innerHTML;
        
        var select_optiones = window.$(select_).find('option');
        
        for (var i = 0; i < li_s.length; i++) {
            
            if (elt.className == 'active') {
                elt.className = '';
            }
            elt.className = 'active';
       
        }
        // window.$(select_).find(`[value="${indx}"]`)[0].selected = true;
        // select_.selectedIndex = indx;
        // window.$(select_).change();
        this.salir_select(elt);

        this.props.onInputChange(this.props.name, indx);

        window.$(".selecionado_opcion .avatar-box, .selecionado_opcion .content").click( (event) => {
            event.stopPropagation();
        })
    }

    handleOptionClick = (e) => {
        var elt = e.target;        
        this._select_option(elt);
    }

    render() {

        return (
            <div className="select_mate" data-mate-select="active" data-indx-select={this.props.value} data-selec-open="false">
				<select>
					<option value={this.props.value}> {this.props.default} </option>
                    { this.props.options.map( (option, index) => (
                        <option key={option.id} value={option.id}>{option.value}</option>
                    ))}
				</select>

                { this.props.value === 0 ? (
                    <p className="selecionado_opcion" onClick={ this.open_select } data-n-select={this.props.value}>{this.props.default}</p>
                ) : (
                    <div className="selecionado_opcion" onClick={ this.open_select } data-n-select={this.props.value}>
                        { this.props.withAvatar ? (
                            <div>
                                <div className="avatar-box">
                                    <div>
                                        <img src={ this.state.selectedOption ? this.state.selectedOption.photo : undefined } />
                                    </div>
                                </div>
                                <div className="content"> { this.state.selectedOption ? this.state.selectedOption.value : "" } </div>
                            </div>
                        ) : ( this.state.selectedOption ? this.state.selectedOption.value : "" )}
                    </div>
                )}
                
				
                <span className="icon_select_mate" onClick={ this.open_select } data-n-select={this.props.value} style={{transform: 'rotate(0deg)'}}>
					<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
						<path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"></path>
						<path d="M0-.75h24v24H0z" fill="none"></path>
					</svg>
				</span>
				
                <div className="cont_list_select_mate">
					<ul className="cont_select_int" style={{height: 0}}>
                        
                        <li onClick={ this.handleOptionClick } data-index="0" data-selec-index={this.props.value}>{this.props.default}</li>

                        { this.props.options.map( (option, index) => {

                            return(
                                <li onClick={ this.handleOptionClick } key={option.id} data-index={option.id} data-selec-index={this.props.value}>
                                    { this.props.withAvatar ? (
                                        <div>
                                            <div onClick={ (event) => { event.stopPropagation(); }} className="avatar-box">
                                                <div>
                                                    <img src={option.photo ? option.photo : BOY_AVATAR} />
                                                </div>
                                            </div>
                                            <div className="content" onClick={ (event) => { event.stopPropagation(); }}> {option.value} </div>
                                        </div>
                                    ) : ( option.value )}
                                    
                                </li>
                            )
                            
                        })}
						
					</ul>
				</div>
			</div>
        );
    }
}

export default CustomSelect;
