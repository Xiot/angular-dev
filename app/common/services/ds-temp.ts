module CoreServices {

	import bs = ng.ui.bootstrap;

	export interface IDialogService {
		
		show(name: string, data? : any) : bs.IModalServiceInstance;
		//show(options: bs.IModalSettings) : bs.IModalServiceInstance;
		
	}

	export class DialogServiceProvider implements  ng.IServiceProvider{
		
		public dialogs : {[name: string]: bs.IModalSettings } = {};
		
	public add(name: string, options: bs.IModalSettings) {
		this.dialogs[name] = options;
	}

	//TODO: addAllInNamespace
		
	// @ngInject
	public $get($modal: bs.IModalService)
	{
		return new DialogService(this, $modal);
	}
}

	export class DialogService implements IDialogService {
		
		constructor(private provider : DialogServiceProvider, private $modal : ng.ui.bootstrap.IModalService) {
			
		}

		public show(name: string, data?: any): bs.IModalServiceInstance {

			var opts = this.provider.dialogs[name];
			if (!opts)
				throw new Error('The dialog \'' + name + '\' was not defined.');
			
			var normalizedData = this._normalizeData(data);
			var resolve = angular.extend({}, opts.resolve, normalizedData);

			opts = angular.extend({}, opts, { resolve: resolve });

			var instance = this.$modal.open(opts);
			return instance;

		}

		private _normalizeData(data: any): any {

			var resolve: any = {};
			if (!data)
				return resolve;

			if (angular.isObject(data)) {

				angular.forEach(data, (value, key) => {

					if (angular.isFunction(value)) {
						resolve[key] = value;

			} else if (angular.isArray(value)) {
				// Supports minified ready array syntax
				resolve[key] = value;

			} else {
				resolve[key] = function() { return value; };
			}
		});
	} else {
				resolve.data = function() { return data; };
}

return resolve;
}
}
}