import exampleComponent from './scripts/components/exampleComponent.jsx';
import exampleModule from './scripts/modules/exampleModule.js';
import exampleModule3 from './scripts/modules/test/exampleModule3.js';
var exportObject = {
    components: {
        exampleComponent: exampleComponent,
    },
    modules: {
        exampleModule: exampleModule,
        test: {
            exampleModule3: exampleModule3,
        },
    },
};
export default exportObject;