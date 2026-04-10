export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.D81yahvK.js",app:"_app/immutable/entry/app.DRT5Mwyz.js",imports:["_app/immutable/entry/start.D81yahvK.js","_app/immutable/chunks/NfEZJUCm.js","_app/immutable/chunks/DieibMJy.js","_app/immutable/chunks/S10D31sG.js","_app/immutable/entry/app.DRT5Mwyz.js","_app/immutable/chunks/CIARrzKj.js","_app/immutable/chunks/DieibMJy.js","_app/immutable/chunks/CDfSM0js.js","_app/immutable/chunks/DZsrOxA9.js","_app/immutable/chunks/S10D31sG.js","_app/immutable/chunks/hAFslpYW.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		remotes: {
			
		},
		routes: [
			
		],
		prerendered_routes: new Set(["/"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
