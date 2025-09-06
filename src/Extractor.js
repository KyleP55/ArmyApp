const factions = [
    "imperium",
    "chaos",
    "ork",
    "tyranid",
    "necron",
    "eldar"
]

const armyRulesList = [
    "acts of faith",
    "assigned agents",
    "battle focus",
    "bondsman abilities",
    "blessings of khorne",
    "cabal of sorcerers",
    "code chivalric",
    "cult ambush",
    "cult of the dark gods",
    "daemonic pact",
    "dark pacts",
    "deathwatch",
    "disparate paths",
    "doctrina imperatives",
    "dreadblades",
    "eye of the ancestors",
    "for the greater good",
    "freeblades",
    "harbingers of dread",
    "kill team",
    "martial ka’tah",
    "nurgle’s gift",
    "oath of moment",
    "pact of blood",
    "pact of decay",
    "pact of excess",
    "pact of sorcery",
    "power from pain",
    "reanimation protocols",
    "shadow in the warp",
    "space marine chapters",
    "super-heavy walker",
    "synapse",
    "teleport assault",
    "thrill seekers",
    "titanic support",
    "titanicus traitoris",
    "towering example",
    "voice of command",
    "waaagh!",
    "the shadow of chaos"
];


export function extractUnits(rosterJson) {
    const units = [];
    if (!rosterJson?.roster?.forces) return units;

    const forces = rosterJson.roster.forces;

    // Army Rules
    const armyRules = {
        type: 'rules',
        name: 'Army Rules',
        faction: 'default',
        rules: [],
        detachments: []
    };

    const theme = factions.find(f => forces[0]?.catalogueName.toLowerCase().includes(f.toLowerCase())) || "default";
    armyRules.faction = theme;

    // function
    function processSelections(selections) {
        selections.forEach(sel => {

            // Army Rules
            sel.rules?.map(r => {
                const isArmyRule = armyRulesList.some(rule =>
                    rule.includes(r.name.toLowerCase())
                );

                if (isArmyRule) {
                    if (armyRules.rules?.some(ar => r.name.toLowerCase().includes(ar.name.toLowerCase()))) {
                        return;
                    }

                    const rule = {
                        name: r.name,
                        description: r.description
                    }
                    armyRules.rules.push(rule);
                }
            })

            // Detachment
            if (sel.name?.toLowerCase() === "detachment" && sel.selections) {
                const sel2 = sel.selections[0];

                if (sel2.name.toLowerCase() != 'battle size') {
                    const desc = sel2.profiles?.[0]
                        ? `${sel2.profiles[0].name}: ${sel2.profiles[0].characteristics?.[0]?.$text || ""}`
                        : `${sel2.rules?.[0]?.name || ""}: ${sel2.rules?.[0]?.description || ""}`;

                    if (!desc) return;

                    const detachment = {
                        name: sel2.name,
                        description: desc
                    }

                    armyRules.detachments.push(detachment);
                }
            } else
                if (sel.type !== "model" && sel.type !== "unit") {
                    return;
                }

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
                count: 0,
                unitCount: 1,
                stats: [],
                abilities: [],
                enhancement: null,
                keywords: [],
                core: [],
                models: [],
                weapons: { melee: [], ranged: [] },
                points: sel.costs?.find(c => c.name === "pts")?.value || 0,
                categories: sel.categories?.map(c => c.name) || [],
                faction: 'default',
                warlord: false
            };

            //
            // --- Costs ---
            //
            if (sel.costs) {
                unit.points = sel.costs.find(c => c.name === "pts")?.value;
            } else if (sel.selections) {
                sel.selections.map(s => {
                    unit.points = s.costs ? s.costs.find(c => c.name === "pts")?.value : 0;
                });
            }

            //
            // --- Abilities ---
            //
            const abilityProfiles = sel.profiles?.filter(p => p.typeName === "Abilities") || [];
            abilityProfiles.forEach(a => {
                a.characteristics?.forEach(c => {
                    let isInvSave = a.name.toUpperCase().includes("INVULNERABLE SAVE");
                    if (isInvSave) {
                        if (a.name.match(/\d\+/)) {
                            invSave = a.name.match(/\d\+/)[0];
                        } else {
                            invSave = a.characteristics[0]?.$text?.match(/\d\+/)[0];
                        }
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
            // --- Weapons & Models ---
            //
            let weapons = [];
            if (sel.type === "unit") {
                sel.selections?.forEach(sel2 => {
                    const model = {
                        name: sel2.name,
                        count: sel2.number,
                        weapons: []
                    }

                    unit.count += sel2.number;

                    sel2.selections?.forEach(sel3 => {
                        sel3.profiles?.forEach(p => {
                            if (p.typeName === "Melee Weapons" || p.typeName === "Ranged Weapons") {
                                const exists = weapons.find(w => w.name === p.name);

                                model.weapons.push(p.name);

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

                    unit.models.push(model);
                })
            } else if (sel.type === "model") {
                // Weapons are in profiles directly for models
                sel.selections?.forEach(s => {
                    if (s.type === "upgrade") {
                        if (s.name.toLowerCase() === "warlord") unit.warlord = true;
                        if (s.group?.toLowerCase().includes("enhancements")) {
                            unit.points += s.costs[0]?.value;

                            const enhancement = {
                                name: s.name,
                                cost: s.costs[0]?.value,
                                description: s.profiles[0]?.characteristics[0]?.$text
                            }

                            unit.enhancement = enhancement;
                        }
                    }

                    s.profiles?.forEach(p => {
                        if (p.typeName === "Melee Weapons" || p.typeName === "Ranged Weapons") {
                            const exists = weapons.find(w => w.name === p.name);

                            if (exists) {
                                exists.count += s.number;
                            } else {
                                const weapon = { name: p.name, type: p.typeName, count: s.number, stats: {} };
                                p.characteristics?.forEach(c => weapon.stats[c.name] = c.$text);
                                weapons.push(weapon);
                            }
                        }
                    });

                    s.selections?.map(sel2 => {
                        sel2.profiles?.forEach(p => {
                            if (p.typeName === "Melee Weapons" || p.typeName === "Ranged Weapons") {
                                const exists = weapons.find(w => w.name === p.name);

                                if (exists) {
                                    exists.count += sel2.number;
                                } else {
                                    const weapon = { name: p.name, type: p.typeName, count: sel2.number, stats: {} };
                                    p.characteristics?.forEach(c => weapon.stats[c.name] = c.$text);
                                    weapons.push(weapon);
                                }
                            }
                        });
                    });
                });
            }

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
                unit.keywords.push(c.name);
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

            const theme = factions.find(f => forces[0]?.catalogueName.toLowerCase().includes(f.toLowerCase())) || "default";
            unit.faction = theme;

            if (armyRules && !units?.some(u =>
                u.name === "Army Rules"
            )) units.push(armyRules);

            // doup check
            let dupe = false;
            units.map((u, i) => {
                if (deepEqual(u, unit)) {
                    dupe = i;
                    return;
                }
            });

            if (dupe) {
                units[dupe].unitCount++;
                return;
            }
            units.push(unit);
        });
    }

    forces.forEach(force => force.selections && processSelections(force.selections));
    return units;
}


function deepEqual(a, b) {
    if (a === b) return true;

    // Handle null or different types
    if (a == null || b == null || typeof a !== "object" || typeof b !== "object") {
        return false;
    }

    // Arrays
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        return a.every((item, index) => deepEqual(item, b[index]));
    }

    // Objects
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;

    return keysA.every(key => deepEqual(a[key], b[key]));
}

