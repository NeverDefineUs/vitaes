import React from "react";

const TextInput = React.forwardRef((props, ref) => {
    return (
        <div ref={ref}>
            <input placeholder={props.placeholder} className={props.className} type="text" name={props.name}></input>   
        </div>
    )
})

export default TextInput;   