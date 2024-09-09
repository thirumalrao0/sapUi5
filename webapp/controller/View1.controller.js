sap.ui.define([
    "sap/ui/core/mvc/Controller",    // Core Controller class from SAPUI5
    "sap/ui/model/json/JSONModel",   // JSON Model for data binding
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
    // MessageToast for displaying messages
], function (Controller, JSONModel, MessageToast, Fragment, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("projectcrudop.controller.View1", {
        // Initialization function, called when the controller is instantiated
        onInit: function () {
            // Create a new JSONModel instance with data from a local file
            var oModel = new JSONModel("/model/details.json");
            // Set the model to the view so that it can be used for data binding
            this.getView().setModel(oModel);
            var cont = this.getView().byId("detailscontainer")
            Fragment.load({
                id: this.getView().getId(),
                name: "projectcrudop.fragments.empDetails",
                controller: this
            }).then(function (evnt) {
                cont.addItem(evnt)
            })

        },
        searchEmp(oEvent) {
            const newarr = []
            let squery = oEvent.getParameter("query");
            console.log(squery)
            if (squery) {
                newarr.push(new Filter("name", FilterOperator.Contains, squery));

            }
            const olist = this.byId("employeeTable");
            const obinding = olist.getBinding("items");
            obinding.filter(newarr)

        },



        // Event handler for when a selection changes in a control (e.g., a list or combo box)
        // onSelectChange: function (oEvent) {

        //     // Store the selected key and index
        //     this._sSelectedKey = oEvent.getSource().getSelectedKey();
        //     this._iSelectedIndex = oEvent.getSource().getSelectedIndex();

        //     // Get the model and data from the view
        //     var oModel = this.getView().getModel();
        //     var oData = oModel.getData();

        //     // Retrieve the selected item data based on the index
        //     var oSelectedItem = oData.employees[this._iSelectedIndex];

        //     // Set the selected item's data into input fields
        //     this.byId("inputName1").setValue(oSelectedItem.name);
        //     this.byId("inputId1").setValue(oSelectedItem.id);
        // },
        //event handler for update item


        // Event handler for adding a new item
        add1: function () {


            // Get the model and data from the view
            var oModel = this.getView().getModel();
            var oData = oModel.getData();

            // Retrieve values from input fields
            var sNewName = this.getView().byId("inputName").getValue();
            var sNewId = this.getView().byId("inputId").getValue();

            console.log(sNewName)

            // Create a new entry object
            if (sNewName && sNewId) {
                var newEntry = {
                    name: sNewName,
                    id: sNewId
                };
                var inp1 = this.byId("inputName").setValue("")
                var inp2 = this.byId("inputId").setValue("")
                // Add the new entry to the employees array
                oData.employees.push(newEntry);

                // Update the model with the new data
                oModel.setData(oData);
                this.byId("dialog1").close();
                // Display a success message
                MessageToast.show("Item added successfully.");
            } else {
                MessageToast.show("Please provide both name and ID.");
            }

        },
        async onAdd() {
            // var cont= this.getView().byId("container")
            // Fragment.load({
            //     id:this.getView().getId(),
            //     name:"projectcrudop.fragments.additem",
            //     controller: this
            // }).then(function(evnt){
            //     cont.addItem(evnt)
            // })
            this.oDialog ??= await this.loadFragment({
                name: "projectcrudop.fragments.additem"
            });
            this.oDialog.open();
        },
        async onModify(oEvent) {
            var oPressedItem = oEvent.getSource();
            // Get the binding context of the pressed item
            var oContext = oPressedItem.getBindingContext();
            // Get the data object bound to the pressed item
            var oSelectedData = oContext.getObject();
            // Get the model and data
            var oModel = this.getView().getModel();
            var oData = oModel.getData();
            // Find the index of the item to delete
            this.index = oData.employees.indexOf(oSelectedData);
            var oSelectedItem = oData.employees[this.index];
            console.log(oSelectedItem)





            this.oDial ??= await this.loadFragment({
                name: "projectcrudop.fragments.updateitem"
            });
            this.byId("inputName1").setValue(oSelectedItem.name);
            this.byId("inputId1").setValue(oSelectedItem.id);
            this.oDial.open();
        },
        close1() {
            this.byId("dialog1").close();
        },
        close2() {
            this.byId("dialog2").close();
        },

        // Event handler for deleting an item
        // onDelete: function () {
        //     // Get the model and data from the view
        //     var oModel = this.getView().getModel();
        //     var oData = oModel.getData();

        //     // Check if a valid item is selected
        //     if (this._iSelectedIndex !== undefined && this._sSelectedKey !== undefined) {
        //         // Retrieve the employees array
        //         var aEmpData = oData.employees;

        //         // Remove the selected item from the array
        //         aEmpData.splice(this._iSelectedIndex, 1);

        //         // Update the model with the modified data
        //         oModel.setData(oData);

        //         // Display a success message
        //         MessageToast.show("Item deleted successfully.");
        //     } else {
        //         // Display an error message if no item is selected
        //         MessageToast.show("Please select an item to delete.");
        //     }
        // },

        // Event handler for modifying an existing item
        update: function () {
            // Get the model and data from the view
            var oModel = this.getView().getModel();
            var oData = oModel.getData();

            // Check if a valid item is selected

            // Retrieve new values from input fields
            var sNewName = this.byId("inputName1").getValue();
            var sNewId = this.byId("inputId1").getValue();

            // Update the selected item's data
            if (sNewName && sNewId) {
                oData.employees[this.index].name = sNewName;
                oData.employees[this.index].id = sNewId;
                oModel.setData(oData);
                this.byId("dialog2").close();
                MessageToast.show("Item modified successfully.");
            } else {
                MessageToast.show("Please provide both name and ID.");
            }



        },
        onDelete: function (oEvent) {
            var oPressedItem = oEvent.getSource();
            // Get the binding context of the pressed item
            var oContext = oPressedItem.getBindingContext();
            // Get the data object bound to the pressed item
            var oSelectedData = oContext.getObject();
            // Get the model and data
            var oModel = this.getView().getModel();
            var oData = oModel.getData();
            // Find the index of the item to delete
            var iIndex = oData.employees.indexOf(oSelectedData);
            // Delete the item from the array
            if (iIndex !== -1) {
                oData.employees.splice(iIndex, 1);
                oModel.setData(oData);
                MessageToast.show("Item deleted successfully.");
            }
        },




    });
});
