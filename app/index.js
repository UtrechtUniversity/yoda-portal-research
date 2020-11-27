import React, { Component } from "react";
import { render } from "react-dom";
import Form from "@rjsf/bootstrap-4";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {Container as bscontainer} from "react-bootstrap/Container";
import Select from 'react-select';
import Geolocation from "./Geolocation";


const path = $('#form').attr('data-path');

let schema       = {};
let uiSchema     = {};
let yodaFormData = {};

let formProperties;

let saving = false;

let form = document.getElementById('form');

const customStyles = {
    control: styles => ({...styles, borderRadius: '0px', minHeight: '15px', height: '33.5px'}),
    placeholder: () => ({color: '#555'})
};

const enumWidget = (props) => {
    let enumArray = props['schema']['enum'];
    let enumNames = props['schema']['enumNames'];

    if (enumNames == null)
        enumNames = enumArray;

    let i = enumArray.indexOf(props['value']);
    let placeholder = enumNames[i] == null ? ' ' : enumNames[i];

    return (<Select className={'select-box'}
                    placeholder={placeholder}
                    required={props.required}
                    isDisabled={props.readonly}
                    onChange={(event) => props.onChange(event.value)}
                    options={props['options']['enumOptions']}
                    styles={customStyles} />);
};

const widgets = {
    //SelectWidget: enumWidget
};

const fields = {
    geo: Geolocation
};

const onSubmit = ({formData}) => submitData(formData);

class YodaForm extends React.Component {
    constructor(props) {
        super(props);

        const formContext = {
            saving: false
        };
        this.state = {
            formData: yodaFormData,
            formContext: formContext
        };
    }

    onChange(form) {
        updateCompleteness();

        // Turn save mode off.
        saving = false;
        const formContext = { saving: false };

        this.setState({
            formData: form.formData,
            formContext: formContext
        });
    }

    onError(form) {
        let formContext = {...this.state.formContext};
        formContext.saving = saving;
        this.setState({ formContext: formContext });
    }

    transformErrors(errors) {
        // Strip errors when saving.
        if (saving)
            return errors.filter((e) => e.name !== 'required' && e.name !== 'dependencies');
        return errors;
    }

    ErrorListTemplate(props) {
        let {errors, formContext} = props;
        errors = errors.filter((e) => e.name !== 'required' && e.name !== 'dependencies');

        if (errors.length === 0) {
            return(<div></div>);
        } else {
            // Show error list only on save.
            if (formContext.saving) {
                return (
                  <div className="panel panel-warning errors">
                    <div className="panel-heading">
                      <h3 className="panel-title">Validation warnings</h3>
                    </div>
                    <ul className="list-group">
                      {errors.map((error, i) => {
                        return (
                          <li key={i} className="list-group-item text-warning">
                            {error.stack}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
            } else {
                return(<div></div>);
            }
        }
    }

    render () {
        return (
        <Form className="metadata-form"
              schema={schema}
              idPrefix={"yoda"}
              uiSchema={uiSchema}
              fields={fields}
              formData={this.state.formData}
              formContext={this.state.formContext}
              ArrayFieldTemplate={ArrayFieldTemplate}
              liveValidate={true}
              noValidate={false}
              noHtml5Validate={true}
              showErrorList={true}
              ErrorList={this.ErrorListTemplate}
              onSubmit={onSubmit}
              widgets={widgets}
              onChange={this.onChange.bind(this)}
              onError={this.onError.bind(this)}
              transformErrors={this.transformErrors}>
            <button ref={(btn) => {this.submitButton=btn;}} className="hidden" />
        </Form>
    );
  }
}

class YodaButtons extends React.Component {
    constructor(props) {
        super(props);
    }

    renderSaveButton() {
        return (<button onClick={this.props.saveMetadata} type="submit" className="btn btn-primary">Save</button>);
    }

    renderDeleteButton() {
        return (<button onClick={deleteMetadata} type="button" className="btn btn-danger delete-all-metadata-btn pull-right">Delete all metadata </button>);
    }

    renderCloneButton() {
        return (<button onClick={this.props.cloneMetadata} type="button" className="btn btn-primary clone-metadata-btn pull-right">Clone from parent folder</button>);
    }

    renderFormCompleteness() {
        return (<span className="form-completeness" aria-hidden="true" data-toggle="tooltip" title=""></span>);
    }

    renderButtons() {
        let buttons = [];

        if (formProperties.data.can_edit) {
            buttons.push(this.renderSaveButton());
            buttons.push(this.renderFormCompleteness());

            // Delete and clone are mutually exclusive.
            if (formProperties.data.metadata !== null)
                buttons.push(this.renderDeleteButton());
            else if (formProperties.data.can_clone)
                buttons.push(this.renderCloneButton());
        }
        return (<div>{buttons}</div>);
    }

    render() {
        return (
            <div className="form-group">
                <div className="row yodaButtons">
                    <div className="col-sm-12">
                        {this.renderButtons()}
                    </div>
                </div>
            </div>
        );
    }
}


class Container extends React.Component {
    constructor(props) {
        super(props);
        this.saveMetadata = this.saveMetadata.bind(this);
    }

    saveMetadata() {
        saving = true;
        this.form.submitButton.click();
    }

    cloneMetadata() {
        swal({
            title: "Are you sure?",
            text: "Entered metadata will be overwritten by cloning.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ffcd00",
            confirmButtonText: "Yes, clone metadata!",
            closeOnConfirm: false,
            animation: false
        },
        async isConfirm => {
            if (isConfirm) {
                await Yoda.call('meta_clone_file',
                                {target_coll: Yoda.basePath+path},
                                {errorPrefix: 'Metadata could not be cloned'});
                window.location.reload();
            }
        });
    }

    render() {
        return (
        <div>
          <YodaButtons saveMetadata={this.saveMetadata}
                       deleteMetadata={deleteMetadata}
                       cloneMetadata={this.cloneMetadata} />
          <YodaForm ref={(form) => {this.form=form;}}/>
          <YodaButtons saveMetadata={this.saveMetadata}
                       deleteMetadata={deleteMetadata}
                       cloneMetadata={this.cloneMetadata} />
        </div>
      );
    }
};

/**
 * Returns to the browse view for the current collection.
 */
function browse() {
    window.location.href = '/research/browse?dir=' + encodeURIComponent(path);
}

function deleteMetadata() {
    swal({
        title: "Are you sure?",
        text: "You will not be able to undo this action.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete all metadata!",
        closeOnConfirm: false,
        animation: false
    },
    async isConfirm => {
        if (isConfirm) {
            await Yoda.call('meta_remove',
                            {coll: Yoda.basePath+path},
                            {errorPrefix: 'Metadata could not be deleted'});

            Yoda.message('success', `Deleted metadata of folder <${path}>`);
            browse();
        }
    });
}

function loadForm(properties) {
    formProperties = properties;
    console.log('Form properties:', formProperties);

    // Inhibit "loading" text.
    formLoaded = true;

    if (formProperties.data !== null) {
        // These ary only present when there is a form to show (i.e. no
        // validation errors, and no transformation needed).
        schema       = formProperties.data.schema;
        uiSchema     = formProperties.data.uischema;
        yodaFormData = formProperties.data.metadata === null ? undefined : formProperties.data.metadata;
    }

    if (formProperties.status === 'error_transformation_needed') {
        // Transformation is necessary. Show transformation prompt.
        $('#transformation-text').html(formProperties.data.transformation_html);
        if (formProperties.data.can_edit) {
            $('#transformation-buttons').removeClass('hide')
            $('#transformation-text').html(formProperties.data.transformation_html);
        } else {
            $('#transformation .close-button').removeClass('hide')
        }
        $('.transformation-accept').on('click', async () => {
            $('.transformation-accept').attr('disabled', true);

            await Yoda.call('transform_metadata',
                            {coll: Yoda.basePath+path},
                            {errorPrefix: 'Metadata could not be transformed'});

            window.location.reload();
        });
        $('#transformation').removeClass('hide');

    } else if (formProperties.status !== 'ok') {
        // Errors exist - show those instead of loading a form.
        let text = '';
        if (formProperties.status === 'error_validation') {
            // Validation errors? show a list.
            $.each(formProperties.data.errors, (key, field) => {
                text += '<li>' + $('<div>').text(field.replace('->', '→')).html();
            });
        } else {
            // Structural / misc error? Show status info.
            text += '<li>' + $('<div>').text(formProperties.status_info).html();
        }
        $('.delete-all-metadata-btn').on('click', deleteMetadata);
        $('#form-errors .error-fields').html(text);
        $('#form-errors').removeClass('hide');

    } else if (formProperties.data.metadata === null && !formProperties.data.can_edit) {
        // No metadata present and no write access. Do not show a form.
        $('#form').addClass('hide');
        $('#no-metadata').removeClass('hide');

    } else {
        // Metadata present or user has write access, load the form.
        if (!formProperties.data.can_edit)
            uiSchema['ui:readonly'] = true;

        render(<Container/>, document.getElementById('form'));

        // Form may already be visible (with "loading" text).
        if ($('#metadata-form').hasClass('hide')) {
            // Avoid flashing things on screen.
            $('#metadata-form').fadeIn(220);
            $('#metadata-form').removeClass('hide');
        }

        updateCompleteness();
    }
}

$(_ => loadForm(JSON.parse(atob($('#form-properties').text()))));

async function submitData(data) {
    // Disable buttons.
    $('.yodaButtons button').attr('disabled', true);

    // Save.
    try {
        await Yoda.call('meta_form_save',
                        {coll: Yoda.basePath+path, metadata: data},
                        {errorPrefix: 'Metadata could not be saved'});

        Yoda.message('success', `Updated metadata of folder <${path}>`);
        browse();
    } catch (e) {
        // Allow retry.
        $('.yodaButtons button').attr('disabled', false);
    }
}

function CustomFieldTemplate(props) {
    const {id, classNames, label, help, hidden, required, description, errors,
           rawErrors, children, displayLabel, formContext, readonly} = props;

    if (hidden || !displayLabel) {
        return children;
    }

    const hasErrors = Array.isArray(errors.props.errors);

    // Only show error messages after submit.
    if (formContext.saving) {
      return (
        <div className={classNames}>
          <div className={'col-sm-11 field-wrapper'}>
            <div className={'row'}>
              <div className={'col-sm-12'}>
                {description}
                {children}
              </div>
            </div>
            {errors}
          </div>
        </div>
      );
    } else {
       return (
        <div className={classNames}>
          <div className={'col-sm-9 field-wrapper'}>
            <div className={'row'}>
              <div className={'col-sm-12'}>
                {description}
                {children}
              </div>
            </div>
          </div>
         </div>
      );
    }
}

function ObjectFieldTemplate(props) {
    const { TitleField, DescriptionField } = props;

    let structureClass;
    let structure;
    if ('yoda:structure' in props.schema) {
        structureClass = `yoda-structure ${props.schema['yoda:structure']}`;
        structure = props.schema['yoda:structure'];
    }

    if (structure === 'compound') {
        var array = props.properties;
        var output = props.properties.map((prop, i, array) => {
            return (
                <div key={i} className="col-sm-6 field compound-field">
                    {prop.content}
                </div>
            );
        });

        return (
            <div className={`form-group ${structureClass}`}>
                <label className="col-sm-2 combined-main-label control-label">
                    <span data-toggle="tooltip" title={props.uiSchema["ui:help"]}>{props.title}</span>
                </label>
                <div className="col-sm-11">
                    <div className="form-group row">
                        {output}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <fieldset className={structureClass}>
            {(props.uiSchema["ui:title"] || props.title) && (
                <TitleField
                    id={`${props.idSchema.$id}__title`}
                    title={props.title || props.uiSchema["ui:title"]}
                    required={props.required}
                    formContext={props.formContext}
                />
            )}
            {props.description && (
                <DescriptionField
                    id={`${props.idSchema.$id}__description`}
                    description={props.description}
                    formContext={props.formContext}
                />
            )}
            {props.properties.map(prop => prop.content)}
        </fieldset>
    );

}

function ArrayFieldTemplate(props) {
    const { DescriptionField } = props;

    return (
        <fieldset>
            {(props.title) && (
                <legend>{props.title}</legend>
            )}

            {props.description && (
                <DescriptionField
                    id={`${props.idSchema.$id}__description`}
                    description={props.description}
                    formContext={props.formContext}
                />
            )}

            {props.canAdd && (
                <div className="row">
                    <p className="col-xs-3 col-xs-offset-9 array-item-add text-right">
                        <button className="btn btn-primary" onClick={props.onAddClick} type="button">
                            Add
                        </button>
                    </p>
                </div>
            )}

            {props.items &&
            props.items.map(element => (
                <div key={element.key} className={element.className}>
                    <div className="col-lg-9 col-9">{element.children}</div>
                    <div className="py-4 col-lg-3 col-3">
                        <div className="d-flex flex-row">
                            {element.hasMoveUp && (
                            <div className="m-0 p-0">
                                <button
                                    className="btn btn-light btn-sm"
                                    onClick={element.onReorderClick(
                                        element.index,
                                        element.index - 1
                                    )}>
                                    Up
                                </button>
                            </div>
                            )}

                            {element.hasMoveDown && (
                                <div className="m-0 p-0">
                                    <button
                                        className="btn btn-light btn-sm"
                                        onClick={element.onReorderClick(
                                            element.index,
                                            element.index + 1
                                        )}>
                                        Down
                                    </button>
                                </div>
                            )}

                            {element.hasRemove && (
                            <div className="m-0 p-0">
                                <button
                                    className="btn btn-light btn-sm"
                                    onClick={element.onDropIndexClick(element.index)}>
                                    Delete
                                </button>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </fieldset>
    );
}


function updateCompleteness()
{
    const mandatoryTotal  = $('.fa-lock.safe:visible').length;
    const mandatoryFilled = $('.fa-stack .checkmark-green-top-right:visible').length;

    const completeness = mandatoryTotal == 0 ? 1 : mandatoryFilled / mandatoryTotal;

    const html = ' '
               + '<i class="fa fa-check form-required-present"></i>'.repeat(  Math.floor(completeness*5))
               + '<i class="fa fa-check form-required-missing"></i>'.repeat(5-Math.floor(completeness*5));

    $('.form-completeness').attr('title', `Required for the vault: ${mandatoryTotal}, currently filled required fields: ${mandatoryFilled}`);
    $('.form-completeness').html(html);

    return mandatoryTotal == mandatoryFilled;
}