import exampleComponent_1 from './scripts/components/exampleComponent.jsx';
import exampleTypescriptFile_2 from './scripts/components/exampleTypescriptFile.ts';
import exampleModule3_3 from './scripts/components/tes55/exampleModule3.js';
import exampleModule3_4 from './scripts/components/tes55/test/exampleModule3.js';
import exampleModule2_5 from './scripts/components/tes55/test2/exampleModule2.coffee';
import exampleModule3_6 from './scripts/components/tes55/test2/exampleModule3.js';
import exampleModule3_7 from './scripts/components/tes56/exampleModule3.js';
import exampleModule3_8 from './scripts/components/tes56/test/exampleModule3.js';
import exampleModule3_9 from './scripts/components/tes56/test2/exampleModule3.js';
import exampleModule_10 from './scripts/modules/exampleModule.js';
import exampleModule2_11 from './scripts/modules/exampleModule2.coffee';
import exampleModule3_12 from './scripts/modules/test/exampleModule3.js';
var exportObject = {
    components: {
        exampleComponent: exampleComponent_1,
        exampleTypescriptFile: exampleTypescriptFile_2,
        tes55: {
            exampleModule3: exampleModule3_3,
            test: {
                exampleModule3: exampleModule3_4,
            },
            test2: {
                exampleModule2: exampleModule2_5,
                exampleModule3: exampleModule3_6,
            },
        },
        tes56: {
            exampleModule3: exampleModule3_7,
            test: {
                exampleModule3: exampleModule3_8,
            },
            test2: {
                exampleModule3: exampleModule3_9,
            },
        },
    },
    modules: {
        exampleModule: exampleModule_10,
        exampleModule2: exampleModule2_11,
        test: {
            exampleModule3: exampleModule3_12,
        },
    },
};
export default exportObject;