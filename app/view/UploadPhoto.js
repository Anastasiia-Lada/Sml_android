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
        name: 'maskedPanel',
        imageID: '',
        btn_from: {},
        scrollable: 'vertical',
        cls: 'popup-panel connect-popup-panel',
        items:
        [
            {
                xtype: 'panel',
                id: 'xRootPanel',
                cls: 'popup-root-panel',
                items:
                [
                    {
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
                        items:
                        [
                            {
                                xtype: 'label',
                                id: 'xTitleLabel',
                                cls: 'popup-title-text',
                                html: 'Earn {0} Smiles uploading a Photo',
                            }, {
                                xtype: 'image',
                                docked: 'right',
                                cls: 'popup-title-image',
                                src: 'resources/images/photo_share.png',
                            }
                        ],
                    }, {
                        xtype: 'panel',
                        id: 'xStatusIndicator',
                        cls: 'popup-status-indicator',
                    }, {
                        xtype: 'panel',
                        cls: 'popup-middle-panel popup-status-container',
                        items:
                        [
                            {
                                xtype: 'panel',
                                layout: 'hbox',
                                items:
                                [
                                    {
                                        xtype: 'panel',
                                        layout: 'vbox',
                                        items:
                                        [
                                        {
                                            xtype: 'fileupload',
                                            autoUpload: true,
                                            name: 'xBrowsePhotoButton',
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
                                            successHandler: function (response)
                                            {
                                                photoAdded = true;
                                                this.up('#xView').config.imageID = response.imageID;
                                                //Ext.Msg.alert('iPad test', response.imageID);
                                            },
                                            failureHandler: function (error, response)
                                            {
                                                Ext.Msg.alert(error, response.message);
                                            }
                                        },
                                        {
                                            xtype: 'label',
                                            cls: 'popup-photo-image',
                                            hidden: true,
                                            html: '<canvas style="width:150px;"/>'
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
                                    }
                                ]
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
                                }
                                ],
                            }
                        ],
                    }, {
                        xtype: 'panel',
                        cls: 'popup-bottom-panel',
                        items:
                        [
                            {
                                xtype: 'panel',
                                layout: 'hbox',
                                defaults: {
                                    width: '50%',
                                    labelAlign: 'right',
                                    labelWidth: '100%',
                                },
                                items:
                                [
                                    {
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
                                    }
                                ],
                            }, {
                                xtype: 'label',
                                cls: 'popup-post-comment',
                                html: 'The following text will automatically be added to your post:',
                            },
                        {
                            xtype: 'label',
                            cls: 'popup-post-comment-text',
                            id: 'xSeedPhrase',
                            html: 'Try Campbell\'s Slow Kettle Style Soups and be sure to use this $1.00 off coupon! http://bit.ly/YxVW1D',
                        }
                        ],
                    }, {
                        xtype: 'panel',
                        cls: 'popup-button-panel',
                        items:
                        [
                            {
                                xtype: 'button',
                                text: 'POST',
                                icon: 'resources/images/share-initial.png',
                                iconAlign: 'right',
                                iconCls: 'popup-post-icon',
                                id: 'xShareButton',
                                cls: 'popup-post-button',
                                disabled: false,
                                listeners: {
                                    tap: function ()
                                    {
                                        this.up('#xView').doShare();
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
                smiley360.failedShares = [];
                photoAdded = false;
                //var fileName = smiley360.services.guid();
                var uploadUrl = smiley360.configuration.getServerDomain() +
                    'getfile.php?memberID=' + smiley360.memberData.UserId +
                    '&deviceID=' + Ext.getStore('membersStore').getAt(0).data.deviceId;

                // this.down('#xBrowsePhotoButton').setUrl(uploadUrl);

                if (smiley360.memberData.Profile.twitter_token && smiley360.memberData.Profile.twitter_token != "")
                    this.down('#xTwitterCheckbox').show()
                else
                    this.down('#xTwitterCheckbox').hide();

                if (smiley360.memberData.Profile.facebookID && smiley360.memberData.Profile.facebookID != "" && smiley360.permissionsList.publish_stream)
                    this.down('#xFacebookCheckbox').show()
                else
                    this.down('#xFacebookCheckbox').hide();
            }
        },
    },

    onCheck: function ()
    {
        this.down('[name=xBrowsePhotoButton]').setCls('popup-photo-button has-shadow');
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
        }
        if (Ext.getCmp('xView')) Ext.getCmp('xView').doValidation();
    },

    doShare: function ()
    {
        if (Ext.getCmp('xView').doValidation())
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
                });
            };

            if (Ext.getCmp('xView'))
                Ext.getCmp('xView').doValidation();
        }
        else
        {
            var msg = '';
            if (!photoAdded)
            {
                if (this.down('[name=xBrowsePhotoButton]'))
                    this.down('[name=xBrowsePhotoButton]').setCls('popup-photo-button-required has-shadow');
                msg += 'Please, select some photo. ';
            }
            if (((!this.down('#xFacebookCheckbox').getChecked() && !this.down('#xFacebookCheckbox').isHidden())
                    && (!this.down('#xTwitterCheckbox').getChecked() && !this.down('#xTwitterCheckbox').isHidden()))
                || (this.down('#xFacebookCheckbox').isHidden() && (!this.down('#xTwitterCheckbox').getChecked() && !this.down('#xTwitterCheckbox').isHidden()))
                || (this.down('#xTwitterCheckbox').isHidden() && (!this.down('#xFacebookCheckbox').getChecked() && !this.down('#xFacebookCheckbox').isHidden())))
            {
                msg += 'Please, select one or more post methods. ';
            }
            if (this.down('#xPostText').getValue().length > this.down('#xCharacterMaximum').config.xMax)
                msg += 'Post text, can`t be longer than ' + this.down('#xCharacterMaximum').config.xMax + ' symbols';
            Ext.Msg.alert('Error', msg);
        }
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
        if (this.down('#xPostText').getValue().length < this.down('#xCharacterMaximum').config.xMax
            && !(((!this.down('#xFacebookCheckbox').getChecked() && !this.down('#xFacebookCheckbox').isHidden())
                    && (!this.down('#xTwitterCheckbox').getChecked() && !this.down('#xTwitterCheckbox').isHidden()))
                || (this.down('#xFacebookCheckbox').isHidden() && (!this.down('#xTwitterCheckbox').getChecked() && !this.down('#xTwitterCheckbox').isHidden()))
                || (this.down('#xTwitterCheckbox').isHidden() && (!this.down('#xFacebookCheckbox').getChecked() && !this.down('#xFacebookCheckbox').isHidden())))
            && photoAdded)
        {
            if (photoAdded && this.down('[name=xBrowsePhotoButton]'))
                this.down('[name=xBrowsePhotoButton]').setCls('popup-photo-button has-shadow');
            // Ext.getCmp('xShareButton').setDisabled(false);
            return true;
        }
        else
            return false; // Ext.getCmp('xShareButton').setDisabled(true);
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