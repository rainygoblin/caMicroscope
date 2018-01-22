<?php require '../../../authenticate.php';
//ini_set('display_errors', 'On');
//error_reporting(E_ALL | E_STRICT);

include_once("RestRequest.php");
require_once 'HTTP/Request2.php';

$config = require '../Configuration/config.php';

$getUrl    =  $config['getPropertiesForMarkupClone'];
$deleteUrl =  $config['deleteAnnotation'];

//$postUrl = $config['postAnnotation'];


if (!empty($_SESSION['api_key'])) {
    $api_key = $_SESSION['api_key'];
}
switch ($_SERVER['REQUEST_METHOD'])
{
	case 'GET':

		if(isset($_GET["id"]))
		{
			$id=$_GET["id"];

      $getUrl  = $getUrl . "api_key=" . $api_key;
      $url = $getUrl . "&id=" . $id;
            //echo $url;
			$getRequest = new RestRequest($url,'GET');
      $getRequest->execute();


			//Figure out how to parse response
			$annotationList = json_decode($getRequest->responseBody);
      //print_r($annotationList[0]['properties']);

      $annotationList[0]->properties->annotations->secret = "xxxx";
      //echo "\n---\n";
      
            if($annotationList)
                echo json_encode($annotationList);
            else
                echo "No annotations";      
        }
  break;

  case 'DELETE':
    echo "PHP Deleteing";
    $d = file_get_contents("php://input");
    //print_r($d);
    $data = [];
	
    parse_str($d, $data); 
    //$data = json_decode($data);
    //print_r($data);
    
    $id = $data['id'];
    $secret = $data['secret'];

    //Check ID is human
    $getUrl  = $getUrl . "api_key=" . $api_key;
    $url = $getUrl . "&id=" . $id;
          //echo $url;
    $getRequest = new RestRequest($url,'GET');
    $getRequest->execute();
    $annotationList = json_decode($getRequest->responseBody);
    $annotation = $annotationList[0];
    $source = $annotation->provenance->analysis->source;
    $annot_secret = $annotation->properties->annotations->secret;
    if($source == "human"){
      if($secret == $annot_secret){
        echo "Source: ".$source;

        $delUrl = $deleteUrl . "?api_key=".$api_key . "&id=".$id;
        echo $delUrl;
        $curl = curl_init($delUrl);

        //Delete request
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "DELETE");
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json',"OAuth-Token: $token"));

        // Make the REST call, returning the result
        $response = curl_exec($curl);
		
        //print_r($response);

      echo "Deleted!";
      } else {
        echo "Wrong secret";
      }
    } else {
      echo "Failed: Cant delete computer generated annotations";
    }


    //Delete ID


  break;    
}

?>
