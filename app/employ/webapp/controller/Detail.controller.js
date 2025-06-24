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
      var sPath = "/Employees(" + sEmployeeId + ")";
      this.getView().bindElement({
        path: sPath,
        parameters: {
          $expand: "role,department"
        }
      });
    },

    onNavBack: function() {
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("list");
    },

    onCalculateSalary: function() {
      var oModel = this.getView().getModel();
      var sEmployeeId = this.getView().getBindingContext().getProperty("ID");
      
      // Call the calculateSalary function
      var sPath = "/calculateSalary(employeeID=" + sEmployeeId + ")";
      oModel.callFunction(sPath, {
        method: "POST",
        success: function(oData) {
          MessageToast.show("Lương đã được tính: $" + oData.value);
          // Refresh the binding to show updated salary
          this.getView().getBindingContext().refresh();
        }.bind(this),
        error: function(oError) {
          MessageToast.show("Lỗi khi tính lương: " + oError.message);
        }
      });
    },

    onSave: function() {
      var oModel = this.getView().getModel();
      var oContext = this.getView().getBindingContext();
      
      // Get values from form
      var oRoleComboBox = this.byId("_IDGenComboBox");
      var oDeptComboBox = this.byId("_IDGenComboBox1");
      
      var sSelectedRoleKey = oRoleComboBox.getSelectedKey();
      var sSelectedDeptKey = oDeptComboBox.getSelectedKey();
      
      if (sSelectedRoleKey) {
        oContext.setProperty("role_ID", sSelectedRoleKey);
      }
      if (sSelectedDeptKey) {
        oContext.setProperty("department_ID", sSelectedDeptKey);
      }

      oModel.submitChanges({
        success: function() {
          MessageToast.show("Nhân viên đã được lưu");
        },
        error: function(oError) {
          MessageToast.show("Lỗi khi lưu nhân viên: " + oError.message);
        }
      });
    },

    onDelete: function() {
      var oModel = this.getView().getModel();
      var sPath = this.getView().getBindingContext().getPath();
      oModel.remove(sPath, {
        success: function() {
          MessageToast.show("Nhân viên đã bị xóa");
          this.getOwnerComponent().getRouter().navTo("list");
        }.bind(this),
        error: function(oError) {
          MessageToast.show("Lỗi khi xóa nhân viên: " + oError.message);
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