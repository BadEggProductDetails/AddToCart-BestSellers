module.exports = (title, app, props) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="/style.css">
    <title>${title}</title>
  </head>
  <body>
    <div id="app">${app}</div>
  </body>
  <script
  crossorigin
  src="https://unpkg.com/react@16/umd/react.development.js"
></script>
<script
  crossorigin
  src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"
></script>
  <script src="/bundle.js"></script>
  <script>
    // ReactDOM.hydrate(
    // React.createElement(App, { data: JSON.parse(${"'" + props + "'"}) }),
    //   document.getElementById('app')
    // );
  </script>
</html>
`;
