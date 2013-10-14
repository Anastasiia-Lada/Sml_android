Ext.define('smiley360.view.ShareToFacebook', {
	extend: 'Ext.Container',
	alias: 'widget.sharetofacebookview',
	requires: [
        'Ext.Rating',
        'Ext.Anim'],
	config: {
		modal: true,
		centered: true,
		fullscreen: true,
		hideOnMaskTap: true,
		id: 'xView',
		btn_from: {},
		scrollable: 'vertical',
		cls: 'popup-panel connect-popup-panel',
		items: [{
			xtype: 'panel',
			id: 'xRootPanel',
			cls: 'popup-root-panel',
			items: [{
				xtype: 'image',
				docked: 'top',
				cls: 'popup-close-button',
				listeners: {
					tap: function () {
						this.up('#xView').destroy();
					}
				}
			}, {
				xtype: 'panel',
				layout: 'hbox',
				cls: 'popup-top-panel facebook-background',
				items: [{
					xtype: 'label',
					id: 'xTitleLabel',
					cls: 'popup-title-text',
					html: 'Earn {0} Smiles Sharing on Facebook',
				}, {
					xtype: 'image',
					docked: 'right',
					cls: 'popup-title-image',
					src: 'resources/images/share_all.png',
				}],
			}, {
				xtype: 'panel',
				id: 'xStatusIndicator',
				cls: 'popup-status-indicator',
			}, {
				xtype: 'panel',
				cls: 'popup-middle-panel popup-status-container',
				items: [{
					xtype: 'rating',
					id: 'xRating',
					label: 'Rate the product:',
					labelWidth: 'auto',
					itemsCount: 5,
					itemCls: 'x-rating-star',
					itemHoverCls: 'x-rating-star-hover',
					listeners: {
						initialize: function () {
							//this.addCls('x-rating-field-required');
						},
						change: function (rate, value, currentValue) {
							var logMessage = Ext.String.format(
                                'ShareToFacebook -> Rating changed: { value: {0}, currentValue: {1} }', value, currentValue);

							console.log(logMessage);

							var xView = this.up('#xView');
							if (xView) {
								if (value < 0) {
									this.addCls('x-rating-field-required');
								}
								else {
									this.removeCls('x-rating-field-required');
								}

								xView.doShareValidation();
							}
						}
					}
				}, {
					xtype: 'panel',
					layout: 'hbox',
					items: [{
						xtype: 'label',
						id: 'xPostLabel',
						cls: 'popup-post-bottom-text',
						style: 'color: #878789;',
						html: 'Post must contain at least 70 characters.',
					}, {
						xtype: 'label',
						id: 'xPostCountLabel',
						docked: 'right',
						cls: 'popup-post-bottom-text',
						html: '0',
					}],
				}, {
					xtype: 'textareafield',
					id: 'xPostText',
					cls: 'popup-input popup-input-text',
					style: 'font-size: 0.9em;',
					maxRows: 5,
					minLength: 70,
					isFocused: false,
					listeners: {
						keyup: function () {
							var postLenght = this.getValue().length;

							var xView = this.up('#xView');
							if (xView) {
								xView.down('#xPostCountLabel').setHtml(postLenght.toString());
								xView.doShareValidation();
							}
						}
					}
				}],
			}, {
				xtype: 'panel',
				cls: 'popup-bottom-panel',
				items: [{
					xtype: 'panel',
					layout: 'hbox',
					defaults: {
						width: '100%',
						labelAlign: 'right',
						labelWidth: '100%',
					},
					items: [{
						xtype: 'checkboxfield',
						id: 'xToProfileCheckbox',
						label: 'Post to Profile Wall',
						labelCls: 'popup-checkbox-grey-label',
						cls: 'popup-checkbox',
						hidden: true,
						width: '50%',
						listeners: {
							check: function () {
								this.up('#xView').doShareValidation();
								this.setLabelCls('popup-checkbox-grey-label');
								Ext.getCmp('xToBrandPageCheckbox').setLabelCls('popup-checkbox-grey-label');
							},
							uncheck: function () {
								if (Ext.getCmp('xToBrandPageCheckbox').getChecked() == false) {
									this.setLabelCls('popup-checkbox-red-label');
									Ext.getCmp('xToBrandPageCheckbox').setLabelCls('popup-checkbox-red-label');
								};
								this.up('#xView').doShareValidation();
							}
						}
					}, {
						xtype: 'checkboxfield',
						id: 'xToBrandPageCheckbox',
						label: 'Post to Brand Page',
						labelCls: 'popup-checkbox-grey-label',
						cls: 'popup-checkbox',
						hidden: true,
						width: '50%',
						listeners: {
							check: function () {
								this.up('#xView').doShareValidation();
								this.setLabelCls('popup-checkbox-grey-label');
								Ext.getCmp('xToProfileCheckbox').setLabelCls('popup-checkbox-grey-label');
							},
							uncheck: function () {
								if (Ext.getCmp('xToProfileCheckbox').getChecked() == false) {
									this.setLabelCls('popup-checkbox-red-label');
									Ext.getCmp('xToProfileCheckbox').setLabelCls('popup-checkbox-red-label');
								};
								this.up('#xView').doShareValidation();
							}
						}
					}],
				}, {
					xtype: 'label',
					cls: 'popup-post-comment',
					html: 'The following text will automatically be added to your post:',
				}, {
					xtype: 'label',
					id: 'xSeedPhrase',
					cls: 'popup-post-comment-text',
					html: 'Try Campbell\'s Slow Kettle Style Soups and be sure to use this $1.00 off coupon! http://bit.ly/YxVW1D',
				}],
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
					allowPost: false,
					disabled: false,
					listeners: {

						tap: function () {
							if (this.config.allowPost)
								this.up('#xView').doShare()
							else {
								this.up('#xView').doShareValidation();

								if (this.up('#xView').down('#xPostText').getValue().length < 70) {
									this.up('#xView').down('#xPostCountLabel').setStyle('color: red;');
									this.up('#xView').down('#xPostLabel').setStyle('color: red;');
								}

								if (this.up('#xView').down('#xRating').getValue() < 0)
									this.up('#xView').down('#xRating').addCls('x-rating-field-required');

								if (!this.up('#xView').down('#xToProfileCheckbox').getChecked() &&
									!this.up('#xView').down('#xToBrandPageCheckbox').getChecked()) {

									this.up('#xView').down('#xToProfileCheckbox').setLabelCls('popup-checkbox-red-label');
									this.up('#xView').down('#xToBrandPageCheckbox').setLabelCls('popup-checkbox-red-label');
								};

								if (this.config.allowPost)
									this.up('#xView').doShare();
							}
						}
					},
				}],
			}],
		}],
		listeners: {
			initialize: function () {
				smiley360.adjustPopupSize(this);
			},
			hide: function () {
				this.destroy();
			}
		},
	},

	doShare: function () {
		var shareView = this;
		var shareOptions = [];

		if (this.down('#xToProfileCheckbox').getChecked() == true) {
			shareOptions.push(1);
		}

		if (this.down('#xToBrandPageCheckbox').getChecked() == true) {
			shareOptions.push(2);
		}
		if (this.down('#xToProfileCheckbox').isHidden() == true) {
			shareOptions.push(1);
		}

		var shareData = {
			missionID: shareView.missionId,
			memberID: smiley360.memberData.UserId,
			rating: this.down('#xRating').getValue(),
			text: this.down('#xPostText').getValue(),
			postOptionIDs: shareOptions,
			imageID: ''
		};


		//query fb does member have permissions
		if (smiley360.permissionsList.publish_stream) {
			smiley360.setViewStatus(shareView, smiley360.viewStatus.progress);
			smiley360.services.postToFacebook(shareData, function (response) {
				smiley360.setResponseStatus(shareView, response, '', shareView.config.btn_from, shareView.missionId);
			});
		}
		else {
			//ask for publish stream permissions

			var shareView = Ext.widget('connectpopupview').show();
			if (shareView.setToolName)
				shareView.setToolName('Facebook');

			//this.onFacebookSignin_forToken();
		}
	},

	doShareValidation: function () {
		if (this.down('#xRating').getValue() > -1 &&
            this.down('#xPostText').getValue().length >= 70 && (
            this.down('#xToProfileCheckbox').getChecked() == true ||
            this.down('#xToBrandPageCheckbox').getChecked() == true ||
			this.down('#xToProfileCheckbox').isHidden() == true)) {
			this.down('#xShareButton').config.allowPost = true;
			//this.down('#xShareButton').enable();
		}
		else {
			this.down('#xShareButton').config.allowPost = false;
			//this.down('#xShareButton').disable();
		}
		if (this.down('#xPostText').getValue().length >= 70) {
			this.down('#xPostCountLabel').setStyle('color: #878789;');
			this.down('#xPostLabel').setStyle('color: #878789;');
		}
	},

	setEarnSmiles: function (smiles) {
		var xTitleLabel = this.down('#xTitleLabel');

		xTitleLabel.setHtml(Ext.String.format(
            xTitleLabel.getHtml(), smiles));
	},

	setMissionId: function (missionId) {
		this.missionId = missionId;
	},
	setSeedPhrase: function (seedPhrase) {
		Ext.getCmp('xSeedPhrase').setHtml(seedPhrase);
	},

	missionId: undefined,

	onFacebookSignin_forToken: function () {
		var deviceId = smiley360.services.getDeviceId();

		console.log('Login -> login to Facebook to store token with deviceId: ', deviceId);

		window.location =
            smiley360.configuration.getServerDomain() +
            'oauth/Facebook.html?deviceId=' + deviceId + '&scope=offline_access,email,read_stream,publish_stream';
	},
});