build:
	babel src/disqus-sdk.js --out-file dist/dist.js
	browserify dist/dist.js --output dist/dist.js	

