sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("ojt.employ.controller.Leave", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("leave").attachPatternMatched(this._onRouteMatched, this);

            // Initialize new leave request model
            var oNewLeaveModel = new JSONModel({
                startDate: null,
                endDate: null,
                reason: ""
            });
            this.getView().setModel(oNewLeaveModel, "newLeave");
        },

        _onRouteMatched: function (oEvent) {
            var sEmployeeId = oEvent.getParameter("arguments").employeeId;
            this.getView().bindElement(`/Employees/${sEmployeeId}`);
            // Filter leave requests for this employee
            var oTable = this.byId("leaveTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(new sap.ui.model.Filter("employee_ID", "EQ", sEmployeeId));
        },

        onNavBack: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            var sEmployeeId = this.getView().getBindingContext().getProperty("ID");
            oRouter.navTo("detail", { employeeId: sEmployeeId });
        },

        onAddLeaveRequest: function () {
            var oModel = this.getView().getModel();
            var oNewLeaveModel = this.getView().getModel("newLeave");
            var sEmployeeId = this.getView().getBindingContext().getProperty("ID");
            var oNewLeave = oNewLeaveModel.getData();

            if (!oNewLeave.startDate || !oNewLeave.endDate) {
                MessageToast.show("Please fill in start and end dates");
                return;
            }

            oModel.create("/LeaveRequests", {
                employee_ID: sEmployeeId,
                startDate: oNewLeave.startDate,
                endDate: oNewLeave.endDate,
                status: "Pending",
                reason: oNewLeave.reason
            }, {
                success: function () {
                    MessageToast.show("Yêu cầu nghỉ phép đã được tạo");
                    oNewLeaveModel.setData({ startDate: null, endDate: null, reason: "" });
                },
                error: function () {
                    MessageToast.show("Lỗi khi tạo yêu cầu nghỉ phép");
                }
            });
        },

        onApproveRequest: function (oEvent) {
            var oItem = oEvent.getSource().getParent().getParent();
            var sPath = oItem.getBindingContext().getPath();
            var oModel = this.getView().getModel();
            oModel.update(sPath, { status: "Approved" }, {
                success: function () {
                    MessageToast.show("Yêu cầu nghỉ phép đã được phê duyệt");
                },
                error: function () {
                    MessageToast.show("Lỗi khi phê duyệt yêu cầu nghỉ phép");
                }
            });
        },

        onRejectRequest: function (oEvent) {
            var oItem = oEvent.getSource().getParent().getParent();
            var sPath = oItem.getBindingContext().getPath();
            var oModel = this.getView().getModel();
            oModel.update(sPath, { status: "Rejected" }, {
                success: function () {
                    MessageToast.show("Yêu cầu nghỉ phép đã bị từ chối");
                },
                error: function () {
                    MessageToast.show("Lỗi khi từ chối yêu cầu nghỉ phép");
                }
            });
        }
    });
});