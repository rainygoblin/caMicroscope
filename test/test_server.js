var express = require('express');
var phpExpress = require('php-express')({
  // assumes php is in your PATH
  binPath: '/home/travis/.phpenv/shims/php'
});
var path = require("path");

var app = express();

app.set('views', '../');
app.engine('php', phpExpress.engine);
app.set('view engine', 'php');

// routing all .php file to php-express
//app.all(/.+\.php$/, phpExpress.router);
app.all(/osdCamicroscope\.php/, phpExpress.router);

app.use('/js',express.static('../js'));
app.use('/shared',express.static('../shared'));
app.use('/css',express.static('../css'));
app.use('/images',express.static('../images'));


// apis
app.get('/api/Data/osdMetadataRetriever.php', (req, res) => {
    var metadata = '[{"mpp-x":0.5015,"mpp-y":0.5015},"\/data\/images\/TCGA-02-0338-01Z-00-DX1-yZgoO.svs.dzi"]'
    res.send(metadata);
});

// TODO make work better for OSD
app.get('/fcgi-bin/iipsrv.fcgi', (req, res) => {
    // are we looking for the dzi or image?
    if(req.originalUrl.substr(-4,4).toLowerCase() !== ".dzi"){
      res.sendFile("card.png", { root: __dirname });
    }
    else
    {
      var dzi_txt = '<?xml version="1.0" encoding="UTF-8"?><Image xmlns="http://schemas.microsoft.com/deepzoom/2008" TileSize="256" Overlap="0" Format="jpg"><Size Width="38001" Height="22715"/></Image>'
      res.send(dzi_txt);
    }

});

app.get('/api/Data/getAlgorithmsForImage.php', (req, res) => {
    var algs = '[{ "_id" : { "$oid" : "59993d432080a0521db84633"} , "color" : "yellow" , "title" : "" , "image" : { "subject_id" : "17039922" , "case_id" : "17039922"} , "provenance" : { "analysis_execution_id" : "wsi:r0.6:w0.8:l3:u200:k20:j0" , "study_id" : null , "type" : "computer" , "algorithm_params" : { "input_type" : "wsi" , "otsu_ratio" : 0.6 , "curvature_weight" : 0.8 , "min_size" : 3 , "max_size" : 200 , "ms_kernel" : 20 , "declump_type" : 0 , "levelset_num_iters" : 100 , "mpp" : 0.251 , "image_width" : 101591 , "image_height" : 76425 , "tile_minx" : 100352 , "tile_miny" : 47104 , "tile_width" : 1239 , "tile_height" : 2048 , "patch_minx" : 100352 , "patch_miny" : 47104 , "patch_width" : 1239 , "patch_height" : 2048 , "output_level" : "mask" , "out_file_prefix" : "17039922.17039922.390766420_mpp_0.251_x100352_y47104" , "subject_id" : "17039922" , "case_id" : "17039922" , "analysis_id" : "wsi:r0.6:w0.8:l3:u200:k20:j0" , "analysis_desc" : ""}} , "submit_date" : { "$date" : "2017-08-20T07:41:55.874Z"} , "randval" : 0.8046938180923462},{ "_id" : { "$oid" : "59993d6025340442f3acc553"} , "color" : "yellow" , "title" : "" , "image" : { "subject_id" : "17039922" , "case_id" : "17039922"} , "provenance" : { "analysis_execution_id" : "wsi:r0.7:w0.8:l3:u200:k20:j0" , "study_id" : null , "type" : "computer" , "algorithm_params" : { "input_type" : "wsi" , "otsu_ratio" : 0.7 , "curvature_weight" : 0.8 , "min_size" : 3 , "max_size" : 200 , "ms_kernel" : 20 , "declump_type" : 0 , "levelset_num_iters" : 100 , "mpp" : 0.251 , "image_width" : 101591 , "image_height" : 76425 , "tile_minx" : 40960 , "tile_miny" : 18432 , "tile_width" : 2048 , "tile_height" : 2048 , "patch_minx" : 40960 , "patch_miny" : 18432 , "patch_width" : 2048 , "patch_height" : 2048 , "output_level" : "mask" , "out_file_prefix" : "17039922.17039922.538483479_mpp_0.251_x40960_y18432" , "subject_id" : "17039922" , "case_id" : "17039922" , "analysis_id" : "wsi:r0.7:w0.8:l3:u200:k20:j0" , "analysis_desc" : ""}} , "submit_date" : { "$date" : "2017-08-20T07:42:24.485Z"} , "randval" : 0.18729883432388306},{ "_id" : { "$oid" : "59993f2016faa876bd898fa2"} , "color" : "yellow" , "title" : "" , "image" : { "subject_id" : "17039922" , "case_id" : "17039922"} , "provenance" : { "analysis_execution_id" : "wsi:r0.8:w0.8:l3:u200:k20:j0" , "study_id" : null , "type" : "computer" , "algorithm_params" : { "input_type" : "wsi" , "otsu_ratio" : 0.8 , "curvature_weight" : 0.8 , "min_size" : 3 , "max_size" : 200 , "ms_kernel" : 20 , "declump_type" : 0 , "levelset_num_iters" : 100 , "mpp" : 0.251 , "image_width" : 101591 , "image_height" : 76425 , "tile_minx" : 53248 , "tile_miny" : 61440 , "tile_width" : 2048 , "tile_height" : 2048 , "patch_minx" : 53248 , "patch_miny" : 61440 , "patch_width" : 2048 , "patch_height" : 2048 , "output_level" : "mask" , "out_file_prefix" : "17039922.17039922.1899999914_mpp_0.251_x53248_y61440" , "subject_id" : "17039922" , "case_id" : "17039922" , "analysis_id" : "wsi:r0.8:w0.8:l3:u200:k20:j0" , "analysis_desc" : ""}} , "submit_date" : { "$date" : "2017-08-20T07:49:52.066Z"} , "randval" : 0.19889724254608154},{ "_id" : { "$oid" : "5999411733bfc63c7398dd56"} , "color" : "yellow" , "title" : "" , "image" : { "subject_id" : "17039922" , "case_id" : "17039922"} , "provenance" : { "analysis_execution_id" : "wsi:r0.9:w0.8:l3:u200:k20:j0" , "study_id" : null , "type" : "computer" , "algorithm_params" : { "input_type" : "wsi" , "otsu_ratio" : 0.9 , "curvature_weight" : 0.8 , "min_size" : 3 , "max_size" : 200 , "ms_kernel" : 20 , "declump_type" : 0 , "levelset_num_iters" : 100 , "mpp" : 0.251 , "image_width" : 101591 , "image_height" : 76425 , "tile_minx" : 6144 , "tile_miny" : 67584 , "tile_width" : 2048 , "tile_height" : 2048 , "patch_minx" : 6144 , "patch_miny" : 67584 , "patch_width" : 2048 , "patch_height" : 2048 , "output_level" : "mask" , "out_file_prefix" : "17039922.17039922.2006869621_mpp_0.251_x6144_y67584" , "subject_id" : "17039922" , "case_id" : "17039922" , "analysis_id" : "wsi:r0.9:w0.8:l3:u200:k20:j0" , "analysis_desc" : ""}} , "submit_date" : { "$date" : "2017-08-20T07:58:15.041Z"} , "randval" : 0.4521363377571106},{ "_id" : { "$oid" : "59994655b25aa206e6866f67"} , "color" : "yellow" , "title" : "" , "image" : { "subject_id" : "17039922" , "case_id" : "17039922"} , "provenance" : { "analysis_execution_id" : "wsi:r1.0:w0.8:l3:u200:k20:j0" , "study_id" : null , "type" : "computer" , "algorithm_params" : { "input_type" : "wsi" , "otsu_ratio" : 1 , "curvature_weight" : 0.8 , "min_size" : 3 , "max_size" : 200 , "ms_kernel" : 20 , "declump_type" : 0 , "levelset_num_iters" : 100 , "mpp" : 0.251 , "image_width" : 101591 , "image_height" : 76425 , "tile_minx" : 4096 , "tile_miny" : 26624 , "tile_width" : 2048 , "tile_height" : 2048 , "patch_minx" : 4096 , "patch_miny" : 26624 , "patch_width" : 2048 , "patch_height" : 2048 , "output_level" : "mask" , "out_file_prefix" : "17039922.17039922.76187642_mpp_0.251_x4096_y26624" , "subject_id" : "17039922" , "case_id" : "17039922" , "analysis_id" : "wsi:r1.0:w0.8:l3:u200:k20:j0" , "analysis_desc" : ""}} , "submit_date" : { "$date" : "2017-08-20T08:20:37.595Z"} , "randval" : 0.8379867076873779},{ "_id" : { "$oid" : "5999b02be40e68315a4a82a4"} , "color" : "yellow" , "title" : "" , "image" : { "subject_id" : "17039922" , "case_id" : "17039922"} , "provenance" : { "analysis_execution_id" : "wsi:r1.1:w0.8:l3:u200:k20:j0" , "study_id" : null , "type" : "computer" , "algorithm_params" : { "input_type" : "wsi" , "otsu_ratio" : 1.1 , "curvature_weight" : 0.8 , "min_size" : 3 , "max_size" : 200 , "ms_kernel" : 20 , "declump_type" : 0 , "levelset_num_iters" : 100 , "mpp" : 0.251 , "image_width" : 101591 , "image_height" : 76425 , "tile_minx" : 8192 , "tile_miny" : 32768 , "tile_width" : 2048 , "tile_height" : 2048 , "patch_minx" : 8192 , "patch_miny" : 32768 , "patch_width" : 2048 , "patch_height" : 2048 , "output_level" : "mask" , "out_file_prefix" : "17039922.17039922.2076807560_mpp_0.251_x8192_y32768" , "subject_id" : "17039922" , "case_id" : "17039922" , "analysis_id" : "wsi:r1.1:w0.8:l3:u200:k20:j0" , "analysis_desc" : ""}} , "submit_date" : { "$date" : "2017-08-20T15:52:11.826Z"} , "randval" : 0.43990129232406616},{ "_id" : { "$oid" : "59c9e671e4b0bf164c332918"} , "title" : "epshita.das_composite_input" , "provenance" : { "analysis_execution_id" : "epshita.das_composite_input" , "type" : "human"} , "image" : { "case_id" : "17039922" , "subject_id" : "17039922"}},{ "_id" : { "$oid" : "59d801d58fb32d7013e0dd72"} , "color" : "yellow" , "title" : "wsi:r0.8:w0.8:l3:u200:k20:j0" , "image" : { "subject_id" : "17039922" , "case_id" : "17039922"} , "provenance" : { "analysis_execution_id" : "epshita.das_composite_dataset" , "study_id" : null , "type" : "computer" , "algorithm_params" : { "patch_miny" : 47104 , "patch_minx" : 73728 , "tile_height" : 2048 , "ms_kernel" : 20 , "tile_width" : 2048 , "levelset_num_iters" : 100 , "analysis_id" : "epshita.das_composite_dataset" , "patch_height" : 2048 , "input_type" : "wsi" , "subject_id" : "17039922" , "analysis_desc" : "wsi:r0.8:w0.8:l3:u200:k20:j0" , "image_width" : 101591 , "image_height" : 76425 , "tile_minx" : 73728 , "tile_miny" : 47104 , "patch_width" : 2048 , "min_size" : 3 , "case_id" : "17039922" , "curvature_weight" : 0.8 , "mpp" : 0.251 , "max_size" : 200 , "out_file_prefix" : "17039922.17039922.1050360919_mpp_0.251_x73728_y47104" , "output_level" : "mask" , "otsu_ratio" : 0.8 , "declump_type" : 0}} , "submit_date" : { "$date" : "2017-10-06T22:21:09.668Z"} , "randval" : 0.48739564418792725}]';
    res.send(algs);
});


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Testing Server running at http://%s:%s', host, port);
});
