console.log("Configuring Analytics for applicaiton: com.data.icicibank.");

require.config({
    'paths': {
        'ibmmfpfanalytics': './node_modules/ibm-mfp-web-sdk/lib/analytics/ibmmfpfanalytics',
        'mfp': './node_modules/ibm-mfp-web-sdk/ibmmfpf'
    }
});

require(['ibmmfpfanalytics', 'mfp'], function (ibmmfpfanalytics, WL) {
    var wlInitOptions = {
        mfpContextRoot: '/mfp',
        applicationId: 'com.demo.icicibank',
        sessionMode: true
    };

    WL.Client.init(wlInitOptions).then(
        function () {
            ibmmfpfanalytics.logger.config({ analyticsCapture: true });

            console.log("Analytics for applicaiton: com.data.icicibank, intialized.");

            ibmmfpfanalytics.addEvent({ 'ICICI-Demo-Analytics for applicaiton: com.data.icicibank, intialized.': 'Analytics for applicaiton: com.data.icicibank, intialized.' });
            ibmmfpfanalytics.send();
        });
});