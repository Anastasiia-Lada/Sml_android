/**
 * @filename Fileup.js
 * 
 * @name File uploading component
 * @fileOverview File uploading component based on Ext.Button
 *
 * @author Constantine V. Smirnov kostysh(at)gmail.com
 * @date 20130716
 * @version 2.0.1
 * @license GNU GPL v3.0
 *
 * @requires Sencha Touch 2.2.1
 * 
 * This component can works in two modes (switched by loadAsDataUrl config):
 * 1) Load local files as dataUrl. 
 * Will be useful if you want to load a local file. For example you can load
 * image and display it inside dom or store it into localStorage.
 * 2) Upload files to server (you should also setup a server part)
 * Current PHP version of server part located in src/php folder (getfile.php)
 * 
 * Server response format (JSON):
 * {
 *     success: true,// or false
 *     message: ''// error message if success === false
 * }
 * 
 * Component has three states:
 * 1) Browse: Initial state, you can browse and select file
 * 2) Ready: File selected and ready for load or upload
 * 3) Uploading: File loading or uploading in process
 * 
 * You can configure these states (add custom text and styles).
 * Default configuration below:
 * 
 

items: [

    //Fileup configuration for "Load local file" mode
    {
        xtype: 'fileupload',
        autoUpload: true,
        loadAsDataUrl: true,
        states: {
            browse: {
                text: 'Browse and load'
            },
            ready: {
                text: 'Load'
            },

            uploading: {
                text: 'Loading',
                loading: true// Enable loading spinner on button
            }
        }
    },
    
    //Fileup configuration for "Upload file" mode
    {
        itemId: 'fileBtn',
        xtype: 'fileupload',
        autoUpload: false,
        url: 'src/php/getfile.php'
    }
]

 
 * 
 */

/**
 * @event success
 * Fired when file uploaded successfully
 * @param {Object} response Response object obtained from server
 * @param {Object} xhr Link to XMLHttpRequest object
 * @param {Object} e Success event
 */

/**
 * @event failure
 * Fired when file not uploaded or server just returns error message
 * @param {String} message Parsed error message obtained from server
 * @param {Object} response Response object obtained from server
 * @param {Object} xhr Link to XMLHttpRequest object
 * @param {Object} e Uploading error event
 */

/**
 * @event loadsuccess
 * Fired when file uploaded successfully
 * @param {Object} dataUrl DataUrl source of readed file
 * @param {Object} reader Link to FileReader object
 * @param {Object} e Load event
 */

/**
 * @event loadfailure
 * Fired when file not uploaded or server just returns error message
 * @param {String} message Parsed error message obtained from server
 * @param {Object} reader Link to FileReader object
 * @param {Object} e Loading error event
 */

Ext.define('Ext.ux.Fileup', {
    extend: 'Ext.Button',
    xtype: 'fileupload',

    requires: [
        'Ext.MessageBox',
        'Ext.device.Notification',
        'Ext.Array'
    ],

    template: [

        // Default button elements (do not change!)
        {
            tag: 'span',
            reference: 'badgeElement',
            hidden: true
        },
        {
            tag: 'span',
            className: Ext.baseCSSPrefix + 'button-icon',
            reference: 'iconElement',
            hidden: true
        },
        {
            tag: 'span',
            reference: 'textElement',
            hidden: true
        },

        // Loading spinner
        {
            tag: 'div',
            className: Ext.baseCSSPrefix + 'loading-spinner',
            reference: 'loadingElement',
            hidden: true,

            children: [
                {
                    tag: 'span',
                    className: Ext.baseCSSPrefix + 'loading-top'
                },
                {
                    tag: 'span',
                    className: Ext.baseCSSPrefix + 'loading-right'
                },
                {
                    tag: 'span',
                    className: Ext.baseCSSPrefix + 'loading-bottom'
                },
                {
                    tag: 'span',
                    className: Ext.baseCSSPrefix + 'loading-left'
                }
            ]
        },

        // Hidden file element
        {
            tag: 'form',
            reference: 'formElement',
            hidden: false,

            children: [
                {
                    tag: 'input',
                    reference: 'fileElement',
                    type: 'file',
                    name: 'userfile',
                    tabindex: -1,
                    hidden: false,
                    style: 'opacity:0;position:absolute;top:-3px;right:-3px;bottom:-3px;left:-3px;z-index:16777270;'
                }
            ]
        }
    ],

    // Default button states config
    defaultStates: {
        browse: {
            text: 'Browse',
            cls: Ext.baseCSSPrefix + 'fileup',
            ui: 'filebrowse'
        },

        ready: {
            text: 'Upload',
            cls: Ext.baseCSSPrefix + 'fileup-ready',
            ui: 'fileready'
        },

        uploading: {
            text: 'Uploading',
            cls: Ext.baseCSSPrefix + 'fileup-uploading',
            ui: 'fileupload',
            loading: true
        }
    },

    // Current button state
    currentState: null,

    config: {
        cls: Ext.baseCSSPrefix + 'fileup',

        /**
         * @cfg {String} name Input element name, check on server for $_FILES['userfile']
         */
        name: 'userfile',

        /**
         * @cfg {Boolean} autoUpload 
         * If true then "uploading" state will start after "ready" event automatically
         */
        autoUpload: false,

        /**
         * @cfg {Object} states 
         */
        states: true,

        /**
         * @cfg {Boolean} loadAsDataUrl
         */
        loadAsDataUrl: false,

        /**
         * @cfg {String} url URL to uploading handler script on server
         */
        url: '',

        /**
         * @cfg {Boolean} signRequestEnabled Enable or disable request signing feature
         */
        signRequestEnabled: false,

        /**
         * @cfg {String} signHeader Signing token header name
         */
        signHeader: '',

        /**
         * @cfg {Array} defaultSuccessCodes Http response success codes
         */
        defaultSuccessCodes: [200, 201]
    },

    // @private
    applyStates: function (states)
    {
        var me = this;

        if (states)
        {

            if (Ext.isObject(states))
            {

                // Merge custom config with default
                return Ext.merge({}, me.defaultStates, states);
            } else
            {
                return me.defaultStates;
            }
        } else
        {
            return me.defaultStates;
        }
    },

    // @private
    initialize: function ()
    {
        var me = this;
        me.callParent();

        me.fileElement.dom.onchange = function ()
        {
            me.onChanged.apply(me, arguments);
        };

        me.on({
            scope: me,
            buffer: 250,// Avoid multiple tap 
            tap: me.onButtonTap
        });

        // Stup initial button state
        me.changeState('browse');
    },

    // @private
    onButtonTap: function ()
    {
        var me = this;

        switch (me.currentState)
        {

            // Currently we handle tap event while button in ready state
            // because in all other states button is not accessible
            case 'ready':
                me.changeState('uploading');
                var file = me.fileElement.dom.files[0];

                if (!me.getLoadAsDataUrl())
                {
                    me.fireEvent('uploadstart', file);
                    me.doUpload(file);
                } else
                {
                    me.doLoad(file);
                }
                break;
        }
    },

    // @private
    onChanged: function (e)
    {
        var me = this;

        if (e.target.files.length > 0)
        {
            me.fireAction('ready', [e.target.files[0]], function ()
            {
                me.changeState('ready');
            }, me);
        } else
        {
            Ext.device.Notification.show({
                title: 'Error',
                message: 'File selected but not accessible',
                buttons: Ext.MessageBox.OK,
                callback: function ()
                {
                    me.changeState('browse');
                }
            });
        }
    },

    // @private
    changeState: function (state)
    {
        var me = this;
        var states = me.getStates();

        if (Ext.isDefined(states[state]))
        {

            // Common tasks for all states
            if (states[state].text)
            {
                me.setText(states[state].text);
            } else
            {
                me.setText('');
            }

            if (states[state].cls)
            {
                me.setCls(states[state].cls);
            } else
            {
                me.setCls('');
            }

            if (states[state].ui)
            {
                me.setUi(states[state].ui);
            } else
            {
                me.setUi('normal');
            }

            if (states[state].loading)
            {
                me.loadingElement.show();
            } else
            {
                me.loadingElement.hide();
            }

            // State specific tasks
            switch (state)
            {
                case 'browse':
                    me.currentState = 'browse';
                    me.reset();
                    break;

                case 'ready':
                    me.currentState = 'ready';
                    me.fileElement.hide();

                    if (me.getAutoUpload())
                    {
                        me.onButtonTap();
                    }
                    break;

                case 'uploading':
                    me.currentState = 'uploading';
                    break;
            }
        } else
        {
            // <debug>
            Ext.Logger.warn('Config for FileUp state "' + state + '" not found!');
            // </debug>
        }
    },

    /**
     * @private
     * @method doLoad
     * Read selected file as dataUrl value.
     * If you wish to get dataUrl content 
     * then you should listen for "loadsuccess" event
     * @param {Object} file Link to loaded file element
     */
    doLoad: function (file)
    {
        var me = this;
        var reader = new FileReader();

        reader.onerror = function (e)
        {
            var message;
            switch (e.target.error.code)
            {
                case e.target.error.NOT_FOUND_ERR:
                    message = 'File Not Found';
                    break;

                case e.target.error.NOT_READABLE_ERR:
                    message = 'File is not readable';
                    break;

                case e.target.error.ABORT_ERR:
                    break;

                default:
                    message = 'Can not read file';
            };
            me.fireEvent('loadfailure', message, this, e);
        };

        canvas = document.createElement('canvas');
        context = null;

        canvas.setAttribute("id", 'hiddenCanvas');
        canvas.width = 40;
        canvas.height = 40;
        //canvas.style.visibility = "hidden";
        document.body.appendChild(canvas);

        //get the context to use 
        context = canvas.getContext('2d');

        myimage = new Image();
        myimage.setAttribute("id", "hiddenImage");
        myimage.onload = function ()
        {

            context.drawImage(myimage, 0, 0, 40, 40);
        }
        //alert(Ext.get('hiddenImage').dom.src);
        //alert(Ext.get('hiddenCanvas').getContext('2d'));

        reader.onload = function (e)
        {

            Ext.getCmp('xAddedImage').setSrc(this.result);

            myimage.src = this.result;

            me.doUpload(canvas);
            me.fireEvent('loadsuccess', this.result, this, e);
            me.changeState('browse');
        };

        // Read image file
        reader.readAsDataURL(file);
    },

    /**
     * @private
     * @method doUpload
     * Upload selected file using XMLHttpRequest.
     * @param {Object} file Link to loaded file element
     */
    doUpload: function (file)
    {
        var me = this;
        var previewSize = { w: 150, h: 150 };
        var mainSize = { w: 800, h: 800 };
        var oFileIn = me.fileElement.dom;
        var canvPreview = me.up().down('[xtype=label]').element.dom.firstChild.firstChild;
        var canv = document.createElement('canvas');
        var oError = null;
        var oFileReader = new FileReader();
        var oImage = new Image();
        oFileReader.onload = function (e)
        {
            oImage.src = e.target.result.replace('data:base64', 'data:image/jpeg;base64');
        };
        oImage.onload = function ()
        {
            var mask = Ext.create('Ext.LoadMask', { xtype: 'loadmask', message: 'Please wait, image is uploading.' });
            me.up('[name=maskedPanel]').setMasked(mask);
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
            widthMultiplier = 1;
            if (this.width > mainSize.w)
            {
                widthMultiplier = mainSize.w / this.width;
            }
            nWidth = this.width * widthMultiplier;
            nHeight = this.height * widthMultiplier;
            heightMultiplier = 1;
            if (nHeight > mainSize.h)
            {
                heightMultiplier = mainSize.h / nHeight;
            }
            nWidth *= heightMultiplier;
            nHeight *= heightMultiplier;
            canv.setAttribute('width', nWidth);
            canv.setAttribute('height', nHeight);
            msinContext.drawImage(this, 0, 0, nWidth, nHeight);
            var str = canv.toDataURL("image/jpeg").replace(/data:.*?base64,/g, '');
            var http = new XMLHttpRequest();
            if (http.upload)
            {
                http.onreadystatechange = function (e)
                {
                    if (this.readyState === 4)
                    {
                        try
                        {
                            if (Ext.Array.indexOf(me.getDefaultSuccessCodes(), parseInt(this.status)) !== -1)
                            {
                                var response = me.decodeResponse(this);
                                if (response && response.success)
                                {
                                    if (me.successHandler)
                                    {
                                        me.successHandler(response);
                                    }
                                    else
                                        me.fireEvent('success', response, this, e);
                                } else if (response && response.message)
                                {
                                    if (me.failureHandler)
                                    {
                                    	me.failureHandler('failure',response);
                                    }
                                    else                                                       // Failure
                                        me.fireEvent('failure', response.message, response, this, e);
                                } else
                                {
                                    if (me.failureHandler)
                                    {
                                    	me.failureHandler('failure',response);
                                    }
                                    else                                                         // Failure
                                        me.fireEvent('failure', 'Unknown error', response, this, e);
                                }
                            }
                            else
                            {
                                if (me.failureHandler)
                                {
                                    me.failureHandler(response);
                                }
                                else                                                   // Failure
                                    me.fireEvent('failure', this.status + ' ' + this.statusText, response, this, e);
                            }
                        }
                        catch (error)
                        {
                            Ext.Msg.alert('Unknown error', error);
                        }
                        finally
                        {
                            mask.destroy();
                            me.changeState('browse');
                        }
                    }
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
            http.send(getForm());
        };
        oFileIn.onchange = function ()
        {
            var oFile = this.files[0];
            //var rFltr = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i
            me.hide();
            oFileReader.readAsDataURL(oFile);
            me.up().down('[xtype=label]').show();
        };
        var oFile = oFileIn.files[0];
        me.hide();
        oFileReader.readAsDataURL(oFile);
        me.up().down('[xtype=label]').show();
    },
    getFormCanvas: function (canvas)
    {
        var me = this;
        var formData = new FormData();
        alert('getFormCanvas');
        if (canvas.toBlob)
        {
            canvas.toBlob(
				function (blob)
				{
				    // Do something with the blob object,
				    // e.g. creating a multipart form for file uploads:

				    formData.append(me.getName(), blob);
				    /* ... */
				},
				'image/png'
			);
        }
        return formData;
    },
    /**
     * @method getForm
     * Returns the form to send to the browser.
     *
     * @param {Object} file Link to loaded file element
     */
    getForm: function (file)
    {
        // Create FormData object
        var form = new FormData();

        // Add selected file to form
        form.append(this.getName(), file);

        // Return the form.
        return form;
    },

    /**
     * @method reset
     * Component reset
     */
    reset: function ()
    {
        var me = this;

        me.setBadgeText(null);
        me.formElement.dom.reset();
        me.fileElement.show();
    },

    /**
     * @private
     * @method decodeResponse
     * Decodes a server response.
     *
     * @param {Object} response The response from the server to decode
     * @return {Object} The response to provide to the library
     */
    decodeResponse: function (response)
    {
        return Ext.decode(response.responseText, true);
    },

    /**
     * @private
     * @method signRequest
     * Sign the request before sending it.
     *
     * @param {Object} http The XHR request object.
     * @param {Function} callback Called when the request has been signed.
     */
    signRequest: function (http, callback)
    {
        var me = this;
        var header = me.getSignHeader();

        if (!header)
        {
            me.fireEvent('failure', 'Request signing header is not defined');
        }

        me.signProvider(
            function (token)
            {
                http.setRequestHeader(header, token);
                callback(http);
            },
            function (failureText)
            {
                me.fireEvent('failure', 'Request signing is failed! ' +
                                        failureText, {}, this);
            });
    },

    /**
     * @private
     * @method signProvider
     * Default token provider (should be redefined)
     *
     * @param {Function} success Signing success callback
     * @param {Function} failure Signing failure callback
     */
    signProvider: function (success, failure)
    {
        success('default-token');// Default behaviour
    }
});
