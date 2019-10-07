<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Metadata form model
 *
 * @package    Yoda
 * @copyright  Copyright (c) 2017-2019, Utrecht University. All rights reserved.
 * @license    GPLv3, see LICENSE.
 */
class Metadata_form_model extends CI_Model
{
    var $CI = NULL;

    function __construct()
    {
        parent::__construct();
        $this->CI =& get_instance();
        $this->CI->load->model('filesystem');
    }

    /**
     * Save JSON metdata posted from the metadata form.
     *
     * @param $rodsaccount Rods account
     * @param $path        Path of collection being worked in
     * @param $data        Form data, as a JSON string
     */
    public function saveJsonMetadata($rodsaccount, $path, $data)
    {
        $rule = new ProdsRule(
            $this->rodsuser->getRodsAccount(),
            'rule { iiMetadataFormSave(*path, *data); }',
            array('*path' => $path, '*data' => $data),
            array('ruleExecOut')
        );

        $result = json_decode($rule->execute()['ruleExecOut'], true);
        return $result;
    }

    /**
     * Determine whether a bounding box has all coordinates complete
     *
     * @param $boundingBoxArray - array that should con
     * @return boolean
     */
    private function _isCompleteBoundingBox($geoBoxData)
    {
        return (isset($geoBoxData['northBoundLatitude'])  &&
            isset($geoBoxData['westBoundLongitude'])  &&
            isset($geoBoxData['southBoundLatitude'])  &&
            isset($geoBoxData['eastBoundLongitude'])
        );
    }
}
