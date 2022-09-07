sap.ui.define([
    'ats/fin/ar/controller/BaseController',
    'sap/m/MessageBox',
    "sap/ui/core/routing/History",
    'sap/m/MessageToast'
], function(Controller, MessageBox, History, MessageToast) {
    'use strict';
    return Controller.extend("ats.fin.ar.controller.View3",{
        onInit: function(){
            //this.haveSomeReuseFunction();
            //Get The router object from Component
            this.oRouter = this.getOwnerComponent().getRouter();
            //Step 2: I register a Router Matched function which will get called 
            //every time we navigate or reach to the detail Root
            this.oRouter.getRoute("suppl").attachMatched(this.sparta, this);
        },
        sparta: function(oEvent){
            //Step 1: whatever is the end point - extract the fruit id 
            var fruitId = oEvent.getParameter("arguments").supplierId;
            //Step 2: construct the path of the element
            var sPath = '/suppliers/' + fruitId;
            //Step 3: Bind the element to my current view
            this.getView().bindElement(sPath);
        },
        onBack: function(){
            var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.oRouter.navTo("spiderman", {}, true /*no history*/);
			}
        }
    });
});