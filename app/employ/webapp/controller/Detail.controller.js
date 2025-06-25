sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
  function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("ojt.employ.controller.Detail", {
      onInit: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter
          .getRoute("detail")
          .attachPatternMatched(this._onRouteMatched, this);
      },

      _onRouteMatched: function (oEvent) {
        var sEmployeeId = oEvent.getParameter("arguments").employeeId;
        var sPath = "/Employees(" + sEmployeeId + ")";
        this.getView().bindElement({
          path: sPath,
          parameters: {
            $expand: "role,department",
          },
        });
      },

      onNavBack: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("list");
      },

      onCalculateSalary: function () {
        var oModel = this.getView().getModel();
        var oContext = this.getView().getBindingContext();

        if (!oContext) {
          MessageToast.show("Không thể xác định nhân viên");
          return;
        }

        var sEmployeeId = oContext.getProperty("ID");

        // Call the function import using OData V4
        var oOperation = oModel.bindContext("/calculateSalary(...)");
        oOperation.setParameter("employeeID", sEmployeeId);

        oOperation
          .execute()
          .then(function () {
            var oResult = oOperation.getBoundContext().getObject();
            MessageToast.show("Lương đã được tính: $" + oResult.value);
            // Refresh the binding to show updated salary
            oContext.refresh();
          })
          .catch(function (oError) {
            MessageToast.show(
              "Lỗi khi tính lương: " + (oError.message || "Unknown error")
            );
          });
      },

      onSave: function () {
        var oContext = this.getView().getBindingContext();

        if (!oContext) {
          MessageToast.show("Không thể lưu - không có context");
          return;
        }

        // Get values from form
        var oRoleComboBox = this.byId("_IDGenComboBox");
        var oDeptComboBox = this.byId("_IDGenComboBox1");

        var sSelectedRoleKey = oRoleComboBox.getSelectedKey();
        var sSelectedDeptKey = oDeptComboBox.getSelectedKey();

        // Set the association IDs
        if (sSelectedRoleKey) {
          oContext.setProperty("role_ID", sSelectedRoleKey);
        }
        if (sSelectedDeptKey) {
          oContext.setProperty("department_ID", sSelectedDeptKey);
        }

        // Submit changes using OData V4
        oContext
          .getModel()
          .submitBatch("$auto")
          .then(function () {
            MessageToast.show("Nhân viên đã được lưu");
          })
          .catch(function (oError) {
            MessageToast.show(
              "Lỗi khi lưu nhân viên: " + (oError.message || "Unknown error")
            );
          });
      },

      onDelete: function () {
        var oContext = this.getView().getBindingContext();
        var oRouter = this.getOwnerComponent().getRouter();

        if (!oContext) {
          MessageToast.show("Không thể xóa - không có context");
          return;
        }

        // Delete using OData V4 context
        oContext
          .delete("$auto")
          .then(function () {
            MessageToast.show("Nhân viên đã bị xóa");
            oRouter.navTo("list");
          })
          .catch(function (oError) {
            MessageToast.show(
              "Lỗi khi xóa nhân viên: " + (oError.message || "Unknown error")
            );
          });
      },

      onManageLeaves: function () {
        var oContext = this.getView().getBindingContext();
        if (!oContext) {
          MessageToast.show("Không thể xác định nhân viên");
          return;
        }

        var sEmployeeId = oContext.getProperty("ID");
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("leave", { employeeId: sEmployeeId });
      },
    });
  }
);
