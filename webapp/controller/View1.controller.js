sap.ui.define([
    "sap/ui/core/mvc/Controller",    // Core Controller class from SAPUI5
    "sap/ui/model/json/JSONModel",   // JSON Model for data binding
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/routing/History",
    "sap/m/StandardListItem"


    // MessageToast for displaying messages
], function (Controller, JSONModel, MessageToast, Fragment, Filter, FilterOperator, History, StandardListItem) {
    "use strict";

    return Controller.extend("projectcrudop.controller.View1", {
        // Initialization function, called when the controller is instantiated
        onInit: function () {
            // Create a new JSONModel instance with data from a local file
            var oModel = new JSONModel("/model/details.json");
            // Set the model to the view so that it can be used for data binding
            this.getView().setModel(oModel);
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
        value4() {
            Fragment.load({
                name: "projectcrudop.fragments.empDetails",
                controller: this
            }).then(function (evnt) {
                evnt.setModel(this.getView().getModel())
                evnt.open()
            }.bind(this))

        },
        close(evn) {
            evn.getSource().getParent().close()
        },

        async onValueHelpRequested() {
            this.getView().byId("multiInput").removeAllTokens()
            this.oDialog1 = await this.loadFragment({
                name: "projectcrudop.fragments.multiinput"
            })
            this.oDialog1.open()
        },
        onDialogClose() {
            this.oDialog1.destroy()
        },
        onGetDateTime: function () {
            // Get the DateTimePicker controls
            var oDateTimePicker1 = this.getView().byId("yourDateTimePickerId1");
            var oDateTimePicker2 = this.getView().byId("yourDateTimePickerId2");

            // Retrieve the date values
            var oDateValue1 = oDateTimePicker1.getDateValue();
            var oDateValue2 = oDateTimePicker2.getDateValue();

            // Check if both dates are selected
            if (!oDateValue1 || !oDateValue2) {
                console.warn("Both dates must be selected.");
                return;
            }

            // Compare the two dates
            if (oDateValue1 > oDateValue2) {
                console.log("The first date is greater than the second date.");
                // Additional logic if needed
            } else if (oDateValue1 < oDateValue2) {
                console.log("The first date is less than the second date.");
                // Additional logic if needed
            } else {
                console.log("Both dates are equal.");
                // Additional logic if needed
            }
        },
        onSearch: function (oEvent) {
            var sQuery = oEvent.getSource().getValue();
            var oList = this.byId("employeeList");
            var oBinding = oList.getBinding("items");

            // Filter the list based on search query
            if (sQuery) {
                var oFilter = new Filter("name", "Contains", sQuery);
                oBinding.filter([oFilter]);
            } else {
                oBinding.filter([]);
            }
        },
        // onEmployeeSelect: function(oSelectedItem) {

        //     // Check if the token already exists to prevent duplicates
        //     var bTokenExists = aExistingTokens.some(function(token) {
        //         return token.getKey() === sSelectedId; // Check for duplicates based on ID
        //     });




        //         MessageToast.show("Selected: " + sSelectedName);
        //         this.updateSelectedCount(); // Update count after adding

        // },

        // updateSelectedCount: function() {
        //     var oMultiInput = this.getView().byId("multiInput");
        //     var count = oMultiInput.getTokens().length;
        //     // Update any UI element with the count if necessary
        //     // Example: this.byId("countLabel").setText("Selected: " + count);
        // },
        onCloseDialog: function () {
            this._oValueHelpDialog.close();
        },
        // onOkPress: function (evn) {

        //     var items = this.byId("employeeList").getSelectedItems()
        //     var oMultiInput = this.getView().byId("multiInput");
        //     items.forEach(element => {

        //         var obj = element.getBindingContext().getObject()
        //         oMultiInput.addToken(new sap.m.Token({ text: obj.name }));
        //     });
        //     // var aExistingTokens = oMultiInput.getTokens();

        //     evn.getSource().getParent().destroy()
        // },
        onOkPress: function (evn) {
            // Get the table and retrieve selected items
            var items = this.byId("employeeTable").getSelectedItems();
            var oMultiInput = this.getView().byId("multiInput");

            items.forEach(function (item) {
                // Get the binding context for each selected item
                var obj = item.getBindingContext().getObject();
                // Add a token to the MultiInput for each selected employee
                oMultiInput.addToken(new sap.m.Token({ text: obj.name }));
            });

            // Destroy the dialog or any parent control that triggered this event
            evn.getSource().getParent().destroy();
        },
        onCombineDateTime: function (oDatePicker, oTimePicker) {


            // Retrieve the selected date and time
            var selectedDate = oDatePicker.getDateValue();
            var selectedTime = oTimePicker.getDateValue(); // This gets the time as a Date object

            if (selectedDate && selectedTime) {
                // Create a new Date object from the selected date
                var combinedDateTime = new Date(selectedDate);

                // Set the hours, minutes, and seconds based on the selected time
                combinedDateTime.setHours(selectedTime.getHours());
                combinedDateTime.setMinutes(selectedTime.getMinutes());
                combinedDateTime.setSeconds(selectedTime.getSeconds() || 0); // Default to 0 seconds if not provided

                // Format the combined date-time to a readable string
                var formattedDateTime = combinedDateTime.toLocaleString();

                // Display the combined date and time
                return combinedDateTime
            } else {
                MessageToast.show("Please select both date and time.");
            }
        },
        check() {
            var oView = this.getView();
            var oDatePicker1 = oView.byId("dateId1");
            var oTimePicker1 = oView.byId("timeId1");
            var oDatePicker2 = oView.byId("dateId2");
            var oTimePicker2 = oView.byId("timeId2");
            var startdate = this.onCombineDateTime(oDatePicker1, oTimePicker1)
            var enddate = this.onCombineDateTime(oDatePicker2, oTimePicker2)
            if (startdate >= enddate) {
                MessageToast.show("start >= enddate")
            } else {
                MessageToast.show("start < enddate")
            }
            var randomDate = new Date(oDatePicker1.getDateValue());

            // Step 2: Add 24 days to the date
            randomDate.setDate(randomDate.getDate() + 24);

            // Step 3: Get the new date
            var newDate = randomDate.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD

            // Output the result
            console.log("New Date after adding 24 days: " + newDate);
        },
        onNavBack() {
            const oHistory = History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== "undefined") {
                window.history.go(-1);
            } else {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("overview", {}, true);
            }
        },
        navToNextpage() {
            this.getOwnerComponent().getRouter().navTo("RouteView2")
        },
        onCalculatePress: function () {
            const startDateInput = this.byId("startDatePicker").getDateValue();
            const endDateInput = this.byId("endDatePicker").getDateValue();
            const oSelect = this.byId("frequencySelectControl");
            const selectedKey = oSelect.getSelectedKey();
            const oList = this.byId("frequencyListControl");
            // Clear the existing items in the list
            oList.removeAllItems();

            // Validate date range
            if (!startDateInput || !endDateInput || startDateInput > endDateInput) {
                MessageToast.show("Please enter a valid date range.");
                return;
            }
            let results = [];

            // Perform calculations based on selected frequency
            switch (selectedKey) {
                case "day":
                    results = this.calculateDailyFrequency(startDateInput, endDateInput);
                    break;
                case "week":
                    results = this.calculateWeeklyFrequency(startDateInput, endDateInput);
                    break;
                case "month":
                    results = this.calculateMonthlyFrequency(startDateInput, endDateInput);
                    break;
                default:
                    MessageToast.show("Please select a valid frequency.");
                    return;
            }

            // Add results to the list
            results.forEach(item => {
                const listItem = new StandardListItem({
                    title: item.title,
                    description: item.description
                });
                oList.addItem(listItem);
            });

            MessageToast.show("Calculation done for: " + selectedKey);
        },

        calculateDailyFrequency: function (startDate, endDate) {
            const result = [];
            const currentDate = new Date(startDate);
            const end = new Date(endDate);

            while (currentDate <= end) {
                result.push({
                    title: `Day: ${currentDate}`,
                    description: "Occurrences for this day"
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return result;
        },

        calculateWeeklyFrequency: function (startDate, endDate) {
            const result = [];
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Set to the start of the week
            // start.setDate(start.getDate() - start.getDay());

            while (start <= end) {
                result.push({
                    title: `Week starting ${start}`,
                    description: "Occurrences for this week"
                });
                start.setDate(start.getDate() + 7); // Move to the next week
            }
            return result;
        },

        calculateMonthlyFrequency: function (startDate, endDate) {
            const result = [];
            const start = new Date(startDate);
            const end = new Date(endDate);

            while (start <= end) {
                const monthKey = start.toISOString().slice(0, 7); // YYYY-MM
                result.push({
                    title: `Month: ${monthKey}`,
                    description: "Occurrences for this month"
                });
                start.setMonth(start.getMonth() + 1); // Move to the next month
            }
            return result;
        }


    });
});