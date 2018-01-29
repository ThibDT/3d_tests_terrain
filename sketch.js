var cols, rows;
var scl = 20;
var w = 3600;
var h = 2000;
var terrain = [];
var distance = 1;
var orientation = {x:0, y:0};
var mousePos = {x:0,y:0};
var speedSlider;
var toolBox;
var speedValSpan;
var pos = {x:600,y:356,z:100};
var exportBtn;

function setup() {
    createCanvas(1200, 713, WEBGL);
    cols = w / scl;
    rows = h / scl;
    angleMode(DEGREES);
    colorMode(HSB);
    speedSlider = createSlider(0.0001, 1, 0.5, 0.0001);
    speedValSpan = createSpan(speedSlider.value());
    speedSlider.changed(updateSpeedVal);

    exportBtn = createButton('Export map');
    toolBox = createDiv('');

    toolBox.addClass('toolbox');
    toolBox.child(createSpan('Speed: '));
    toolBox.child(speedSlider);
    toolBox.child(speedValSpan);
    toolBox.child(exportBtn);
    for (var x = 0; x < cols; x++) {
        terrain[x] = []
        for (var y = 0; y < rows; y++) {
            terrain[x][y] = {
                alt:0,
                color: color(255)
            };
        }
    }
    var yoff = 0;
    for (var y = 0; y < rows; y++) {
        var xoff = 0;
        for (var x = 0; x < cols; x++) {
            terrain[x][y].alt = map(noise(xoff, yoff), 0, 1, 0, 100);
            var hue = parseInt(terrain[x][y].alt)*1.55;
            terrain[x][y].color = color(hue, 100, 90);
            xoff += 0.2;
        }
        yoff += 0.2;
    }
}

function draw() {
    background(0);
    rotateX(orientation.y);
    rotateZ(orientation.x);
    fill(0, 0, 0, 175);
    stroke(255);
    scale(1/distance);
    print(distance);
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
    for(var y = 0; y < rows-1; y++) {
        beginShape(TRIANGLE_STRIP);
        for (var x = 0; x < cols; x++) {
            fill(terrain[x][y].color);
            noStroke();
            vertex(x*scl, y*scl, terrain[x][y].alt);
            vertex(x*scl, (y+1)*scl, terrain[x][y+1].alt)
        }
        endShape();
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
