
class Cloud {
    constructor( credentials ) {
        this.self = this;
        this.credentials = credentials;
    }


    getCredentials() {
        return this.credentials;
    }

    setCredentials( credentials ) {
        this.credentials = credentials;
    }

    async ensureResolved( prop ) {
        const value = await prop;
        if ( value instanceof Error) {
            throw value;
        } else {
            return value;
        }
    }
}

module.exports = Cloud;
