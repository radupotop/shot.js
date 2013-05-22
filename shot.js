var express = require('express');
var phantom = require('node-phantom');
var phantomInstance;

var appUrl = 'http://radu.sm.lo:8080/';
var staticDir = 'shots/';

/**
 * Phantom instance
 */
phantom.create(function(err, ph) {
    phantomInstance = ph;
});

/**
 * Take screenshot
 */
function shot(body, resp) {
    
    console.log(body);
    
    var time = now();
    var filename = 'shot-'+time+'.png';
    
    phantomInstance.createPage(function(err, page) {
        
        page.viewportSize = {
            'width': body.width || 1024,
            'height': body.height || 768
        };
        
        page.open(body.url, function(err, status) {
            page.render(staticDir+filename);
            console.log(staticDir+filename);
            
            resp.json(200, {
                'url': appUrl+filename 
            });
            
        });
        
        return filename;
        
    });
    
}

/**
 * Timestamp
 */
function now() {
    return new Date().getTime();
}


var app = express();

/**
 * Config
 */
app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.static(staticDir));
});

/**
 * Routes
 */
app.post('/shot', function(req, resp) {
    var filename = shot(req.body, resp);
});

/**
 * Listen
 */
app.listen(8080);
console.log('Listening on '+appUrl);
