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
    control: styles => ({...styles})
};

const enumWidget = (props) => {
    let enumArray = props['schema']['enum'];
    let enumNames = props['schema']['enumNames'];

    if (enumNames == null)
        enumNames = enumArray;

    let i = enumArray.indexOf(props['value']);
    let placeholder = enumNames[i] == null ? ' ' : enumNames[i];

    return (
        <div>
            <label className="form-label">{props.label || props.uiSchema["ui:title"]}</label>
            <Select className={'select-box'}
                    placeholder={placeholder}
                    required={props.required}
                    isDisabled={props.readonly}
                    onChange={(event) => props.onChange(event.value)}
                    options={props['options']['enumOptions']}
                    styles={customStyles} />
        </div>
    );
};


const widgets = {
    SelectWidget: enumWidget
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
                    <div className="mb-4 card border-danger">
                        <div className="alert-danger card-header">Validation warnings</div>
                        <div className="p-0 card-body">
                            <div className="list-group">
                              {errors.map((error, i) => {
                                return (
                                    <div key={i} className="border-0 list-group-item">
                                        <span>{error.stack}</span>
                                    </div>
                                );
                              })}
                          </div>
                      </div>
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
              ObjectFieldTemplate={ObjectFieldTemplate}
              FieldTemplate={CustomFieldTemplate}
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
        return (<button onClick={this.props.saveMetadata} type="submit" className="btn btn-primary pull-left">Save</button>);
    }

    renderDeleteButton() {
        return (<button onClick={deleteMetadata} type="button" className="btn btn-danger delete-all-metadata-btn pull-right">Delete all metadata </button>);
    }

    renderCloneButton() {
        return (<button onClick={this.props.cloneMetadata} type="button" className="btn btn-primary clone-metadata-btn pull-right">Clone from parent folder</button>);
    }

    renderFormCompleteness() {
        return (<div><span className="text-sm pull-left text-muted text-center ml-3 mt-1">Required for the vault:</span><div className="form-completeness progress pull-left ml-3 mt-2 w-25" data-toggle="tooltip" title=""><div className="progress-bar bg-success"></div></div></div>);
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

    // Only show error messages after submit.
    if (formContext.saving) {
      return (
        <div className={classNames + ' row'}>
          <div className={'col-12 field-wrapper'}>
            <div className={'form-group mb-0'}>
              <div className={'mb-0 form-group'}>
                {children}
                  {help && (
                      <small className="text-muted form-text">{help}</small>
                  )}
                {description}
              </div>
            </div>
            {errors}
          </div>
        </div>
      );
    } else {
       return (
        <div className={classNames+ ' row'}>
          <div className={'col-12 field-wrapper'}>
            <div className={'form-group mb-0'}>
              <div className={'mb-0 form-group'}>
                {children}
                  {help && (
                      <small className="text-muted form-text">{help}</small>
                  )}
                {description}
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
        let output = props.properties.map((prop, i) => {
            return (
                <div key={i} className="col compound-field">
                    {prop.content}
                </div>
            );
        });

        return (
            <div className={`form-row ${structureClass}`}>
                {output}
            </div>
        );
    }

    return (
        <fieldset>
            {(props.uiSchema["ui:title"] || props.title) && (
                <TitleField
                    id={`${props.idSchema.$id}__title`}
                    title={props.title || props.uiSchema["ui:title"]}
                    required={props.required}
                    formContext={props.formContext}
                />
            )}
            {(props.uiSchema["ui:description"] || props.schema.description) && (
                <small className="col-xs-12 text-muted form-text">
                    {props.uiSchema["ui:description"] || props.schema.description}
                </small>
            )}
            <div className="container-fluid p-0">
                {props.properties.map(prop => (
                    <div className="col-xs-12" key={prop.content.key}>
                        {prop.content}
                    </div>
                ))}
            </div>
        </fieldset>
    );
}

function ArrayFieldTemplate(props) {
    const { DescriptionField, readonly, disabled } = props;

    if (disabled) {
        let output = props.items.map((element, i) => {
            // Disabled view
            if (disabled) {
                return element.children;
            }
        });
        return (<div className="hide">{output}</div>);
    } else {
        let buttonClass = "col-sm-2 offset-sm-10 array-item-add text-right";
        if (props.uiSchema["ui:description"] || props.schema.description) {
            buttonClass = "col-sm-2 array-item-add text-right";
        }

        return (
            <fieldset className="yoda-array-field">
                {(props.title) && (
                    <legend>{props.title}</legend>
                )}

                <div className="d-flex">
                    {(props.uiSchema["ui:description"] || props.schema.description) && (
                        <small className="col-sm-10 text-muted form-text">
                            {props.uiSchema["ui:description"] || props.schema.description}
                        </small>
                    )}

                    {(!readonly && props.canAdd) && (
                        <p className={buttonClass}>
                            <button className="btn btn-outline-secondary btn-sm" onClick={props.onAddClick} type="button">
                                <i className="fa fa-plus" aria-hidden="true"></i>
                            </button>
                        </p>
                    )}
                </div>

                {props.items &&
                props.items.map(el => (
                    <div key={el.key} className="d-flex">
                        <div className="col-lg-10 col-10">
                            {el.children}
                        </div>
                        {!readonly && (
                            <div className="py-4 col-lg-2 col-2 mt-2">
                                <div className="d-flex flex-row">
                                    {el.hasMoveUp && (
                                        <div className="m-0 p-0">
                                            <button className="btn btn-light btn-sm"
                                                onClick={el.onReorderClick(
                                                    el.index,
                                                    el.index - 1
                                                )}>
                                                <i className="fa fa-arrow-up" aria-hidden="true"></i>
                                            </button>
                                        </div>
                                    )}

                                    {el.hasMoveDown && (
                                        <div className="m-0 p-0">
                                            <button className="btn btn-light btn-sm"
                                                onClick={el.onReorderClick(
                                                    el.index,
                                                    el.index + 1
                                                )}>
                                                <i className="fa fa-arrow-down" aria-hidden="true"></i>
                                            </button>
                                        </div>
                                    )}

                                    {el.hasRemove && (
                                        <div className="m-0 p-0">
                                            <button className="btn btn-light btn-sm"
                                                onClick={el.onDropIndexClick(el.index)}>
                                                <i className="fa fa-trash" aria-hidden="true"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </fieldset>
        );
    }
}

function updateCompleteness()
{
    let mandatoryTotal = 0;
    let mandatoryFilled = 0;
    $(".form-control").each(function() {
        if ($(this)[0].required) {
            mandatoryTotal++;
            if ($(this)[0].value != "") {
                mandatoryFilled++;
            }
        }
    });

    let percent = (mandatoryFilled / mandatoryTotal) * 100;
    $(".form-completeness .progress-bar").css('width', percent + '%');
    $('.form-completeness').attr('title', `Required for the vault: ${mandatoryTotal}, currently filled required fields: ${mandatoryFilled}`);

    return mandatoryTotal == mandatoryFilled;
}
