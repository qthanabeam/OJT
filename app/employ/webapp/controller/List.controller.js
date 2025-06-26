// /home/user/projects/ojt_employ/app/employ/webapp/controller/List.controller.js
sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
  ],
  function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("ojt.employ.controller.List", {
      onInit: function () {
        var oModel = this.getOwnerComponent().getModel();
        if (!oModel) {
          MessageToast.show("OData model not initialized");
          return;
        }
        this.getView().setModel(oModel);
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter
          .getRoute("list")
          .attachPatternMatched(this._onRouteMatched, this);
      },

      _onRouteMatched: function () {
        var oList = this.byId("employeeTable");
        var oBinding = oList.getBinding("items");
        if (oBinding) {
          oBinding.refresh(); // Xóa tham số `true`
        }
      },

      onItemPress: function (oEvent) {
        var oItem = oEvent.getSource();
        var oRouter = this.getOwnerComponent().getRouter();
        var sEmployeeId = oItem.getBindingContext().getProperty("ID");
        oRouter.navTo("detail", { employeeId: sEmployeeId });
      },

      onNavToAddEmployee: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("addEmployee");
      },

      onDelete: function (oEvent) {
        var oItem = oEvent.getSource().getParent();
        var oContext = oItem.getBindingContext();
        var oModel = this.getView().getModel();

        if (!oContext) {
          MessageToast.show("Không thể xác định nhân viên cần xóa");
          return;
        }

        oContext
          .delete("$auto")
          .then(function () {
            MessageToast.show("Nhân viên đã bị xóa");
            oModel.refresh(); // Làm mới model sau khi xóa
          })
          .catch(function (oError) {
            MessageToast.show(
              "Lỗi khi xóa nhân viên: " + (oError.message || "Unknown error")
            );
          });
      },
    });
  }
);
