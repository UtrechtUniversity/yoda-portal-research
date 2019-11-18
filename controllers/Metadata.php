<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Metadata controller
 *
 * @package    Yoda
 * @copyright  Copyright (c) 2017-2019, Utrecht University. All rights reserved.
 * @license    GPLv3, see LICENSE.
 */

class Metadata extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();

        $this->data['userIsAllowed'] = TRUE;

        $this->load->model('rodsuser');
        $this->config->load('config');

        $this->load->library('pathlibrary');
        $this->load->library('api');
    }

    public function form()
    {
        $pathStart = $this->pathlibrary->getPathStart($this->config);
        $rodsaccount = $this->rodsuser->getRodsAccount();

        $path = $this->input->get('path');
        if ($path === null)
            return redirect('research/browse', 'refresh');

        $fullPath =  $pathStart . $path;

        $flashMessage = $this->session->flashdata('flashMessage');
        $flashMessageType = $this->session->flashdata('flashMessageType');

        // Load CSRF token
        $tokenName = $this->security->get_csrf_token_name();
        $tokenHash = $this->security->get_csrf_hash();

        $formProperties = $this->api->call('uu_meta_form_load', ['coll' => $fullPath]);

        $viewParams = array(
            'styleIncludes' => array(
                'lib/font-awesome/css/font-awesome.css',
                'lib/sweetalert/sweetalert.css',
                'css/metadata/form.css',
                'css/metadata/leaflet.css',
            ),
            'scriptIncludes' => array(
                'lib/sweetalert/sweetalert.min.js'
            ),
            'path'             => $path,
            'tokenName'        => $tokenName,
            'tokenHash'        => $tokenHash,
            'flashMessage'     => $flashMessage,
            'flashMessageType' => $flashMessageType,
            'formProperties'   => $formProperties,
        );
        loadView('metadata/form', $viewParams);
    }

    /**
     * Currently unused - logic to be moved to uu ruleset.
     * TODO.
     */
    function store()
    {
        if ($this->input->server('REQUEST_METHOD') !== 'POST') {
            header('Allow: POST'); set_status_header(405); return;
        }

        $pathStart = $this->pathlibrary->getPathStart($this->config);
        $rodsaccount = $this->rodsuser->getRodsAccount();

        $this->load->model('Filesystem');

        $path = $this->input->get('path');
        $fullPath = $pathStart . $path;

        $formConfig = $this->filesystem->metadataFormPaths($rodsaccount, $fullPath);

        $userType = $formConfig['userType'];
        $lockStatus = $formConfig['lockFound'];
        $folderStatus = $formConfig['folderStatus'];
        $isDatamanager = $formConfig['isDatamanager'];

        if (!($userType=='normal' || $userType=='manager')) { // superseeds userType!= reader - which comes too late for permissions for vault submission
            $this->session->set_flashdata('flashMessage', 'Insufficient rights to perform this action.'); // wat is een locking error?
            $this->session->set_flashdata('flashMessageType', 'danger');
            return redirect('research/browse?dir=' . rawurlencode($path), 'refresh');
        }

        if ($this->input->post('vault_submission') || $this->input->post('vault_unsubmission')) {
            $this->load->library('vaultsubmission', array('formConfig' => $formConfig, 'folder' => $fullPath));
            if ($this->input->post('vault_submission')) { // HdR er wordt nog niet gecheckt dat juiste persoon dit mag

                $metadataExists = ($formConfig['hasMetadataXml'] == 'true' || $formConfig['hasMetadataXml'] == 'yes');
                $loadedFormData = $this->Metadata_form_model->loadXmlFormData($rodsaccount, $formConfig['metadataXmlPath'], $metadataExists, $pathStart);
                if ($loadedFormData['schemaIdMetadata'] != $loadedFormData['schemaIdCurrent']) {
                    setMessage('error', 'No submission allowed as your data is not up to date with the lastest YoDa schema for this community.');
                    return redirect('research/metadata/form?path=' . rawurlencode($path), 'refresh');
                }

                if(!$this->vaultsubmission->checkLock()) {
                    setMessage('error', 'There was a locking error encountered while submitting this folder.');
                }
                else {
                    // first perform a save action of the latest posted data - only if there is no lock!
                    if ($formConfig['folderStatus']!='LOCKED') {
                        $data = $this->input->post('formData');
                        $result = $this->Metadata_form_model->saveJsonMetadata($rodsaccount, $fullPath, $data);
                        if ($result['status'] != "Success") {
                            setMessage('error', 'Saving the metadata form failed: ' . $result['statusInfo']);
                        }
                    }
                    // Do vault submission
                    $result = $this->vaultsubmission->validate();
                    if ($result === true) {
                        $submitResult = $this->vaultsubmission->setSubmitFlag();
                        if ($submitResult) {
                            setMessage('success', 'The folder is successfully submitted.');
                        } else {
                            setMessage('error', $result['*statusInfo']);
                        }
                    } else {
                        // result contains all collected messages as an array
                        setMessage('error', implode('<br>', $result));
                    }
                }
            }
            elseif ($this->input->post('vault_unsubmission')) {
                $result = $this->vaultsubmission->clearSubmitFlag();
                if ($result['*status']== 'Success') {
                    setMessage('success', 'This folder was successfully unsubmitted from the vault.');
                }
                else {
                    setMessage('error', $result['*statusInfo']);
                }
            }
        }
        else {
            // Save metadata JSON.  Check for correct conditions
            if ($folderStatus == 'SUBMITTED') {
                setMessage('error', 'The form has already been submitted');
                return redirect('research/metadata/form?path=' . rawurlencode($path), 'refresh');
            }
            if ($folderStatus == 'LOCKED' || $lockStatus == 'ancestor') {
                setMessage('error', 'The metadata form is locked possibly by the action of another user.');
                return redirect('research/metadata/form?path=' . rawurlencode($path), 'refresh');
            }

            $data = $this->input->post('formData');
            $result = $this->Metadata_form_model->saveJsonMetadata($rodsaccount, $fullPath, $data);
            if ($result['status'] != "Success") {
                setMessage('error', 'Saving the metadata form failed: ' . $result['statusInfo']);
            }
        }

        return redirect('research/metadata/form?path=' . rawurlencode($path), 'refresh');
    }
}
