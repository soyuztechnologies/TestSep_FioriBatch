/* eslint-disable no-undef */
sap.ui.define([
    'ats/fin/ar/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment',
    'sap/m/DisplayListItem',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function(Controller, MessageBox, MessageToast, Fragment, DisplayListItem, Filter, FilterOperator) {
    'use strict';
    return Controller.extend("ats.fin.ar.controller.View2",{
        onInit: function(){
            //this.haveSomeReuseFunction();
            //Get The router object from Component
            this.oRouter = this.getOwnerComponent().getRouter();
            //Step 2: I register a Router Matched function which will get called 
            //every time we navigate or reach to the detail Root
            this.oRouter.getRoute("superman").attachMatched(this.sparta, this);
        },
        sparta: function(oEvent){
            //Step 1: whatever is the end point - extract the fruit id 
            var fruitId = oEvent.getParameter("arguments").fruitId;
            //Step 2: construct the path of the element
            var sPath = '/' + fruitId;
            //Step 3: Bind the element to my current view
            this.getView().bindElement(sPath,{
                expand: 'To_Supplier'
            });

            //Get the object of the image
            var oImage = this.getView().byId("idImg");
            //Get service path from manifest json
            var sServicePath = this.getOwnerComponent().getManifestEntry("sap.app").dataSources.anubhavService.uri;
            //Construct the address of the image /$value
            var sProdId = fruitId.split("'")[1];
            sServicePath = sServicePath + "ProductImgSet('" + sProdId + "')/$value"
            //Bind the same to image control
            oImage.setSrc(sServicePath);
        },
        //This global object of supplier popup will act like a remote control
        oSupplierPopup: null,
        onFilterSupplier: function(){
            var that = this;
            if(!this.oSupplierPopup){
                Fragment.load({
                    fragmentName: "ats.fin.ar.fragments.popup",
                    type:"XML",
                    id:"supplier",
                    controller: this
                }).then(function(oFragment){
                    //inside the callback/promise, we cannot access this pointer viz. our controller object
                    //but we can access local variables of caller function
                    that.oSupplierPopup = oFragment;
                    that.oSupplierPopup.setTitle("Suppliers");
                    //Grant the access of all resources which view also has access to - model
                    //allowing parasite (fragment) to access body part (model) though immune system (view)
                    that.getView().addDependent(that.oSupplierPopup);
                    //Here the oSupplierPopup is the remote control of the fragment
                    that.oSupplierPopup.bindAggregation("items",{
                        path: '/suppliers',
                        template: new DisplayListItem({
                            label: '{name}',
                            value: '{city}'
                        })
                    });
                    that.oSupplierPopup.open();
                });
            }else{
                this.oSupplierPopup.open();
            }
            //MessageBox.confirm("This functionality is under construction 🤣😊");
            
        },
        onConfim: function(oEvent){
            
            //We need to read ID of the fragment because of that this confirm event triggred
            var sId = oEvent.getSource().getId();
            if(sId.indexOf("city") != -1){
                //Step 1: Get the selected item data
                var oSelItem = oEvent.getParameter("selectedItem");
                //Step 2: Get The data of selecte item
                var sData = oSelItem.getLabel();
                //Step 3: The object of the input field - set data
                this.oField.setValue(sData);
            }else{
                //DO nothing for now 😁
                var aSelItems = oEvent.getParameter("selectedItems");
                var aFilter = [];
                //Construct the filter object
                for (let i = 0; i < aSelItems.length; i++) {
                    const element = aSelItems[i];
                    aFilter.push(new Filter("name", FilterOperator.EQ, element.getLabel()));
                }
                //Inject the filter to the table with OR
                var oFilter = new Filter({
                    filters: aFilter,
                    and: false
                });
                var oTable = this.getView().byId("idTabSupp");
                oTable.getBinding("items").filter(oFilter);

            }
            
        },
        oCitypopup:null,
        oField: null,
        onSearchPopup: function(oEvent){
            //Step 1: What user type in search field
            var sValueToBeSearched = oEvent.getParameter("value");
            //Step 2: Prepare a filter for search
            var oFilter = new Filter("name", FilterOperator.Contains, sValueToBeSearched);
            //Step 3: Inject filter
            var oPopup = oEvent.getSource();
            oPopup.getBinding("items").filter(oFilter);
        },
        onF4Help: function(oEvent){
            //EXercise: Create a global object for citi popup and 
            //          build fragment object with cities title as another popup
            this.oField = oEvent.getSource();
            var that = this;
            if(!this.oCitypopup){
                Fragment.load({
                    fragmentName: 'ats.fin.ar.fragments.popup',
                    type: 'XML',
                    id: 'city',
                    controller: this
                }).then(function(oFragment){
                    that.oCitypopup = oFragment;
                    that.getView().addDependent(that.oCitypopup);
                    that.oCitypopup.setTitle("Cities");
                    that.oCitypopup.setMultiSelect(false);
                    that.oCitypopup.bindAggregation("items",{
                        path: '/cities',
                        template: new DisplayListItem({
                            label: '{name}',
                            value: '{famousFor}'
                        })
                    });
                    that.oCitypopup.open();
                });
            }else{
                that.oCitypopup.open();
            }
            //MessageBox.confirm("This functionality is under construction 🤣😊");
            
        },
        onSupplierSelect: function(oEvent){
            debugger;
            //Step 1: Get the selected item object from the table
            var oSelectedItem = oEvent.getParameter("listItem");
            //Step 2: Get the path of selected item (memory address)
            var sPath = oSelectedItem.getBindingContextPath();
            //Extract index
            var sIndex = sPath.split("/")[sPath.split("/").length - 1];
            //Step 3: Drill Down to next screen by passing the index of supplier data
            this.oRouter.navTo("suppl",{
                supplierId : sIndex
            });
        },
        onBack: function(){
            this.getView().getParent().to("idV1");
        },
        onSave: function(){
            var oResource = this.getView().getModel('i18n');
            var oResourceBundle = oResource.getResourceBundle();
            MessageBox.confirm("Do you want to save?",{
                onClose: function(status){
                    if(status === "OK"){
                        var sMsgText = oResourceBundle.getText("XMSG_SUCCESS",["999999"]);
                        MessageToast.show(sMsgText);
                    }else{
                        MessageBox.error("Oops!! something was wrong with us 😒");
                    }
                }
            });
        }
    });
});