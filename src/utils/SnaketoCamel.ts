export default function snakeToCamel(input: string): string {
    let array = input.split("_");
    return array.map((word: string, index: number) => {
        if (index === 0) {
            //Make sure the first word starts with lowercase letter
            let firstLetter = word.charAt(0).toLowerCase();
            let minusFirstLetter = word.slice(1, word.length);
            return `${firstLetter}${minusFirstLetter}`
        }
        let firstLetter = word.charAt(0).toUpperCase();
        let minusFirstLetter = word.slice(1, word.length);
        return `${firstLetter}${minusFirstLetter}`
    }).join("");
}

export { snakeToCamel }