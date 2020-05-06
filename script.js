$(document).ready( function() {
 
  /* 
  ----------------
  DEFINTING FORMS
  ----------------
  */

  let addForm = {
    ref : $("#addStudentFormDiv"),
    btn_openAddStudentForm : $("#openAddFormButton"),
    btn_closeAddStudentForm : $("#closeAddFormButton"),
    idField : $("#addId"),
    nameField : $("#addName"),
    ageField : $("#addAge"),
    subjectField : $("#addSubject"),
    countryField : $("#addCountry"),
    cityField : $("#addCity"),
    btn_save : $("#saveStudent"),
    errors: [],
    error_id: $("#idExists"),
    error: $("#addError")
  };

  let updateForm = {
    ref : $("#updateStudentFormDiv"),
    btn_closeUpdateStudentForm : $("#closeUpdateFormButton"),
    idField : $("#updateId"),
    nameField : $("#updateName"),
    ageField : $("#updateAge"),
    subjectField : $("#updateSubject"),
    countryField : $("#updateCountry"),
    cityField : $("#updateCity"),
    btn_update : $("#updateStudent"),
    errors: [],
    error_id: $("#updateIdExists"),
    error: $("#updateError")
  };

/* 
----------------
STATIC DATA (Countries and Cities)
----------------
*/

let selectedCountry = "";

addForm.countryField.change( function() {
  selectedCountry = $("#addCountry option:selected").val();
  if (selectedCountry == "Nepal") {
    $('.Nepal').show();
    $('.India').hide();
    $('.USA').hide();
  }

  if (selectedCountry == "India") {
    $('.Nepal').hide();
    $('.India').show();
    $('.USA').hide();
  }

  if (selectedCountry == "USA") {
    $('.Nepal').hide();
    $('.India').hide();
    $('.USA').show();
  }
});

$("#updateCountry").change( function() {
  selectedCountry = $("#updateCountry option:selected").val();
  if (selectedCountry == "Nepal") {
    $('.Nepal').show();
    $('.India').hide();
    $('.USA').hide();
  }

  if (selectedCountry == "India") {
    $('.Nepal').hide();
    $('.India').show();
    $('.USA').hide();
  }

  if (selectedCountry == "USA") {
    $('.Nepal').hide();
    $('.India').hide();
    $('.USA').show();
  }
})

let validation = {
  idExists: function(anyArray, formName) {
    for (let i in anyArray) {
      if (anyArray[i]['id'] === formName.idField.val()) {
        return true;
      }
    }
  },
  validateId: function(anyArray, formName) {
    for (let i in anyArray) {
      if (anyArray[i]['id'] === formName.idField.val()) {
        interaction.open(formName.error_id);
        formName.error_id.text(`${anyArray[i]['id']} has already been assigned to ${anyArray[i]['name']}`)
      } else {
        interaction.close(formName.error_id)
      }
    }
  },
  emptyField: function(formName, [...fieldNames]) {
    console.log(fieldNames)
    fieldNames.forEach( function(field) {

      if (formName[field].val() === "" || formName[field].val() == null) {
        formName.errors = "";
        formName.errors = `Please specify ${formName[field].attr('name')} field`;
        console.log(formName.errors)
        interaction.open(formName.error);
        formName.error.append(`<li>${formName.errors}</li>`);
        console.log(formName.error.html())
      }
    });
  }
}
fieldsToValidate = [
  "idField",
  "nameField",
  "ageField",
  "subjectField",
  "countryField",
  "cityField"
]

  /* 
  ---------------------
  DEFINING INTERACTIONS 
  ---------------------
  */

  let interaction = {
    open: function(anyEle){anyEle.slideDown()},
    close: function(anyEle){anyEle.slideUp()},
    display: function(anyHTMLElement, anyArray) {
      
      anyHTMLElement.html("");
      $(anyArray).each(function(index, value){
        data = value;
        
        anyHTMLElement.append(`<tr>
        <td>${data['id']}</td>
        <td>${data['name']}</td>
        <td>${data['age']}</td>
        <td>${data['subject']}</td>
        <td>${data['country']}</td>
        <td>${data['city']}</td>
        <td>
        <i class='material-icons editRowButton' id='edit${data['id']}'>edit</i>
        <i class='material-icons deleteRowButton' id='delete${data['id']}'>delete</i>
        </td>
        
        </tr>`)
      });
    }
  }
  
  /* 
  -------------------------
  DEFINING CRUD OPERATIONS 
  -------------------------
  */

  let crud = {
    add: function(anyArray, anyForm, studentObject){
      if (
        validation.idExists(anyArray, anyForm) ||
        anyForm.idField.val() == "" ||
        anyForm.nameField.val() == "" ||
        anyForm.ageField.val() == "" ||
        anyForm.subjectField.val() == "" ||
        anyForm.countryField.val() == "" ||
        anyForm.cityField.val() == ""
      ) {
        validation.validateId(anyArray, anyForm);
        validation.emptyField(anyForm, fieldsToValidate)
      } else {
        anyForm.errors = [];
        interaction.close(anyForm.error);
        anyArray.push(studentObject);
      }
    },
    update: function(anyArray, anyForm, currentIndex, studentObject){
      if (currentIndex in anyArray) {
        anyArray[currentIndex] = studentObject;
      }  
    }
  }  
  
  let output = $("tbody");
  let studentsInfo = [];

  let newStudent;
  let updatedStudent;

  
  /* 
  =========================
  CRUD OPERATIONS IN ACTION 
  =========================
  */

  /* 
  ----------------
  SAVE MECHANISM 
  ----------------
  */

  // Add Form -> Save Button -> [Get Values from Add Form] [Add to Object] and [Display in DOM]
  addForm.btn_save.click( function() {
    newStudent = {
      "id": addForm.idField.val(),
      "name": addForm.nameField.val(),
      "age": addForm.ageField.val(),
      "subject": addForm.subjectField.val(),
      "country": addForm.countryField.val(),
      "city": addForm.cityField.val()
    }
    crud.add(studentsInfo, addForm, newStudent)
    interaction.display(output, studentsInfo)
  })
  
  // Creating un-assigned variable for getting the index of the row for which edit icon is clicked
  let updateIndex;

  /* 
  ----------------
  UPDATE MECHANISM 
  ----------------
  */

  // Table -> Edit Icon -> [Find updateIndex in studentsInfo] [Display Update Form with Pre-filled Matching Information]
  output.on('click', 'i.editRowButton', function() {
    updateIndex = $( "i.editRowButton" ).index( this );
    if( updateIndex in studentsInfo ) {
      interaction.open(updateForm.ref);
    
      updateForm.ref.find(updateForm.idField).val(studentsInfo[updateIndex]['id'])
      updateForm.ref.find(updateForm.nameField).val(studentsInfo[updateIndex]['name'])
      updateForm.ref.find(updateForm.ageField).val(studentsInfo[updateIndex]['age'])
      updateForm.ref.find(updateForm.subjectField).val(studentsInfo[updateIndex]['subject'])
      updateForm.ref.find(updateForm.countryField).val(studentsInfo[updateIndex]['country'])
      updateForm.ref.find(updateForm.cityField).val(studentsInfo[updateIndex]['city'])
    };
    
    interaction.display(output, studentsInfo);
  })
  
  // Update Form -> Save button -> [Get values from Update Form] [Update matching student in the studentsInfo] [Display updated Info in DOM]
  updateForm.btn_update.click( function() {
    updatedStudent = {
      "id": updateForm.idField.val(),
      "name": updateForm.nameField.val(),
      "age": updateForm.ageField.val(),
      "subject": updateForm.subjectField.val(),
      "country": updateForm.countryField.val(),
      "city": updateForm.cityField.val()
    }
    crud.update(studentsInfo, addForm, updateIndex, updatedStudent);
    interaction.display(output, studentsInfo)
  })
  
  /* 
  ----------------
  DELETE MECHANISM 
  ----------------
  */

  // Table -> Delete Icon -> Delete Matching Object from studentsInfo
  output.on('click', 'i.deleteRowButton', function() {
    let index = $( "i.deleteRowButton" ).index( this );
    if( index in studentsInfo ) {
      studentsInfo.splice(index,1);
    }
    interaction.display(output, studentsInfo);
  })
  
// INTERACTIONS

  // Main Button -> Open Add Student Form
  addForm.btn_openAddStudentForm.click( function() { 
    interaction.open(addForm.ref);
  });

  // Cross Button -> Close Add Student Form
  addForm.btn_closeAddStudentForm.click( function() { 
    interaction.close(addForm.ref);
  });

  // Close Button -> Close Update Student Form
  updateForm.btn_closeUpdateStudentForm.click( function() { 
    interaction.close(updateForm.ref);
  });

  // Add Form Id Input -> Runtime Check for Existing Id
  addForm.idField.keyup( function(){
    validation.validateId(studentsInfo, addForm)
  });

  // Update Form Id Input -> Runtime check for Existing Id
  updateForm.idField.keyup( function(){
    validation.validateId(studentsInfo, updateForm)
  });
})
