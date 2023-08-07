const MessageBox = (props) => {
    return (
        <div className={`msg-box ${props.msgData === "" ? "" : " open"}`}>
            <h6> { props.msgData } </h6>
        </div>
    )
}

export default MessageBox;