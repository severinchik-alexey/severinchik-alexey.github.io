document.body.onmousedown = function (eo) {
    if (eo.target.tagName === 'IMG') {
        let ball = eo.target;
        let shiftX = eo.clientX - ball.getBoundingClientRect().left;
        let shiftY = eo.clientY - ball.getBoundingClientRect().top;

        ball.style.position = 'absolute';
        ball.style.zIndex = 1000;
        ball.style.cursor = 'pointer';
        ball.style.width = 170 + 'px';
        document.body.append(ball);
        moveAt(eo.pageX, eo.pageY);

        function moveAt(pageX, pageY) {
            ball.style.left = pageX - shiftX + 'px';
            ball.style.top = pageY - shiftY + 'px';
        }
        function onMouseMove(eo) {
            moveAt(eo.pageX, eo.pageY);
        }
        document.addEventListener('mousemove', onMouseMove);
        ball.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            ball.onmouseup = null;
            ball.style.cursor = 'default';
            ball.style.width = 150 + 'px';
        };
    }
};
document.body.ondragstart = function () {
    return false;
};
