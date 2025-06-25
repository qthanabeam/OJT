sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel"
], function (UIComponent, Device, JSONModel) {
    "use strict";

    return UIComponent.extend("ojt.employ.Component", {
        metadata: {
            manifest: "json",
            interfaces: ["sap.ui.core.IAsyncContentCreation"]
        },

        init: function () {
            // Call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // Initialize the router
            this.getRouter().initialize();

            // Set device model
            var oDeviceModel = new JSONModel(Device);
            oDeviceModel.setDefaultBindingMode("OneWay");
            this.setModel(oDeviceModel, "device");

            // Set user model
            var oUserModel = new JSONModel({
                isAdmin: true // Set to true for testing, change to false for Viewer role
            });
            this.setModel(oUserModel, "user");
           
            this._checkUserRole();
        },

        _checkUserRole: function () {
            var oUserModel = this.getModel("user");
            var bIsAdmin = true; 
            oUserModel.setProperty("/isAdmin", bIsAdmin);
            console.log(oUserModel);
        }
    });
});