import _ from "lodash";
import "./style.css";
import eclipse from "./eclipse.jpg";
import printMe from "./print.js";
import 'es6-promise/auto';

let element;
let eclipseImg;
let btn;

function component() {
    element = document.createElement('div');
    btn = document.createElement('button');

    // Lodash, currently included via a script, is required for this line to work
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add("hello");

    // set up button
    btn.textContent = 'Click me and check the console!';
    btn.addEventListener('click', printMe);
    element.appendChild(btn);

    // add the image
    eclipseImg = new Image();
    eclipseImg.src = eclipse;
    element.appendChild(eclipseImg);

    return element;
}

document.body.appendChild(component());

if (module.hot) {
    module.hot.accept('./print.js', function() {
        console.log('Accepting the updated printMe module!');
        printMe();
    });
}
