angular.module('dev')
    .provider('templateFactory', function() {

        var self = this;
        var templates = {

        };

        this.template = function(name, template) {

            if (angular.isObject(template)) {
                templates[name] = template;
                return this;
            }

            if (template.startsWith("<")) {
                templates[name] = {
                    template: template
                };
            } else if (template.endsWith(".html")) {
                templates[name] = {
                    templateUrl: template
                };
            } else {
                templates[name] = {
                    templateUrl: this.baseTemplateUrl + template + ".html"
                };
            }
            return this;
        };

        this.baseTemplateUrl = "/templates/field/";
        this.defaultTemplateName = "default";

        this.$get = function($q, $templateCache, $http) {

            return {
                getTemplate: function(type) {

                    var templateName = type || self.defaultTemplateName;

                    var template = templates[templateName];
                    if (!template)
                        return $q.reject('The template ' + templateName + "' could not be found and no default template could be found.");

                    if (template.template) {
                        return $q.when(angular.element(template.template));
                    }

                    
                    var defer = $q.defer();

                    $http.get(template.templateUrl, { cache: $templateCache })
                        .then(function(response) {
                            defer.resolve( angular.element(response.data));

                        }, function (response) {
                            defer.reject("The template '" + templateName + "' failed to download from '" + template.templateUrl + "'.");
                        });
                    return defer.promise;
                },
                /*
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
                */
            };
        };
    });