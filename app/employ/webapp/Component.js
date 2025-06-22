sap.ui.define([
    "sap/ui/core/UIComponent",
    "employ/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("employ.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

         init: function() {
      UIComponent.prototype.init.apply(this, arguments);
      
      // Initialize user model
      var oUserModel = new JSONModel({
        isAdmin: false
      });
      this.setModel(oUserModel, "user");

      // Check user role
      var oJwt = sap.ui.getCore().getConfiguration().getXsuaaToken();
      if (oJwt && oJwt.scope.includes("Admin")) {
        oUserModel.setProperty("/isAdmin", true);
      }

      // Initialize router
      this.getRouter().initialize();
    }
    });
});