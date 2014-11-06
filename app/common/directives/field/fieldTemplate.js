angular.module('dev')
    .provider('fieldTemplate', function() {

        var self = this;
        var templates = {};

        this.setTemplateFor = function(fieldType, template) {
            templates[fieldType] = template;
        };

        this.baseTemplateUrl = "/template/field/";
        this.defaultTemplate = "input";

        this.$get = function($templateCache, $http) {

            return {
                getTemplate: function(type) {

                    var templateName = templates[type] || self.defaultTemplate;
                    var templatePath = self.baseTemplateUrl + templateName + ".html";

                    return $http.get(templatePath, { cache: $templateCache })
                        .then(function(response) {
                            return angular.element(response.data);

                        }, function(response) {
                            throw new Error("The template '" + template + "' was not found.");

                        });
                },
                getDisplayTemplate: function(type) {

                    var templateName = templates[type] || self.defaultTemplate;
                    var templatePath = self.baseTemplateUrl + templateName + '-display' + ".html";

                    return $http.get(templatePath, { cache: false })
                        .then(function(response) {
                            return angular.element(response.data);

                        }, function(response) {
                            throw new Error("The template '" + template + "' was not found.");

                        });
                },
                getDisplayTemplateUrl: function(type) {
                    var templateName = templates[type] || self.defaultTemplate;
                    var templatePath = self.baseTemplateUrl + templateName + '-display' + ".html";
                    return templatePath;
                }
            };
        };
    });