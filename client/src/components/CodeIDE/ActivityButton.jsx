import React from "react";


export default function ActivityButton({
    icon,
    title,
    active = false,
    onClick
}) {


    return (

        <button

            className={
                `activity-btn ${
                    active ? "active" : ""
                }`
            }


            title={title}


            aria-label={title}


            onClick={onClick}


        >

            <span className="activity-icon">

                {icon}

            </span>


        </button>

    );

}