import React from "react";
import "./Paragraphs.css";

/**
 * @param input split on \n char and wrapped as paragraph tags
 * @returns div containing paragraphs
 */
export default ({ input, className }) =>
    <div className={"Paragraphs "+ className}>
        {input.split("\n").map((output, i) => <p key={i}>{output}</p>)}
    </div>

