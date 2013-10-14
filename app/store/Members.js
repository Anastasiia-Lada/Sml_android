Ext.define('smiley360.store.Members', {
	extend: 'Ext.data.Store',
	//requires: 'Ext.util.Functions',
	config: {
		model: 'smiley360.model.Member',
		storeId: 'membersStore',
		autoLoad: false,
		proxy: {
			type: 'localstorage',
			id: 'membersProxy'
		},
		listeners: {
			initialize: function () {
			},
			beforeload: function () {
				var curr_Store = Ext.getStore('membersStore');
				var newOnProxyLoad = function (operation) {
					if (operation.success === false) {
						curr_Store.loading = false;
						return false; // cancels execution of origin
					}
					else {
						// success
					}
				};
				curr_Store.onProxyLoad = Ext.Function.createInterceptor(
					curr_Store.onProxyLoad,
					newOnProxyLoad,
					curr_Store // scope
				);

			}
		}
	}
});