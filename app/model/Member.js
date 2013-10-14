Ext.define('smiley360.model.Member', {
    extend: 'Ext.data.Model',
    config: {
        identifier: 'sequential',
        fields: [
			{ name: 'id', type: 'int' },
            { name: 'memberId', type: 'string' },
            { name: 'deviceId', type: 'string' },
        ],
        proxy: {
            type: 'localstorage',
            id: 'member'
        }
    	
    }
});