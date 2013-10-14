Ext.define('smiley360.view.ShareToFace2Face', {
	extend: 'Ext.Container',
	alias: 'widget.sharetoface2faceview',
	requires: ['Ext.Rating', 'Ext.Anim'],
	config: {
		modal: true,
		centered: true,
		fullscreen: true,
		hideOnMaskTap: true,
		id: 'xView',
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
					tap: function () {
						this.up('#xView').destroy();
					}
				}
			}, {
				xtype: 'panel',
				layout: 'hbox',
				cls: 'popup-top-panel face2face-background',
				items: [{
					xtype: 'label',
					cls: 'popup-title-text',
					html: 'Earn Smiles Sharing on Face2Face',
				}, {
					xtype: 'image',
					docked: 'right',
					cls: 'popup-title-image',
					src: 'resources/images/f2f_share.png',
				}],
			}, {
				xtype: 'panel',
				id: 'xStatusIndicator',
				cls: 'popup-status-indicator',
			}, {
				xtype: 'panel',
				cls: 'popup-middle-panel popup-status-container',
				style: 'padding-bottom: 0px;',
				items: [{
					xtype: 'selectfield',
					id: 'xPeoplesSelector',
					autoSelect: false,
					value: null,
					required: true,
					placeHolder: 'How many people did you talk to?',
					cls: 'popup-input popup-input-selector',
					style: 'font-size: 0.9em',
					listeners: {
						initialize: function () {
							//this.addCls('popup-input-required');
						},
						change: function () {
							var xView = this.up('#xView');
							if (xView) {
								xView.doShareValidation();
							}
						}
					}
				}, {
					xtype: 'textareafield',
					id: 'xReviewText',
					placeHolder: 'Write your review',
					cls: 'popup-input popup-input-text',
					maxRows: 5,
					minLength: 70,
					required: true,
					isFocused: false,
					style: 'font-size: 0.9em',
					listeners: {
						initialize: function () {
							//this.addCls('popup-input-required');
						},
						keyup: function () {
							var postLenght = this.getValue().length;

							var xView = this.up('#xView');
							if (xView) {
								xView.down('#xPostCountLabel').setHtml(postLenght.toString());
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
					xtype: 'rating',
					id: 'xRating',
					label: 'Rate the product:',
					labelWidth: 'auto',
					itemsCount: 5,
					itemCls: 'x-rating-star',
					itemHoverCls: 'x-rating-star-hover',
					style: 'font-size: 0.9em',
					listeners: {
						initialize: function () {
							//this.addCls('x-rating-field-required');
						},
						change: function (rate, value, currentValue) {
							var logMessage = Ext.String.format(
                                'ShareToFace2Face -> Rating changed: { value: {0}, currentValue: {1} }', value, currentValue);

							console.log(logMessage);

							var xView = this.up('#xView');
							if (xView) {
								if (value < 0) {
									this.addCls('x-rating-field-required');
								}
								else {
									this.removeCls('x-rating-field-required');

								};
								xView.doShareValidation();
							}
						}
					}
				}],
			}, {
				xtype: 'panel',
				cls: 'popup-button-panel',
				items: [{
					xtype: 'button',
					id: 'xShareButton',
					text: 'SUBMIT',
					icon: 'resources/images/share-initial.png',
					iconAlign: 'right',
					iconCls: 'popup-post-icon',
					cls: 'popup-post-button',
					disabled: false,
					allowPost: false,
					listeners: {
						tap: function () {
							if (this.config.allowPost)
								this.up('#xView').doShare()
							else {
								this.up('#xView').doShareValidation();
							};

							if (this.up('#xView').down('#xReviewText').getValue().length < 70) {
								this.up('#xView').down('#xPostCountLabel').setStyle('color: red;');
								this.up('#xView').down('#xPostLabel').setStyle('color: red;');
							}

							if (!(this.up('#xView').down('#xPeoplesSelector').getValue() > 0))
								this.up('#xView').down('#xPeoplesSelector').addCls('popup-input-required')
							else this.up('#xView').down('#xPeoplesSelector').removeCls('popup-input-required');

							if (this.up('#xView').down('#xRating').getValue() < 0)
								this.up('#xView').down('#xRating').addCls('x-rating-field-required')
							else this.up('#xView').down('#xRating').removeCls('x-rating-field-required');

							if (this.up('#xView').down('#xReviewText').getValue().length == 0)
								this.up('#xView').down('#xReviewText').addCls('popup-input-required')
							else this.up('#xView').down('#xReviewText').removeCls('popup-input-required');

							
						}
					},
				}],
			}],
		}],
		listeners: {
			initialize: function () {
				smiley360.adjustPopupSize(this);
			},
			painted: function () {
				var stateIdTemp = [];
				for (var i = 1; i < 22; i++) {
					var temp_array = new Array();
					temp_array["text"] = i;
					temp_array["value"] = i;
					stateIdTemp.push(temp_array);
				};
				Ext.getCmp('xPeoplesSelector').setOptions(stateIdTemp, true);
			},
			hide: function () {
				this.destroy();
			}
		},
	},

	doShare: function () {
		var shareView = this;
		var shareData = {
			missionID: shareView.missionId,
			memberID: smiley360.memberData.UserId,
			sharepeople: this.down('#xPeoplesSelector').getValue(),
			rating: this.down('#xRating').getValue(),
			desc: this.down('#xReviewText').getValue(),
		};

		smiley360.setViewStatus(shareView, smiley360.viewStatus.progress);
		smiley360.services.postToFace2face(shareData, function (response) {
			smiley360.setResponseStatus(shareView, response, '', shareView.config.btn_from, shareView.missionId);
		});
	},

	doShareValidation: function () {
		if (this.down('#xPeoplesSelector').getValue() > 0 &&
            this.down('#xRating').getValue() > -1 &&
            this.down('#xReviewText').getValue().length >= 70) {
			this.down('#xShareButton').config.allowPost = true;
		}
		else {
			this.down('#xShareButton').config.allowPost = false;
		}
		if (this.down('#xReviewText').getValue().length >= 70) {
			this.down('#xPostCountLabel').setStyle('color: #878789;');
			this.down('#xPostLabel').setStyle('color: #878789;');
		}
	},

	setMissionId: function (missionId) {
		this.missionId = missionId;
	},

	missionId: undefined,
});