sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast"
], function(Controller, MessageToast) {
  "use strict";

  return Controller.extend("ojt.employ.controller.Detail", {
    onInit: function() {
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("detail").attachPatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched: function(oEvent) {
      var sEmployeeId = oEvent.getParameter("arguments").employeeId;
      this.getView().bindElement(`/Employees/${sEmployeeId}`);
    },

    onNavBack: function() {
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("list");
    },

    onCalculateSalary: function() {
      var oModel = this.getView().getModel();
      var sEmployeeId = this.getView().getBindingContext().getProperty("ID");
      oModel.callFunction("/calculateSalary", {
        method: "POST",
        urlParameters: { employeeID: sEmployeeId },
        success: function(oData) {
          MessageToast.show("Salary calculated: $" + oData.value);
        },
        error: function() {
          MessageToast.show("Error calculating salary");
        }
      });
    },

    onSave: function() {
      var oModel = this.getView().getModel();
      oModel.submitChanges({
        success: function() {
          MessageToast.show("Employee saved");
        },
        error: function() {
          MessageToast.show("Error saving employee");
        }
      });
    },

    onDelete: function() {
      var oModel = this.getView().getModel();
      var sPath = this.getView().getBindingContext().getPath();
      oModel.remove(sPath, {
        success: function() {
          MessageToast.show("Employee deleted");
          this.getOwnerComponent().getRouter().navTo("list");
        }.bind(this),
        error: function() {
          MessageToast.show("Error deleting employee");
        }
      });
    },

    onManageLeaves: function() {
      var sEmployeeId = this.getView().getBindingContext().getProperty("ID");
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("leave", { employeeId: sEmployeeId });
    }
  });
});