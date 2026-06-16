import * as Y from "yjs";

export const ydoc = new Y.Doc();

export const storyText = ydoc.getText("story");

export const applyRemoteUpdate = (update: Uint8Array) => {
  Y.applyUpdate(ydoc, update);
};

export const getDocumentState = () => {
  return storyText.toString();
};