import React, { useState, useEffect } from "react";

const atScrollFocus = (ref) => {
    return (ref.getBoundingClientRect().top + window.scrollY) > window.scrollY;
};

const updateChildrenClass = (children) => {
    return React.Children.map(children, (child) => {
        const ref = child.ref.current;
        
        const isFocused = atScrollFocus(ref);

        let className = child.props.className;

        if (!isFocused) {
            if (className) {
                className += ' unfocused';
            } else {
                className = 'unfocused';
            }
        }   

        return React.cloneElement(child, {
            className
        })
    })
}

function ScrollWatcher(props) {
    const { children } = props;
    const [childrenFocused, setChildren] = useState(children);

    useEffect(() => {

        const updateVisbility = () => {
            const newChildren = updateChildrenClass(children);
            setChildren(newChildren);
        }

        window.addEventListener("scroll", () => { updateVisbility() });
    }, [])

    return (
        <React.Fragment>
            {
                childrenFocused
            }
        </React.Fragment>
    )
}

export default ScrollWatcher;