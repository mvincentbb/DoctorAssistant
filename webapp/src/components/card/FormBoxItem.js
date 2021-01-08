import React from "react";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CKEditor from "@ckeditor/ckeditor5-react";

// import Select from 'react-select';
class FormBoxItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        if (this.props.type === "tagsinput") {
            window.$(document).ready( () => {
                window.$(`#${this.props.name}-control`).find('input[data-role="tagsinput"]').first().tagsinput();
                var taginput = window.$(`#${this.props.name}-control`).find(".bootstrap-tagsinput").find("input").first();
                // console.log(taginput);
                taginput.keyup(() => {
                    this.handleTagsInputChange(this.props.name, window.$(`#${this.props.name}-control`).find('input[data-role="tagsinput"]').first().val());
                });
            })
        }
    }

    handleInputChange(e) {
        const { name, value } = e.target;
        this.props.onInputChange(name, value);
    }

    handleTagsInputChange = (name, value) => {
        this.props.onInputChange(name, value);
    };

    handleFileInputChange = (e) => {
        const input = e.target;
        const { name, files } = input;

        if (input.files && input.files[0]) {
            this.props.onInputChange(name, files[0]);
        }
    };

    handleCKEditorChange = (name, data) => {
        this.props.onCKEditorChange(name, data);
    };

    render() {
    return (
        <div className="form-group">
            <label className="form-label" style={{fontWeight: "bolder"}}>{this.props.label}</label>
            <span className="desc">{this.props.description} </span>

            {this.props.type === "select" && (
                <div id={`${this.props.name}-control`}>
                <select
                    className="form-control"
                    onChange={this.handleInputChange}
                    name={this.props.name}
                    value={this.props.value}
                >
                    {this.props.selectOptions.map((option) =>
                    option.id ? (
                        <option key={option.id} value={option.id}>
                        {option.libelle}
                        </option>
                    ) : null
                    )}
                </select>
                <span className=""></span>
                </div>
            )}

            {this.props.type === "textarea" && (
                <div id={`${this.props.name}-control`} className="controls">
                <textarea
                    name={this.props.name}
                    value={this.props.value ? this.props.value : ""}
                    className="form-control autogrow"
                    cols="5"
                    style={{
                    overflow: "hidden",
                    overflowWrap: "break-word",
                    resize: "horizontal",
                    height: 100 + "px",
                    }}
                    onChange={this.handleInputChange}
                ></textarea>
                <span className=""></span>
                </div>
            )}

            {this.props.type === "date" && (
                <div id={`${this.props.name}-control`} className="controls">
                <input
                    type="date"
                    name={this.props.name}
                    value={this.props.value ? this.props.value : ""}
                    className="form-control"
                    onChange={this.handleInputChange}
                />
                <span className=""></span>
                </div>
            )}

            {this.props.type === "file" && (
                <div id={`${this.props.name}-control`} className="controls">
                    <input
                        type="file"
                        accept={this.props.accept}
                        name={this.props.name}
                        className="form-control"
                        onChange={this.handleFileInputChange}
                    />
                    <span className=""></span>
                </div>
            )}

            {this.props.type === "password" && (
                <div id={`${this.props.name}-control`} className="controls">
                <input
                    type="password"
                    name={this.props.name}
                    value={this.props.value ? this.props.value : ""}
                    className="form-control"
                    onChange={this.handleInputChange}
                />
                <span className=""></span>
                </div>
            )}

            {this.props.type === "text" && (
                <div id={`${this.props.name}-control`} className="controls">
                <input
                    type="text"
                    name={this.props.name}
                    value={this.props.value ? this.props.value : ""}
                    className="form-control"
                    onChange={this.handleInputChange}
                    aria-required="true"
                    aria-invalid="false"
                />
                <span className=""></span>
                </div>
            )}

            {this.props.type === "number" && (
                <div id={`${this.props.name}-control`} className="controls">
                <input
                    type="number"
                    name={this.props.name}
                    value={this.props.value ? this.props.value : ""}
                    className="form-control"
                    onChange={this.handleInputChange}
                    aria-required="true"
                    aria-invalid="false"
                />
                <span className=""></span>
                </div>
            )}

            {this.props.type === "tagsinput" && (
                <div id={`${this.props.name}-control`} className="controls">
                    <input
                        type="text"
                        data-role="tagsinput"
                        name={this.props.name}
                        value={this.props.value ? this.props.value : ""}
                        className="form-control"
                        onChange={this.handleInputChange}
                    />
                    <span className=""></span>
                </div>
            )}

            {this.props.type === "email" && (
                <div id={`${this.props.name}-control`} className="controls">
                <input
                    type="email"
                    name={this.props.name}
                    value={this.props.value ? this.props.value : ""}
                    className="form-control"
                    onChange={this.handleInputChange}
                />
                <span className=""></span>
                </div>
            )}
            {this.props.type === "Cke" && (
                <div id={`${this.props.name}-control`} className="controls">
                <CKEditor
                    editor={ClassicEditor}
                    config={{toolbar:["heading","|","bold","italic","|", 'bulletedList', 'numberedList', 'blockQuote']}}
                    data={this.props.value ? this.props.value : ""}
                    onInit={(editor) => {
                        // You can store the "editor" and use when it is needed.
                    }}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        this.handleCKEditorChange(this.props.name, data);
                        // console.log({ event, editor, data });
                    }}
                    onBlur={(editor) => {
                        // console.log("Blur.", editor);
                    }}
                    onFocus={(editor) => {
                        // console.log("Focus.", editor);
                    }}
                />
                <span className=""></span>
                </div>
            )}
        </div>
    );
    }
}

export default FormBoxItem;
