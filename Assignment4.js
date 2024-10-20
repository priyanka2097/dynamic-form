$(document).ready(function() {

    $(".outputWrapper").hide(); // Hide the output formwrapper that is to be designed
    var formDetails = []; // Store the data in this array

    // Check for the selected input type
    $(".data").off("change").on("change", function() {

        if ($(this).val() === "checkbox") {
            $(".controlValues").html('NUMBER OF CHECKBOX: <input type="number" class="vals" id="NumberOfCheckbox"  /><br> <input type="button" value="ADD LABELS" class="labelButton" id="checkboxButton" /><br><br>');
        } else if ($(this).val() === "radioButton") {

            $(".controlValues").html('NUMBER OF RADIO BUTTONS: <input type="number" class="vals" id="NumberOfRadiobutton"  /><br> <input type="button" value="ADD LABELS" class="labelButton" id="radioButton" /><br><br>');
        } else if ($(this).val() === "select") {
            $(".controlValues").html('NUMBER OF SELECT: <input type="number" class="vals" id="NumberOfOptions"  /><br> <input type="button" value="ADD LABELS" class="labelButton" id="selectOptions" /><br><br>');
        } else {
            $(".controlValues").empty();
            $(".labelButton").prop("disabled", false);
        }
        // Add sublabel options if multile options are required
        $(".labelButton").off("click").on("click", function() {
            $(".labelButton").prop("disabled", true);
            $(".vals").each(function() {
                var x = $(this).val();

                if ($(this).val() !== "") {
                    for (i = 0; i < x; i++) {
                        $(".controlValues").append('SUBLABEL: <input id="subLabels" class="dataLabel" type="text" /><br>');
                    }
                }
            });
        });
    });

    // Add the JSON array to the div below
    $("#add").click(function() {

        var formElements = ['label', 'validation', 'required', 'control', 'numberOfLabels'];
        var detail = {};
        $('.data').each(function(i) {
            detail[formElements[i]] = $(this).val();
        });

        $(".vals").each(function() {
            detail['numberOfLabels'] = $(this).val();
        });

        $(".dataLabel").each(function(index) {
            if ($(this).val() !== "") {
                detail['sublabel' + (index + 1)] = $(this).val();
            }
        });

        formDetails.push(detail);

        localStorage.setItem("detail", JSON.stringify(formDetails));
        var result = JSON.stringify(formDetails);
        $(".formElementsArray").html(result);
    });

    // Pop out the array if not required
    $("#delete").click(function() {

        formDetails.pop();
        localStorage.setItem("detail", JSON.stringify(formDetails));
        var result = JSON.stringify(formDetails);
        $(".formElementsArray").html(result);

    });

    // Go the next page where the form is to designed
    $("#done").off("click").on("click", function() {
        window.open("Assignment4a.html", "_blank");
    });

    // Clear all the fields to create new control
    $("#reset").off("click").on("click", function() {
        $(".vals").remove();
    });

    // Design the form according to the inputs given by the user
    $("#design").click(function() {
        debugger
        var string = $("#jsonString").val();
        var obj = JSON.parse(string);
        $(".json1").slideUp(500);
        $("#design").prop("disabled", true);
        $(".outputWrapper").fadeIn(500);

        $(obj).each(function(index) {

            var ip = obj[index].label;
            $(".output").append("<br><span class='labelDecor'>" + ip + "</span>"); // Append label to the input type

            var validationType = obj[index].validation;
            var reqType = obj[index].required;

            if (obj[index].required == "yes") {
                $(".output").append("<span style='color:red;'><sup> *</sup></span>");
            }

            if (obj[index].control == "textbox") {
                $(".output").append("<br><input class='outputText' type='text' validationtype='" + validationType + "' reqtype='" + reqType + "''><br>");
            } else if (obj[index].control == "button") {
                $(".output").append("<input style='border:none; ' type='button' value='CLICK'><br>");
            } else if (obj[index].control == "password") {
                $(".output").append("<br><input class='outputText' type='password'>");
            } else if (obj[index].control == "select") {

                $(".output").append("&nbsp; <select class='outputSelect'></select><br>");
                $(".outputSelect").append('<option value=""></option>');
                var a = obj[index].numberOfLabels;
                for (i = 0; i < a; i++) {
                    var labelIndex = i + 1;
                    var ip1 = obj[index]["sublabel" + labelIndex];
                    $(".outputSelect").append('<option value="' + ip1 + '">' + ip1 + '</option>');
                }
            } else if (obj[index].control == "checkbox") {
                $(".output").append("<br>");
                var a = obj[index].numberOfLabels;
                for (i = 0; i < a; i++) {
                    var labelIndex = i + 1;
                    var ip1 = obj[index]["sublabel" + labelIndex];
                    $(".output").append("<input class='inputTypes' type='checkbox' />");
                    $(".output").append(ip1);
                }
            } else if (obj[index].control == "radioButton") {
                $(".output").append("<br>");
                var a = obj[index].numberOfLabels;
                for (i = 0; i < a; i++) {
                    var labelIndex = i + 1;
                    var ip1 = obj[index]["sublabel" + labelIndex];

                    $(".output").append("<input class='inputTypes' name='radioButton' type='radio' />");
                    $(".output").append(ip1);
                }
            }
        });

        // Button for submitting the designed form
        $("#submit").off("click").on("click", function() {
            debugger
            var inputs = $(".output input").not("[type='button']");

            // Check for validations
            inputs.each(function() {

                if ($(this).attr("validationtype") === "emailval") {
                    validateEmailID($(this));
                } else if ($(this).attr("validationtype") === "numberval") {
                    validatePhoneNumber($(this));
                }

                if ($(this).attr("reqtype") === "yes") {
                    requiredField($(this));
                }
            });
        });

        // Validation for Phone Number
        function validatePhoneNumber(value) {
            var phoneno = /^\d{10}$/;
            if (!value.val().match(phoneno)) {
                $(value).css("borderColor", "red");
            } else {
                $(value).css("borderColor", "green");
            }
        }

        // Validation for Email-ID
        function validateEmailID(value) {
            var emailid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!value.val().match(emailid)) {
                $(value).css("borderColor", "red");
            } else {
                $(value).css("borderColor", "green");
            }
        }

        // Validation for required field 
        function requiredField($reqd) {
            debugger
            if ($reqd.val() == "") {
                if ($reqd.siblings(".warning").length < $(".outputText").length) {
                    $reqd.after("<br><span class='warning' style='color:red; font-size: 12px;'>cannot be blank</span>");
                }
            } else {
                if ($reqd.siblings(".warning").length) {
                    $reqd.siblings(".warning").remove();
                }
            }
        }
    });
});