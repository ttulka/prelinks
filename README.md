# PreLinks - cached even before clicked!

This simple plugin will load and cache pages right when the user shows a mere intention to visit a link (move the cursor upon the link).

That results in a very quick navigating among pages, lower load, and great user experience.

## Usage

Put the script to the bottom of `<body>` into each HTML page:

```html
<script src="prelinks.min.js" type="module" id="prelinks"></script>
```

## Demo

https://ttulka.github.io/prelinks/index.html

## Build

```
npm i
./node_modules/.bin/rollup -c
```
