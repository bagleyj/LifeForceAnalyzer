/* 
 This file was generated by Dashcode.  
 You may edit this file to customize your widget or web page 
 according to the license.txt file included in the project.
 */

var gFolderKey = "energy-folder";
var gSystemCommand; // pending append command - no
var gEntry;


//
// Function: load()
// Called by HTML body element's onload event when the widget is ready to start
//
function load()
{
    dashcode.setupParts();
}

//
// Function: remove()
// Called when the widget has been removed from the Dashboard
//
function remove()
{
    // Stop any timers to prevent CPU usage
    // Remove any preferences as needed
    // widget.setPreferenceForKey(null, dashcode.createInstancePreferenceKey("your-key"));
}

//
// Function: hide()
// Called when the widget has been hidden
//
function hide()
{
    // Stop any timers to prevent CPU usage
}


function makeKey(key)
{
   if (window.widget)
   {
      //!! Identifier changes each time.
      //return widget.identifier + "-" + key;
      return key;
   }
   return key;
}


//
// Function: show()
// Called when the widget has been shown
//
function show()
{
   var key = makeKey(gFolderKey);
   var folder = widget.preferenceForKey(key);
   console.log("Preference for key " + key + " is " + folder + ".");
   
   var fEnergyFileFolder = document.getElementById("fEnergyFileFolder");
   fEnergyFileFolder.value = folder;

    // Restart any timers that were stopped on hide
   if (undefined == folder)
   {
      console.log("Showing back.");
      showBack(event);
   }
}

//
// Function: sync()
// Called when the widget has been synchronized with .Mac
//
function sync()
{
    // Retrieve any preference values that you need to be synchronized here
    // Use this for an instance key's value:
    // instancePreferenceValue = widget.preferenceForKey(null, dashcode.createInstancePreferenceKey("your-key"));
    //
    // Or this for global key's value:
    // globalPreferenceValue = widget.preferenceForKey(null, "your-key");
}

//
// Function: showBack(event)
// Called when the info button is clicked to show the back of the widget
//
// event: onClick event from the info button
//
function showBack(event)
{
    var front = document.getElementById("front");
    var back = document.getElementById("back");

    if (window.widget) {
        widget.prepareForTransition("ToBack");
    }

    front.style.display = "none";
    back.style.display = "block";

    if (window.widget) {
        setTimeout('widget.performTransition();', 0);
    }
}


function energyFileFolder()
{
   var fEnergyFileFolder = document.getElementById("fEnergyFileFolder");
   return fEnergyFileFolder.value;
}

   
function saveEnergyFileFolder()
{
   var fEnergyFileFolder = document.getElementById("fEnergyFileFolder");

   if (window.widget)
   {
      var folder = fEnergyFileFolder.value;
      if (folder[folder.length - 1] !== '/')
      {
         folder += '/';
         fEnergyFileFolder.value = folder;
      }
      
      var key = makeKey(gFolderKey);
      console.log("Saving energy file folder: " + fEnergyFileFolder.value + " to key " + key + ".");
      widget.setPreferenceForKey(folder, key);
   }
}


function endBack(event)
{
   if (undefined != energyFileFolder())
   {
      saveEnergyFileFolder();
      
      showFront(event);
   }
}


function updateAmount(bcOutput)
{
   var result = bcOutput.replace('\n','');
   if (-1 == result.indexOf('.'))
   {
      result += '.00';
   }
   if ('$' != result[0])
   {
      result = '$' + result;
   }
   document.getElementById('fAmount').value = '$' + result;
}


function endBcProcessing(bc)
{
   if (typeof bc == 'object' && bc.outputString != 'undefined' && bc.outputString)
   {
      console.log('bc output: ' + bc.outputString);
      updateAmount(bc.outputString);
      validateAmount(document.getElementById('fAmount'));
   }
}


function processAmountCalculation(event)
{
   amountField = document.getElementById('fAmount');

   var amount = amountField.value;
   if (amount[0] == '=')
   {
      // Pass the calculation to end handler.
      var calculation = amount.substring(1, amount.length);
      console.log(calculation);
      
      var command = '/bin/echo "scale=2;' + calculation + '" | /usr/bin/bc -q';
      widget.system(command, endBcProcessing);
   }
   else
   {
      validateAmount(amountField);
   }
}


//
// Function: showFront(event)
// Called when the done button is clicked from the back of the widget
//
// event: onClick event from the done button
//
function showFront(event)
{
    var front = document.getElementById("front");
    var back = document.getElementById("back");

    if (window.widget) {
        widget.prepareForTransition("ToFront");
    }

    front.style.display="block";
    back.style.display="none";

    if (window.widget) {
        setTimeout('widget.performTransition();', 0);
    }
}

if (window.widget) {
    widget.onremove = remove;
    widget.onhide = hide;
    widget.onshow = show;
    widget.onsync = sync;
}


function validateAll(event)
{
   // Reset results area
   var fResults = document.getElementById('fResults');
   setValidatedStyle(fResults, true);
   fResults.innerText = "";
   
   var enterButton = document.getElementById('fAppendEntry');

   //enterButton.object.setEnabled(false);
   
   var dateIsValid = validateDate(document.getElementById('fDate'));

   var payeeEntered = validateValueExists(document.getElementById('fPayee'));
   var accountsEntered = validateValueExists(document.getElementById('fAccounts'));
   
   // If the amount field contains a calculation starting with '=' and use bc
   // system command to handle it if so.
   var amountIsValid = validateAmount(document.getElementById('fAmount'));

   var doEnableEnter = (dateIsValid && payeeEntered &&
    accountsEntered && amountIsValid);
    
   //enterButton.object.setEnabled(doEnableEnter);
   
   return doEnableEnter; // is the data valid?
}


function setValidatedStyle(textField, isValid)
{
   if (isValid)
   {
      textField.style.backgroundColor = '#fff'; // white
   }
   else
   {
      textField.style.backgroundColor = '#fba'; // red
   }
}


function validateValueExists(textField)
{
   var valueExists = ("" != textField.value);
   setValidatedStyle(textField, valueExists);
}



function validateText(textField, regex)
{
   var isValid = (null != textField.value && regex.test(textField.value));
   setValidatedStyle(textField, isValid);
   return isValid;
}


function validateAmount(amountField)
{
   return validateText(amountField, /^\$?[0-9]?[0-9]*\.[0-9][0-9]$/);
}


function validateDate(dateField)
{
   var seconds = Date.parse(dateField.value);
   //console.log(seconds);
   var valid = !isNaN(seconds);
   //console.log(valid);
   setValidatedStyle(dateField, valid);
   return valid;
   
   //console.log(!(seconds !== seconds));
   //console.log(!(+seconds - seconds !== 0));
   //return ((+seconds - seconds) !== 0); // test for NaN
}


function expenseFileNameForDate(date)
{
   console.log(date);
   // Date return 0 - 11 for month
   var month = date.getMonth() + 1;
   if (month < 10)
   {
      month = "0" + month;
   }
   var fileName = "Expense-" + month + "-" + date.getFullYear() + ".txt"
   //console.log(fileName);

   return fileName
}


function appendDone(command)
{
   // TODO: Display some output of lifeforceanalyzer for the new entry alone.
   var resultsField = document.getElementById('fResults');
   if (command.errorString == undefined)
   {
      resultsField.innerText = gEntry;
      resultsField.style.backgroundColor = '#afb'; // green
   }
   else
   {
      resultsField.innerText = command.errorString;
      resultsField.style.backgroundColor = '#fba'; // red

   }
   delete gSystemCommand;
   gSystemCommand = null;
}


function appendEntryAndShowResult(event)
{
   var dateField = document.getElementById('fDate');
   var date = new Date(dateField.value);
   
   var payeeField = document.getElementById('fPayee');
   var accountsField = document.getElementById('fAccounts');
   var amountField = document.getElementById('fAmount');
   var amount = amountField.value;
   if (amount[0] != '$')
   {
      amount = '$' + amount;
   }
   // Quote the dollar sign to prevent interpreting it as a var in shell.
   amount = "\\" + amount;
   
   gEntry = dateField.value + '\t' + payeeField.value + '\t' +
    accountsField.value + '\t' + amount;
   //console.log(entry);
   
   var date = new Date(dateField.value);
   var fileName = expenseFileNameForDate(date);

   var folder = energyFileFolder();
   var filePath = folder + fileName;
   //console.log(filePath);
   
   var command = "/bin/echo \"" + gEntry + "\" >> " + filePath;
   console.log("Appending with command: " + command);
   
   gSystemCommand = widget.system(command, appendDone);
}

