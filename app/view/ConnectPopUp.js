var local_name = '';
var showUploadDialog = false;
Ext.define('smiley360.view.ConnectPopUp', {
	extend: 'Ext.Container',
	alias: 'widget.connectpopupview',
	config: {
		modal: true,
		centered: true,
		fullscreen: true,
		hideOnMaskTap: true,
		saved_button: {},
		saved_smilesCurrent: 0,
		saved_missionId: 0,
		saved_seedPhrase: '',
		saved_seedLength: 0,
		id: 'xViewPopup',
		scrollable: 'vertical',
		cls: 'popup-panel connect-popup-panel',
		items: [{
			xtype: 'panel',
			id: 'xRootPanel',
			cls: 'popup-root-panel',
			items: [{
				xtype: 'image',
				cls: 'popup-close-button',
				listeners: {
					tap: function () {
						if ((showUploadDialog || Ext.getCmp('xSubmitButton').getText() == 'OK') &&
							((smiley360.memberData.Profile.twitter_token && smiley360.memberData.Profile.twitter_token != "")
								|| (smiley360.memberData.Profile.facebookID && smiley360.memberData.Profile.facebookID != "" && smiley360.permissionsList.publish_stream))) {

							var shareView = Ext.widget('uploadphotoview').show();
							//var shareItem.sharingTool_typeID = 9;
							Ext.getCmp('xDetailsView').fireEvent('goSetSharingInfo', this, Ext.getCmp('xSharePanel').missionDetails.MissionId, smiley360.memberData.UserId, 9, shareView);

							if (shareView.setEarnSmiles)
								shareView.setEarnSmiles(Ext.getCmp('xViewPopup').config.saved_smilesCurrent);

							if (shareView.setMissionId)
								shareView.setMissionId(Ext.getCmp('xViewPopup').config.saved_missionId);
							if (shareView.config.btn_from)
								shareView.config.btn_from = Ext.getCmp('xViewPopup').config.saved_button;
						};
						showUploadDialog = false;
						Ext.getCmp('xSubmitButton').setText('Connect!');
						this.up('#xViewPopup').destroy();
					}
				}
			}, {
				xtype: 'panel',
				layout: 'hbox',
				cls: 'popup-top-panel forgetpwd-background',
				items: [{
					xtype: 'label',
					id: 'xTitleLabel',
					cls: 'missing-offers-title-text',
					style: 'max-height: 40px; padding-right: 10px;',
					html: 'Connect {0} <br> to share!',
				},
				{
					xtype: 'image',
					docked: 'right',
					id: 'xTitleImage',
					cls: 'popup-title-image',
					src: 'resources/images/smile-successful.png',
				}
				],
			},
			{
				xtype: 'panel',
				cls: 'popup-bottom-panel',
				items: [{
					xtype: 'label',
					id: 'xMessageText',
					cls: 'popup-message-text',
					html: 'Click the button below to connect to {0}, otherwise close this prompt to continue sharing without {0}.',
				}],
			}, {
				xtype: 'panel',
				cls: 'popup-button-panel',
				items: [{
					xtype: 'button',
					text: 'Connect!',
					id: 'xSubmitButton',
					cls: 'popup-submit-button',
					listeners: {
						tap: function () {
							if (this.getText() == 'OK') {
								showUploadDialog = true;
								if (!smiley360.memberData.Profile.facebookID || smiley360.memberData.Profile.facebookID == "" || !smiley360.permissionsList.publish_stream) {
									local_name = 'Facebook';
									this.up('#xViewPopup').setText(Ext.String.format('Connect {0} <br> to share!', 'Facebook'), Ext.String.format('Click the button below to connect to {0}, otherwise close this prompt to continue sharing without {0}.', 'Facebook'), 'Connect!');
								}

								else if (!smiley360.memberData.Profile.twitter_token || smiley360.memberData.Profile.twitter_token == "") {
									local_name = 'Twitter';
									this.up('#xViewPopup').setText(Ext.String.format('Connect {0} <br> to share!', 'Twitter'), Ext.String.format('Click the button below to connect to {0}, otherwise close this prompt to continue sharing without {0}.', 'Twitter'), 'Connect!');
								};
							}
							else if (this.getText() == 'Connect!') {
								allow_fb = true;
								if (smiley360.memberData.Profile.twitter_token && smiley360.memberData.Profile.twitter_token != "")
									allow_twitter = true;
								if (local_name == 'Facebook') {
									Ext.getCmp('xDetailsView').fireEvent('setToolId', 'sharetofacebookview');
									Ext.getStore('toolsStore').sync();
									this.up('#xViewPopup').onFacebookLoginTap();
								}
								else if (local_name == 'Twitter') {
									Ext.getCmp('xDetailsView').fireEvent('setToolId', 'sharetotwitterview');
									Ext.getStore('toolsStore').sync();
									this.up('#xViewPopup').onTwitterLoginTap();
								}
								else if (local_name == 'Facebook and Twitter') {
									Ext.getCmp('xDetailsView').fireEvent('setToolId', 'uploadphotoview');
									Ext.getStore('toolsStore').sync();
									this.up('#xViewPopup').onFacebookLoginTap();
								}
								this.up('#xViewPopup').destroy();

							};
							//Ext.widget('missingoffersview').hide();
							//Ext.getCmp('xMainView').showExternalView('editprofileview');
						}
					},
				}],
			}],
		}],
		listeners: {
			initialize: function () {
				smiley360.adjustPopupSize(this, 20);
			},
			painted: function () {
			},
			hide: function () {
				if ((showUploadDialog || Ext.getCmp('xSubmitButton').getText() == 'OK') &&
					((smiley360.memberData.Profile.twitter_token && smiley360.memberData.Profile.twitter_token != "")
							|| (smiley360.memberData.Profile.facebookID && smiley360.memberData.Profile.facebookID != "" && smiley360.permissionsList.publish_stream))) {
					var shareView = Ext.widget('uploadphotoview').show();
					//var shareItem.sharingTool_typeID = 9;
					Ext.getCmp('xDetailsView').fireEvent('goSetSharingInfo', this, Ext.getCmp('xSharePanel').missionDetails.MissionId, smiley360.memberData.UserId, 9, shareView);

					if (shareView.setEarnSmiles)
						shareView.setEarnSmiles(Ext.getCmp('xViewPopup').config.saved_smilesCurrent);

					if (shareView.setMissionId)
						shareView.setMissionId(Ext.getCmp('xViewPopup').config.saved_missionId);

					if (shareView.config.btn_from)
						shareView.config.btn_from = Ext.getCmp('xViewPopup').config.saved_button;

				};
				showUploadDialog = false;
				Ext.getCmp('xSubmitButton').setText('Connect!');
				this.destroy();
			}
		},
	},
	setText: function (txt_title, txt_msg, txt_btn) {

		var xTitleLabel = this.down('#xTitleLabel');

		xTitleLabel.setHtml(txt_title);

		var xMessageText = this.down('#xMessageText');

		xMessageText.setHtml(txt_msg);

		var xSubmitButton = this.down('#xSubmitButton');

		xSubmitButton.setText(txt_btn);
	},
	setToolName: function (name) {
		var xTitleLabel = this.down('#xTitleLabel');


		xTitleLabel.setHtml(Ext.String.format(
			xTitleLabel.getHtml(), name));

		var xMessageText = this.down('#xMessageText');


		xMessageText.setHtml(Ext.String.format(
			xMessageText.getHtml(), name));
		local_name = name;
	},
	onFacebookLoginTap: function () {
		if (!smiley360.permissionsList.publish_stream) {
			FB.login(function (response) {
				if (response.error)
					revoke();
				if (response.authResponse) {
					//alert(response.authResponse.accessToken);
					//alert('server login');
					//loginToServer();
				}
			}, { scope: 'email, read_stream, publish_stream' });

			smiley360.permissionsList.publish_stream = true;
		}
		else revoke();
		//var deviceId = smiley360.services.getDeviceId();

		//console.log('Login -> login to Facebook with deviceId: ', deviceId);

		//window.location =
        //    smiley360.configuration.getServerDomain() +
        //   'oauth/Facebook.html?deviceId=' + deviceId + '&scope=offline_access,email,read_stream,publish_stream';
	},

	onTwitterLoginTap: function () {
		var deviceId = smiley360.services.getDeviceId();

		console.log('Login -> login to Twitter with deviceId: ', deviceId);

		window.location =
	        smiley360.configuration.getServerDomain() +
	        'oauth/Twitter.html?deviceId=' + deviceId;
	},

});