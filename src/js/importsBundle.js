import exampleComponent from './components/exampleComponent.js';
import exampleModule from './modules/exampleModule.js';
import exampleModule2 from './modules/exampleModule2.coffee';
import exampleModule3 from './modules/test/exampleModule3.js';
var exportObject = {
    components: {
        exampleComponent: exampleComponent,
    },
    modules: {
        exampleModule: exampleModule,
        exampleModule2: exampleModule2,
        test: {
            exampleModule3: exampleModule3,
        },
    },
};
export default exportObject;