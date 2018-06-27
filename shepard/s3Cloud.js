
const Cloud = require('./cloud.js');

class S3Cloud extends Cloud {

    constructor( credentials ) {
        super( credentials );
        this.AWS = require('aws-sdk');
        this.AWS.config.update ({
            accessKeyId: credentials.user.accessKeyId,
            secretAccessKey: credentials.user.secretAccessKey,
        });

        this.s3 = new this.AWS.S3();


    }

    fetchBuckets() {
        return new Promise ((resolve, reject) => {

            this.s3.listBuckets( (err, data) => {
                if (err) {
                    reject (err);
                }
                resolve (data);

            });

        });
    }

    fetchObjects( rootDir, dirPath='', delimiter='/' , limit ){
        return new Promise ((resolve, reject) => {
            const s3params = {
                Bucket: rootDir,
                Prefix: dirPath,
                Delimiter: delimiter,
                MaxKeys: limit
            };

            this.s3.listObjectsV2 (s3params, (err, data) => {
                if (err) {
                    reject (err);
                }
                resolve (data);

            });

        });
    }


    static test(){
        const credentials = require('../credentials');

        let source = new S3Cloud(credentials);


        source.fetchBuckets()
            .then(data => console.log('Success', data))
            .catch(err => console.log('failed', err));

        //Use prefix parameter to indicate dir path
        source.fetchObjects( 'gigofbuffalos', 'yaks/', '/' ,3000)
            .then(data => console.log('success', data))
            .catch(err => console.log('failed', err));
    }

    //Idea for representing file trees across cloud enviornments and standardising them
    buildDirTree() {
        //get root directories
        //add to json
        //for each root
        //getDirectories
        //place in json
        //forEachDirectory
        //getObject
        //place in json
    }

}



module.exports = S3Cloud;