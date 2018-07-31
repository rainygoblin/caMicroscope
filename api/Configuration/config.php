<?php

if (file_exists('../../../config.php')) {
    $config = require '../../../config.php';
}
else {
    $config = ['dataHost' => 'quip-data:9099',
               'kueHost' => 'quip-jobs:3000'];
}


$baseUrl = "http://" . $config['dataHost'];
$kueUrl = "http://" . $config['kueHost'];

$serviceUrl     = "$baseUrl/services/Camicroscope_DataLoader";
$annotationsUrl = "$baseUrl/services/Camicroscope_Annotations";

if (isset($_SESSION['db_name']) && !empty($_SESSION['db_name'])) {

    if ($_SESSION["db_name"] == "quip_comp"){
        $serviceUrl     = "$baseUrl/services/Camicroscope_DataLoader_comp";
        $annotationsUrl = "$baseUrl/services/Camicroscope_Annotations_comp";
    }
}

$u24_userUrl    = "$baseUrl/services/u24_user";
$imageUrl       = "$serviceUrl/DataLoader";
$lymphocyteUrl = "$baseUrl/services/Camicroscope_Lymphocyte";


$dynamicServices = $serviceUrl;

$templateUrl    = "$baseUrl/services/caMicroscope_Templates";

//$firebase = "https://test-8f679.firebaseio.com/camicroscopeStates";
//$firebase_key = "kweMPSAo4guxUXUodU0udYFhC27yp59XdTEkTSJ4";

//Optional Firebase
$firebase = "";
$firebase_key = "";

$tempMarkupUrl = "http://localhost:9099/services/TCGABRCA_Dev";

return array(
    'auth_realm' => "$baseUrl/securityTokenService",
    /*
     * temp
     */
    'getOverlayTiles' => "$baseUrl/services/TileOverlay/Tiles/query/getTileLocation?",
    'algorithmsForImage' => "$annotationsUrl/MarkupsForImages/query/MarkupsAvilableForImage?",
    'getMultipleAnnotations' => "$annotationsUrl/MarkupLoader/query/getMultipleMarkups?",
    'getROI' => "$annotationsUrl/MarkupLoader/query/getROI", //Featurescape URL.
    'deleteMarkups' => "$annotationsUrl/MarkupLoader/delete/deleteMultipleMarkups",
    'firebase' => $firebase,
    'firebase_key' => $firebase_key,
    'retrieveTemplate' => "$serviceUrl/AnnotationTemplate/query/retrieveTemplate",
    'getAllAnnotations' => "$tempMarkupUrl/Annotations/query/byUserAndImageID?iid=",
    'getAnnotationsSpatial' => "$serviceUrl/GeoJSONImageMetaData/query/getMarkups?",
    'getAnnotationSpatialFilter' => "$tempMarkupUrl/Annotations/query/allByFilter?iid=",
    'postAnnotation' => "$annotationsUrl/MarkupLoader/submit/json",
    'retrieveAnnotation' => "$tempMarkupUrl/Annotations/query/byAnnotId?annotId=",
    'postJobParameters' => "$tempMarkupUrl/AnalysisJobs/submit/singleJob",
    'deleteAnnotation' => "$tempMarkupUrl/Annotations/delete/singleAnnotation?annotId=",

    /* Lymphocyte */
    'postAlgorithmForImageLymph' => "$annotationsUrl/MarkupsForImages/submit/json?",
    'getAnnotationsSpatialLymph' => "$serviceUrl/GeoJSONImageMetaData/query/getMarkups?",
    'getMultipleAnnotationsWithAttr' => "$annotationsUrl/MarkupLoader/query/getMultipleMarkupsWithAttr?",

    //'postDataForLymphocytes' => "$annotationsUrl/Lymphocytes/submit/json?",
    //'getLymphocyteData' => "$annotationsUrl/Lymphocytes/query/getLymphocytes?",
    'postDataForLymphocytes' => "$lymphocyteUrl/DataForLymphocytes/submit/json?",
    'getLymphocyteData' => "$lymphocyteUrl/DataForLymphocytes/query/getLymphocytes?",
    'getLymphocyteDataByCaseId' => "$lymphocyteUrl/DataForLymphocytes/query/getLymphocytesByCaseId?",
    'postDataForHeatmap' => "$lymphocyteUrl/HeatmapData/submit/json?",
    'getHeatmapData' => "$lymphocyteUrl/HeatmapData/query/getQualHeatmapByCaseidExecid?",

    /* Lymphocyte Superusers */
    'postSuperuserForLymphocytes' => "$lymphocyteUrl/LymphocyteUsers/submit/json?",
    'getLymphocyteSuperusers' => "$lymphocyteUrl/LymphocyteUsers/query/getLymphSuperusers?",
    'getLymphocyteSuperuserByEmail' => "$lymphocyteUrl/LymphocyteUsers/query/getUserByEmail?",
    'getLymphocyteUserByEmailAndRole' => "$lymphocyteUrl/LymphocyteUsers/query/getUserByEmailAndRole?",
    'deleteLymphocyteUserByEmail' => "$lymphocyteUrl/LymphocyteUsers/delete/deleteUserByEmail?",
    'deleteLymphocyteSuperuser' => "$lymphocyteUrl/LymphocyteUsers/delete/deleteLymphSuperuser?",


   /*Bindaas API for back compatible */
     'postAlgorithmForImage'           => "$annotationsUrl/MarkupsForImages/submit/json",
     'getMultipleAnnotationsClone'     => "$annotationsUrl/MarkupLoader/query/getMultipleMarkupsClone?",
     'deleteAnnotation'                => "$annotationsUrl/MarkupLoader/delete/DeleteByOID",
     'deleteAnnotationWithinRectangle' => "$annotationsUrl/MarkupLoader/delete/deleteAnnotationWithinRectangle",
     'deleteAnnotationWithinRectangleClone' => "$annotationsUrl/MarkupLoader/delete/deleteAnnotationWithinRectangleClone",
     'getPropertiesForMarkupClone'          => "$annotationsUrl/MarkupLoader/query/getPropertiesForMarkupClone?",
     'getAnnotationCountWithinRectangle'    => "$annotationsUrl/MarkupLoader/query/getAnnotationCountWithinRectangle?",
     'getAnnotationWithinRectangle'         => "$annotationsUrl/MarkupLoader/query/getAnnotationWithinRectangle?",
     'getMultipleMarkupsNew'=> "$annotationsUrl/MarkupLoader/query/getMultipleMarkupsNew?",


    /* Template */
    'retrieveTemplate'      => "$templateUrl/AnnotationTemplate/query/retrieveTemplate",
    'retrieveTemplateByName' => "$templateUrl/AnnotationTemplate/query/retrieveTemplateByName",

    /* u24_user */
    'findUserByName'   => "$u24_userUrl/user_data/query/findUserByName?",
    'findUserByEmail'  => "$u24_userUrl/user_data/query/findUserByEmail?",
    'findUser'         => "$u24_userUrl/user_data/query/findUser?",
    'findAdmin'        => "$u24_userUrl/user_data/query/findAdmin?",
    'findAllBindaasUsers'=>"$u24_userUrl/user_data/query/findAllBindaasUsers?",
    'findSuperUserCount'=>"$u24_userUrl/user_data/query/findSuperUserCount?",

    'deleteUserByName' => "$u24_userUrl/user_data/delete/deleteUserByName?",
    'deleteUserByEmail'=> "$u24_userUrl/user_data/delete/deleteUserByEmail?",
    'postUser'         => "$u24_userUrl/user_data/submit/json",
    'setUserType'      => "$u24_userUrl/user_data/delete/setUserType?",


    /* Image */
    'getDimensions' => "$imageUrl/query/getDimensionsByIID?api_key=",
    'getFileLocation' => "$imageUrl/query/getFileLocationByIID?api_key=",
    //'getTileLocation' => "$imageUrl/query/getTileLocationByIID?api_key=",
    'getMPP' => "$imageUrl/query/getMPPByIID?api_key=",
    'getImageInfoByCaseID'=> "$imageUrl/query/getImageInfoByCaseID?api_key=",
    'fastcgi_server' => "/VTR-Pancreatic/fcgi-bin/iipsrv.fcgi",
    'imageStatusUpdate'=> "$imageUrl/delete/imageStatusUpdate?",
    'getImageStatus'=> "$imageUrl/query/getImageStatusByCaseID?api_key=",
    'getImageAssignTo'=> "$imageUrl/query/getImageAssignToByCaseID?api_key=",
    'imageAssignTo'=> "$imageUrl/delete/imageAssignTo?",

    /* Dynamic Services */
    'postWorkOrder' => "$dynamicServices/WorkOrders/submit/json",
    'kueUrl' => $kueUrl
);





?>
