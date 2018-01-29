var cols, rows;
var scl = 20;
var w = 3000;
var h = 3000;
var terrain;
var distance = 1;
var orientation = {x:0, y:0};
var mousePos = {x:0,y:0};
var speedSlider;
var toolBox;
var speedValSpan;
var pos = {x:600,y:356,z:2000};
var importBtn, exportBtn, generateBtn, closeBtn;

function setup() {
    createCanvas(1200, 713, WEBGL);
    cols = w / scl;
    rows = h / scl;
    angleMode(DEGREES);
    colorMode(HSB);
    speedSlider = createSlider(0.0001, 5, 0.5, 0.0001);
    speedValSpan = createSpan(speedSlider.value());
    speedSlider.changed(updateSpeedVal);

    generateBtn = createButton('Generate new Terrain');
    importBtn = createButton('Import map');
    exportBtn = createButton('Export map');
    closeBtn = createButton('Close map');
    exportBtn.mousePressed(downloadMap);
    importBtn.mousePressed(importMap);
    generateBtn.mousePressed(generateTerrain);
    closeBtn.mousePressed(closeTerrain);
    toolBox = createDiv('');

    toolBox.addClass('toolbox');
    toolBox.child(createSpan('Speed: '));
    toolBox.child(speedSlider);
    toolBox.child(speedValSpan);
    toolBox.child(exportBtn);
    toolBox.child(importBtn);
    toolBox.child(generateBtn);
    toolBox.child(closeBtn);
    //generateTerrain();
}

function draw() {
    background(0);
    rotateX(orientation.y);
    rotateZ(orientation.x);
    fill(0, 0, 0, 175);
    stroke(255);
    scale(1/distance);
    translate(-pos.x, -pos.y, -pos.z);
    if (keyIsPressed === true) {
        var x1Offset = 2*cos(orientation.x - 90);
        var y1Offset = 2*sin(orientation.x - 90);
        var x2Offset = 2*cos(orientation.x);
        var y2Offset = 2*sin(orientation.x);
        if (keyIsDown(90) || keyIsDown(UP_ARROW)) {
            pos.y += y1Offset*speedSlider.value()*10;
            pos.x -= x1Offset*speedSlider.value()*10;
        } else if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {
            pos.y -= y1Offset*speedSlider.value()*10;
            pos.x += x1Offset*speedSlider.value()*10;
        }
        if (keyIsDown(81) || keyIsDown(LEFT_ARROW)) {
            pos.y += y2Offset*speedSlider.value()*10;
            pos.x -= x2Offset*speedSlider.value()*10;
        } else if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
            pos.y -= y2Offset*speedSlider.value()*10;
            pos.x += x2Offset*speedSlider.value()*10;
        }
        if (keyIsDown(65)) {
            pos.z += speedSlider.value()*10;
        } else if (keyIsDown(69)) {
            pos.z -= speedSlider.value()*10;
        }
    }
    if (mouseIsPressed) {
        //if (mouseButton === LEFT) {
        //
        //}
        //if (mouseButton === RIGHT) {
        //
        //}
        if (mouseButton === CENTER) {
            orientation.x = (orientation.x + (mousePos.x - mouseX) * speedSlider.value())%360;
            orientation.y += (mousePos.y - mouseY) * speedSlider.value();
            if(orientation.y > 180) {
                orientation.y = 180;
            } else if (orientation.y < 0) {
                orientation.y = 0;
            }
            mousePos.x = mouseX;
            mousePos.y = mouseY;
        }
    }
    if(terrain !== undefined) {
        for(var y = 0; y < terrain[0].length-1; y++) {
            beginShape(TRIANGLE_STRIP);
            for (var x = 0; x < terrain.length; x++) {
                fill(color(terrain[x][y].color));
                noStroke();
                vertex(x*scl, y*scl, terrain[x][y].alt);
                vertex(x*scl, (y+1)*scl, terrain[x][y+1].alt)
            }
            endShape();
        }
    }
}

function mouseWheel(event) {
    if(event.delta > 0) {
        distance += speedSlider.value()*0.1;
    } else {
        distance -= speedSlider.value()*0.1;
        if(distance < 1) {
            distance = 1;
        }
    }
}

function mousePressed(event) {
    mousePos.x = mouseX;
    mousePos.y = mouseY;
}

function updateSpeedVal() {
    speedValSpan.html(speedSlider.value());
}

function downloadMap() {
    var jsonTerrain = JSON.stringify(terrain);
    var filename = "map.json";
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonTerrain));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function importMap() {
    loadJSON('map.json', function(map) {
        terrain = map;
    });

}

function generateTerrain() {
    noiseSeed(parseInt(random(0, 10000)));
    var yoff = 0;
    var xoff = 0;
    terrain = [];
    for (var x = 0; x < cols; x++) {
        terrain[x] = [];
        for (var y = 0; y < rows; y++) {
            terrain[x][y] = {
                alt:0,
                color: color(255)
            };
        }
    }
    for (var y = 0; y < rows; y++) {
        xoff = 0;
        for (var x = 0; x < cols; x++) {
            terrain[x][y].alt = map(noise(xoff, yoff), 0, 1, 0, 1000);
            terrain[x][y].color = 'hsb('+parseInt(terrain[x][y].alt%360)+', 100%, 90%)';
            xoff += 0.01;
        }
        yoff += 0.01;
    }
}

function closeTerrain() {
    terrain = undefined;
}