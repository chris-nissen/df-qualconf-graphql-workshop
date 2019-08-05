import React from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';

const layout: React.FunctionComponent = props => (
  <div>
    <NavMenu />
    <Container>
      {props.children}
    </Container>
  </div>
);
export default layout;
