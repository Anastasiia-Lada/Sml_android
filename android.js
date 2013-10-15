          
<!-- These are the notifications that are displayed to the user through pop-ups if the above JS files does not exist in the same directory-->
var toServer = false;
var saved_controller_obj = {};
if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');

FB.Event.subscribe('auth.login', function (response) {
    //alert('auth.login event');
    //(toServer) ?
    loginToServer();
    //find_member();

});

FB.Event.subscribe('auth.logout', function (response) {
    //alert('auth.logout event');
});

FB.Event.subscribe('auth.sessionChange', function (response) {
    //alert('auth.sessionChange event');
});

//FB.Event.subscribe('auth.statusChange', handleStatusChange);

FB.Event.subscribe('auth.statusChange', function (response) {
    //alert('auth.statusChange event');
});

FB.Event.subscribe('auth.authResponseChange',
    function (response) {
        //alert('auth.ResponseChange');
        //alert(response.status);
        //alert(response.authResponse.accessToken);// + '<br>' + response.authResponse.expiresIn + '<br>' + response.authResponse.userID);
        //FB.getLoginStatus(updateStatusCallback);
    });
    
function me() { };

var permissions = ['email', 'offline_access', 'read_stream'];
   

function fb_login() {
    FB.getLoginStatus(updateStatusCallback, true);
}

function updateStatusCallback(response) {
    if (response.status === 'connected') {
            
        alert('You are already connected to Facebook!');
        revoke();
        //loginToServer();
    }
    else if (response.status === 'not_authorized') {
        alert('You are not authorized on Facebook!');
        // not_authorized
        login();
    } else {
        // not_logged_in
        alert('You are not logged in with Facebook! Please, log in!');
        login();
    }
}

function login() {
    //toServer = true;
    FB.login(function (response) {
        if (response.authResponse) {                
            // alert('GoLogin');
            //toServer = false;
            //alert(response.authResponse.accessToken);
            loginToServer();
        }
    }, { scope: 'email, read_stream' });        
}
function revoke() {
    FB.init({
        appId: "104171846376854",
        nativeInterface: CDV.FB,
        useCachedDialogs: false,
        status: true,           // Check Facebook Login status
        cookie: true,           // enable cookies to allow the server to access the session
        oauth: true,            // enable OAuth 2.0
        xfbml: false,
    });
    //FB.login(function (response) {
    //    if (response.authResponse) {                
    //        alert('Revoke');
    //        alert(response.authResponse.accessToken);
    //    }
    //}, { scope: 'email, offline_access, read_stream, publish_stream' });
}

function loginToServer() {
    FB.api('me?fields=email', function (response) {
        var params = {
            facebookID: response.id,
            guid: smiley360.services.getDeviceId(),//getURLParameter('deviceId'),
            fbtoken: FB.getAccessToken(),
        };

        $.ajax({
            dataType: "json",
            beforeSend: function () {
                //('ajax request will be sent');
            },
            url: smiley360.configuration.getServerDomain() + 'index.php',
            data: 'method=facebookSignIn&params=' + JSON.stringify(params),
            success: function (data) {
                //go back to application
                //alert('loginToServer succeded');
                find_member();
                //window.history.go(-(window.history.length - 1));
            },
            error: function (xhr, status, error) {
                alert(xhr.responseText);//'ajax request failed');
            }
        });
    });
}

function find_member() {
    //var me = Ext.app.getController('ParentController');
    saved_controller_obj.tryLoginUser();
}

document.addEventListener('deviceready', function () {
    FB.init({
        appId: "104171846376854",
        nativeInterface: CDV.FB,
        useCachedDialogs: false,
        status: true,           // Check Facebook Login status
        cookie: true,           // enable cookies to allow the server to access the session
        oauth: true,            // enable OAuth 2.0
        xfbml: false,
    });
    document.getElementById('data').innerHTML = "";
    navigator.splashscreen.hide();
       
}, false);