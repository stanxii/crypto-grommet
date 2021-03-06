import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { graphql } from 'react-apollo';
import { Box, Text, Anchor, Button } from 'grommet';
import { Form, EmailInputField, validators } from 'grommet-controls';
import connect from '../../redux';
import { addError, addSuccessMessage } from '../../redux/notifications/actions';
import ForgotPasswordMutation from './graphql/ForgotPassword.graphql';

class ResetPasswordForm extends Component {
  getServerErrors(err) {
    if (err.graphQLErrors || err.networkError) {
      const message = err.graphQLErrors.length ?
        err.graphQLErrors[0].message : err.networkError.result.errors[0].message;
      this.props.addError(message);
    }
  }

  onSubmitReset = ({ email }) => {
    this.props.mutate({
      variables: { email },
    })
      .then((response) => {
        if (response.data && response.data.resetPassword.success) {
          this.props.addSuccessMessage(`A link was sent to your email (${response.data.resetPassword.email}).`);
          if (this.props.onClose) {
            this.props.onClose();
          }
        }
      })
      .catch((err) => {
        this.getServerErrors(err);
      });
  };

  render() {
    const { onSwitchLogin } = this.props;
    return (
      <Box gap='small'>
        <Text color='status-disabled' size='small'>
          Remembered your password? <Anchor label='log in' onClick={onSwitchLogin} />
        </Text>
        <Form onSubmit={this.onSubmitReset} basis='medium'>
          <EmailInputField label='Email' name='email' validation={[validators.required(), validators.email()]} />
          <Box pad='small'>
            <Button type='submit' label='Submit' />
          </Box>
        </Form>
      </Box>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ addError, addSuccessMessage }, dispatch);

export default graphql(ForgotPasswordMutation)(
  connect(null, mapDispatchToProps)(ResetPasswordForm)
);
