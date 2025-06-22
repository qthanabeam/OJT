sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast"
], function(Controller, JSONModel, MessageToast) {
  "use strict";

  return Controller.extend("ojt.employ.controller.List", {
    onInit: function() {
      // Initialization logic
    },

    onItemPress: function(oEvent) {
      var oItem = oEvent.getSource();
      var oRouter = this.getOwnerComponent().getRouter();
      var sEmployeeId = oItem.getBindingContext().getProperty("ID");
      oRouter.navTo("detail", { employeeId: sEmployeeId });
    },

    onAddEmployee: function() {
      var oModel = this.getView().getModel();
      var oRouter = this.getOwnerComponent().getRouter();
      oModel.create("/Employees", {
        firstName: "",
        lastName: "",
        dateOfBirth: null,
        gender: "",
        email: "",
        hireDate: null,
        salary: 0,
        performanceRating: 1
      }, {
        success: function(oData) {
          MessageToast.show("Employee created");
          oRouter.navTo("detail", { employeeId: oData.ID });
        },
        error: function() {
          MessageToast.show("Error creating employee");
        }
      });
    },

    onDelete: function(oEvent) {
      var oItem = oEvent.getSource().getParent();
      var sPath = oItem.getBindingContext().getPath();
      var oModel = this.getView().getModel();
      oModel.remove(sPath, {
        success: function() {
          MessageToast.show("Employee deleted");
        },
        error: function() {
          MessageToast.show("Error deleting employee");
        }
      });
    }
  });
});