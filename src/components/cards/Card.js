import React from 'react';
import PropTypes from 'prop-types';
import { Box, Heading, Text } from 'grommet';


const Card = ({ title, subTitle, children, border, borderTitle }) => (
  <Box pad='small' margin='small' border='all' align='center' >
    <Box border={borderTitle} direction='row' align='center'>
      <Heading level={2} margin='none'>{title}</Heading>
    </Box>
    <Box margin='small'>
      <Text size='medium'><strong>{subTitle}</strong></Text>
    </Box>
    <Box pad='small' border={border}>
      <Box >
        {children}
      </Box>
    </Box>
  </Box>
);

Card.defaultProps = {
  border: null,
  borderTitle: null,
};

Card.propTypes = {
  border: PropTypes.string,
  borderTitle: PropTypes.string,
};

export default Card;