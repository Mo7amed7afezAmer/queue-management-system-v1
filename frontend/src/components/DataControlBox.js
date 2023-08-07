const DataControlBox = (props) => {
    return (
        <div className="data-control-box" id={`dataInfo_${props.id}`}>
            <div className="data-box">
                <h6 className="data-name">{ props.name }</h6>
                <p className="data-des">{ props.des }</p>
            </div>
            <div className="control-box">
                <input type="hidden" id="editAndDelete" value={ props.id } />
                <button 
                className="edit bg-success" id={`${props.id}`} onClick={ props.editClick }>edit</button>
                <button className="delete bg-danger" id={ props.id } onClick={ props.delClick }>delete</button>
            </div>
        </div>
    );
}

export default DataControlBox;