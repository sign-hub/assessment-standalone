export class Baseconst {
    private static protocol = 'https';
    // private static url = 'testing02.eclettica.net:8085';
    // private static url = '10.6.0.162';
    // private static url = 'testing.sign-hub.eu';
    private static url = 'testing02.eclettica.net';
    private static frontend_url = 'localhost:4200';
    private static api_path = '/api/rest';

    private static protocoldev = 'https';
    private static urldev = 'testing02.eclettica.net';
    private static protocoltest = 'https';
    private static urltest = 'testing01.eclettica.net';
    private static protocolprod = 'http';
    private static urlprod = 'platform.sign-hub.eu';

    /**
     * PER MODIFICARE IL PUNTAMENTO CAMBIARE SOLO IL PARAMETRO endpoint;
     * VALORI POSSIBILI: dev, test, prod
     */
    private static version = '1.0.2';
    // private static endpoint = 'dev';
    private static endpoint = 'prod';
    // private static endpoint = 'prod';

    // public static url: string = '54.76.141.222:9000';
    // private static api_path: string = '';

    private static isProd = false;

    public static getCompleteBaseUrl = function () {
        if (this.isProd) {
            return this.api_path + '/';
        }
        if (this.endpoint == 'dev') {
            return Baseconst.protocoldev + '://' + Baseconst.urldev + this.api_path + '/';
        } else if (this.endpoint == 'test') {
            return Baseconst.protocoltest + '://' + Baseconst.urltest + this.api_path + '/';
        } else if (this.endpoint == 'prod') {
            return Baseconst.protocolprod + '://' + Baseconst.urlprod + this.api_path + '/';
        }
    };

    public static getPartialBaseUrl = function () {
        if (this.isProd) {
            return this.api_path;
        }
        if (this.endpoint == 'dev') {
            return Baseconst.protocoldev + '://' + Baseconst.urldev + this.api_path;
        } else if (this.endpoint == 'test') {
            return Baseconst.protocoltest + '://' + Baseconst.urltest + this.api_path;
        } else if (this.endpoint == 'prod') {
            return Baseconst.protocolprod + '://' + Baseconst.urlprod + this.api_path ;
        }
    };

    public static getVersion = function () {
        return this.version;
    };

    public static getEndpoint = function () {
        return this.endpoint;
    };
}
