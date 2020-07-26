# PreLinks - eager caching for web pages

- Cached before even visited!
- TurboLinks on steroids :-)

This simple plugin loads and caches pages when the user shows a mere *intention to visit a link* - she just moves the cursor over the link and the target page is cached immediatelly.

That results in a very **quick navigating** among pages, **lower load**, and **better user experience**.

Once cached switching between links is super quick, the HTTP request is performed only once.

HTML head elements are merged, scripts are executed.

Small (6 KB) and easy to use.

Best fit for server-side rendered websites. 

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
<script src="prelinks.min.js" id="prelinks" defer></script>
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
