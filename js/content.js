function retrieveWindowVariables(variables) {
    var ret = {};

    var scriptContent = "";

    scriptContent = "if(typeof iqNavigator !== 'undefined'){if(typeof iqNavigator.submitter !== 'undefined'){if(typeof iqNavigator.submitter.validator !== 'undefined'){jQuery('body').attr('tmp_iqNavigator_submitter_validator_editNameList', iqNavigator.submitter.validator.editNameList);}}}\n";
    scriptContent += "if(typeof iqNavigator !== 'undefined'){if(typeof iqNavigator.submitter !== 'undefined'){if(typeof iqNavigator.submitter.validator !== 'undefined'){jQuery('body').attr('tmp_iqNavigator_submitter_validator_editMessageFieldName', iqNavigator.submitter.validator.editMessageFieldName);}}}\n";
    scriptContent += "if(typeof iqNavigator !== 'undefined'){if(typeof iqNavigator.submitter !== 'undefined'){if(typeof iqNavigator.submitter.validator !== 'undefined'){jQuery('body').attr('tmp_iqNavigator_submitter_validator_editTypeList', iqNavigator.submitter.validator.editTypeList);}}}\n";
    scriptContent += "if(typeof iqNavigator !== 'undefined'){if(typeof iqNavigator.submitter !== 'undefined'){if(typeof iqNavigator.submitter.validator !== 'undefined'){jQuery('body').attr('tmp_iqNavigator_submitter_validator_editVal1List', JSON.stringify(iqNavigator.submitter.validator.editVal1List));}}}\n";
    scriptContent += "if(typeof iqNavigator !== 'undefined'){if(typeof iqNavigator.submitter !== 'undefined'){if(typeof iqNavigator.submitter.validator !== 'undefined'){jQuery('body').attr('tmp_iqNavigator_submitter_validator_editVal2List', JSON.stringify(iqNavigator.submitter.validator.editVal2List));}}}\n";
    scriptContent += "if(typeof iqNavigator !== 'undefined'){if(typeof iqNavigator.submitter !== 'undefined'){if(typeof iqNavigator.submitter.validator !== 'undefined'){jQuery('body').attr('tmp_iqNavigator_submitter_validator_editVal3List', JSON.stringify(iqNavigator.submitter.validator.editVal3List));}}}\n";
    scriptContent += "if(typeof iqNavigator !== 'undefined'){if(typeof iqNavigator.submitter !== 'undefined'){if(typeof iqNavigator.submitter.validator !== 'undefined'){jQuery('body').attr('tmp_iqNavigator_submitter_validator_editMessageList', JSON.stringify(iqNavigator.submitter.validator.editMessageList));}}}\n";

    var script = document.createElement('script');
    script.id = 'tmpScript';
    script.appendChild(document.createTextNode(scriptContent));
    jQuery('body').append(script);

    var headID = document.getElementsByTagName("head")[0];         
	headID.appendChild(script);

    ret['iqNavigator.submitter.validator.editNameList'] = jQuery("body").attr("tmp_iqNavigator_submitter_validator_editNameList");
    ret['iqNavigator.submitter.validator.editMessageFieldName'] = jQuery("body").attr("tmp_iqNavigator_submitter_validator_editMessageFieldName");
    ret['iqNavigator.submitter.validator.editTypeList'] = jQuery("body").attr("tmp_iqNavigator_submitter_validator_editTypeList");
    ret['iqNavigator.submitter.validator.editVal1List'] = jQuery("body").attr("tmp_iqNavigator_submitter_validator_editVal1List");
    ret['iqNavigator.submitter.validator.editVal2List'] = jQuery("body").attr("tmp_iqNavigator_submitter_validator_editVal2List");
    ret['iqNavigator.submitter.validator.editVal3List'] = jQuery("body").attr("tmp_iqNavigator_submitter_validator_editVal3List");
    ret['iqNavigator.submitter.validator.editMessageList'] = jQuery("body").attr("tmp_iqNavigator_submitter_validator_editMessageList");
    jQuery("body").removeAttr("tmp_iqNavigator_submitter_validator_editNameList");
    jQuery("body").removeAttr("tmp_iqNavigator_submitter_validator_editMessageFieldName");
    jQuery("body").removeAttr("tmp_iqNavigator_submitter_validator_editTypeList");
    jQuery("body").removeAttr("tmp_iqNavigator_submitter_validator_editVal1List");
    jQuery("body").removeAttr("tmp_iqNavigator_submitter_validator_editVal2List");
    jQuery("body").removeAttr("tmp_iqNavigator_submitter_validator_editVal3List");
    jQuery("body").removeAttr("tmp_iqNavigator_submitter_validator_editMessageList");

    jQuery("#tmpScript").remove();

    return ret;
}

/* Listen for messages */
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    var windowVariables = retrieveWindowVariables(["iqNavigator"]);

    if (msg.text && (msg.text == "parse_DOM")) {
        sendResponse({
            screenHTML: document.all[0].outerHTML, 
            screenVariables: windowVariables
        });
    }
});