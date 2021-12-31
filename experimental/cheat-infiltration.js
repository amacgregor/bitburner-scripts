import { waitFor } from "/lib/generalHelpers";
const doc = eval("document");
export async function main(ns) {
    while (true) {
        const player = ns.getPlayer();
        if (player.hp < player.max_hp) {
            ns.hospitalize();
        }
        if (getByText("h1", "Remember all the mines!")) {
            await solveMines(ns);
        }
        else if (getByText("h1", "Match the symbols!")) {
            await solveMatch(ns);
        }
        else if (getByText("h1", "Slash")) {
            cheatSlash(ns);
        }
        else if (getByText("h1", "Cut the wires with the following properties! (keyboard 1 to 9)")) {
            await solveWires(ns);
        }
        await ns.sleep(50);
    }
}
// this minigame is impossible for me
const cheatSlash = async (ns) => {
    var _a, _b;
    await waitFor(ns, () => getByText("p", "!ATTACKING!"));
    const event = new KeyboardEvent("keydown", { keyCode: 32, bubbles: true });
    const eventClone = Object.getOwnPropertyNames(Object.getPrototypeOf(event)).reduce((object, key) => {
        // @ts-expect-error yeah no way is this passing the checker
        object[key] = event[key];
        return object;
    }, {});
    eventClone.isTrusted = true;
    eventClone.preventDefault = () => { };
    // @ts-expect-error ditto
    (_b = (_a = doc.activeElement[
    // @ts-expect-error ditto
    Object.keys(doc.activeElement).find((attr) => {
        return attr.startsWith("__reactEventHandlers");
    })]) === null || _a === void 0 ? void 0 : _a.onKeyDown) === null || _b === void 0 ? void 0 : _b.call(_a, eventClone);
};
const getByText = (tag, text) => {
    return Array.from(doc.querySelectorAll(tag)).find((element) => element.innerText.includes(text));
};
const solveMines = async (ns) => {
    const mines = Array.from(doc.querySelectorAll("#infiltration-container pre span")).map((element) => {
        return element.innerText.includes("?") ? true : false;
    });
    await waitFor(ns, () => {
        return getByText("h1", "Mark all the mines!");
    });
    doc
        .querySelectorAll("#infiltration-container pre span")
        .forEach((element, index) => {
        if (mines[index]) {
            element.style.outline = "3px solid white";
        }
    });
};
const getMatchedItem = (body) => {
    return Array.from(body.querySelectorAll("h2 span"))
        .find((element) => element.style.color === "blue")
        .innerText.trim();
};
const solveMatch = async (ns) => {
    const body = getByText("h1", "Match the symbols!").parentElement;
    while (getByText("h1", "Match the symbols!")) {
        const currentItem = getMatchedItem(body);
        body.querySelectorAll("pre span").forEach((element) => {
            if (element.innerText.trim() === currentItem) {
                element.style.outline = "3px solid white";
            }
            else {
                element.style.outline = "";
            }
        });
        await waitFor(ns, () => {
            return getMatchedItem(body) !== currentItem;
        });
        await ns.sleep(50);
    }
};
const WIRE_COLORS = {
    yellow: "rgb(255, 193, 7)",
    red: "red",
    blue: "blue",
    white: "white",
};
const solveWires = async (ns) => {
    const conditions = doc.querySelectorAll("#infiltration-container h3");
    const body = getByText("h1", "Cut the wires with the following properties! (keyboard 1 to 9)").parentElement;
    const wireCount = body.querySelector("pre").childNodes.length;
    const wireIndexes = Array.from(conditions).reduce((set, element) => {
        const text = element.innerText;
        if (text.includes("Cut wires number")) {
            const number = Number(text.match(/[0-9]/)[0]);
            set.add(number - 1);
        }
        else if (text.includes("wires colored")) {
            const color = text.match(/colored ([a-z]+)/)[1];
            const wires = Array.from(body.querySelectorAll("pre span")).filter((element) => element.innerText.includes("|"));
            wires.forEach((element, index) => {
                if (element.style.color === WIRE_COLORS[color]) {
                    set.add(index % wireCount);
                }
            });
        }
        return set;
    }, new Set());
    Array.from(body.querySelectorAll("pre span"))
        .slice(0, wireCount)
        .forEach((element, index) => {
        if (wireIndexes.has(index)) {
            element.style.outline = "3px solid white";
        }
    });
    await waitFor(ns, () => {
        if (!getByText("h1", "Cut the wires with the following properties! (keyboard 1 to 9)")) {
            return true;
        }
    });
};
