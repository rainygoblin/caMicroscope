// this code helps us define our schema for state mangment
// schema : {position:{x:x,y:y,z:z}, algs:[algname1,algname2]}
var camic_state = new StateManager('state');

function setPosition(position){
  var pt = new OpenSeadragon.Point(position.x, position.y);
  viewer.viewport.zoomTo(position.z, pt);
  viewer.viewport.panTo(pt, true);
}

// TODO test if this method always works
function setAlgs(algList){
  // requires annotool to contain SELECTED_ALGORITHM_LIST
  SELECTED_ALGORITHM_LIST = algList;
}

// initalize after 500 mseconds
viewer.addHandler('open',function(){
  camic_state.add_key('position', setPosition);
  camic_state.add_key('alg', setAlgs);
  // before touching the url, get what we already have
  try{
    var x = camic_state.get_url_state();
    console.log("camic_state.get_url_state()", x);
    if (x)
    {
      camic_state.initialize(camic_state.decode(x));
    }
    //camic_state.initialize(camic_state.decode(camic_state.get_url_state()));
  }
  catch(e){
    console.log(e);
  }
});


algHandler = function() {
  camic_state.vals['alg'] = SELECTED_ALGORITHM_LIST;
  //camic_state.set_url();
};

moveHandler = function() {
  var pos = viewer.viewport.getCenter(true);
  var zoom = viewer.viewport.getZoom(true);
  camic_state.vals['position']={'x':pos.x, 'y':pos.y, 'z':zoom};
  //camic_state.set_url();
};

// TODO make this actually trigger usefully
// update url when requested only (this should be share)
function LinkRequest(){
  moveHandler();
  algHandler();
  console.log("{state : " + camic_state.encode(camic_state.vals)+ "}");
}
