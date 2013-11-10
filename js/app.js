function addURLPrefix(url){
    if (url == '') {
        url += '?';
    } else {
        url += '&';
    }

    return url;
}

chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.executeScript(
    {
        code: "document.getElementsByTagName('html')[0].innerHTML;"
    },
    function (ps1) {
        var html = ps1[0];
        var inputs = $(html).find('input, select, textarea');
        var tables = $(html).find('table');
        var title = $(html).filter('title').text();
        var scripts = $(html).filter('script');
        var styles = $(html).filter('style');

        var inputsWithoutID = [];
        var inputsWithoutName = [];
        var inputsWithoutLabel = [];
        var radiosWithoutValidationLabel = [];
        var numInlineStyles = 0;
        var numHeadlessTables = 0;
        var numTables = tables.length;
        var numInputs = inputs.length;
        var url = '';
        var totalNumScripts = scripts.length;
        var totalNumInlineScripts = 0;
        var safeObject;
        var safeNameObject;
        var safeLabelObject;
        var safeRadioObject;

        $(inputs).each(function () {
            if (($(this).attr('type') !== 'submit') && ($(this).attr('type') !== 'button')) {
                if ($(this).attr('id') == undefined) {
                    inputsWithoutID.push($(this).attr('name') + ' - ' + $(this).get(0).tagName + ' - ' + $(this).attr('type'));
                }
                else {
                    if ($(this).attr('type') !== 'hidden') {
                        var label = $('label[for="' + $(this).attr('id') + '"]');
                        if (label.length == 0) {
                            inputsWithoutLabel.push($(this).attr('id') + ' - ' + $(this).get(0).tagName + ' - ' + $(this).attr('type'));
                        }
                    }
                }
                if ($(this).attr('name') == undefined) {
                    inputsWithoutName.push($(this).attr('id') + ' - ' + $(this).get(0).tagName + ' - ' + $(this).attr('type'));
                }

                if ($(this).attr('type') === 'radio') {
                    if ($(this).attr('data-validationLabel') == undefined) {
                        radiosWithoutValidationLabel.push($(this).attr('name'));
                    }
                }
            }
        });

        $(tables).each(function () {
            var firstCellIsHeader = $(this).find('tr').first().children().first().is("th");
            if (firstCellIsHeader !== true) {
                numHeadlessTables++;
            }
        });

        $(html).find('*').each(function () {
            if ($(this).attr('style') != undefined) {
                numInlineStyles++;
            }
        });

        scripts.each(function () {
            if ($(this).attr('src') == undefined) {
                totalNumInlineScripts++;
            }
        });

        safeObject = encodeURI(inputsWithoutID);
        safeNameObject = encodeURI(inputsWithoutName);
        safeLabelObject = encodeURI(inputsWithoutLabel);
        safeRadioObject = encodeURI(radiosWithoutValidationLabel);

        if (safeObject != '') {
            url = addURLPrefix(url);
            url += 'elementNames=' + safeObject;
        }

        if (safeNameObject.length != '') {
            url = addURLPrefix(url);
            url += 'elementIDs=' + safeNameObject;
        }

        if (safeLabelObject != '') {
            url = addURLPrefix(url);
            url += 'elementsWithoutLabel=' + safeLabelObject;
        }

        if (safeRadioObject != '') {
            url = addURLPrefix(url);
            url += 'radiosWithoutValidationLabel=' + safeRadioObject;
        }

        if (numInlineStyles > 0) {
            url = addURLPrefix(url);
            url += 'numInlineStyles=' + numInlineStyles;
        }

        if (numTables > 0) {
            url = addURLPrefix(url);
            url += 'numTables=' + numTables;
        }

        if (numInputs > 0) {
            url = addURLPrefix(url);
            url += 'numInputs=' + numInputs;
        }

        if (numHeadlessTables > 0) {
            url = addURLPrefix(url);
            url += 'numHeadlessTables=' + numHeadlessTables;
        }

        if (totalNumScripts > 0) {
            url = addURLPrefix(url);
            url += 'totalNumScripts=' + totalNumScripts;
        }

        if (totalNumInlineScripts > 0) {
            url = addURLPrefix(url);
            url += 'totalNumInlineScripts=' + totalNumInlineScripts;
        }

        if (title != '') {
            url = addURLPrefix(url);
            url += 'title=' + title;
        }

        chrome.tabs.create({ 'url': 'tab.html' + url }, function (tab) {
            // Tab opened.
        });

    }
  );
});


