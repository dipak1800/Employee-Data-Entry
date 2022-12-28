(async()=>{
    const data = await fetch("./data/data.json");
    const response = await data.json();
    const employeeData = response.data;
    const addEmployeeModal = $(".addNewEmployeeModal");
    let selectedEmployeeId = employeeData[0].id;
    let selectedEmployee = employeeData[0];
    const renderEmployee = ()=>{
        const employeeListContainer = $(".employeeName__list");
        let employeeList = "";
        
        $.each(employeeData,(index,value)=> {
            employeeList += `<div class="employeeName__list--items ${value.id === selectedEmployeeId && "selected"}" id="${value.id}">
             <span class="employeeName__list--name">${value.employee_name}</span>
             <span class="employeeName__list--actions"><i class="fa-solid fa-user-pen"></i> <i class=" fa fa-light fa-user-xmark"></i></span>
            </div>`
        });
        employeeListContainer.append(employeeList);
    };
    const renderEmployeeInformation = (employeeData)=> {
        const employeeDescriptionContainer = $(".employeeInformation__description");
        employeeFullNameArray= employeeData.employee_name.split(" ");
        employeeFirstName = employeeFullNameArray[0];
        employeeLastName = employeeFullNameArray[1];
        const employeeDetails = `<img src="${employeeData.profile_image}"  onerror="this.onerror=null; this.src='https://eu.ui-avatars.com/api/?name=${employeeFirstName}+${employeeLastName}&size=250'"></img>
                                <h3>${employeeData.employee_name}</h3>
                                <div><b>Email-</b> ${employeeFirstName}.${employeeLastName}@${employeeData.employee_age}.com</div>
                                <div><b>Phone-</b> ${employeeData.employee_phone}</div>
                                <div><b>Age-</b> ${employeeData.employee_age}</div>
                                <div><b>Salary-</b> ${employeeData.employee_salary}</div>
                                `;
        if(employeeDescriptionContainer !== "") {
            employeeDescriptionContainer.empty();
        }
        employeeDescriptionContainer.append(employeeDetails)
    }
    const showModal = ()=> {
        $(".header__button").click(()=> { 
            addEmployeeModal.addClass("show");
        });
    };
    const closeModal = ()=> {
        addEmployeeModal.click((event)=> { 
            if($(event.target).hasClass("addNewEmployeeModal")){
                addEmployeeModal.removeClass("show");
            }
        });
    };
    $(".employeeName__list").on("click", ".employeeName__list--items", function () { 
        if(!$(this).hasClass("selected")) {
                $(".employeeName__list--items").removeClass("selected");
                $(this).addClass("selected");
                selectedEmployeeId = $(this).attr("id");
                selectedEmployee = employeeData[Number(selectedEmployeeId)- 1];
                renderEmployeeInformation(selectedEmployee);
        }
     })

    renderEmployee();
    renderEmployeeInformation(selectedEmployee);
    showModal();
    closeModal();
})();