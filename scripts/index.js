(async () => {
    const data = await fetch("./data/data.json");
    const response = await data.json();
    let employeeData = response.data;
    const addEmployeeModal = $(".addNewEmployeeModal");
    let selectedEmployeeId = employeeData[0].id;
    let selectedEmployee = employeeData[0];
    const renderEmployee = () => {
        const employeeListContainer = $(".employeeName__list");
        let employeeList = "";
        $.each(employeeData, (index, value) => {
            employeeList += `<div class="employeeName__list--items ${value.id === selectedEmployeeId && "selected"}" id="${value.id}">
             <span class="employeeName__list--name">${value.employee_name}</span>
             <span class="employeeName__list--actions"><i class="fa-solid fa-user-pen"></i> <i class=" fa fa-light fa-user-xmark"></i></span>
            </div>`
        });
        employeeListContainer.empty();
        employeeListContainer.append(employeeList);
    };
    const renderEmployeeInformation = (employeeData) => {
        const employeeDescriptionContainer = $(".employeeInformation__description");
        employeeFullNameArray = employeeData.employee_name.split(" ");
        employeeFirstName = employeeFullNameArray[0];
        employeeLastName = employeeFullNameArray[1];
        const employeeDetails = `<img src="${employeeData.profile_image}"  onerror="this.onerror=null; this.src='https://eu.ui-avatars.com/api/?name=${employeeFirstName}+${employeeLastName}&size=250'"></img>
                                <h3>${employeeData.employee_name}</h3>
                                <div><b>Email - </b> ${employeeData.employee_email ? employeeData.employee_email : `${employeeFirstName}.${employeeLastName}@${employeeData.employee_age}.com`}</div>
                                <div><b>Phone - </b> ${employeeData.employee_phone}</div>
                                <div><b>Age - </b> ${employeeData.employee_age}</div>
                                <div><b>Salary - </b> ${employeeData.employee_salary}</div>
                                `;
        if (employeeDescriptionContainer !== "") {
            employeeDescriptionContainer.empty();
        }
        employeeDescriptionContainer.append(employeeDetails)
    }
    const showModal = () => {
        $(".header__button").click(() => {
            addEmployeeModal.addClass("show");
            addEmployeeModal.find("#add_edit_employee_form").trigger("reset").attr("class", "").find("button").text("Add Employee");
        });
    };
    const closeModal = () => {
        addEmployeeModal.click((event) => {
            if ($(event.target).hasClass("addNewEmployeeModal")) {
                addEmployeeModal.removeClass("show");
            }
        });
    };
    const removeEmployee = (employee) => {
        employeeData = employeeData.filter((emp) => emp.id !== employee.id);
        if (employee.id === Number(selectedEmployeeId)) {
            selectedEmployeeId = employeeData[0]?.id || -1;
            selectedEmployee = employeeData[0] || {};
            renderEmployeeInformation(selectedEmployee);
        }
        renderEmployee();
        setTimeout(() => {
            $(".employeeName__list--items.selected").get(0).scrollIntoView();
        }, 0)
    }
    $(".employeeName__list").on("click", ".employeeName__list--items", function (event) {
        const targetedEmployeeId = $(this).attr("id");
        const targetedEmployeeData = employeeData.find((employee) => employee.id === Number(targetedEmployeeId));
        if ($(event.target).hasClass("fa-user-xmark")) {
            const deleteEmployee = confirm(`Do you really want to remove ${targetedEmployeeData.employee_name} from Employee list?`);
            if (deleteEmployee) {
                removeEmployee(targetedEmployeeData);
            }
            return;
        }
        if ($(event.target).hasClass("fa-user-pen")) {
            const modalContainer = $(".addNewEmployeeModal");
            const formConatiner = modalContainer.find("#add_edit_employee_form").addClass("edit_employee_details").attr("data-employee_id", targetedEmployeeId);
            formConatiner.find(".addNewEmployeeModal__buttonContainer button").text("Save Details");
            $.each(targetedEmployeeData, (key, value) => {
                if (!targetedEmployeeData.firstName && key === "employee_name") {
                    const employeeFullNameArray = value.split(" ");
                    employeeFirstName = employeeFullNameArray[0];
                    employeeLastName = employeeFullNameArray[1];
                    formConatiner.find(`input[name="firstName"]`).val(employeeFirstName).trigger("input");
                    formConatiner.find(`input[name="lastName"]`).val(employeeLastName).trigger("input");
                    formConatiner.find(`input[name="employee_email"]`).val(`${employeeFirstName}.${employeeLastName}@${targetedEmployeeData.employee_age}.com`).trigger("input");
                }
                else {
                    formConatiner.find(`input[name=${key}]`).val(value).trigger("input");
                }
            })
            modalContainer.addClass("show");
            return;
        }
        if (!$(this).hasClass("selected")) {
            $(".employeeName__list--items").removeClass("selected");
            $(this).addClass("selected");
            selectedEmployeeId = targetedEmployeeId;
            selectedEmployee = targetedEmployeeData;
            renderEmployeeInformation(selectedEmployee);
        }
    });
    $("#add_edit_employee_form").submit(function (e) {
        e.preventDefault();
        const formData = $(this).serializeArray();
        const newEmployeeData = {};
        $.each(formData, (index, data) => {
            newEmployeeData[data.name] = data.value;
        });
        newEmployeeData.employee_name = newEmployeeData.firstName + " " + newEmployeeData.lastName;
        if ($(this).hasClass("edit_employee_details")) {
            targetedEmployeeId = Number($(this).attr("data-employee_id"));
            const targetedEmployeeArrayIndex = employeeData.findIndex((employee) => employee.id === targetedEmployeeId);
            newEmployeeData.id = employeeData[targetedEmployeeArrayIndex].id;
            employeeData[targetedEmployeeArrayIndex] = newEmployeeData;
            selectedEmployeeId = employeeData[targetedEmployeeArrayIndex].id;
            selectedEmployee = employeeData[targetedEmployeeArrayIndex];
        }
        else {
            newEmployeeData.id = employeeData[employeeData.length - 1].id + 1;
            employeeData.push(newEmployeeData);
            selectedEmployeeId = employeeData[employeeData.length - 1].id;
            selectedEmployee = employeeData[employeeData.length - 1];
            setTimeout(() => {
                $(".employeeName__list--items.selected").get(0).scrollIntoView();
            }, 0)
        }
        addEmployeeModal.removeClass("show");
        renderEmployee();
        renderEmployeeInformation(selectedEmployee);
    });

    renderEmployee();
    renderEmployeeInformation(selectedEmployee);
    showModal();
    closeModal();
})();