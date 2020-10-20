<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Revision controller
 *
 * @package    Yoda
 * @copyright  Copyright (c) 2017-2019, Utrecht University. All rights reserved.
 * @license    GPLv3, see LICENSE.
 */
class Revision extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();

        $this->data['userIsAllowed'] = TRUE;

        $this->load->model('filesystem'); //@todo: komt te vervallen!!
        $this->load->model('rodsuser');
        $this->load->model('revisionmodel');
        $this->config->load('config');

        $this->load->library('pathlibrary');
    }

    /**
     * Main page containing the table with the actual files
     */
    public function index()
    {
        $items= $this->config->item('revision-items-per-page');
        $dlgPageItems = $this->config->item('revision-dialog-items-per-page');

        $filter = $this->input->get('filter');

        // Set basic search params
        $this->session->set_userdata(
            array(
                'research-search-term' => $this->input->get('filter'),
                'research-search-start' => 0,
                'research-search-type' => 'revision',
                'research-search-order-dir' => 'ASC',
                'research-search-order-column' => 0
            )
        );

        $searchTerm = $this->input->get('filter');
        $searchType = 'revision';
        $showStatus = false;
        $showTerm = true;
        $searchStatusValue = '';
        $searchStart = 0;
        $searchOrderDir = 'asc';
        $searchOrderColumn = 0;
        $searchItemsPerPage = $this->config->item('search-items-per-page');
        $searchData = compact('searchTerm', 'searchStatusValue', 'searchType', 'searchStart', 'searchOrderDir', 'searchOrderColumn', 'showStatus', 'showTerm', 'searchItemsPerPage');
        $searchHtml = $this->load->view('search', $searchData, true);

        $viewParams = array(
            'styleIncludes' => array(
                'css/research.css',
                'lib/datatables/css/datatables.min.css',
                'lib/font-awesome/css/font-awesome.css'
            ),
            'scriptIncludes' => array(
                'lib/datatables/js/datatables.min.js',
                'js/revision.js',
                'js/search.js',
            ),
            'activeModule'   => 'research',
            'searchHtml' => $searchHtml,
            'items' => $items,
            'dlgPageItems' => $dlgPageItems,
            'filter' => $filter,
        );
        loadView('revision', $viewParams);
    }
}
