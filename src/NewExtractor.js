export function NewExtractor(unit) {
    return {
        name: unit.name,
        costs: unit.costs?.map(c => `${c.name}: ${c.value}`) || [],
        categories: unit.categories?.map(c => c.name) || [],

        // Find unit statline (first "Unit" profile)
        stats: unit.profiles?.find(p => p.typeName === "Unit")?.characteristics || [],

        // Abilities are sometimes mixed in profiles
        abilities: unit.profiles
            ?.filter(p => p.typeName === "Abilities")
            .map(p => ({
                name: p.name,
                text: p.characteristics?.map(c => c.value).join(" ") || ""
            })) || [],

        // Weapons live under selections → profiles
        weapons: unit.selections
            ?.flatMap(sel =>
                sel.profiles?.filter(p =>
                    p.typeName === "Melee Weapons" || p.typeName === "Ranged Weapons"
                ).map(p => ({
                    name: p.name,
                    type: p.typeName,
                    stats: p.characteristics || []
                })) || []
            ) || []
    };
}
