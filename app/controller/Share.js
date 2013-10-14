
Ext.define('smiley360.controller.Share',
{
    extend: "Ext.app.Controller",
    views:
	[
	],
    stores:
	[

	],
    models:
	[

	],
    commands:
	{
	    'share.upload': function (command, me)
	    {
	        var previewSize = { w: 200, h: 150 };
	        var mainSize = { w: 400, h: 400 };
	        Ext.Msg.alert('find fileIn');
	        var oFileIn = me.fileElement.dom;
	        var canvPreview = me.up().down('[xtype=label]').element.dom.firstChild.firstChild;
	        var canv = document.createElement('canvas');
	        var oError = null;
	        var oFileReader = new FileReader();
	        Ext.Msg.alert('File reader created');
	        var oImage = new Image();
	        oFileReader.addEventListener('load', function (e)
	        {
	            Ext.Msg.alert('File reader LOAD', e.target.result);
	            oImage.src = e.target.result;
	        }, false);
	        oImage.addEventListener('load', function ()
	        {
	            var myMask = new Ext.LoadMask(Ext.getBody(), { message: "Please wait..." });
	            myMask.show();
	            var oCanvas = canvPreview;
	            var oContext = oCanvas.getContext('2d');
	            var widthMultiplier = 1;
	            if (this.width > previewSize.w)
	            {
	                widthMultiplier = previewSize.w / this.width;
	            }
	            var nWidth = this.width * widthMultiplier;
	            var nHeight = this.height * widthMultiplier;
	            var heightMultiplier = 1;
	            if (nHeight > previewSize.h)
	            {
	                heightMultiplier = previewSize.h / nHeight;
	            }
	            nWidth *= heightMultiplier;
	            nHeight *= heightMultiplier;
	            oCanvas.setAttribute('width', nWidth);
	            oCanvas.setAttribute('height', nHeight);
	            oContext.drawImage(this, 0, 0, nWidth, nHeight);

	            var msinContext = canv.getContext('2d');
	            var widthMultiplier = 1;
	            if (this.width > mainSize.w)
	            {
	                widthMultiplier = previewSize.w / this.width;
	            }
	            var nWidth = this.width * widthMultiplier;
	            var nHeight = this.height * widthMultiplier;
	            var heightMultiplier = 1;
	            if (nHeight > mainSize.h)
	            {
	                heightMultiplier = previewSize.h / nHeight;
	            }
	            nWidth *= heightMultiplier;
	            nHeight *= heightMultiplier;
	            canv.setAttribute('width', nWidth);
	            canv.setAttribute('height', nHeight);
	            msinContext.drawImage(this, 0, 0, nWidth, nHeight);
	            var str = canv.toDataURL("image/jpeg").replace("data:image/jpeg;base64,", "");
	            var http = new XMLHttpRequest();
	            if (http.upload && http.upload.addEventListener)
	            {                                            // Uploading progress handler
	                http.upload.onprogress = function (e)
	                {
	                    if (e.lengthComputable)
	                    {
	                        var percentComplete = (e.loaded / e.total) * 100;
	                        me.setBadgeText(percentComplete.toFixed(0) + '%');
	                    }
	                };
	                // Response handler
	                http.onreadystatechange = function (e)
	                {
	                    if (this.readyState === 4)
	                    {
	                        myMask.hide();
	                        if (Ext.Array.indexOf(me.getDefaultSuccessCodes(), parseInt(this.status)) !== -1)
	                        {
	                            var response = me.decodeResponse(this);
	                            if (response && response.success)
	                            {                                                            // Success
	                                me.fireEvent('success', response, this, e);
	                            } else if (response && response.message)
	                            {                                                            // Failure
	                                me.fireEvent('failure', response.message, response, this, e);
	                            } else
	                            {                                                            // Failure
	                                me.fireEvent('failure', 'Unknown error', response, this, e);
	                            }
	                        } else
	                        {                                                        // Failure
	                            me.fireEvent('failure', this.status + ' ' + this.statusText, response, this, e);
	                        }
	                        me.changeState('browse');
	                    }
	                };
	                http.upload.onerror = function (e)
	                {
	                    me.fireEvent('failure', this.status + ' ' + this.statusText, {}, this, e);
	                };
	            }
	            http.open('POST', smiley360.configuration.getServerDomain() + 'getfile.php?memberID='
                 + smiley360.services.getMemberId() + '&deviceID=' + smiley360.services.getDeviceId());
	            function getForm()
	            {
	                var form = new FormData();
	                form.append('imageDataString', str);
	                return form;
	            }
	            if (false/*me.getSignRequestEnabled()*/)
	            {
	                me.signRequest(http, function (http)
	                {
	                    http.send(getForm(file));
	                });
	            } else
	            {
	                http.send(getForm());
	            }
	        }, false);
	        oFileIn.addEventListener('change', function ()
	        {
	            Ext.Msg.alert('file select');
	            var oFile = this.files[0];
	            var oLogInfo = document.getElementById('logInfo');
	            var rFltr = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i
	            try
	            {
	                if (rFltr.test(oFile.type))
	                {
	                    me.hide();
	                    oFileReader.readAsDataURL(oFile);
	                    me.up().down('[xtype=label]').show();
	                } else
	                {
	                    throw oFile.name + ' is not a valid image';
	                }
	            } catch (err)
	            {
	                me.reset();
	                Ext.Msg.alert('Error', err)
	            }
	        }, false);
	        Ext.Msg.alert('end of controllers');
	    }
	},
    init: function ()
    {
        this.control(
		{
		    '':
			{
			    'share.command': function (cmdName)
			    {
			        this.commands[cmdName].apply(this, arguments);
			    }
			}
		})
    }
});