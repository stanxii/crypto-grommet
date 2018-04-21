import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { bindActionCreators } from 'redux';
import { graphql } from 'react-apollo';
import styled from 'styled-components';
import {
  Grommet,
  Responsive,
  Heading,
  Paragraph,
  Anchor,
  Markdown,
  Box,
} from 'grommet';
import { Notification } from 'grommet-controls';
import connect from '../redux';
import Notifications from './Notifications';
import RoutedAnchor from './RoutedAnchor';
import NavMenu from './NavMenu';
import { navActivate, updateResponsive } from '../redux/nav/actions';
import { signIn } from '../redux/auth/actions';
import CURRENT_USER_QUERY from './auth/graphql/CurrentUserQuery.graphql';

const LargeParagraph = styled(Paragraph)`
  max-width: 100%;
`;

class App extends Component {
  componentDidMount() {
    this.props.navActivate(false);
  }

  onResponsiveMenu = () => {
    const { navMenu: { active } } = this.props;
    this.props.navActivate(!active);
  };
  onResponsive = (size) => {
    this.props.updateResponsive(size === 'narrow');
  };


  onCloseMenu = () => {
    this.props.navActivate(false);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && nextProps.user !== this.props.user) {
      this.props.signIn({ user: nextProps.user });
    }
  }


  render() {
    const {
      children, description, title, visibleTitle, notifications, menu, showLogin,
    } = this.props;
    const keywords = ['grommet', 'grommet 2', 'react', 'next.js', 'crypto', 'cryptocurrencies'];
    if (title) {
      keywords.push(title);
    }

    let header;
    if (title) {
      header = (
        <Box direction='row' responsive={true} tag='header'>
          <Box margin={{ vertical: 'medium' }} align='start'>
            {visibleTitle !== undefined ? visibleTitle : (
              <Heading margin='none' level={1}>
                <strong>{title}</strong>
              </Heading>)
            }
            {description ? (
              <Box pad={{ vertical: 'medium' }}>
                <Markdown
                  components={{ p: { component: LargeParagraph, props: { size: 'medium' } } }}
                >
                  {description}
                </Markdown>
              </Box>
            ) : null}
          </Box>
        </Box>
      );
    }
    return (
      <div>
        <Head>
          {title && (
            <title>{title}</title>
            )
          }
          {typeof description === 'string' && (
            <meta name='description' content={description} />
            )
          }
          <meta name='keywords' content={keywords.join(',')} />
        </Head>
        <Grommet>
          <Responsive onChange={this.onResponsive}>
            <Box pad={{ horizontal: 'large', top: 'medium' }} gap='small'>
              <NavMenu showLogin={showLogin} />
              {menu && menu}
              <Notifications />
              {notifications && notifications.map(
                (msg, index) => (<Notification key={`msg_${index}`} {...msg} />)
              )}

              {header}
              {children}
              <Box
                tag='footer'
                direction='row'
                justify='center'
                pad={{ top: 'large' }}
              >
                <Box
                  basis='large'
                  border='top'
                  direction='row'
                  justify='center'
                  pad='medium'
                  gap='medium'
                >
                  <RoutedAnchor
                    route='about'
                    label='about'
                    a11yTitle='About crypto-grommet'
                  />
                  <Anchor
                    href='https://github.com/atanasster/crypto-grommet'
                    target='_blank'
                    label='git'
                    a11yTitle='Go to the github page for this project'
                  />
                </Box>
              </Box>
            </Box>
          </Responsive>
        </Grommet>
      </div>
    );
  }
}

App.propTypes = {
  description: PropTypes.string,
  notifications: PropTypes.array,
  menu: PropTypes.element,
  title: PropTypes.string.isRequired,
  visibleTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  showLogin: PropTypes.bool,
};

App.defaultProps = {
  notifications: undefined,
  description: undefined,
  menu: undefined,
  visibleTitle: undefined,
  showLogin: false,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({ signIn, navActivate, updateResponsive }, dispatch);

const mapStateToProps = state => ({
  nav: state.nav,
  accessToken: state.auth.accessToken,
});

export default connect(mapStateToProps, mapDispatchToProps)(graphql(CURRENT_USER_QUERY, {
  skip: ({ accessToken }) => !accessToken,
  props({ data: { loading, currentUser, refetch } }) {
    return { userLoading: loading, user: currentUser, refetchCurrentUser: refetch };
  },
})(App));