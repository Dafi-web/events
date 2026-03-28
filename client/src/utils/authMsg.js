/** Map API `msg` codes from auth routes to LanguageContext keys. */
export function translateAuthMsg(msg, t) {
  if (!msg || typeof msg !== 'string') return t('errServer');
  const map = {
    valid_email_required: 'errValidEmail',
    token_required: 'errTokenRequired',
    password_min_6: 'errPasswordMin',
    invalid_or_expired_token: 'errExpiredToken',
    invalid_current_password: 'errInvalidCurrentPassword',
    current_password_required: 'errCurrentPasswordRequired',
    password_reset_success: 'passwordResetSuccess',
    password_updated: 'passwordChangedSuccess',
    server_error: 'errServer',
    user_not_found: 'errServer'
  };
  const key = map[msg];
  if (key) return t(key);
  return msg;
}
