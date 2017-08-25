import React from 'react';
import { render } from 'react-dom';

class Welcome extends React.Component {
  render() {
    return (
      <h1>欢迎使用 Taf Node Server Generator with Webpack config and React</h1>
    );
  }
}

render(<Welcome />, document.getElementById('target'));
