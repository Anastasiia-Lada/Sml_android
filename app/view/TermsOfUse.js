Ext.define('smiley360.view.TermsOfUse', {
    extend: 'Ext.Container',
    alias: 'widget.termsofuseview',
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
                //docked: 'top',
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
                    html: 'Terms of Use',
                }],
            }, {
            	xtype: 'container',
            	cls: 'has-shadow',
            	layout: 'hbox',
            	items: [{
            		xtype: 'label',
            		html: 'SMILEY360.COM TERMS OF SERVICE AGREEMENT',
            		cls: 'heading-text active-sign',
            		style: 'padding-left: 15px;',
            		flex: 1
            	}],
            }, {
                xtype: 'container',
                cls: 'popup-middle-panel',
                items: [{
                	xtype: 'container',
                	style: '-webkit-overflow-scrolling: touch ; height: 100%; width: 100%; overflow-y: auto; overflow-x: hidden;',
                	html: '<iframe frameborder="0" scrolling="yes" style="margin-left: 17px;" src="resources/htmls/termsContent_mobile.html" class="popup-survey-iframe"></iframe>'
					}],
            }, {
                xtype: 'panel',
                cls: 'popup-button-panel',
                items: [{
                    xtype: 'button',
                    text: 'CLOSE',
                    id: 'xCloseButton',
                    cls: 'popup-submit-button',
                    listeners: {
                        tap: function () {
                            Ext.getCmp('xView').destroy();
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
});