const CoreList = [
    "DEEP STRIKE", "DEADLY DEMISE", "FIGHTS FIRST", "FIRING DECK", "INFILTRATORS", "LEADER", "LONE OPERATIVE", "SCOUTS", "STEALTH"
];

export function extractUnits(rosterJson) {
    const units = [];

    if (!rosterJson?.roster?.forces) return units;

    const forces = rosterJson.roster.forces;

    function processSelections(selections) {
        selections.forEach(sel => {
            const unitProfile = sel.profiles?.find(p => p.typeName === "Unit");
            if (unitProfile) {
                let invSave;
                const unit = {
                    name: sel.name,
                    stats: [],
                    abilities: [],
                    keywords: [],
                    weapons: [],
                    points: sel.costs?.find(c => c.name === "pts")?.value || 0,
                    categories: sel.categories?.map(c => c.name) || []
                };

                // sel.rules?.forEach(a => {
                //     const isKeyword = keywordList.some(k => {
                //         //console.log(a.name.toUpperCase(), 'includes', k, '=', a.name.toUpperCase().includes(k))
                //         if (a.name.toUpperCase().includes(k)) return true;
                //     });

                //     if (isKeyword) {
                //         if (!unit.keywords.includes(a.name)) unit.keywords.push(a.name);
                //     } else {
                //         unit.abilities.push({ name: a.name, description: a.$text });
                //     }
                // });

                sel.profiles
                    ?.filter(p => p.typeName === "Abilities")
                    .forEach(a => {
                        a.characteristics?.forEach(c => {
                            let isInvSave;
                            if (a.name.toUpperCase().includes("INVULNERABLE SAVE")) isInvSave = true; else isInvSave = false;

                            const isCore = CoreList.some(k => {
                                if (a.name.toUpperCase().includes(k)) return true;
                            });

                            if (isCore) {
                                if (!unit.keywords.includes(a.name)) unit.keywords.push(a.name);
                            } else if (isInvSave) {
                                invSave = a.name.charAt(a.name.length - 3) + a.name.charAt(a.name.length - 2);;
                            } else {
                                unit.abilities.push({ name: a.name, description: c.$text });
                            }
                        });
                    });

                // Weapons
                sel.selections?.filter(s => s.group?.toLowerCase().includes("wargear"))
                    .forEach(w => {
                        //console.log(w)
                        const weapon = { name: w.name, type: w.profiles[0]?.typeName, stats: {} };
                        w.profiles[0]?.characteristics?.forEach(c => weapon.stats[c.name] = c.$text);
                        unit.weapons.push(weapon);
                    });
                //console.log('weapon', unit.weapons)

                sel.categories?.forEach(c => {
                    const isFaction = c.name.toUpperCase().includes("FACTION:");

                    if (isFaction) {
                        unit.faction = c.name;
                    } else {
                        unit.keywords.push({ name: c.name });
                    }
                })

                unitProfile.characteristics?.forEach((c, i) => {
                    let stat;
                    if (i === 2 && invSave) {
                        stat = {
                            label: c.name + '/Inv',
                            value: c.$text + "/" + invSave
                        }
                    } else {
                        stat = {
                            label: c.name,
                            value: c.$text
                        }
                    }

                    unit.stats.push(stat);
                });

                units.push(unit);
            }

            if (sel.selections) processSelections(sel.selections);
        });
    }

    forces.forEach(force => force.selections && processSelections(force.selections));
    return units;
}
