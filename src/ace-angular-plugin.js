/**
 * ACE
 */
angular.module('ng')
    .directive('ace', function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            transclude: true,
            template: '<div class="transcluded" ng-transclude></div><div class="ace-editor"></div>',
            link: function (scope, element, attrs, ngModel) {
            	if (!ngModel)
                    return; // do nothing if no ngModel

                function buildEditor(container, textarea, mode) {
                    textarea.hide();
                    var element = $('<div/>', {
                        position: 'absolute',
                        width: textarea.width(),
                        height: textarea.height(),
                        'class': textarea.attr('class')
                    }).insertBefore(textarea);
                    var toggleFullBtn = $('<i class="icon-fullscreen" style="cursor:pointer;"></i>').on('click', resizeEditor);
                    var themeSelect = $('<select style="border: 1px solid;background-color: white;color: black;width:auto;height:auto;line-height: auto;font-size: 10px;padding: 1px;border-radius: 0px;float:right;"><optgroup label="Bright"><option value="chrome">Chrome</option><option value="clouds">Clouds</option><option value="crimson_editor">Crimson Editor</option><option value="dawn">Dawn</option><option value="dreamweaver">Dreamweaver</option><option value="eclipse">Eclipse</option><option value="github">GitHub</option><option value="solarized_light">Solarized Light</option><option value="textmate">TextMate</option><option value="tomorrow">Tomorrow</option><option value="xcode" selected>XCode</option><option value="kuroir">Kuroir</option><option value="katzenmilch">KatzenMilch</option></optgroup><optgroup label="Dark"><option value="ambiance">Ambiance</option><option value="chaos">Chaos</option><option value="clouds_midnight">Clouds Midnight</option><option value="cobalt">Cobalt</option><option value="idle_fingers">idle Fingers</option><option value="kr_theme">krTheme</option><option value="merbivore">Merbivore</option><option value="merbivore_soft">Merbivore Soft</option><option value="mono_industrial">Mono Industrial</option><option value="monokai">Monokai</option><option value="pastel_on_dark">Pastel on dark</option><option value="solarized_dark">Solarized Dark</option><option value="terminal">Terminal</option><option value="tomorrow_night">Tomorrow Night</option><option value="tomorrow_night_blue">Tomorrow Night Blue</option><option value="tomorrow_night_bright">Tomorrow Night Bright</option><option value="tomorrow_night_eighties">Tomorrow Night 80s</option><option value="twilight">Twilight</option><option value="vibrant_ink">Vibrant Ink</option></optgroup></select></select>').on('change', function(){
                    	changeTheme($(this).val());
                    });
                    var bar = $('<div class="navbar" style="width:'+(textarea.width()-20)+'px;padding: 5px 10px;margin: 0;font-size: 12px;border-radius: 1px;background-color: #f5f5f5;"></div>')
                    	.append(toggleFullBtn)
                    	.append("<span class='btn' style='font-size: 13px;font-weight: bold;border-radius: 5px;background-color: #dddddd;margin:5px;'>"+mode.substring(0,1).toUpperCase()+mode.substring(1)+" Editor</span>")
                    	.append(themeSelect)
                    	.append($('<span class="add-on" style="float:right">Theme:</span>'))
                    .insertBefore(element);

                    var editor = ace.edit(element[0]);
                    editor.getSession().setValue(textarea.val());
                    editor.getSession().setMode("ace/mode/" + mode);
                    editor.setTheme("ace/theme/xcode");
                    editor.setShowPrintMargin(false);
                    editor.getSession().on('change', function () {
	                    if (!scope.$$phase) {
	                    	ngModel.$setViewValue(editor.getValue());
	                    	textarea.val(editor.getValue());
	                	}
	           		});
	           		
	           		function resizeEditor(){
	           			$(document.body).toggleClass("fullScreen");
	           			$(container).toggleClass("fullScreen-editor");
						$(bar).toggleClass("fullScreen-bar");						
						$(editor.container).toggleClass("fullScreen-editor");
				    	editor.resize();
	           		}
	           		
	           		function changeTheme(theme){
	           			editor.setTheme("ace/theme/"+theme);
	           		}
	           		
	           		editor.commands.addCommand({
					    name: 'Toggle Fullscreen',
					    bindKey: "F11",
					    exec: resizeEditor
					});

                    return editor;
                }

                var textarea = $(element).find('textarea');
                var editor = buildEditor(element, textarea, attrs.ace);

                scope.$watch(attrs.ngModel, function (value) {
                        editor.getSession().setValue(value);
                        textarea.val(value);
                });
            }
        }
    });