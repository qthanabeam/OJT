sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("ojt.employ.controller.App", {
        onInit: function () {
            // Initialize user role model
            var oUserModel = new JSONModel({
                isAdmin: false // Default to Viewer role
            });
            this.getView().setModel(oUserModel, "user");

            // Check user role (assuming XSUAA provides user info)
            this._checkUserRole();

            // Set router
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.initialize();
        },

        _checkUserRole: function () {
            var oUserModel = this.getView().getModel("user");
            var bIsAdmin = false;
            oUserModel.setProperty("/isAdmin", bIsAdmin);
        }
    });
});