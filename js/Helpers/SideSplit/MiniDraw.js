// need:
// ViewportCalibratedCanvas
// proxytools
// coordinateView (well, not really, but it'd be silly not to have)
// SideSplit
///////
// utils
function objToParamStr(obj) {
    var parts = [];
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            if (Array.isArray(obj[i])) {
                // arrays are a list of strings with escaped quotes, surrounded by []
                parts.push(encodeURIComponent(i) + "=" + encodeURIComponent("[" + obj[i].map((x) => '\"' + x + '\"').toString() + "]"));
            } else {
                parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
            }
        }
    }
    return parts.join("&");
}

function apiCall(callback, url, params) {
    fetch(url + "?" + objToParamStr(params), {
            credentials: "same-origin"
        })
        .then((x) => x.json())
        .then(function(response) {
            callback(response);
        })
        .catch((x) => console.warn(x));
}

var stringToColor = function(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colorlist = ['#1b9e77', '#d95f02', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666'];
    return colorlist[Math.abs(hash) % colorlist.length];
}

class annotStore {
    /**
     * Annotation API Interactions
     * @param {string} id - the image id
     * @param {object} [options] - optional substitution for api urls
     */
    constructor(id, options) {
        // image id
        this.id = id;
        // TODO cache??
        this.algDataUrl = options.algUrl || "api/Data/getMultipleAnnots.php";
        this.algListUrl = options.algListUrl || "api/Data/getAlgorithmsForImage.php";
    }

    /**
     * Get a list of avaliable algorithms for the image
     * @param {function} callback - callback for the result data
     */
    getAlgList(callback) {
        var params = {
            "iid": this.id
        }
        apiCall(callback, this.algListUrl, params);
    }

    /**
     * Get a list of avaliable algorithms for the image
     * @param {function} callback - callback for the result data
     */
    getAlgData(x1, y1, x2, y2, footprint, algs, callback) {
        // sanitization/validation
        x1 = x1 < 0 ? 0 : x1;
        y1 = y1 < 0 ? 0 : y1;
        x2 = x2 < 0 ? 0 : x2;
        y2 = y2 < 0 ? 0 : y2;
        // set params object
        var params = {
            "iid": this.id,
            "x": x1,
            "x1": x2,
            "y": y1,
            "y1": y2,
            "footprint": footprint,
            "algorithms": algs
        };
        apiCall(callback, this.algDataUrl, params);
    }
}


function drawFromList(data, context) {
    data.forEach(function(annotation) {
        let id = annotation.provenance.analysis.execution_id;
        let color = stringToColor(id);
        let type = annotation.geometry.type;
        let coords = annotation.geometry.coordinates[0];
        if (!type || type == "Polygon") {
            context.strokeStyle = color;
            let first = coords.splice(0, 1);
            context.moveTo(first[0], first[1]);
            context.beginPath();
            coords.forEach(function(coord) {
                let x = coord[0];
                let y = coord[1];
                context.lineTo(x, y);
            });
            context.stroke();
            // stop
        } else {
            console.warn("Don't know how to draw '" + type + "'");
        }
    })
}

class annotations {
    constructor(id, viewer, context, imagingHelper, options) {
        this.id = id;
        this.store = new annotStore(id, options);
        this.viewer = viewer;
        this.options = options;
        this.selection = [];
        this.context = context;
        this.imagingHelper = imagingHelper;
        this.lastBounds = [0, 0, 0, 0];
        this.lastZoom = 0;
    }

    // draw using current viewer state
    draw() {
        // bounds for collision
        let x = this.imagingHelper._viewportOrigin['x'];
        let y = this.imagingHelper._viewportOrigin['y'];
        let w = this.imagingHelper._viewportWidth;
        let h = this.imagingHelper._viewportHeight;

        let z = this.viewer.viewport.getZoom();

        // bounds for drawing
        let x1 = x - w;
        let y1 = y - h;
        let x2 = x1 + 2 * (w);
        let y2 = y1 + 2 * (h);

        // calculate footprint for api
        var max = new OpenSeadragon.Point(this.imagingHelper.physicalToDataX(9), this.imagingHelper.physicalToDataY(9));
        var origin = new OpenSeadragon.Point(this.imagingHelper.physicalToDataX(0), this.imagingHelper.physicalToDataY(0));
        var footprint = (max.x - origin.x) * (max.y - origin.y);

        // is any part of current view out of last rectangle?
        let panUpdate = x < this.lastBounds[0] || y < this.lastBounds[2] || x + w > this.lastBounds[1] || y + h > this.lastBounds[3];

        // has zoom changed enough?
        let zoomUpdate = (this.lastZoom / z) >= 2 || (this.lastZoom / z) <= 0.5;
        if (panUpdate || zoomUpdate) {
            // console.info("NEW: " + x + ", " + x + w + ", " + y + ", " + y + h, +", " + z)
            // console.info("OLD: " + this.lastBounds + ", " + this.lastZoom);
            this.context.__clear_queue();
            this.lastZoom = z;
            this.lastBounds = [x1, x2, y1, y2];
            this.store.getAlgData(x1, y1, x2, y2, footprint, this.selection, (data) => drawFromList(data, this.context));

        }


    }

    // forcr a redraw from memory
    forceDraw(){
      this.context.__clear_queue();
      // calculate footprint for api
      var max = new OpenSeadragon.Point(this.imagingHelper.physicalToDataX(9), this.imagingHelper.physicalToDataY(9));
      var origin = new OpenSeadragon.Point(this.imagingHelper.physicalToDataX(0), this.imagingHelper.physicalToDataY(0));
      var footprint = (max.x - origin.x) * (max.y - origin.y);
      this.store.getAlgData(this.lastBounds[0], this.lastBounds[2], this.lastBounds[1], this.lastBounds[3], footprint, this.selection, (data) => drawFromList(data, this.context));
      // not triggered by pan or zoom, so trigger osd to redraw too
      this.viewer.viewport.panBy(new OpenSeadragon.Point(0.00001, 0.00001));
    }

    select(alg) {
        if (this.selection.indexOf(alg) == -1) {
            this.selection.push(alg);
        }
    }

    deselect(alg) {
        let pos = this.selection.indexOf(alg)
        if (pos > -1) {
            this.selection.splice(pos, 1);
        }
    }

}
