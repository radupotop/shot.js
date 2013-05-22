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
    
    var sanitizedUrl = body.url.replace(/[^a-z0-9]+/gi, '-');
    var filename = sanitizedUrl+'-'+now()+'.png';
    
    console.log(body, staticDir+filename);
    
    phantomInstance.createPage(function(err, page) {
        
        page.viewportSize = {
            'width': body.width || 1024,
            'height': body.height || 768
        };
        
        page.open(body.url, function(err, status) {
            page.render(staticDir+filename);
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
    
    if(!req.body.url) {
        resp.json(403, 'No url specified');
    } else {
        shot(req.body, resp);
    }
    
});

/**
 * Listen
 */
app.listen(8081);
console.log('Listening on '+appUrl);
