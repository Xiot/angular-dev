angular.module('dev').service('notificationService', function(toastr){
	
	var activeNotifications = [];


	//BRAIN DUMP: Notifications will be added and stored in a collection
	// when they are first added, they will toast.
	// after that they will be kept in a public list for other services/directives to deal with
	// first idea - have a facebook style notification menu that shows the latest x notifications
	// this will probably be piped into via SignalR or similar

	// public interface
	// - toast on add
	// - max notifications to keep

	// notification interface
	// - dismiss - removes it from the list of notificaitons
	// - is_read - marks if the notification was read by the user
	// - message
	// - title
	// - type
	// - datetime

	this.info = function(title, msg){
		activeNotifications.push({title: title, message: msg});

		toastr.info(msg, title);
	}

});