import exampleComponent_1 from './scripts/components/exampleComponent.jsx';
import exampleModule3_2 from './scripts/components/tes55/exampleModule3.js';
import exampleModule3_3 from './scripts/components/tes55/test/exampleModule3.js';
import exampleModule2_4 from './scripts/components/tes55/test2/exampleModule2.coffee';
import exampleModule3_5 from './scripts/components/tes55/test2/exampleModule3.js';
import exampleModule3_6 from './scripts/components/tes56/exampleModule3.js';
import exampleModule3_7 from './scripts/components/tes56/test/exampleModule3.js';
import exampleModule3_8 from './scripts/components/tes56/test2/exampleModule3.js';
import exampleModule_9 from './scripts/modules/exampleModule.js';
import exampleModule2_10 from './scripts/modules/exampleModule2.coffee';
import exampleModule3_11 from './scripts/modules/test/exampleModule3.js';
var exportObject = {
    components: {
        exampleComponent: exampleComponent_1,
        tes55: {
            exampleModule3: exampleModule3_2,
            test: {
                exampleModule3: exampleModule3_3,
            },
            test2: {
                exampleModule2: exampleModule2_4,
                exampleModule3: exampleModule3_5,
            },
        },
        tes56: {
            exampleModule3: exampleModule3_6,
            test: {
                exampleModule3: exampleModule3_7,
            },
            test2: {
                exampleModule3: exampleModule3_8,
            },
        },
    },
    modules: {
        exampleModule: exampleModule_9,
        exampleModule2: exampleModule2_10,
        test: {
            exampleModule3: exampleModule3_11,
        },
    },
};
export default exportObject;