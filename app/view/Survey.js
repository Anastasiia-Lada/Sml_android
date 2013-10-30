Ext.define('smiley360.view.Survey', {
	extend: 'Ext.Panel',
	alias: 'widget.surveyview',
	config: {
		title: 'Take This Survey',
		layout: 'fit',
		items: [{
			xtype: 'panel',
			scrollable: 'vertical',
			cls: 'popup-survey-innerpanel',
			style: '-webkit-overflow-scrolling: touch ; height: 100% ; overflow: auto;',
			items: [{
				xtype: 'panel',
				margin: '0px -16px 0px 0px',
				style: '-webkit-overflow-scrolling: touch ; height: 100%; overflow: auto;',
				html: '<iframe id="xSurveyFrame" frameborder="0" scrolling="yes" class="popup-survey-iframe-new"></iframe>',
			}],
			listeners: {
				painted: function () {
					window.addEventListener("message", function (evt) {
						if (evt.data)
							if (evt.data == "offersview") {
								smiley360.fromRemove = true;
								Ext.getCmp('xOfferView').fireEvent('getOffersCommand', this, smiley360.memberData.UserId);
							}
							else {
								Ext.getCmp('xMainView').showExternalView(evt.data);
							}

					}, true);
				}
			}
		}]
	}
});