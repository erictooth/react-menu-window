export function parentsContainElem(target: any, elem: any) {
    let node = target;
    while (node !== null) {
        if (node === elem) {
            return true;
        }
        if (node !== null)
            node = node.parentNode;
    }
    return false;
}
