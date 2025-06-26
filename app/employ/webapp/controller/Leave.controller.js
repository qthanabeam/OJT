sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (Controller, MessageToast, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("ojt.employ.controller.Leave", {
      onInit: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter
          .getRoute("leave")
          .attachPatternMatched(this._onRouteMatched, this);

        // Initialize new leave request model
        var oNewLeaveModel = new JSONModel({
          startDate: null,
          endDate: null,
          reason: "",
        });
        this.getView().setModel(oNewLeaveModel, "newLeave");
      },

      _onRouteMatched: function (oEvent) {
        var sEmployeeId = oEvent.getParameter("arguments").employeeId;
        this.getView().bindElement("/Employees(" + sEmployeeId + ")");

        // Filter leave requests for this employee
        var oTable = this.byId("leaveTable");
        var oBinding = oTable.getBinding("items");

        if (oBinding) {
          var oFilter = new Filter(
            "employee_ID",
            FilterOperator.EQ,
            sEmployeeId
          );
          oBinding.filter([oFilter]);
        }
      },

      onNavBack: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        var oContext = this.getView().getBindingContext();

        if (oContext) {
          var sEmployeeId = oContext.getProperty("ID");
          oRouter.navTo("detail", { employeeId: sEmployeeId });
        } else {
          oRouter.navTo("list");
        }
      },

      onAddLeaveRequest: function () {
        var oModel = this.getView().getModel();
        var oNewLeaveModel = this.getView().getModel("newLeave");
        var oContext = this.getView().getBindingContext();

        if (!oContext) {
          MessageToast.show("Không thể xác định nhân viên");
          return;
        }

        var sEmployeeId = oContext.getProperty("ID");
        var oNewLeave = oNewLeaveModel.getData();

        if (!oNewLeave.startDate || !oNewLeave.endDate) {
          MessageToast.show("Vui lòng điền đầy đủ ngày bắt đầu và kết thúc");
          return;
        }

        // Create new leave request using OData V4
        var oListBinding = oModel.bindList("/LeaveRequests");
        var oNewContext = oListBinding.create({
          employee_ID: sEmployeeId,
          startDate: oNewLeave.startDate,
          endDate: oNewLeave.endDate,
          status: "Pending",
          reason: oNewLeave.reason || "",
        });

        oNewContext
          .created()
          .then(function () {
            MessageToast.show("Yêu cầu nghỉ phép đã được tạo");
            oNewLeaveModel.setData({
              startDate: null,
              endDate: null,
              reason: "",
            });
          })
          .catch(function (oError) {
            MessageToast.show(
              "Lỗi khi tạo yêu cầu nghỉ phép: " +
                (oError.message || "Unknown error")
            );
          });
      },

      onApproveRequest: function (oEvent) {
        var oItem = oEvent.getSource().getParent().getParent();
        var oContext = oItem.getBindingContext();

        if (!oContext) {
          MessageToast.show("Không thể xác định yêu cầu nghỉ phép");
          return;
        }

        // Update status using OData V4
        oContext.setProperty("status", "Approved");

        oContext
          .getModel()
          .submitBatch("$auto")
          .then(function () {
            MessageToast.show("Yêu cầu nghỉ phép đã được phê duyệt");
          })
          .catch(function (oError) {
            MessageToast.show(
              "Lỗi khi phê duyệt yêu cầu nghỉ phép: " +
                (oError.message || "Unknown error")
            );
          });
      },

      onRejectRequest: function (oEvent) {
        var oItem = oEvent.getSource().getParent().getParent();
        var oContext = oItem.getBindingContext();

        if (!oContext) {
          MessageToast.show("Không thể xác định yêu cầu nghỉ phép");
          return;
        }

        // Update status using OData V4
        oContext.setProperty("status", "Rejected");

        oContext
          .getModel()
          .submitBatch("$auto")
          .then(function () {
            MessageToast.show("Yêu cầu nghỉ phép đã bị từ chối");
          })
          .catch(function (oError) {
            MessageToast.show(
              "Lỗi khi từ chối yêu cầu nghỉ phép: " +
                (oError.message || "Unknown error")
            );
          });
      },
    });
  }
);
