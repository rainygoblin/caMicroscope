var rhs_viewer;

function getAlgs(caseid, cb){
  fetch("api/Data/getAlgorithmsForImage.php?iid=" + caseid, {
    credentials: "same-origin"
  })
  .then((x)=>(x.json()))
  .then((y)=>(cb(y)))
}

// init
function init_sbs() {

    // div for right viewer
    var rhs = document.createElement('div');
    rhs.style.position = "absolute";
    rhs.style.zIndex = "5";
    rhs.style.right = "0px";
    rhs.style.width = "50%";
    rhs.style.height = "700px"
    rhs.style.display = "none";
    rhs.id = "right_sidebyside";
    document.body.appendChild(rhs);

    //hidden input for calibration
    var calib = document.createElement('input');
    calib.type = "hidden"
    calib.id = "sbs_calibration"
    calib.value = "0,0"
    document.body.appendChild(calib);

    //hidden input for activation
    var activ = document.createElement('input');
    activ.type = "hidden"
    activ.id = "sbs_activation"
    activ.value = "active"
    document.body.appendChild(activ);


    var prefixurl = "https://cdn.jsdelivr.net/npm/openseadragon@2.3/build/openseadragon/images/";
    rhs_viewer = OpenSeadragon({
        id: "right_sidebyside",
        prefixUrl: prefixurl,
        showNavigationControl: false
    });

    window.setTimeout(coordinatedView(viewer, rhs_viewer), 500);

    // silly button fix attempt
    rhs_viewer.buttons = viewer.buttons;
}

function show_sbs() {
    var rhs = document.getElementById("right_sidebyside");
    rhs.style.display = "block";
    var lhs = document.getElementById("viewer");
    lhs.style.width = "50%";
    lhs.style.left = "0px";
    viewer.viewport.zoomTo(2 * viewer.viewport.getZoom());
}

function unlock() {
    document.getElementById("sbs_activation").value = "not"
}

// re-lock with "previous" calibration
function snapLock() {
    document.getElementById("sbs_activation").value = "active"
}

// re-lock with "current" calibration
function freeLock() {
    // get the differenct between the viewers, set as calib
    var diff = rhs_viewer.viewport.getCenter(true).minus(viewer.viewport.getCenter(true))
    document.getElementById("sbs_calibration").value = [diff.x, diff.y].toString();
    document.getElementById("sbs_activation").value = "active"
}

function hide_sbs() {
    var rhs = document.getElementById("right_sidebyside");
    rhs.style.display = "none";
    var lhs = document.getElementById("viewer");
    lhs.style.width = "100%";
    lhs.style.left = "0px";
    viewer.viewport.zoomTo(0.5 * viewer.viewport.getZoom());
}


init_sbs();

document.getElementById("right_sidebyside").style.height = window.innerHeight + "px"
window.onresize = function() {
    document.getElementById("right_sidebyside").style.height = window.innerHeight + "px"
}
