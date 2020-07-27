type ArtifactUpdate = {
  action: "editListItem" | "editString" | "add" | "delete";
  type: "alias" | "symbol" | "businessDescription" | "businessExample";
  existing?: string;
};

export default ArtifactUpdate;
