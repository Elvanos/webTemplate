var sharp = require('sharp');

var mtfiles = plugins.dirTree('./' + projectSettings.settingsPaths.srcFolderPath + '/mtimages');

mtfiles = mtfiles.children;

for (var i = 0; i < mtfiles.length; i++) {

    if (mtfiles[i].type === 'file') {
        //console.log(mtfiles[i].name);
        /* sharp('src/mtimages/'+mtfiles[i].name)
              .resize(80,80)
              .toFile('src/mtimages/thumbs/'+mtfiles[i].name, (err, info) => {


              } );*/

        plugins.fs.renameSync('./src/mtimages/'+mtfiles[i].name, './src/mtimages/'+[i]+'.jpg');
        plugins.fs.renameSync('./src/mtimages/thumbs/'+mtfiles[i].name, './src/mtimages/thumbs/'+[i]+'.jpg');
    }

}
