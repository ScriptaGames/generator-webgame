import "./style.css";
import "es6-promise/auto";
<% if (lib == "p5") { %>
import ezfn from "ezfn";
<% } %>
import { bindAll, functionsIn, assignIn } from "lodash";
import Game from "./game.js";

<% if (lib == "p5") { %>
// Bind all of Game's functions (setup and draw) to the global namespace so
// that p5 can find and run them.
ezfn(Game, window);
require("p5");
<% } %>


// if (module.hot) {
//     module.hot.accept("./print.js", function() {
//         console.log("Accepting the updated printMe module!");
//         printMe();
//     });
// }
