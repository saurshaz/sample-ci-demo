console.log("init.js");

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

            ibmmfpfanalytics.addEvent({ 'Application initialized': 'Analytics for applicaiton: com.data.icicibank, intialized.' });
            ibmmfpfanalytics.send();
        });
});