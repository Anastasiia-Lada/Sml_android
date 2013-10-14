var photoAdded = false;
var shareResponse = [];
var uploader = {};
Ext.define('smiley360.view.UploadPhoto', {
    extend: 'Ext.Container',
    alias: 'widget.uploadphotoview',
    requires: [
        'Ext.Anim',
        'Ext.Rating',
        'Ext.ux.Fileup',
		'Ext.Function'
    ],
    config: {
        modal: true,
        centered: true,
        fullscreen: true,
        hideOnMaskTap: true,
        id: 'xView',
        imageID: '',
        btn_from: {},
        scrollable: 'vertical',
        cls: 'popup-panel',
        items: [{
            xtype: 'panel',
            id: 'xRootPanel',
            cls: 'popup-root-panel',
            items: [{
                xtype: 'image',
                docked: 'top',
                cls: 'popup-close-button',
                listeners: {
                    tap: function ()
                    {
                        this.up('#xView').destroy();
                    }
                }
            }, {
                xtype: 'panel',
                layout: 'hbox',
                cls: 'popup-top-panel photo-background',
                items: [{
                    xtype: 'label',
                    id: 'xTitleLabel',
                    cls: 'popup-title-text',
                    html: 'Earn {0} Smiles uploading a Photo',
                }, {
                    xtype: 'image',
                    docked: 'right',
                    cls: 'popup-title-image',
                    src: 'resources/images/photo_share.png',
                }],
            }, {
                xtype: 'panel',
                id: 'xStatusIndicator',
                cls: 'popup-status-indicator',
            }, {
                xtype: 'panel',
                cls: 'popup-middle-panel popup-status-container',
                items: [{
                    xtype: 'panel',
                    layout: 'hbox',
                    items: [{
                        xtype: 'panel',
                        layout: 'vbox',
                        items:
                        [
                        {
                            xtype: 'fileupload',
                            html: '<input type="file"/>',
                            cls: 'popup-photo-button has-shadow',
                            states:
                            {
                                browse: {
                                    text: 'ADD PHOTO'
                                },
                                uploading: {
                                    text: 'Uploading',
                                    loading: true// Enable loading spinner on button
                                }
                            },
                            listeners:
                            {
                                painted: function (me)
                                {
                                    this.fireEvent('share.command', 'share.upload', this);
                                },
                                success: function (response)
                                {
                                    this.hide();
                                    this.up('#xView').config.imageID = response.imageID;
                                    this.up('#xView').down('#xShareButton').enable();
                                }
                            }
                        },
                        {
                            xtype: 'label',
                            cls: 'popup-photo-image',
                            hidden: true,
                            html: '<canvas/>'
                        }
                        ]
                    }, {
                        xtype: 'textareafield',
                        id: 'xPostText',
                        flex: 1,
                        maxRows: 5,
                        //maxLength: 84,
                        isFocused: false,
                        cls: 'popup-input popup-input-text',
                        style: 'font-size: 0.9em;',
                        listeners: {
                            keyup: function ()
                            {
                                var postLenght = this.getValue().length;
                                var xPostCountLabel = this.up('#xView').down('#xPostCountLabel');

                                xPostCountLabel.setHtml(postLenght.toString());

                                if (postLenght > Ext.getCmp('xCharacterMaximum').config.xMax)
                                {
                                    xPostCountLabel.setStyle('color: red;')
                                }
                                else
                                {
                                    xPostCountLabel.setStyle('color: #878789;')
                                }
                            }
                        }
                    }]
                }, {
                    xtype: 'panel',
                    layout: 'hbox',
                    items: [{
                        xtype: 'label',
                        cls: 'popup-post-bottom-text',
                        id: 'xCharacterMaximum',
                        xMax: 140,
                        style: 'color: #878789;',
                        html: 'Post must contain a maximum of {0} characters.',
                    }, {
                        xtype: 'label',
                        id: 'xPostCountLabel',
                        docked: 'right',
                        cls: 'popup-post-bottom-text',
                        html: '0',
                    }],
                }],
            }, {
                xtype: 'panel',
                cls: 'popup-bottom-panel',
                items: [{
                    xtype: 'panel',
                    layout: 'hbox',
                    defaults: {
                        width: '50%',
                        labelAlign: 'right',
                        labelWidth: '100%',
                    },
                    items: [{
                        xtype: 'checkboxfield',
                        id: 'xFacebookCheckbox',
                        label: 'Post to Facebook',
                        labelCls: 'popup-checkbox-grey-label',
                        cls: 'popup-checkbox',
                        checked: true,
                        listeners: {
                            check: function ()
                            {
                                this.up('#xView').onCheck();
                            },
                            uncheck: function ()
                            {
                                this.up('#xView').onUncheck();
                            }
                        }
                    }, {
                        xtype: 'checkboxfield',
                        id: 'xTwitterCheckbox',
                        label: 'Post to Twitter',
                        labelCls: 'popup-checkbox-grey-label',
                        cls: 'popup-checkbox',
                        listeners: {
                            check: function ()
                            {
                                this.up('#xView').onCheck();
                            },
                            uncheck: function ()
                            {
                                this.up('#xView').onUncheck();
                            }
                        }
                    }],
                }, {
                    xtype: 'label',
                    cls: 'popup-post-comment',
                    html: 'The following text will automatically be added to your post:',
                }, {
                    xtype: 'label',
                    cls: 'popup-post-comment-text',
                    id: 'xSeedPhrase',
                    html: 'Try Campbell\'s Slow Kettle Style Soups and be sure to use this $1.00 off coupon! http://bit.ly/YxVW1D',
                },
                //{
                //	xtype: 'container',
                //	html: //'<form id="submit-form" method="post" action="dump.php">' +


                //	'<div id="filelist">Your browser doesn\'t have Flash, Silverlight or HTML5 support.</div>'+
                //	'<br />'+
                //	'<div id="container">'+
                //	'<a id="pickfiles" href="javascript:;">Select and Resize</a>'+ 
                //	'<a id="uploadfiles" href="javascript:;">Upload files</a>'+
                //	'</div>'+
                //	'<br />'+
                //	'<pre id="console"></pre>'

                //					'<h1>Custom example</h1>' +
                //					'<p>Shows you how to use the core plupload API.</p>' +
                //					'<div>' +
                //					'<div id="filelist">No runtime found.</div>' +
                //					'<br />' +
                //					'<a id="pickfiles" href="#">[Select files]</a>' +
                //					'<a id="uploadfiles" href="#">---[Upload files]</a>' +
                //					'</div>' +
                    //'<input type="submit" />' +
                    //'</form>'
                //}
                ],
            }, {
                xtype: 'panel',
                cls: 'popup-button-panel',
                items: [{
                    xtype: 'button',
                    text: 'POST',
                    icon: 'resources/images/share-initial.png',
                    iconAlign: 'right',
                    iconCls: 'popup-post-icon',
                    id: 'xShareButton',
                    cls: 'popup-post-button',
                    disabled: true,
                    listeners: {
                        tap: function ()
                        {
                            var doShareAll = Ext.Function.createSequence(this.up('#xView').doShare());
                        }
                    },
                }],
            }],
        }],
        listeners: {
            initialize: function ()
            {
                smiley360.adjustPopupSize(this);
            },
            hide: function ()
            {
                this.destroy();
            },
            painted: function ()
            {
                uploader = new plupload.Uploader({
                    runtimes: 'html5,flash,silverlight,html4',
                    browse_button: 'pickfiles', // you can pass in id...
                    container: document.getElementById('container'), // ... or DOM Element itself
                    url: 'upload.php',
                    flash_swf_url: '../js/Moxie.swf',
                    silverlight_xap_url: '../js/Moxie.xap',
                    resize: { width: 100, height: 100, quality: 90 },


                    filters: {
                        max_file_size: '10mb',
                        mime_types: [
                            { title: "Image files", extensions: "jpg,gif,png" },
                            { title: "Zip files", extensions: "zip" }
                        ]
                    },

                    init: {
                        PostInit: function ()
                        {
                            document.getElementById('filelist').innerHTML = '';

                            document.getElementById('uploadfiles').onclick = function ()
                            {
                                uploader.start();
                                return false;
                            };
                        },

                        FilesAdded: function (up, files)
                        {
                            files = ////chosen file
                            plupload.each(files, function (file)
                            {
                                document.getElementById('filelist').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></div>';
                            });
                        },

                        UploadProgress: function (up, file)
                        {
                            document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                        },

                        Error: function (up, err)
                        {
                            document.getElementById('console').innerHTML += "\nError #" + err.code + ": " + err.message;
                        }
                    }
                });

                uploader.init();

                smiley360.failedShares = [];
                photoAdded = false;
                //var fileName = smiley360.services.guid();
                var uploadUrl = smiley360.configuration.getServerDomain() +
                    'getfile.php?memberID=' + smiley360.memberData.UserId +
                    '&deviceID=' + Ext.getStore('membersStore').getAt(0).data.deviceId;

                // this.down('#xBrowsePhotoButton').setUrl(uploadUrl);

                if (smiley360.memberData.Profile.twitter_token && smiley360.memberData.Profile.twitter_token != "")
                    this.down('#xTwitterCheckbox').show()
                else this.down('#xTwitterCheckbox').hide();

                if (smiley360.memberData.Profile.facebookID && smiley360.memberData.Profile.facebookID != "" && smiley360.permissionsList.publish_stream)
                    this.down('#xFacebookCheckbox').show()
                else this.down('#xFacebookCheckbox').hide();
            }
        },
    },

    onCheck: function ()
    {
        this.down('#xBrowsePhotoButton').setCls('popup-photo-button has-shadow');
        this.down('#xFacebookCheckbox').setLabelCls('popup-checkbox-grey-label');
        this.down('#xTwitterCheckbox').setLabelCls('popup-checkbox-grey-label');
        if (Ext.getCmp('xView')) Ext.getCmp('xView').doValidation();
    },

    onUncheck: function ()
    {
        var xTwitterCheckbox = this.down('#xTwitterCheckbox');
        var xFacebookCheckbox = this.down('#xFacebookCheckbox');

        if (!xTwitterCheckbox.getChecked() &&
            !xFacebookCheckbox.getChecked())
        {

            xTwitterCheckbox.setLabelCls('popup-checkbox-red-label');
            xFacebookCheckbox.setLabelCls('popup-checkbox-red-label');

            this.down('#xBrowsePhotoButton').setCls('popup-photo-button-required has-shadow');
        }
        if (Ext.getCmp('xView')) Ext.getCmp('xView').doValidation();
    },

    doShare: function ()
    {
        var shareView = this;
        var shareOptions = [];

        smiley360.setViewStatus(shareView, smiley360.viewStatus.progress);
        ///////////////facebook
        if (this.down('#xFacebookCheckbox').getChecked() == true && !this.down('#xFacebookCheckbox').isHidden())
        {

            shareOptions.push(1);
            var shareDataFB = {
                missionID: shareView.missionId,
                memberID: smiley360.memberData.UserId,
                rating: 1,//this.down('#xRating').getValue(),
                text: this.down('#xPostText').getValue(),
                postOptionIDs: [1],//shareOptions,
                imageID: Ext.getCmp('xView').config.imageID
            };


            smiley360.services.postToFacebook(shareDataFB, function (responseFB)
            {
                if (responseFB.success && responseFB.status == 'success')
                    smiley360.failedShares.push('fb_s')
                else smiley360.failedShares.push('fb_f');
                smiley360.setResponseStatus(shareView, responseFB, '', shareView.config.btn_from);
                console.log(shareView.config.btn_from.valueOf());
                //shareView.checkResponse();
            });
        };

        ///////////////twitter
        if (this.down('#xTwitterCheckbox').getChecked() == true && !this.down('#xTwitterCheckbox').isHidden())
        {

            shareOptions.push(3);
            var shareDataTW = {
                missionID: shareView.missionId,
                memberID: smiley360.memberData.UserId,
                text: this.down('#xPostText').getValue(),
                imageID: Ext.getCmp('xView').config.imageID
            };

            smiley360.services.postToTwitter(shareDataTW, function (responseTW)
            {
                if (responseTW.success && responseTW.status == 'success')
                    smiley360.failedShares.push('twi_s')
                else smiley360.failedShares.push('twi_f');
                smiley360.setResponseStatus(shareView, responseTW, '', shareView.config.btn_from);
                console.log(shareView.config.btn_from.valueOf());
                //shareView.checkResponse();
            });
        };

        if (Ext.getCmp('xView')) Ext.getCmp('xView').doValidation();
    },


    setEarnSmiles: function (smiles)
    {
        var xTitleLabel = this.down('#xTitleLabel');

        xTitleLabel.setHtml(Ext.String.format(
            xTitleLabel.getHtml(), smiles));
    },
    setSeedPhrase: function (seedPhrase)
    {
        Ext.getCmp('xSeedPhrase').setHtml(seedPhrase);
    },
    doValidation: function ()
    {
        if (((this.down('#xFacebookCheckbox').getChecked() == true) || (this.down('#xTwitterCheckbox').getChecked() == true)) && (photoAdded))
            Ext.getCmp('xShareButton').setDisabled(false)
        else Ext.getCmp('xShareButton').setDisabled(true);
    },
    setCharacterMaximum: function (number)
    {
        this.down('#xCharacterMaximum').config.xMax = number;
        this.down('#xCharacterMaximum').setHtml(Ext.String.format(
            this.down('#xCharacterMaximum').getHtml(), number));
    },

    setMissionId: function (missionId)
    {
        this.missionId = missionId;
    },

    missionId: undefined,
});