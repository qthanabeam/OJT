sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast"
], function(Controller, MessageToast) {
  "use strict";

  return Controller.extend("ojt.employ.controller.Leave", {
    onInit: function() {
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("leave").attachPatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched: function(oEvent) {
      var sEmployeeId = oEvent.getParameter("arguments").employeeId;
      this.getView().bindElement(`/Employees/${sEmployeeId}`);
    },

    onNavBack: function() {
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("detail");
    },

    onAddLeaveRequest: function() {
      var oModel = this.getView().getModel();
      var sEmployeeId = this.getView().getBindingContext().getProperty("ID");
      oModel.create("/LeaveRequests", {
        employee_ID: sEmployeeId,
        startDate: null,
        endDate: null,
        status: "Pending",
        reason: ""
      }, {
        success: function() {
          MessageToast.show("Leave request created");
        },
        error: function() {
          MessageToast.show("Error creating leave request");
        }
      });
    },

    onApproveRequest: function(oEvent) {
      var oItem = oEvent.getSource().getParent();
      var sPath = oItem.getBindingContext().getPath();
      var oModel = this.getView().getModel();
      oModel.update(sPath, { status: "Approved" }, {
        success: function() {
          MessageToast.show("Leave request approved");
        },
        error: function() {
          MessageToast.show("Error approving leave request");
        }
      });
    }
  });
});