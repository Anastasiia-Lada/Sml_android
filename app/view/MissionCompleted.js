Ext.define('smiley360.view.MissionCompleted', {
    extend: 'Ext.Container',
    alias: 'widget.missioncomletedview',
    config: {
        modal: true,
        centered: true,
        fullscreen: true,
        hideOnMaskTap: true,
        id: 'xView',
        scrollable: 'vertical',
        cls: 'popup-panel',
        items: [{
            xtype: 'panel',
            id: 'xRootPanel',
            cls: 'popup-root-panel',
            items: [{
                xtype: 'image',
                cls: 'popup-close-button',
                listeners: {
                    tap: function () {
                        Ext.getCmp('xView').destroy();
                    }
                }
            }, {
                xtype: 'panel',
                layout: 'hbox',
                cls: 'popup-top-panel forgetpwd-background',
                items: [{
                    xtype: 'label',
                    cls: 'popup-title-text',
                    html: 'You\'ve completed this mission!',
                }, {
                    xtype: 'image',
                    docked: 'right',
                    id: 'xTitleImage',
                    cls: 'popup-title-image',
                    src: 'resources/images/smile-successful.png',
                }],
            }, {
                xtype: 'panel',
                cls: 'popup-bottom-panel',
                items: [{
                    xtype: 'label',
                    id: 'xMessageText',
                    cls: 'popup-message-text',
                    //style: 'margin: 10px;',
                    html: 'You\'ve earned all the Smiles for the {0} mission. Way to go! Don\'t worry, you can still keep sharing about your experience with the sharing tools.',
                }],
            }, {
                xtype: 'panel',
                cls: 'popup-button-panel',
                items: [{
                    xtype: 'button',
                    text: 'Continue Sharing!',
                    id: 'xSubmitButton',
                    cls: 'popup-submit-button',
                    listeners: {
                        tap: function () {
                        	this.up('#xView').destroy();//Ext.getCmp('xView').doRemoveOffer();
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
    setMissionName: function(name) {
    	var xMessageText = this.down('#xMessageText');

    	xMessageText.setHtml(Ext.String.format(
            xMessageText.getHtml(), name));
    }
});