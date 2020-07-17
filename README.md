# PreLinks - cached even before clicked!

This simple plugin will load and cache pages right when the user shows a mere intention to visit a link (move the cursor upon the link).

That results in a very quick navigating among pages, lower load, and great user experience.

## Usage

Put the script to the bottom of `<body>` into each HTML page:

```html
<script src="prelinks.min.js" type="module" id="prelinks" defer></script>
```

## Demo

https://ttulka.github.io/prelinks/index.html

## Build

```
npm i
./node_modules/.bin/rollup -c
```

## Advanced

### Disable prelinks

To disable prelinks on a particular link add the attribute `data-prelink="false"`:
```html
<a href="..." data-prelink="false">...</a>
```

### Progress actions

To enable an action for loading a page put a meta tag `prelinks-progress` into `<head>`:

```html
<meta name="prelinks-progress" content="blur">
```

Possible values for `content` are:
- `none` (default)
    - no action
- `blur`
    - blur page

### Disable caching

To disable caching for a page put a meta tag `prelinks-cache-control` with `content="no-cache"` into `<head>`:

```html
<meta name="prelinks-cache-control" content="no-cache">
```
