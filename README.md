![Stormzy Logo](https://raw.githubusercontent.com/cstrnt/formzy/master/logo.png)

# Form Submissions Made Easy

## Motivation

I personally never knew what I should do with form submissions. It was quite obvious in the PHP days but I always struggled to find an easy to use solution in the modern JS world. Therefore I create **Formzy** which makes Form Submissions so easy that you never have to worry about it ever again.

## Usage

After you created a Form in the UI you will get unique URL where you can submit your Forms to. You can either add it to a plain form like this

```html
<form action="https://example.com/api/f/1" method="POST"></form>
```

or submit the data using a POST Request using `fetch` like this

```js
fetch('https://example.com/api/f/1', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ number: 42 }),
})
```

## Deployment

If you want to try out Formzy just click the button below
<br />
<br />
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/cstrnt/formzy/tree/master)

<br>

After the App is deployed go to the settings panel in heroku and click _Reveal Config Vars_. Add a new Key/Value pair like this

**KEY**

`APP_URL`

**VALUE**

` https://<your_heroku_app_name>.herokuapp.com`

e.g.
`https://formzy-demo.herokuapp.com`

Your app will then reload and you are good to go!
