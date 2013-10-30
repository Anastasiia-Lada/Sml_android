var tmp_params = {
    facebookID: '',
    guid: '',
    fbtoken: '',
};
var detectedFail = false;
var saved_controller_obj = {};

FB.Event.subscribe('auth.login', function (response)
{
    detectedFail = false;

});

FB.Event.subscribe('auth.logout', function (response)
{
});

function handleOpenURL(url)
{
    window.setTimeout(function ()
    {
        var url_to_parse = url;
        var my_accessToken = getURLParameter('access_token', url);
        FB.api('/me?access_token=' + my_accessToken, { fields: 'id, email' },
            function (session)
            {
                tmp_params = {
                    facebookID: session.id,
                    guid: guid(),
                    fbtoken: my_accessToken,
                };
                //alert(tmp_params.guid);
            });

    }, 1000);
}

function guid()
{
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
}

function s4()
{
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

function getURLParameter(name, url)
{
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ""])[1].replace(/\+/g, '%20')) || null;
}


function fb_login()
{
    FB.getLoginStatus(updateStatusCallback, true);
}

function updateStatusCallback(response)
{
    login();
}

function login()
{

    try
    {
        FB.login(function (response)
        {
            if (response && response.authResponse)
            {
            }
            else
            {
                revoke();
            }
        }, { scope: 'email, read_stream' });
    }
    catch (err)
    {
        FB.login(function (response)
        {
        }, { scope: 'email, publish_stream' });
    }
}
function revoke()
{
    FB.init({
        appId: "213563938819286",
        nativeInterface: CDV.FB,
        useCachedDialogs: false,
        status: true,           // Check Facebook Login status
        cookie: true,           // enable cookies to allow the server to access the session
        oauth: true,            // enable OAuth 2.0
        xfbml: false,
    });

    detectedFail = true;
}

function find_member()
{
    //var me = Ext.app.getController('ParentController');
    saved_controller_obj.tryLoginUser();
}

document.addEventListener('deviceready', function ()
{
    FB.init({
        appId: "213563938819286",
        nativeInterface: CDV.FB,
        useCachedDialogs: false,
        status: true,           // Check Facebook Login status
        cookie: true,           // enable cookies to allow the server to access the session
        oauth: true,            // enable OAuth 2.0
        xfbml: false,
    });

}, false);