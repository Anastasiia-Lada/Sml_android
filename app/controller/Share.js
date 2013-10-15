
Ext.define('smiley360.controller.Share',
{
    extend: "Ext.app.Controller",
    views:
	[
	],
    stores:
	[

	],
    models:
	[

	],
    commands:
	{
	    'share.upload': function (command, me)
	    {
	        me.on('ready', function ()
	        {
	           
	        });
	    }
	},
    init: function ()
    {
        this.control(
		{
		    '':
			{
			    'share.command': function (cmdName)
			    {
			        this.commands[cmdName].apply(this, arguments);
			    }
			}
		})
    }
});