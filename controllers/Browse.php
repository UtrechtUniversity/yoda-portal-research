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
                'lib/datatables/css/dataTables.bootstrap.min.css',
                'lib/font-awesome/css/font-awesome.css'
            ),
            'scriptIncludes' => array(
                'lib/datatables/js/jquery.dataTables.min.js',
                'lib/datatables/js/dataTables.bootstrap.min.js',
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

    public function top_data()
    {
        $rodsaccount = $this->rodsuser->getRodsAccount();
        $pathStart = $this->pathlibrary->getPathStart($this->config);
        $dirPath = $this->input->get('dir');

        $output = $this->filesystem->collectionDetails($rodsaccount, $pathStart . $dirPath);

        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($output));
    }

    public function list_locks()
    {
        $rodsaccount = $this->rodsuser->getRodsAccount();
        $pathStart = $this->pathlibrary->getPathStart($this->config);
        $folderPath = $this->input->get('folder');
        $fullPath = $pathStart . $folderPath;

        $result = $this->filesystem->listLocks($rodsaccount, $fullPath);

        // Strip path
        $locks = array();
        if ($result['*status'] == 'Success') {
            $total = $result['*result']['total'];
            if ($total > 0) {
                $locksResult = $result['*result']['locks'];
                foreach ($locksResult as $path) {
                    $locks[] = str_replace($pathStart, '', $path);
                }
            }
        }

        $output = array('result' => $locks,
	                'status' => $result['*status'],
			'statusInfo' => $result['*statusInfo']);

        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($output));
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
