import { useState, useEffect } from "react";

function AbilityDetails({ ability, k }) {

    return (<div key={k}>
        <h2>{ability.abilityName}</h2>
        <h4>Unit: {ability.modelName}</h4>
        <p>{ability.description}</p>
    </div>)

}

export default AbilityDetails;