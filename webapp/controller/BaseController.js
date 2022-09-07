sap.ui.define([
    'sap/ui/core/mvc/Controller'
], function(Controller) {
    'use strict';
    return Controller.extend("ats.fin.ar.controller.BaseController",{
        x: "Anubhav",
        pi : 3.14,
        haveSomeReuseFunction: function(){
            alert("Wallah!");
        }
    });
});