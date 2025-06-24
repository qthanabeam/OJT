sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("ojt.employ.controller.List", {
        onInit: function () {
            // Ensure OData model is loaded
            var oModel = this.getOwnerComponent().getModel();
            if (!oModel) {
                MessageToast.show("OData model not initialized");
                return;
            }
            this.getView().setModel(oModel);
        },

        onItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oRouter = this.getOwnerComponent().getRouter();
            var sEmployeeId = oItem.getBindingContext().getProperty("ID");
            oRouter.navTo("detail", { employeeId: sEmployeeId });
        },

        onAddEmployee: function () {
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
                success: function (oData) {
                    MessageToast.show("Nhân viên đã được tạo");
                    oRouter.navTo("detail", { employeeId: oData.ID });
                },
                error: function (oError) {
                    MessageToast.show("Lỗi khi tạo nhân viên: " + oError.message);
                }
            });
        },

        onDelete: function (oEvent) {
            var oItem = oEvent.getSource().getParent();
            var sPath = oItem.getBindingContext().getPath();
            var oModel = this.getView().getModel();
            oModel.remove(sPath, {
                success: function () {
                    MessageToast.show("Nhân viên đã bị xóa");
                },
                error: function (oError) {
                    MessageToast.show("Lỗi khi xóa nhân viên: " + oError.message);
                }
            });
        }
    });
});