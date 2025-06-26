sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("ojt.employ.controller.App", {
      onInit: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.initialize();

        // Set layout model
        var oLayoutModel = new JSONModel({
          layout: "OneColumn", // Default layout
        });
        this.getView().setModel(oLayoutModel);

        // Handle route matched to change layout
        oRouter.attachRouteMatched(this._onRouteMatched, this);
      },

      _onRouteMatched: function (oEvent) {
        var sRouteName = oEvent.getParameter("name");
        var oLayoutModel = this.getView().getModel();

        if (sRouteName === "list" || sRouteName === "addEmployee") {
          oLayoutModel.setProperty("/layout", "OneColumn");
        } else if (sRouteName === "detail") {
          oLayoutModel.setProperty("/layout", "TwoColumnsMidExpanded");
        } else if (sRouteName === "leave") {
          oLayoutModel.setProperty("/layout", "ThreeColumnsMidExpanded");
        }
      },

      onNavToList: function () {
        this.getOwnerComponent().getRouter().navTo("list");
      },

      onNavToAddEmployee: function () {
        this.getOwnerComponent().getRouter().navTo("addEmployee");
      },
    });
  }
);
