<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Browse controller
 *
 * @package    Yoda
 * @copyright  Copyright (c) 2017-2019, Utrecht University. All rights reserved.
 * @license    GPLv3, see LICENSE.
 */
class Browse extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();

        $this->data['userIsAllowed'] = TRUE;

        $this->load->model('filesystem');
        $this->load->model('rodsuser');
        $this->config->load('config');

        $this->load->library('pathlibrary');
    }

    public function index()
    {
        $items = $this->config->item('browser-items-per-page');
        $dir = $this->input->get('dir');

        if ($dir === null)
            $dir = '';

        // Search results data
        $searchTerm = '';
        $searchStatusValue = '';
        $searchType = 'filename';
        $searchStart = 0;
        $searchOrderDir = 'asc';
        $searchOrderColumn = 0;
        $searchItemsPerPage = $this->config->item('search-items-per-page');

        if ($this->session->userdata('research-search-term') || $this->session->userdata('research-search-status-value')) {
            if ($this->session->userdata('research-search-term')) {
                $searchTerm = $this->session->userdata('research-search-term');
            }
            if ($this->session->userdata('research-search-status-value')) {
                $searchStatusValue = $this->session->userdata('research-search-status-value');
            }
            $searchType = $this->session->userdata('research-search-type');
            $searchStart = $this->session->userdata('research-search-start');
            $searchOrderDir = $this->session->userdata('research-search-order-dir');
            $searchOrderColumn = $this->session->userdata('research-search-order-column');
        }

        $showStatus = false;
        $showTerm = false;
        if ($searchType == 'status') {
            $showStatus = true;
        } else {
            $showTerm = true;
        }
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
                'js/research.js',
                'js/search.js',
            ),
            'activeModule'   => 'research',
            'searchHtml' => $searchHtml,
            'items' => $items,
            'dir' => $dir,
        );
        loadView('browse', $viewParams);
    }

    public function download()
    {
        $rodsaccount = $this->rodsuser->getRodsAccount();
        $pathStart = $this->pathlibrary->getPathStart($this->config);
        $filePath = $this->input->get('filepath');

        $this->filesystem->download($rodsaccount, $pathStart . $filePath);
    }

    public function upload()
    {
        $rodsaccount = $this->rodsuser->getRodsAccount();
        $pathStart = $this->pathlibrary->getPathStart($this->config);
        $filePath = $this->input->post('filepath');

        $output = $this->filesystem->upload($rodsaccount, $pathStart . $filePath, $_FILES["file"]);

        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($output));
    }
}
