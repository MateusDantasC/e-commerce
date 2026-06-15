const Message = ({ variant = 'error', children }) => {
  const className = variant === 'success'
    ? 'nc-alert-success'
    : 'nc-alert-error';

  return <div className={className}>{children}</div>;
};

export default Message;