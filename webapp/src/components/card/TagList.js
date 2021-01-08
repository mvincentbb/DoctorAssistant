import React from 'react';

const TagList = ({list}) => {
    return (
        <p className="mb-0 g-text info-medicales">
            { list.map((label) => (
                <span className="Tag" key={label}>{label}</span>
            ))}
        </p>
    )   
}

export default TagList;