Package.describe({
  summary: 'Simple error display via `{{> pageErrors}}` template and `PageErrors.raise(msg)`.'
});

Package.on_use(function (api) {
	api.use(['minimongo', 'mongo-livedata', 'templating'], 'client');
	api.add_files(['errors.html', 'errors.js'], 'client');
	if (api.export) {
		api.export("PageErrors");
	}
});
