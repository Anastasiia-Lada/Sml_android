Ext.define('smiley360.model.ShareTool', {
    extend: 'Ext.data.Model',
    config: {
        identifier: 'sequential',
        fields: [
            { name: 'toolId', type: 'string' }
        ],
        proxy: {
            type: 'localstorage',
            id: 'sharetool'
        }
    }
});