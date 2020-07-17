# PreLinks - cached before clicked

This simple plugin loads and caches pages when the user shows a mere intention to visit a link (she moves the cursor over the link).

That results in a very quick navigating among pages, lower load, and better user experience.

## Demo

<https://ttulka.github.io/prelinks/index.html>

## Build

```sh
npm i
./node_modules/.bin/rollup -c
```

## Usage

Put the script to the bottom of `<body>` into each HTML page:

```html
<script src="prelinks.min.js" type="module" id="prelinks" defer></script>
```

### Settings

#### Disable prelinks for a link

To disable prelinks on a particular link, add the attribute `data-prelinks="false"`:

```html
<a href="..." data-prelinks="false">...</a>
```

#### Disable caching for a link

To disable caching for a particular link, add the attribute `data-prelinks-cache="false"`:

```html
<a href="..." data-prelinks-cache="false">...</a>
```

#### Progress action

To enable an action for loading a page, put a meta tag `prelinks-progress` into `<head>`:

```html
<meta name="prelinks-progress" content="blur">
```

Possible values for `content` are:

- `none` (default)
  - no action
- `blur`
  - blur page

#### Disable all caching

To disable caching completelly, put a meta tag `prelinks-cache-control` with `content="no-cache"` into `<head>`:

```html
<meta name="prelinks-cache-control" content="no-cache">
```
