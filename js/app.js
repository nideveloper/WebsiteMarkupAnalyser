
function findAll(placeToSearch, jQueryExpression){
    return $(placeToSearch).filter(jQueryExpression).add($(placeToSearch).find(jQueryExpression))
}

function processInputElements(processObject){
    for(var i = 0; i < processObject.inputs.length; i++){
        var input = $.parseHTML(processObject.inputs[i]);

        if (($(input).attr('type') !== 'submit') && ($(input).attr('type') !== 'button')) {
            if ($(input).attr('id') == undefined) {
                processObject.inputsWithoutID.push({
                    name : $(input).attr('name'),
                    type : $(input).attr('type'),
                    tagName : $(input).get(0).tagName ,
                    displayString : $(input).attr('name') + ' - ' + $(input).get(0).tagName + ' - ' + $(input).attr('type'),
                    originalHTML : $(input).prop('outerHTML')
                });
            }
            else if ($(input).attr('type') !== 'hidden') {

                var jQueryExpression = 'label[for="' + $(input).attr('id') + '"]';
                var label = findAll(window.html, jQueryExpression);
                if (label.length == 0) {
                    var type = $(input).attr('type');
                    var inputString = $(input).attr('id') + ' - ' + $(input).get(0).tagName;
                    if(undefined !== type){
                        inputString = inputString + ' - ' + $(input).attr('type')
                    }
                    processObject.inputsWithoutLabel.push({
                        id : $(input).attr('id'),
                        name : $(input).attr('name'),
                        tagName : $(input).get(0).tagName,
                        displayString : inputString,
                        originalHTML : $(input).prop('outerHTML')
                    });
                }
                
            }

            if ($(input).attr('name') == undefined) {
                processObject.inputsWithoutName.push({
                    id : $(input).attr('id'),
                    type : $(input).attr('type'),
                    tagName : $(input).get(0).tagName,
                    displayString : $(input).attr('id') + ' - ' + $(input).get(0).tagName + ' - ' + $(input).attr('type'),
                    originalHTML : $(input).prop('outerHTML')
                });
            }

            if ($(input).attr('type') === 'radio') {
                if ($(input).attr('data-validationLabel') == undefined) {
                    processObject.radiosWithoutValidationLabel.push({
                        id : $(input).attr('id'),
                        name : $(input).attr('name'),
                        displayString : $(input).attr('name'),
                        originalHTML : $(input).prop('outerHTML')
                    });
                }
            }
        }
    }
}

function processTables(processObject){
    for(var i = 0; i < processObject.tables.length; i++){
        var table = $.parseHTML(processObject.tables[i]);

        var firstCellIsHeader = $(table).find('tr').first().children().first().is("th");
        if (firstCellIsHeader !== true) {
            processObject.numHeadlessTables++;
        }
    }
}

function processNumInlineStyles(processObject){
    $(window.html).find('*').each(function () {
        if ($(this).attr('style') != undefined) {
            processObject.numInlineStyles++;
        }
    });
}

function processNumInlineScripts(processObject, rawScripts){
    for(var i = 0; i < rawScripts.length; i++){
        var script = $(rawScripts[i]);

        if ($(script).attr('src') == undefined) {
            processObject.totalNumInlineScripts++;
        }
    }
}

function IQNavigator(form){
    return true
}

function processReferenceData(processObject, screenVariables){
    var ETMData = {};

    if(!$.isEmptyObject(screenVariables)){
        var editNameList = screenVariables['iqNavigator.submitter.validator.editNameList'].split(',');
        var editMessageFieldName = screenVariables['iqNavigator.submitter.validator.editMessageFieldName'].split(',');
        var editTypeList = screenVariables['iqNavigator.submitter.validator.editTypeList'].split(',');
        var editVal1List = eval(screenVariables['iqNavigator.submitter.validator.editVal1List']);
        var editVal2List = eval(screenVariables['iqNavigator.submitter.validator.editVal2List']);
        var editVal3List = eval(screenVariables['iqNavigator.submitter.validator.editVal3List']);
        var editMessageList = eval(screenVariables['iqNavigator.submitter.validator.editMessageList']);

        

        for(var i = 0; i< editNameList.length; i++){
            if(editNameList[i] !== ''){
                if(typeof ETMData[editNameList[i]] == 'undefined'){
                    ETMData[editNameList[i]] = [];
                }
                ETMData[editNameList[i]].push({
                    fieldName: editNameList[i],
                    displayName : editMessageFieldName[i],
                    validationType : editTypeList[i],
                    val1 : editVal1List[i],
                    val2 : editVal2List[i],
                    val3 : editVal3List[i],
                    validationMessage : editMessageList[i]
                });
            }
        }
    }

    processObject.ETMData = ETMData;
}

/* A function creator for callbacks */
function processDOMResponse(response) {
    window.html = response.screenHTML;
    var screenVariables = response.screenVariables;

    var url = '';
    var safeObject;
    var safeNameObject;
    var safeLabelObject;
    var safeRadioObject;
    var rawScripts = findAll(window.html, 'script');
    var processObject = {
        inputs : [],
        tables : [],
        title : $(window.html).filter('title').text(),
        scripts : [],
        styles : [],
        inputsWithoutID : [],
        inputsWithoutName : [],
        inputsWithoutLabel : [],
        radiosWithoutValidationLabel : [],
        numInlineStyles : 0,
        numHeadlessTables : 0,
        numTables : 0,
        numInputs : 0,
        totalNumScripts : 0,
        totalNumInlineScripts : 0,
        ETMData : {}
    };

    /*To avoid circular references we can only store the object as a string */
    $(findAll(window.html, 'input, select, textarea')).each(function(){
        processObject.inputs.push($(this).prop('outerHTML'));
    });

    $(findAll(window.html, 'table')).each(function(){
        processObject.tables.push($(this).prop('outerHTML'));
    });

    $(findAll(window.html, 'script')).each(function(){
        processObject.scripts.push($(this).prop('outerHTML'));
    });

    $(findAll(window.html, 'style')).each(function(){
        processObject.styles.push($(this).prop('outerHTML'));
    });

    processObject.numTables = processObject.tables.length;
    processObject.numInputs = processObject.inputs.length;
    processObject.totalNumScripts = processObject.scripts.length;

    /*Logic to process elements */

    processInputElements(processObject);
    processTables(processObject);
    processNumInlineStyles(processObject);
    processNumInlineScripts(processObject, rawScripts);
    processReferenceData(processObject, screenVariables);

    //creare a tab
    chrome.tabs.create({ 'url': 'tab.html' }, function (tab) {

        var listener = function(tabID , info, tabChanged) {
            //if the tab we created is loaded
            if ((info.status == "complete")&&(tabID == tab.id)) {
                //send it a message
                chrome.tabs.sendMessage(tab.id, 
                {
                    "messageName" : 'processValues',
                    'processObject' : processObject
                });
                chrome.tabs.onUpdated.removeListener(listener);
            }
        }
        //bind a listener to opening tabs
        chrome.tabs.onUpdated.addListener(listener);
    });

        
}


chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, { text: "parse_DOM" }, processDOMResponse);
});


