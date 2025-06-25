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
        // Ensure OData model is loaded
        var oModel = this.getOwnerComponent().getModel();
        if (!oModel) {
          MessageToast.show("OData model not initialized");
          return;
        }
        let router = this.getOwnerComponent().getRouter();
        router.getRoute("list").attachPatternMatched(this._renderDetail, this);
        this.getView().setModel(oModel);
      },

      _onRouteMatched: function () {
        let oList = this.byId("employeeTable");
        let oBinding = oList.getBinding("items");
        if (oBinding) {
          oBinding.refresh(); // refetch the data from OData
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

        // Delete using OData V4 context
        oContext
          .delete("$auto")
          .then(function () {
            MessageToast.show("Nhân viên đã bị xóa");
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
