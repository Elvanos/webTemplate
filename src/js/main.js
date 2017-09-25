import jqModule from './modules/exampleModule.js';
import jqModule2 from './modules/exampleModule2.coffee';
import componentCounter from './components/exampleComponent.js';

var webApp = {
    modules: {
        jqModule: jqModule,
        jqModule2: jqModule2,
    },
    components: {
        componentCounter: componentCounter
    }
}
export default webApp;




