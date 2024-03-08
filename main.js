
const TOL = 0.0000001;

const circleFromPoints = function (p1, p2, p3) {
    const offset = Math.pow(p2.x, 2) + Math.pow(p2.y, 2);
    const bc = (Math.pow(p1.x, 2) + Math.pow(p1.y, 2) - offset) / 2.0;
    const cd = (offset - Math.pow(p3.x, 2) - Math.pow(p3.y, 2)) / 2.0;
    const det = (p1.x - p2.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p2.y);

    if (Math.abs(det) < TOL) {
        return {
            invalid: true
        }
    }

    const idet = 1 / det;

    const centerx = (bc * (p2.y - p3.y) - cd * (p1.y - p2.y)) * idet;
    const centery = (cd * (p1.x - p2.x) - bc * (p2.x - p3.x)) * idet;
    const radius = Math.sqrt(Math.pow(p2.x - centerx, 2) + Math.pow(p2.y - centery, 2));

    return {
        x: centerx,
        y: centery,
        r: radius
    }
}

const x1 = document.getElementById('x1');
const y1 = document.getElementById('y1');
const x2 = document.getElementById('x2');
const y2 = document.getElementById('y2');
const x3 = document.getElementById('x3');
const y3 = document.getElementById('y3');

const canvas = document.getElementById('canvas');

const p1 = { x: 0, y: 0 };
const p2 = { x: 100, y: 100 };
const p3 = { x: 200, y: 0 };

const origin = {
    x: 100,
    y: 300
}

const draw_graphics = function (p1, p2, p3, c) {
    const canvas = document.getElementById('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    origin.x = 100;
    origin.y = Math.round(height / 2);

    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(origin.x, 0);
    ctx.lineTo(origin.x, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, origin.y);
    ctx.lineTo(width, origin.y);
    ctx.stroke();


    const draw_line = function (p1, p2) {
        ctx.beginPath();
        ctx.moveTo(origin.x + p1.x, origin.y - p1.y);
        ctx.lineTo(origin.x + p2.x, origin.y - p2.y);
        ctx.stroke();
    }

    const draw_circle = function (p) {
        ctx.beginPath();
        ctx.arc(origin.x + p.x, origin.y - p.y, 2.5, 0, 2 * Math.PI);
        ctx.fill();
    }

    draw_line(p1, p2);
    draw_line(p2, p3);
    draw_circle(p1);
    draw_circle(p2);
    draw_circle(p3);

    draw_circle(c);
    ctx.beginPath();
    ctx.arc(origin.x + c.x, origin.y - c.y, c.r, 0, 2 * Math.PI);
    ctx.stroke();
}

const on_point_change = function () {
    c = circleFromPoints(p1, p2, p3);
    if (!c.invalid) {
        draw_graphics(p1, p2, p3, c);
        update_html_circle_data();
    } else {
        update_html_circle_data("INVALID_POINTS");
    }
}

const update_html_input = function () {
    x1.value = p1.x; y1.value = p1.y;
    x2.value = p2.x; y2.value = p2.y;
    x3.value = p3.x; y3.value = p3.y;
};

const circle_data = document.getElementById('circle_data');

const update_html_circle_data = function (INVALID_POINTS) {
    document.getElementById('centerx').innerHTML = INVALID_POINTS || c.x;
    document.getElementById('centery').innerHTML = INVALID_POINTS || c.y;
    document.getElementById('radius').innerHTML = INVALID_POINTS || c.r;
    if (INVALID_POINTS) {
        circle_data.style.background = "#f007";
    } else {
        circle_data.style.background = "";
    }
};


update_html_input();

x1.onkeyup = x1.onchange = x1.onmouseup = function (value) { p1.x = parseInt(x1.value) 
|| 0; on_point_change() };
y1.onkeyup = y1.onchange = y1.onmouseup = function (value) { p1.y = parseInt(y1.value) 
|| 0; on_point_change() };
x2.onkeyup = x2.onchange = x2.onmouseup = function (value) { p2.x = parseInt(x2.value) 
|| 0; on_point_change() };
y2.onkeyup = y2.onchange = y2.onmouseup = function (value) { p2.y = parseInt(y2.value) 
|| 0; on_point_change() };
x3.onkeyup = x3.onchange = x3.onmouseup = function (value) { p3.x = parseInt(x3.value) 
|| 0; on_point_change() };
y3.onkeyup = y3.onchange = y3.onmouseup = function (value) { p3.y = parseInt(y3.value) 
|| 0; on_point_change() };

const mouse = {
    down: false,
    point_selected: false
};

let moving_point = {};

const getRelativeEvent = function (evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: Math.round(evt.clientX - rect.left) - origin.x,
        y: origin.y - Math.round(evt.clientY - rect.top)
    };
}

canvas.onmousedown = function (e) {
    mouse.down = true;
    const event = getRelativeEvent(e);
    const RAD = 5;

    if (Math.abs(p1.x - event.x) < RAD && Math.abs(p1.y - event.y) < RAD) {
        moving_point = p1; mouse.point_selected = true;
        return;
    }
    if (Math.abs(p2.x - event.x) < RAD && Math.abs(p2.y - event.y) < RAD) {
        moving_point = p2; mouse.point_selected = true;
        return;
    }
    if (Math.abs(p3.x - event.x) < RAD && Math.abs(p3.y - event.y) < RAD) {
        moving_point = p3; mouse.point_selected = true;
        return;
    }
    console.log(p1, p2, p3, event);
};

canvas.onmouseup = function (e) {
    mouse.down = false;
    mouse.point_selected = false;
};
canvas.onmousemove = function (e) {
    const event = getRelativeEvent(e);
    if (mouse.point_selected) {
        moving_point.x = event.x;
        moving_point.y = event.y;
        on_point_change();
    }
}
on_point_change();
