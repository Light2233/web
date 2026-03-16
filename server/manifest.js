const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["robots.txt","styles/design_system.css","styles/flex.less","styles/nullstyle.css","styles/roots.css"]),
	mimeTypes: {".txt":"text/plain",".css":"text/css",".less":"text/less"},
	_: {
		client: {start:"_app/immutable/entry/start.DLs55e5z.js",app:"_app/immutable/entry/app.BK9Y3blf.js",imports:["_app/immutable/entry/start.DLs55e5z.js","_app/immutable/chunks/c4I0w_Hd.js","_app/immutable/chunks/B4M7RMlc.js","_app/immutable/chunks/C3nK0z1T.js","_app/immutable/entry/app.BK9Y3blf.js","_app/immutable/chunks/B4M7RMlc.js","_app/immutable/chunks/BMyqTN10.js","_app/immutable/chunks/w2BGC93N.js","_app/immutable/chunks/C3nK0z1T.js","_app/immutable/chunks/FItBq93K.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-Bt2wsrGG.js')),
			__memo(() => import('./chunks/1-BcS8-jx0.js')),
			__memo(() => import('./chunks/2-DomOerGJ.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
