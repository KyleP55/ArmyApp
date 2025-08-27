import { useState, useEffect } from "react";
import AbilityDetails from "../Components/AbilityDetails";

const timingNames = [
    ["battle round", "battle turn"],
    ["command phase"],
    ["movement phase", "move"],
    ["shoot phase", "shooting phase"],
    ["charge phase"],
    ["fight phase", "melee"],
    ["targets a unit"],
    ["command point", "command points", "cp"]
];

const catName = ["Battle Round", "Command Phase", "Movement Phase", "Shoot Phase",
    "Charge Phase", "Fight Phase", "On Target", "On Stragagem"];

function AbilitiesPage({ units, faction }) {
    const [abilities, setAbilities] = useState();
    const themeClass = 'theme-' + faction;

    useEffect(() => {
        // round, command, movement, shoot, charge, fight, targets, commandPoint
        const newList = [[], [], [], [], [], [], [], []];

        units.map(u => {
            u.abilities?.map(a => {
                const phase = timingNames.findIndex(n =>
                    n.some(nArr => a.description?.toLowerCase().includes(nArr))
                );

                if (phase >= 0) {
                    const newInput = {
                        modelName: u.name,
                        abilityName: a.name,
                        description: a.description
                    }

                    if (newList[phase].length == 0 || !newList[phase].some(obj => obj.modelName === newInput.modelName && obj.abilityName === newInput.abilityName)) {
                        newList[phase].push(newInput);
                    }
                }
            });
        });


        setAbilities(newList);
    }, [units]);

    return <div className={`unit-details ${themeClass}`}>
        {abilities && abilities.map((phase, i) => (
            <div className={themeClass} key={i}>
                <h2 className="unit-header">{catName[i]}</h2>
                {phase && phase.map((a, i2) => (
                    <AbilityDetails ability={a} k={i2} />
                ))}
            </div>
        ))}
    </div>
}

export default AbilitiesPage;