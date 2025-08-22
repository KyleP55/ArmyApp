const CoreList = [
    "DEEP STRIKE", "DEADLY DEMISE", "FIGHTS FIRST", "FIRING DECK",
    "INFILTRATORS", "LEADER", "LONE OPERATIVE", "SCOUTS", "STEALTH"
];

export function extractUnits(rosterJson) {
    const units = [];
    if (!rosterJson?.roster?.forces) return units;

    const forces = rosterJson.roster.forces;

    function processSelections(selections) {
        selections.forEach(sel => {
            if (sel.type !== "model" && sel.type !== "unit") return;

            let unitProfile;

            // case 1: check direct profiles
            if (sel.profiles) {
                unitProfile = sel.profiles.find(p => p.typeName === "Unit");
            }

            // case 2: check nested selections
            if (!unitProfile && sel.selections) {
                sel.selections.forEach(s => {
                    const found = s.profiles?.find(p => p.typeName === "Unit");
                    if (found) unitProfile = found;
                });
            }

            if (!unitProfile) return;

            let invSave;
            const unit = {
                name: sel.name,
                stats: [],
                abilities: [],
                keywords: [],
                core: [],
                weapons: { melee: [], ranged: [] },
                points: sel.costs?.find(c => c.name === "pts")?.value || 0,
                categories: sel.categories?.map(c => c.name) || [],
                warlord: false
            };

            //
            // --- Abilities ---
            //
            const abilityProfiles = sel.profiles?.filter(p => p.typeName === "Abilities") || [];
            abilityProfiles.forEach(a => {
                a.characteristics?.forEach(c => {
                    let isInvSave = a.name.toUpperCase().includes("INVULNERABLE SAVE");

                    if (isInvSave) {
                        invSave = a.name.slice(-3, -1);
                    } else {
                        unit.abilities.push({ name: a.name, description: c.$text });
                    }
                });
            });

            //
            // --- Core ---
            //
            sel.rules.forEach(r => {
                unit.core.push(r.name);
            });

            //
            // --- Weapons ---
            //
            let weapons = [];
            if (sel.type === "unit") {
                sel.selections?.forEach(sel2 => {
                    sel2.selections?.forEach(sel3 => {
                        sel3.profiles?.forEach(p => {
                            if (p.typeName === "Melee Weapons" || p.typeName === "Ranged Weapons") {
                                const exists = weapons.find(w => w.name === p.name);

                                if (exists) {
                                    exists.count += sel3.number;
                                } else {
                                    const weapon = { name: p.name, type: p.typeName, count: sel3.number, stats: {} };
                                    p.characteristics?.forEach(c => weapon.stats[c.name] = c.$text);
                                    weapons.push(weapon);
                                }
                            }
                        });
                    })
                })
            } else if (sel.type === "model") {
                // Weapons are in profiles directly for models
                sel.selections?.forEach(s => {
                    if (s.name.toLowerCase() === "warlord") unit.warlord = true;
                    s.profiles?.forEach(p => {
                        if (p.typeName === "Melee Weapons" || p.typeName === "Ranged Weapons") {
                            const weapon = { name: p.name, type: p.typeName, stats: {} };
                            p.characteristics?.forEach(c => weapon.stats[c.name] = c.$text);
                            weapons.push(weapon);
                        }
                    })
                });
            }

            //console.log(weapons)


            // Sort weapons
            weapons?.forEach((w) => {
                if (w.type === "Melee Weapons") {
                    unit.weapons.melee.push(w);
                } else {
                    unit.weapons.ranged.push(w);
                }
            });



            //
            // --- Keywords / Factions ---
            //
            sel.categories?.forEach(c => {
                const isFaction = c.name.toUpperCase().includes("FACTION:");
                if (isFaction) {
                    unit.faction = c.name;
                } else {
                    unit.keywords.push(c.name);
                }
            });

            //
            // --- Stats ---
            //
            unitProfile.characteristics?.forEach((c, i) => {
                let stat;
                if (i === 2 && invSave) {
                    stat = {
                        label: c.name + " / Inv",
                        value: c.$text + " / " + invSave
                    };
                } else {
                    stat = { label: c.name, value: c.$text };
                }
                unit.stats.push(stat);
            });

            //console.log(unit)
            units.push(unit);
        });
    }

    forces.forEach(force => force.selections && processSelections(force.selections));
    return units;
}
