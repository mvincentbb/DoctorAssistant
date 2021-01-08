import React from 'react';


const Message = ({content, isDismissible, mode, msg}) => (
    <li className="messenger-message-slot">
		<div className="messenger-message message alert success message-success alert-success messenger-will-hide-after messenger-will-hide-on-navigate messenger-hidden">
			<div className="messenger-message-inner">Transaction Completed Successfully!</div>
		</div>
	</li>
)

export default Message;