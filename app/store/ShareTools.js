Ext.define('smiley360.store.ShareTools', {
	extend: 'Ext.data.Store',
	config: {
	    model: 'smiley360.model.ShareTool',
	    storeId: 'toolsStore',
		autoLoad: true,
		proxy: {
			type: 'localstorage',
			id: 'toolsProxy'
		}
	}
});