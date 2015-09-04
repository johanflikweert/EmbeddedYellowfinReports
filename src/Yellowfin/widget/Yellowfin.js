/*jslint white: true, nomen: true, plusplus: true */
/*global mx, mxui, mendix, dojo, require, console, define, module */

require([
	'dojo/_base/declare', 'mxui/widget/_WidgetBase',
	'mxui/dom', 'dojo/dom-style', 'dojo/dom-attr', 'dojo/html'
], function (declare, _WidgetBase, dom, domStyle, domAttr, html) {
	
	'use strict';

	// Declare widget.
	return declare('Yellowfin.widget.Yellowfin', [_WidgetBase, mendix.addon._Contextable], {
	// Here we receive the context and use it to retrieve our object. We also subscribe to any commits of the object elsewhere.
	applyContext : function(context, callback){
		if (context) {
			mx.processor.getObject(context.getActiveGUID(), dojo.hitch(this, function(object) {
				if (object !== null) {
					this.contextObject = context;
					this.Account = object;
					mx.processor.subscribeToGUID(this, object.getGUID());
					this.setIntervals();												
				}
			}));
		}
		//else
        //{
			//logger.warn(this.id + ".applyContext received empty context");
        //}
		callback();
	},

    constructor: function () {
		},
		
		// dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
		postCreate: function () {
		this.initContext();
//		this.actRendered();
			console.log(this.id + '.postCreate');

			domStyle.set(this.domNode, {
				'height': this.Height,
				'width': this.Width,
				'outline': 0
			});

			domAttr.set(this.domNode, 'style', this.style); //might override height and width
			
			var pass = ''; //this.Account.getAttribute(this.YellowfinPassword);
			var user = ''; //this.Account.getAttribute(this.YellowfinUsername);
			
			switch (this.contenttype) {
				case 'Report': //+"&username="+user+"&password="+pass
					var YellowFinScript = mxui.dom.script({"src" : this.BaseUrl+"JsAPI?cmd=loadreport&height="+this.Height+"&width="+this.Width+"&reportUUID="+this.ObjectId, id : "YellowFinScript"});
					//html.set(this.domNode,"<iframe src=\"http://localhost:8080/RunReport.i4?reportUUID=9a31442d-d8a6-4aad-ad11-d342db606b64\"></iframe>");
					html.set(this.domNode, "<div id=\"yfReportContainer"+this.ObjectId+"\"></div>");
					break;
				case 'Dashboard': //+"&username="+user+"&password="+pass
					var YellowFinScript = mxui.dom.script({"src" : this.BaseUrl+"JsAPI?cmd=loaddash&height="+this.Height+"&width="+this.Width+"&dashUUID="+this.ObjectId, id : "YellowFinScript"});
					html.set(this.domNode, "<div id=\"yfDashContainer"+this.ObjectId+"\"></div>");
					break;
			}
					
			this.domNode.appendChild(YellowFinScript);
		
		}
	});
});


