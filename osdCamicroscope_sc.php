<?php
/**
 * Segment Curation App
 */
include 'shared/osdHeader.php';
?>
<script>
    var _USERNAME = "<?php echo filter_var($_SESSION["email"], FILTER_SANITIZE_EMAIL); ?>";
</script>
<!-- ANNOTATION -->
<script src="js/annotationtools_sc/annotools-openseajax-handler.js"></script>
<script src="js/annotationtools_sc/ToolBar_sc.js"></script>
<script src="js/annotationtools_sc/AnnotationStore_sc.js"></script>
<script src="js/annotationtools_sc/osdAnnotationTools_sc.js"></script>
<script src="js/annotationtools_sc/geoJSONHandler_sc.js"></script>
<!-- /ANNOTATION -->

<div id="container">
    <div id="tool"></div>
    <div id="panel"></div>
    <div id="algosel">
        <div id="tree"></div>
    </div>
    <div class="demoarea">
        <div id="viewer" class="openseadragon"></div>
    </div>
    <div id="navigator"></div>
</div>

<div id="confirmDelete" style="display:none">
    <p> Please enter the secret: <input id="deleteSecret" type="password"/> <a href="#confirmDelete" rel="modal:close">
            <button id="confirmDeleteButton">Delete</button>
        </a></p>
</div>

<script type="text/javascript">
    $.noConflict();
    var annotool = null;
    var tissueId = <?php echo json_encode($_GET['tissueId']); ?>;

    var cancerType = "<?php echo $_SESSION["cancerType"] ?>";

    console.log("cancerType is: " + cancerType);
    console.log("tissueId is: " + tissueId);

    var user_email = "<?php echo $_SESSION["email"]; ?>";
    console.log("user_email :" + user_email);
    var userType = "<?php echo $_SESSION["userType"]; ?>";
    console.log("userType :" + userType);

    var imagedata = new OSDImageMetaData({imageId: tissueId});
    //console.log(imagedata);         

    var MPP = imagedata.metaData[0];
    console.log(MPP);
    //console.log(imagedata);
    var fileLocation = imagedata.metaData[1];//.replace("tcga_data","tcga_images");
    console.log(fileLocation);
    var imageStatus = imagedata.metaData[2][0]['status'];
    var assignTo = imagedata.metaData[3][0]['assign_to'];
    var viewer = new OpenSeadragon.Viewer({
        id: "viewer",
        prefixUrl: "images/",
        showNavigator: true,
        //navigatorPosition:   "BOTTOM_LEFT",
        navigatorPosition: "BOTTOM_RIGHT",
        //navigatorId: "navigator",
        zoomPerClick: 2,
        //zoomPerScroll: 1,
        animationTime: 0.75,
        maxZoomPixelRatio: 2,
        visibilityRatio: 1,
        constrainDuringPan: true
    });
    console.log(viewer.navigator);
    // var zoomLevels = viewer.zoomLevels({
    //levels:[0.001, 0.01, 0.2, 0.1,  1]
    // });

    viewer.addHandler("open", addOverlays);
    viewer.clearControls();
    viewer.open("<?php print_r($config['fastcgi_server']); ?>?DeepZoom=" + fileLocation);
    var imagingHelper = new OpenSeadragonImaging.ImagingHelper({viewer: viewer});
    imagingHelper.setMaxZoom(2);
    //console.log(this.MPP);
    viewer.scalebar({
        type: OpenSeadragon.ScalebarType.MAP,
        pixelsPerMeter: (1 / (parseFloat(this.MPP["mpp-x"]) * 0.000001)),
        xOffset: 5,
        yOffset: 10,
        stayInsideImage: true,
        color: "rgb(150,150,150)",
        fontColor: "rgb(100,100,100)",
        backgroundColor: "rgba(255,255,255,0.5)",
        barThickness: 2
    });

    //console.log(viewer);

    function isAnnotationActive() {
        // isAnnotationActive called from osdAnnotationTools.js
        this.isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

        this.isFirefox = typeof InstallTrigger !== 'undefined';

        //this.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0; // Fix Safari check.
        var browser = navigator.userAgent;
        this.isSafari = (browser.search("Safari") >= 0 && browser.search("Chrome") < 0);

        this.isEdge = (browser.search("Edge") >= 0);

        this.isChrome = !!window.chrome && !this.isOpera && !this.isEdge;

        this.isIE = /*@cc_on!@*/false || !!document.documentMode;

        this.annotationActive = !(this.isIE || this.isOpera);
        return this.annotationActive;
    }


    function addOverlays() {
        var annotationHandler = new AnnotoolsOpenSeadragonHandler(viewer, {});
        annotool = new annotools({
            canvas: 'openseadragon-canvas',
            displayId: tissueId,
            iid: tissueId,
            cancerType: cancerType,
            imageStatus: imageStatus,
            assignTo: assignTo,
            userType: userType,
            user_email: user_email,
            viewer: viewer,
            annotationHandler: annotationHandler,
            mpp: MPP
        });

        //console.log(tissueId);
        var toolBar = new ToolBar('tool', {
            left: '0px',
            top: '0px',
            height: '48px',
            width: '100%',
            displayId: tissueId,
            iid: tissueId,
            cancerType: cancerType,
            imageStatus: imageStatus,
            assignTo: assignTo,
            userType: userType,
            user_email: user_email,
            annotool: annotool,
            viewer: viewer

        });

        annotool.toolBar = toolBar;

        toolBar.createButtons();


        var index = user_email.indexOf("@");
        var user = user_email.substring(0, index);
        var execution_id = user + "_composite_input";

        annotool.execution_id = execution_id;
        annotool.user = user;
        console.log("execution_id :" + annotool.execution_id);

        /*Pan and zoom to point*/
        var bound_x = <?php echo json_encode($_GET['x']); ?>;
        var bound_y = <?php echo json_encode($_GET['y']); ?>;
        var zoom = <?php echo json_encode($_GET['zoom']); ?> ||
        viewer.viewport.getMaxZoom();
        zoom = Number(zoom); //convert zoom to number if it is string
        jQuery("#panel").hide();
        if (bound_x && bound_y) {
            var ipt = new OpenSeadragon.Point(+bound_x, +bound_y);
            var vpt = viewer.viewport.imageToViewportCoordinates(ipt);
            viewer.viewport.panTo(vpt);
            viewer.viewport.zoomTo(zoom);
        } else {
            console.log("bounds not specified");
        }
    }//end of addOverlays()

    if (!String.prototype.format) {
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined'
                    ? args[number]
                    : match
                    ;
            });
        };
    }

</script>
<?php include 'shared/osdFooter.php'; ?>
