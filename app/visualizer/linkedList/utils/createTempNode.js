export function createLinkedListTempNode({
  value,
  nextText = "NULL",
  doc,
} = {}) {
  const documentRef =
    doc ?? (typeof document !== "undefined" ? document : undefined);
  if (!documentRef) {
    throw new Error(
      "createLinkedListTempNode must be called in a DOM environment.",
    );
  }

  const tempNode = documentRef.createElement("div");
  tempNode.className = "node absolute flex border border-gray-300";

  const dataPart = documentRef.createElement("div");
  dataPart.className = "data-part rounded-l-lg bg-blue-500 p-4 text-white";
  dataPart.textContent = String(value ?? "");

  const nextPart = documentRef.createElement("div");
  nextPart.className = "next-part rounded-r-lg bg-blue-300 p-4";
  nextPart.textContent = String(nextText ?? "");

  tempNode.appendChild(dataPart);
  tempNode.appendChild(nextPart);

  return tempNode;
}
